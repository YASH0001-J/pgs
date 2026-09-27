/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import {
  uploadPdfToSupabase,
  deletePdfFromSupabase,
  getSupabasePdfPublicUrl,
  isSupabaseConfigured,
  SUPABASE_PDF_BUCKET
} from './supabase';
import { PDFCategory, PDFDocument } from '../types';
import { INITIAL_PDF_DOCUMENTS } from '../data/initialPdfs';

const COLLECTION_NAME = 'pdfs';
const STORAGE_CACHE_KEY = 'pgs_pdf_documents_cache_v4';

type PdfListener = (pdfs: PDFDocument[]) => void;
type ViewerModalListener = (pdf: PDFDocument | null, title?: string) => void;

class PdfService {
  private pdfs: PDFDocument[] = [];
  private listeners: Set<PdfListener> = new Set();
  private viewerModalListeners: Set<ViewerModalListener> = new Set();
  private unsubscribeSnapshot: (() => void) | null = null;
  private isInitialized = false;

  constructor() {
    this.loadFromCache();
    this.initFirestoreListener();
  }

  /**
   * Load cached PDFs from localStorage
   */
  private loadFromCache() {
    try {
      const cached = localStorage.getItem(STORAGE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          this.pdfs = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read PDF cache from localStorage', e);
    }
    this.pdfs = [];
  }

  private saveToCache() {
    try {
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(this.pdfs));
    } catch (e) {
      console.warn('Could not save PDF cache to localStorage', e);
    }
  }

  private notifyListeners() {
    const list = this.getAllPdfs();
    this.listeners.forEach((listener) => {
      try {
        listener(list);
      } catch (err) {
        console.error('Error in PDF listener callback', err);
      }
    });
  }

