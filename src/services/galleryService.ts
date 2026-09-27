/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  doc, 
  onSnapshot, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export type GalleryCategory = 'overview' | 'achievements' | 'events' | 'pgs-stars' | 'stars';

export interface GalleryCategoryMeta {
  id: 'overview' | 'achievements' | 'events' | 'pgs-stars';
  title: string;
  shortName: string;
  icon: string; // Emoji
  description: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'overview' | 'achievements' | 'events' | 'pgs-stars';
  imageUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryUrlsMap {
  overview: string[];
  achievements: string[];
  events: string[];
  'pgs-stars': string[];
}

export const GALLERY_CATEGORIES: GalleryCategoryMeta[] = [
  {
    id: 'overview',
    title: 'Overview',
    shortName: 'Overview',
    icon: '📸',
    description: 'Explore our state-of-the-art campus, smart labs, sports arenas, and vibrant learning infrastructure.',
  },
  {
    id: 'achievements',
    title: 'Our Achievements',
    shortName: 'Achievements',
    icon: '🏆',
    description: 'Celebrating academic milestones, CBSE excellence, national athletic trophies, and competitive honors.',
  },
  {
    id: 'events',
    title: 'Events & Celebrations',
    shortName: 'Events & Celebrations',
    icon: '🎉',
    description: 'Glimpses of annual fests, cultural carnivals, sports meets, and festive joy across campus.',
  },
  {
    id: 'pgs-stars',
    title: 'PGS Stars',
    shortName: 'PGS Stars',
    icon: '⭐',
    description: 'Honoring exceptional student leaders, innovation prodigies, artists, and state champions.',
  },
];

const STORAGE_KEY = 'pgs_school_gallery_cache_v3';

// Normalize category helper
function normalizeCategory(cat: string): 'overview' | 'achievements' | 'events' | 'pgs-stars' {
  if (cat === 'stars' || cat === 'pgs-stars') return 'pgs-stars';
  if (cat === 'achievements') return 'achievements';
  if (cat === 'events') return 'events';
  return 'overview';
}

function loadLocalCache(): GalleryImage[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => ({
          ...item,
          category: normalizeCategory(item.category || 'overview')
        }));
      }
    }
  } catch (e) {
    console.warn("Could not read gallery from localStorage:", e);
  }
  return [];
}

function saveLocalCache(images: GalleryImage[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    }
  } catch (e) {
    console.warn("Could not write gallery to localStorage:", e);
  }
}

// In-memory runtime cache fed by server API, local storage, and Firestore
let cachedImages: GalleryImage[] = loadLocalCache();
let firestoreError: string | null = null;
let hasInitializedSync = false;

export class GalleryService {
  /**
   * Get current Firestore error if any
   */
  static getFirestoreError(): string | null {
    return firestoreError;
  }

