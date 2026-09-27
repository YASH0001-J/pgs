/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabaseDocumentsService, SupabaseDocument } from '../services/supabaseDocuments';

export function useSupabaseDocuments(category?: string, onlyPublished = true) {
  const [documents, setDocuments] = useState<SupabaseDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        setLoading(true);
        await supabaseDocumentsService.fetchDocuments();
      } catch (err: any) {
        if (isMounted) setError(err?.message || 'Error loading documents');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    const unsubscribe = supabaseDocumentsService.subscribe((list) => {
      if (isMounted) {
        let filtered = onlyPublished ? list.filter((d) => d.is_published !== false) : list;
        if (category && category !== 'all') {
          filtered = filtered.filter((d) => d.category === category);
        }
        setDocuments(filtered);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [category, onlyPublished]);

  const addDocument = async (title: string, url: string, cat: string, year?: string) => {
    return await supabaseDocumentsService.addDocument(title, url, cat, year);
  };

  const deleteDocument = async (id: string) => {
    return await supabaseDocumentsService.deleteDocument(id);
  };

  const togglePublishStatus = async (id: string, isPublished: boolean) => {
    return await supabaseDocumentsService.togglePublishStatus(id, isPublished);
  };

  return {
    documents,
    loading,
    error,
    addDocument,
    deleteDocument,
    togglePublishStatus
  };
}
