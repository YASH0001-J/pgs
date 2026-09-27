/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SupabaseDocument {
  id: string;
  title: string;
  category: string;
  year: string;
  pdf_url: string;
  created_at: string;
  is_published: boolean;
}

type DocumentsListener = (docs: SupabaseDocument[]) => void;

class SupabaseDocumentsService {
  private listeners: Set<DocumentsListener> = new Set();
  private documents: SupabaseDocument[] = [];
  private isSubscribed = false;
  private channel: any = null;

  /**
   * Validate that a URL is a valid HTTP/HTTPS URL
   */
  public isValidUrl(url: string): boolean {
    if (!url) return false;
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  /**
   * Fetch all documents from the Supabase table `documents`
   */
  public async fetchDocuments(): Promise<SupabaseDocument[]> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. Returning empty document list.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If the table doesn't exist yet (relation "documents" does not exist, code '42P01' or similar)
        if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('Supabase table "documents" does not exist yet. Please run the SQL migration schema in Supabase SQL Editor. Fallback to empty list.');
          return [];
        }
        throw error;
      }

      this.documents = data || [];
      this.notifyListeners();
      return this.documents;
    } catch (err: any) {
      if (err instanceof TypeError || (err?.message && (err.message.includes('fetch') || err.message.includes('NetworkError')))) {
        console.warn('Network offline or connecting to Supabase failed to fetch (harmless fallback):', err.message || err);
      } else {
        console.error('Error fetching documents from Supabase:', err);
      }
      return [];
    }
  }

  /**
   * Add a new document to the Supabase `documents` table
   */
  public async addDocument(
    title: string,
    pdfUrl: string,
    category: string,
    year: string = ''
  ): Promise<SupabaseDocument> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured in this applet yet.');
    }

    // 1. Validate inputs
    const trimmedTitle = title.trim();
    const trimmedUrl = pdfUrl.trim();
    if (!trimmedTitle) {
      throw new Error('Document Title is required.');
    }
    if (!this.isValidUrl(trimmedUrl)) {
      throw new Error('Invalid URL. Please enter a valid HTTP or HTTPS PDF URL.');
    }

    // 2. Prevent duplicate PDF URLs in the same table
    const existing = await this.findDuplicateUrl(trimmedUrl);
    if (existing) {
      throw new Error(`A document with this exact PDF URL is already registered as "${existing.title}".`);
    }

    // 3. Prepare record
    const newDoc = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      category: category || 'other',
      year: year.trim() || '2026-27',
      pdf_url: trimmedUrl,
      is_published: true
    };

    // 4. Insert into Supabase
    const { data, error } = await supabase
      .from('documents')
      .insert([newDoc])
      .select();

    if (error) {
      console.error('Failed to insert record into Supabase:', error);
      throw new Error(`Supabase Database Error: ${error.message}. Make sure table "documents" is created with proper fields.`);
    }

    if (data && data[0]) {
      // Update local memory list and trigger listeners
      this.documents = [data[0], ...this.documents.filter(d => d.id !== data[0].id)];
      this.notifyListeners();
      return data[0];
    }

    throw new Error('Could not verify insertion from Supabase response.');
  }

  /**
   * Toggle published visibility of a document
   */
  public async togglePublishStatus(id: string, isPublished: boolean): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from('documents')
      .update({ is_published: isPublished })
      .eq('id', id);

    if (error) {
      console.error('Failed to update publish status in Supabase:', error);
      throw error;
    }

    this.documents = this.documents.map((doc) =>
      doc.id === id ? { ...doc, is_published: isPublished } : doc
    );
    this.notifyListeners();
  }

  /**
   * Delete a document record permanently from Supabase
   */
  public async deleteDocument(id: string): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete document from Supabase:', error);
      throw error;
    }

    this.documents = this.documents.filter((doc) => doc.id !== id);
    this.notifyListeners();
  }

  /**
   * Search for duplicate URL in current loaded documents or query DB
   */
  private async findDuplicateUrl(url: string): Promise<SupabaseDocument | null> {
    const cleanUrl = url.trim().toLowerCase();
    
    // Check in-memory list first
    const inMem = this.documents.find(d => d.pdf_url.toLowerCase() === cleanUrl);
    if (inMem) return inMem;

    // Direct DB query check
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('pdf_url', url.trim())
        .limit(1);

      if (!error && data && data.length > 0) {
        return data[0];
      }
    } catch (_) {
      // Fail-safe
    }

    return null;
  }

  /**
   * Subscribe to real-time additions/modifications/deletions on the table
   */
  public subscribe(listener: DocumentsListener): () => void {
    this.listeners.add(listener);
    
    // Send immediate current state
    listener([...this.documents]);

    // Initialize real-time channel if not done yet
    if (!this.isSubscribed && isSupabaseConfigured()) {
      this.isSubscribed = true;
      this.channel = supabase
        .channel('public:documents')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'documents' },
          async (payload) => {
            console.log('Realtime postgres change on documents table:', payload);
            // Re-fetch all documents on change to guarantee accurate sort and fields
            await this.fetchDocuments();
          }
        )
        .subscribe((status) => {
          console.log(`Supabase Realtime subscription status for "documents":`, status);
        });
    }

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0 && this.channel) {
        supabase.removeChannel(this.channel);
        this.channel = null;
        this.isSubscribed = false;
      }
    };
  }

  private notifyListeners() {
    const list = [...this.documents];
    this.listeners.forEach((listener) => {
      try {
        listener(list);
      } catch (err) {
        console.error('Error in Supabase Document listener', err);
      }
    });
  }
}

export const supabaseDocumentsService = new SupabaseDocumentsService();
