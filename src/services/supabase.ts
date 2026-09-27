/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for client-side Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const SUPABASE_PDF_BUCKET = 'school-pdfs';

let supabaseClient: SupabaseClient | null = null;

/**
 * Check whether Supabase environment variables are provided
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.trim() !== '' &&
    supabaseUrl.startsWith('http') &&
    supabasePublishableKey &&
    supabasePublishableKey.trim() !== ''
  );
}

/**
 * Get or initialize the reusable Supabase client
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl.trim(), supabasePublishableKey.trim(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseClient;
}

export interface SupabaseUploadResult {
  publicUrl: string;
  storagePath: string;
  fileName: string;
  fileSize: string;
}

/**
 * Upload a PDF file to the `school-pdfs` bucket in Supabase Storage.
 *
 * It first attempts direct client upload using the Supabase client.
 * If client upload is blocked by strict RLS or if server-side proxy is active,
 * it falls back to the secure server-side endpoint `/api/admin/supabase-pdf/upload`.
 */
export async function uploadPdfToSupabase(
  file: File,
  folder = 'general',
  customFileName?: string,
  onProgress?: (percent: number) => void
): Promise<SupabaseUploadResult> {
  const sanitizedFileName = (customFileName || file.name).replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${folder}/${Date.now()}_${sanitizedFileName}`;
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

  const client = getSupabaseClient();

  if (onProgress) onProgress(20);

  // 1. Try Direct Client Upload via Supabase JS SDK
  if (client) {
    try {
      if (onProgress) onProgress(40);
      const { data, error } = await client.storage
        .from(SUPABASE_PDF_BUCKET)
        .upload(storagePath, file, {
          contentType: 'application/pdf',
          upsert: true,
          cacheControl: '3600',
        });

      if (error) {
        console.warn('Direct Supabase client upload notice:', error.message);
        throw error;
      }

      if (onProgress) onProgress(80);

      // Get public URL
      const { data: publicUrlData } = client.storage
        .from(SUPABASE_PDF_BUCKET)
        .getPublicUrl(data.path);

      if (onProgress) onProgress(100);

      return {
        publicUrl: publicUrlData.publicUrl,
        storagePath: data.path,
        fileName: file.name,
        fileSize: fileSizeMb,
      };
    } catch (clientErr: any) {
      console.warn('Direct client upload attempt encountered issue, trying server proxy endpoint...', clientErr?.message);
    }
  }

  // 2. Fallback / Secure Server-side Upload Endpoint
  try {
    if (onProgress) onProgress(50);

    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    if (onProgress) onProgress(70);

    const response = await fetch('/api/admin/supabase-pdf/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Data,
        storagePath,
        bucket: SUPABASE_PDF_BUCKET,
        contentType: 'application/pdf',
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (onProgress) onProgress(100);
      return {
        publicUrl: result.publicUrl,
        storagePath: result.storagePath || storagePath,
        fileName: file.name,
        fileSize: fileSizeMb,
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Server-side PDF upload endpoint responded with:', errorData);
    }
  } catch (serverErr) {
    console.warn('Server proxy upload attempt failed:', serverErr);
  }

  // If neither client nor server could reach Supabase, surface an informative error
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment.'
    );
  }

  throw new Error('Could not complete PDF upload to Supabase Storage bucket `school-pdfs`.');
}

/**
 * Delete a PDF file from Supabase Storage
 */
export async function deletePdfFromSupabase(storagePath: string): Promise<boolean> {
  if (!storagePath) return false;

  const client = getSupabaseClient();

  // Try direct client deletion
  if (client) {
    try {
      const { error } = await client.storage
        .from(SUPABASE_PDF_BUCKET)
        .remove([storagePath]);

      if (!error) {
        return true;
      }
    } catch (e) {
      console.warn('Direct client delete error:', e);
    }
  }

  // Fallback to server endpoint
  try {
    const res = await fetch('/api/admin/supabase-pdf/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storagePath, bucket: SUPABASE_PDF_BUCKET }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Server delete error:', e);
    return false;
  }
}

/**
 * Retrieve public URL for a storage path in `school-pdfs` bucket
 */
export function getSupabasePdfPublicUrl(storagePath: string): string {
  if (!storagePath) return '';
  const client = getSupabaseClient();
  if (client) {
    const { data } = client.storage.from(SUPABASE_PDF_BUCKET).getPublicUrl(storagePath);
    return data.publicUrl;
  }
  if (supabaseUrl) {
    const cleanUrl = supabaseUrl.replace(/\/+$/, '');
    return `${cleanUrl}/storage/v1/object/public/${SUPABASE_PDF_BUCKET}/${storagePath}`;
  }
  return '';
}