  /**
   * Initialize Firestore live listener
   */
  private async initFirestoreListener() {
    if (!db) {
      console.warn('Firestore not initialized, running in local mode for PDFs');
      return;
    }

    try {
      const pdfsCol = collection(db, COLLECTION_NAME);

      this.unsubscribeSnapshot = onSnapshot(
        pdfsCol,
        (snapshot) => {
          if (snapshot.empty) {
            this.pdfs = [];
            this.saveToCache();
            this.notifyListeners();
            this.isInitialized = true;
            return;
          }

          const remotePdfs: PDFDocument[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remotePdfs.push({
              id: docSnap.id,
              key: data.key,
              title: data.title || 'Untitled Document',
              category: data.category || 'other',
              fileName: data.fileName || 'document.pdf',
              storagePath: data.storagePath || '',
              pdfUrl: data.pdfUrl || '',
              fileSize: data.fileSize || '1.0 MB',
              academicYear: data.academicYear || '2026-27',
              uploadedBy: data.uploadedBy || 'School Admin',
              description: data.description || '',
              isPublished: data.isPublished !== false,
              downloadCount: data.downloadCount || 0,
              createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString()
            });
          });

          // Sort by category and key/title
          remotePdfs.sort((a, b) => a.title.localeCompare(b.title));

          this.pdfs = remotePdfs;
          this.saveToCache();
          this.notifyListeners();
          this.isInitialized = true;
        },
        (error) => {
          console.warn('Firestore snapshot error for pdfs:', error);
        }
      );
    } catch (e) {
      console.error('Failed to init Firestore snapshot listener for PDFs:', e);
    }
  }

  /**
   * Seed registry if manually invoked
   */
  public async seedInitialDocuments(): Promise<void> {
    if (!db || INITIAL_PDF_DOCUMENTS.length === 0) return;

    try {
      const batch = writeBatch(db);
      INITIAL_PDF_DOCUMENTS.forEach((docItem) => {
        const docRef = doc(db, COLLECTION_NAME, docItem.id);
        batch.set(
          docRef,
          {
            ...docItem,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );
      });

      await batch.commit();
      console.log(`✅ Successfully seeded ${INITIAL_PDF_DOCUMENTS.length} PDF slots to Firestore.`);
    } catch (err) {
      console.error('Error seeding PDF documents to Firestore:', err);
    }
  }

  /**
   * Subscribe to real-time PDF list changes
   */
  public subscribe(listener: PdfListener): () => void {
    this.listeners.add(listener);
    listener(this.getAllPdfs());
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Subscribe to PDF Viewer modal open events
   */
  public onOpenViewerModal(listener: ViewerModalListener): () => void {
    this.viewerModalListeners.add(listener);
    return () => {
      this.viewerModalListeners.delete(listener);
    };
  }

  /**
   * Get all active PDF documents (optionally filtering only published documents for public views)
   */
  public getAllPdfs(onlyPublished = false): PDFDocument[] {
    if (onlyPublished) {
      return this.pdfs.filter((doc) => doc.isPublished !== false);
    }
    return [...this.pdfs];
  }

  /**
   * Get PDFs filtered by Category
   */
  public getPdfsByCategory(category: PDFCategory | 'all', onlyPublished = false): PDFDocument[] {
    const list = this.getAllPdfs(onlyPublished);
    if (category === 'all') return list;
    return list.filter((doc) => doc.category === category);
  }

  /**
   * Check if a document with a given filename or storagePath already exists
   */
  public findDuplicateFile(fileName: string, storagePath?: string): PDFDocument | undefined {
    const cleanName = fileName.trim().toLowerCase();
    return this.pdfs.find((doc) => {
      if (storagePath && doc.storagePath && doc.storagePath.toLowerCase() === storagePath.toLowerCase()) {
        return true;
      }
      if (doc.fileName && doc.fileName.toLowerCase() === cleanName) {
        return true;
      }
      return false;
    });
  }

  /**
   * Toggle published / visibility status in Firestore and local state
   */
  public async togglePublishStatus(id: string, isPublished: boolean): Promise<void> {
    await this.updatePdfRecord(id, { isPublished });
  }

  /**
   * Find a PDF document by its stable key (e.g. 'cbse_affiliation_letter', 'fee_structure')
   */
  public getPdfByKey(key: string): PDFDocument | undefined {
    return this.pdfs.find((doc) => doc.key === key);
  }

  /**
   * Find a PDF document by its ID
   */
  public getPdfById(id: string): PDFDocument | undefined {
    return this.pdfs.find((doc) => doc.id === id);
  }

  /**
   * Find a PDF document by matching a URL or filename
   */
  public getPdfByUrl(url: string): PDFDocument | undefined {
    if (!url) return undefined;
    const cleanUrl = url.trim().toLowerCase();
    return this.pdfs.find((doc) => {
      if (doc.pdfUrl && doc.pdfUrl.trim().toLowerCase() === cleanUrl) return true;
      if (doc.fileName && cleanUrl.endsWith(doc.fileName.toLowerCase())) return true;
      return false;
    });
  }

  /**
   * Resolve any input (key, ID, or old URL) into the active PDF document or fallback URL
   */
  public resolvePdf(keyOrUrlOrId: string): PDFDocument | undefined {
    if (!keyOrUrlOrId) return undefined;
    // 1. Try by key
    let found = this.getPdfByKey(keyOrUrlOrId);
    if (found) return found;

    // 2. Try by ID
    found = this.getPdfById(keyOrUrlOrId);
    if (found) return found;

    // 3. Try by URL / filename match
    found = this.getPdfByUrl(keyOrUrlOrId);
    if (found) return found;

    // 4. Try finding by case-insensitive key or partial title
    const lower = keyOrUrlOrId.toLowerCase();
    found = this.pdfs.find(
      (p) =>
        (p.key && p.key.toLowerCase() === lower) ||
        p.fileName.toLowerCase().includes(lower) ||
        p.title.toLowerCase().includes(lower)
    );
    return found;
  }

  /**
   * Helper to check if a string is a valid HTTP/HTTPS URL
   */
  private isHttpUrl(str: string): boolean {
    if (!str) return false;
    const s = str.trim().toLowerCase();
    return s.startsWith('http://') || s.startsWith('https://');
  }

  /**
   * Open the PDF Viewer modal (or trigger fallback notice)
   */
  public openPdf(keyOrUrlOrId: string, customTitle?: string): void {
    if (!keyOrUrlOrId) return;

    // 1. If keyOrUrlOrId is a valid HTTP/HTTPS URL, open it directly!
    if (this.isHttpUrl(keyOrUrlOrId)) {
      window.open(keyOrUrlOrId, '_blank');
      return;
    }

    const docItem = this.resolvePdf(keyOrUrlOrId);

    // 2. If a document record was found
    if (docItem) {
      if (docItem.pdfUrl) {
        this.incrementDownloadCount(docItem.id);
        
        // If the document has a valid HTTP/HTTPS URL, open it directly!
        if (this.isHttpUrl(docItem.pdfUrl)) {
          window.open(docItem.pdfUrl, '_blank');
          return;
        }
      }
      this.viewerModalListeners.forEach((listener) => {
        listener(docItem, customTitle || docItem.title);
      });
      return;
    }

    // If no document record was found at all, create a synthetic pending record
    const syntheticDoc: PDFDocument = {
      id: `synthetic_${Date.now()}`,
      title: customTitle || keyOrUrlOrId.replace(/[-_]/g, ' '),
      category: 'other',
      fileName: `${keyOrUrlOrId}.pdf`,
      storagePath: '',
      pdfUrl: '',
      academicYear: '2026-27',
      isPublished: true
    };

    this.viewerModalListeners.forEach((listener) => {
      listener(syntheticDoc, customTitle);
    });
  }

  /**
   * Trigger a client download of the PDF document
   */
  public downloadPdf(keyOrUrlOrId: string, customFilename?: string): void {
    if (!keyOrUrlOrId) return;

    // 1. If keyOrUrlOrId is a valid HTTP/HTTPS URL, open it directly!
    if (this.isHttpUrl(keyOrUrlOrId)) {
      window.open(keyOrUrlOrId, '_blank');
      return;
    }

    const docItem = this.resolvePdf(keyOrUrlOrId);

    if (docItem && docItem.pdfUrl && this.isHttpUrl(docItem.pdfUrl)) {
      this.incrementDownloadCount(docItem.id);
      window.open(docItem.pdfUrl, '_blank');
      return;
    }

    // If no valid URL, fallback to opening the pending notice modal
    this.openPdf(keyOrUrlOrId, customFilename ? customFilename.replace(/\.pdf$/i, '') : undefined);
  }

  /**
   * Upload a PDF file to Supabase Storage ('school-pdfs' bucket) and save metadata to Firebase Firestore
   */
  public async uploadPdfFile(
    file: File,
    metadata: {
      title: string;
      category: PDFCategory;
      key?: string;
      description?: string;
      academicYear?: string;
      uploadedBy?: string;
      isPublished?: boolean;
    },
    onProgress?: (percent: number) => void
  ): Promise<PDFDocument> {
    const docId = `pdf_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folder = metadata.category || 'general';

    // 1. Upload to Supabase Storage bucket 'school-pdfs'
    const uploadResult = await uploadPdfToSupabase(file, folder, sanitizedFileName, onProgress);

    const newDoc: PDFDocument = {
      id: docId,
      key: metadata.key || sanitizedFileName.replace(/\.[^/.]+$/, '').toLowerCase(),
      title: metadata.title,
      category: metadata.category,
      fileName: file.name,
      storagePath: uploadResult.storagePath,
      pdfUrl: uploadResult.publicUrl,
      fileSize: uploadResult.fileSize,
      academicYear: metadata.academicYear || '2026-27',
      uploadedBy: metadata.uploadedBy || 'School Admin',
      description: metadata.description || '',
      isPublished: metadata.isPublished !== false,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 2. Save metadata to Firebase Firestore (collection: 'pdfs')
    if (db) {
      try {
        await setDoc(doc(db, COLLECTION_NAME, docId), {
          ...newDoc,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        console.error('Failed to write new PDF record to Firestore:', e);
      }
    }

    // 3. Update local in-memory state & cache
    this.pdfs = [newDoc, ...this.pdfs];
    this.saveToCache();
    this.notifyListeners();

    return newDoc;
  }

  /**
   * Replace the PDF file for an existing document slot in Supabase Storage and update Firestore
   */
  public async replacePdfFile(
    docId: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<PDFDocument> {
    const existing = this.getPdfById(docId);
    if (!existing) {
      throw new Error(`Document with ID ${docId} not found`);
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folder = existing.category || 'general';

    // Clean up old Supabase storage object if present
    if (existing.storagePath) {
      await deletePdfFromSupabase(existing.storagePath).catch(() => {});
    }

    // Upload new file to Supabase Storage
    const uploadResult = await uploadPdfToSupabase(file, folder, sanitizedFileName, onProgress);

    const updates: Partial<PDFDocument> = {
      fileName: file.name,
      storagePath: uploadResult.storagePath,
      pdfUrl: uploadResult.publicUrl,
      fileSize: uploadResult.fileSize,
      updatedAt: new Date().toISOString()
    };

    // Update in Firestore and cache
    await this.updatePdfRecord(docId, updates);

    const updatedDoc = {
      ...existing,
      ...updates
    };

    return updatedDoc;
  }

  /**
   * Update an existing PDF document metadata
   */
  public async updatePdfRecord(id: string, updates: Partial<PDFDocument>): Promise<void> {
    const idx = this.pdfs.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.pdfs[idx] = {
        ...this.pdfs[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToCache();
      this.notifyListeners();
    }

    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error('Error updating PDF in Firestore:', err);
      }
    }
  }

  /**
   * Delete a PDF document from Supabase Storage and Firebase Firestore
   */
  public async deletePdfRecord(id: string, storagePath?: string): Promise<void> {
    // Remove from local memory
    this.pdfs = this.pdfs.filter((p) => p.id !== id);
    this.saveToCache();
    this.notifyListeners();

    // Delete object from Supabase Storage if storagePath exists
    if (storagePath) {
      await deletePdfFromSupabase(storagePath).catch((err) => {
        console.warn('Could not delete file from Supabase Storage:', err);
      });
    }

    // Delete record from Firestore
    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
      } catch (err) {
        console.error('Error deleting PDF document from Firestore:', err);
      }
    }
  }

  /**
   * Increment download counter
   */
  public async incrementDownloadCount(id: string): Promise<void> {
    const docItem = this.pdfs.find((p) => p.id === id);
    if (docItem) {
      docItem.downloadCount = (docItem.downloadCount || 0) + 1;
      this.saveToCache();
      this.notifyListeners();
    }

    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
          downloadCount: increment(1)
        });
      } catch (e) {
        // Silently catch stats increment errors
      }
    }
  }
}

export const pdfService = new PdfService();