  /**
   * Initialize real-time synchronization from Firebase Firestore and server API
   */
  static initRealtimeSync(
    onUpdate?: (images: GalleryImage[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    // 1. Immediately notify caller with local cache if available
    if (cachedImages.length > 0 && onUpdate) {
      onUpdate(cachedImages);
    }

    // 2. Fetch latest data from server API
    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : null))
      .then((items: GalleryImage[] | null) => {
        if (Array.isArray(items) && items.length > 0) {
          const normalized = items.map((img) => ({
            ...img,
            category: normalizeCategory(img.category || 'overview'),
            thumbnailUrl: img.thumbnailUrl || img.imageUrl,
          }));
          normalized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          cachedImages = normalized;
          saveLocalCache(cachedImages);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('galleryUpdated'));
          }
          if (onUpdate) onUpdate(cachedImages);
        }
      })
      .catch((err) => {
        console.warn("Notice: Server gallery fetch init:", err?.message || err);
      });

    // 3. Optional real-time Firestore listener if db is active
    if (!db) {
      return () => {};
    }

    try {
      const galleryCol = collection(db, 'gallery');
      const unsubscribe = onSnapshot(
        galleryCol,
        (snapshot) => {
          if (snapshot.empty) return;

          const items: GalleryImage[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let createdAtStr = new Date().toISOString();

            if (data.createdAt) {
              if (typeof data.createdAt.toDate === 'function') {
                createdAtStr = data.createdAt.toDate().toISOString();
              } else if (data.createdAt instanceof Timestamp) {
                createdAtStr = data.createdAt.toDate().toISOString();
              } else if (typeof data.createdAt === 'string') {
                createdAtStr = data.createdAt;
              }
            }

            return {
              id: docSnap.id,
              title: data.title || 'Campus Photo',
              category: normalizeCategory(data.category || 'overview'),
              imageUrl: data.imageUrl,
              thumbnailUrl: data.thumbnailUrl || data.imageUrl,
              description: data.description || undefined,
              videoUrl: data.videoUrl || undefined,
              createdAt: createdAtStr,
            };
          });

          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          // Merge with any server items preserving unique URLs
          const merged = [...items];
          for (const cached of cachedImages) {
            if (!merged.some((m) => m.imageUrl === cached.imageUrl || m.id === cached.id)) {
              merged.push(cached);
            }
          }
          merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          cachedImages = merged;
          saveLocalCache(cachedImages);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('galleryUpdated'));
          }
          if (onUpdate) onUpdate(cachedImages);
        },
        (error) => {
          // Gracefully degrade: do not fail application or trigger user-facing errors
          console.warn("Firestore remote sync notice (using server storage):", error?.message || error);
          if (onError && !error.message?.includes('permission')) {
            onError(error);
          }
        }
      );

      return unsubscribe;
    } catch (e) {
      console.warn("Firestore listener initialization skipped:", e);
      return () => {};
    }
  }

  /**
   * Synchronous accessor for rendering cached gallery images
   */
  static getCachedImagesSync(): GalleryImage[] {
    if (cachedImages.length === 0) {
      cachedImages = loadLocalCache();
    }
    return cachedImages;
  }

  /**
   * Get category-wise URLs dictionary from gallery images
   */
  static getCategoryUrlsMap(): CategoryUrlsMap {
    const map: CategoryUrlsMap = {
      overview: [],
      achievements: [],
      events: [],
      'pgs-stars': [],
    };

    for (const img of cachedImages) {
      const cat = normalizeCategory(img.category);
      if (!map[cat].includes(img.imageUrl)) {
        map[cat].push(img.imageUrl);
      }
    }

    return map;
  }

  /**
   * Fetch all images from server API, Firestore, and local cache
   */
  static async getAllImages(): Promise<GalleryImage[]> {
    // 1. Fetch from server API
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items) && items.length > 0) {
          const normalized = items.map((img: any) => ({
            ...img,
            category: normalizeCategory(img.category || 'overview'),
            thumbnailUrl: img.thumbnailUrl || img.imageUrl,
          }));
          normalized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          cachedImages = normalized;
          saveLocalCache(cachedImages);
          return cachedImages;
        }
      }
    } catch (err) {
      console.warn("Notice: Server gallery fetch error, checking Firestore/local cache:", err);
    }

    // 2. Try Firestore if available
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, 'gallery'));
        if (!snapshot.empty) {
          const items: GalleryImage[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let createdAtStr = new Date().toISOString();
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              createdAtStr = data.createdAt.toDate().toISOString();
            }
            return {
              id: docSnap.id,
              title: data.title || 'Campus Photo',
              category: normalizeCategory(data.category || 'overview'),
              imageUrl: data.imageUrl,
              thumbnailUrl: data.thumbnailUrl || data.imageUrl,
              description: data.description || undefined,
              videoUrl: data.videoUrl || undefined,
              createdAt: createdAtStr,
            };
          });

          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          cachedImages = items;
          saveLocalCache(cachedImages);
          return cachedImages;
        }
      } catch (err: any) {
        console.warn("Firestore remote read notice:", err?.message || err);
      }
    }

    // 3. Fallback to localStorage
    if (cachedImages.length === 0) {
      cachedImages = loadLocalCache();
    }
    return cachedImages;
  }

  /**
   * Add image URL directly to persistent server storage and local cache
   */
  static async addImageUrl(
    categoryInput: GalleryCategory,
    urlInput: string,
    titleInput?: string,
    descriptionInput?: string
  ): Promise<GalleryImage> {
    const category = normalizeCategory(categoryInput);
    const url = urlInput.trim();

    if (!url) {
      throw new Error('Image URL is required.');
    }

    // Check for duplicate URL in current cached images
    const isDuplicate = cachedImages.some((img) => img.imageUrl === url);
    if (isDuplicate) {
      throw new Error('This image URL already exists in the gallery.');
    }

    const defaultCatMeta = GALLERY_CATEGORIES.find((c) => c.id === category);
    const title = titleInput?.trim() || `${defaultCatMeta?.title || 'Campus'} Photo`;
    const description = descriptionInput?.trim() || undefined;

    let newImage: GalleryImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      category,
      imageUrl: url,
      thumbnailUrl: url,
      description,
      createdAt: new Date().toISOString(),
    };

    // 1. Persist to server backend API
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          imageUrl: url,
          thumbnailUrl: url,
          description: description || null,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.id) {
          newImage = {
            ...saved,
            category: normalizeCategory(saved.category || category),
          };
        }
      }
    } catch (err) {
      console.warn("Could not save to /api/gallery, saved to local cache:", err);
    }

    // 2. Update local state and notify application
    cachedImages = [newImage, ...cachedImages.filter((img) => img.imageUrl !== url)];
    saveLocalCache(cachedImages);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('galleryUpdated'));
    }

    // 3. Attempt Firestore background sync (never fail the user on permission/network errors)
    if (db) {
      try {
        const docData = {
          title,
          category,
          imageUrl: url,
          thumbnailUrl: url,
          description: description || null,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'gallery'), docData);
      } catch (e: any) {
        console.warn("Remote Firestore write skipped (saved to server storage):", e?.message || e);
      }
    }

    return newImage;
  }

  /**
   * Alias for addImageUrl
   */
  static async addImage(imageData: {
    category: GalleryCategory;
    imageUrl: string;
    title?: string;
    description?: string;
  }): Promise<GalleryImage> {
    return this.addImageUrl(
      imageData.category,
      imageData.imageUrl,
      imageData.title,
      imageData.description
    );
  }

  /**
   * Delete image document from server storage and local cache
   */
  static async deleteImage(idOrUrl: string): Promise<boolean> {
    const target = cachedImages.find((img) => img.id === idOrUrl || img.imageUrl === idOrUrl);
    const docId = target ? target.id : idOrUrl;

    // 1. Delete from server API
    try {
      await fetch(`/api/gallery/${encodeURIComponent(docId)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn("Server delete warning:", e);
    }

    // 2. Delete from Firestore in background
    if (db) {
      try {
        const docRef = doc(db, 'gallery', docId);
        await deleteDoc(docRef);
      } catch (e) {
        try {
          const q = query(collection(db, 'gallery'), where('imageUrl', '==', idOrUrl));
          const snapshot = await getDocs(q);
          snapshot.forEach(async (docSnap) => {
            await deleteDoc(doc(db, 'gallery', docSnap.id));
          });
        } catch {
          // Swallowed: permissions or network
        }
      }
    }

    // 3. Update local cache & dispatch event
    cachedImages = cachedImages.filter((img) => img.id !== docId && img.imageUrl !== idOrUrl);
    saveLocalCache(cachedImages);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('galleryUpdated'));
    }

    return true;
  }

  /**
   * Update image details in storage
   */
  static async updateImage(
    idOrUrl: string,
    updates: { title?: string; description?: string; category?: GalleryCategory }
  ): Promise<GalleryImage | null> {
    const target = cachedImages.find((img) => img.id === idOrUrl || img.imageUrl === idOrUrl);
    if (!target) {
      throw new Error('Image not found in gallery.');
    }

    const docId = target.id;
    const updatePayload: Record<string, any> = {};
    if (updates.title !== undefined) updatePayload.title = updates.title.trim();
    if (updates.description !== undefined) updatePayload.description = updates.description.trim() || null;
    if (updates.category !== undefined) updatePayload.category = normalizeCategory(updates.category);

    // 1. Update on server API
    try {
      await fetch(`/api/gallery/${encodeURIComponent(docId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
    } catch (e) {
      console.warn("Server update warning:", e);
    }

    // 2. Update Firestore in background
    if (db) {
      try {
        const docRef = doc(db, 'gallery', docId);
        await updateDoc(docRef, updatePayload);
      } catch (e) {
        console.warn("Firestore update skipped:", e);
      }
    }

    const updatedImage: GalleryImage = {
      ...target,
      title: updates.title !== undefined ? updates.title.trim() : target.title,
      description: updates.description !== undefined ? updates.description.trim() || undefined : target.description,
      category: updates.category ? normalizeCategory(updates.category) : target.category,
      updatedAt: new Date().toISOString(),
    };

    cachedImages = cachedImages.map((img) => (img.id === docId ? updatedImage : img));
    saveLocalCache(cachedImages);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('galleryUpdated'));
    }

    return updatedImage;
  }

  /**
   * Add multiple image URLs at once
   */
  static async addMultipleImageUrls(
    categoryInput: GalleryCategory,
    urlInputs: string[],
    baseTitleInput?: string,
    descriptionInput?: string
  ): Promise<GalleryImage[]> {
    const category = normalizeCategory(categoryInput);
    const validUrls = Array.from(new Set(urlInputs.map((u) => u.trim()).filter((u) => u.length > 0)));

    if (validUrls.length === 0) {
      throw new Error("At least one valid image URL is required.");
    }

    const defaultCatMeta = GALLERY_CATEGORIES.find((c) => c.id === category);
    const itemsToCreate = validUrls.map((url, i) => {
      const title = baseTitleInput?.trim()
        ? validUrls.length > 1
          ? `${baseTitleInput.trim()} #${i + 1}`
          : baseTitleInput.trim()
        : `${defaultCatMeta?.title || 'Campus'} Photo`;
      const desc = descriptionInput?.trim() || undefined;

      return {
        id: `img-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        category,
        imageUrl: url,
        thumbnailUrl: url,
        description: desc,
        createdAt: new Date().toISOString(),
      };
    });

    let addedImages: GalleryImage[] = itemsToCreate;

    // 1. Bulk post to server API
    try {
      const res = await fetch('/api/gallery/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToCreate }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result && Array.isArray(result.items) && result.items.length > 0) {
          addedImages = result.items.map((item: any) => ({
            ...item,
            category: normalizeCategory(item.category || category),
          }));
        }
      }
    } catch (err) {
      console.warn("Could not save bulk URLs to server, saved locally:", err);
    }

    // 2. Update local state
    const existingOther = cachedImages.filter((existing) => !validUrls.includes(existing.imageUrl));
    cachedImages = [...addedImages, ...existingOther];
    saveLocalCache(cachedImages);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('galleryUpdated'));
    }

    // 3. Sync to Firestore in background (non-blocking)
    if (db) {
      try {
        for (const img of addedImages) {
          await addDoc(collection(db, 'gallery'), {
            title: img.title,
            category: img.category,
            imageUrl: img.imageUrl,
            thumbnailUrl: img.thumbnailUrl || img.imageUrl,
            description: img.description || null,
            createdAt: serverTimestamp(),
          });
        }
      } catch (e: any) {
        console.warn("Firestore sync skipped for bulk URLs (stored on server):", e?.message || e);
      }
    }

    return addedImages;
  }

  /**
   * Add multiple File objects as Base64 images
   */
  static async addMultipleFiles(
    categoryInput: GalleryCategory,
    files: File[],
    baseTitleInput?: string,
    descriptionInput?: string
  ): Promise<GalleryImage[]> {
    if (files.length === 0) {
      throw new Error("No files provided.");
    }

    // Convert all files to Data URLs
    const dataUrls = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

    const category = normalizeCategory(categoryInput);
    const defaultCatMeta = GALLERY_CATEGORIES.find((c) => c.id === category);

    const itemsToCreate = files.map((file, i) => {
      const dataUrl = dataUrls[i];
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      const title = baseTitleInput?.trim()
        ? files.length > 1
          ? `${baseTitleInput.trim()} #${i + 1}`
          : baseTitleInput.trim()
        : fileNameWithoutExt || `${defaultCatMeta?.title || 'Campus'} Photo`;
      const desc = descriptionInput?.trim() || undefined;

      return {
        id: `img-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        category,
        imageUrl: dataUrl,
        thumbnailUrl: dataUrl,
        description: desc,
        createdAt: new Date().toISOString(),
      };
    });

    let addedImages: GalleryImage[] = itemsToCreate;

    // 1. Bulk post to server API
    try {
      const res = await fetch('/api/gallery/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToCreate }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result && Array.isArray(result.items) && result.items.length > 0) {
          addedImages = result.items.map((item: any) => ({
            ...item,
            category: normalizeCategory(item.category || category),
          }));
        }
      }
    } catch (err) {
      console.warn("Could not save files to server API, saved locally:", err);
    }

    // 2. Update local state
    cachedImages = [...addedImages, ...cachedImages];
    saveLocalCache(cachedImages);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('galleryUpdated'));
    }

    // 3. Sync to Firestore in background
    if (db) {
      try {
        for (const img of addedImages) {
          await addDoc(collection(db, 'gallery'), {
            title: img.title,
            category: img.category,
            imageUrl: img.imageUrl,
            thumbnailUrl: img.thumbnailUrl || img.imageUrl,
            description: img.description || null,
            createdAt: serverTimestamp(),
          });
        }
      } catch (e: any) {
        console.warn("Firestore sync skipped for files:", e?.message || e);
      }
    }

    return addedImages;
  }

  /**
   * Move image to another category
   */
  static async moveImageCategory(idOrUrl: string, newCategory: GalleryCategory): Promise<GalleryImage | null> {
    return this.updateImage(idOrUrl, { category: newCategory });
  }

  /**
   * Delete all images from storage
   */
  static async deleteAllImages(): Promise<boolean> {
    // 1. Delete from server API
    try {
      await fetch('/api/gallery', { method: 'DELETE' });
    } catch (e) {
      console.warn("Server delete all warning:", e);
    }

    // 2. Delete from Firestore in background
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, 'gallery'));
        for (const docSnap of snapshot.docs) {
          await deleteDoc(doc(db, 'gallery', docSnap.id));
        }
      } catch (e) {
        console.warn("Firestore delete all skipped:", e);
      }
    }

    cachedImages = [];
    saveLocalCache(cachedImages);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('galleryUpdated'));
    }

    return true;
  }
}

// Automatically start real-time sync listener on module import
if (!hasInitializedSync) {
  hasInitializedSync = true;
  GalleryService.initRealtimeSync();
}
