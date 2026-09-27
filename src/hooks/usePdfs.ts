/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { pdfService } from '../services/pdfService';
import { PDFCategory, PDFDocument } from '../types';

export function usePdfs(category?: PDFCategory | 'all', onlyPublished = true) {
  const [pdfs, setPdfs] = useState<PDFDocument[]>(() => {
    return category
      ? pdfService.getPdfsByCategory(category, onlyPublished)
      : pdfService.getAllPdfs(onlyPublished);
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = pdfService.subscribe((all) => {
      let filtered = onlyPublished ? all.filter((p) => p.isPublished !== false) : all;
      if (category && category !== 'all') {
        filtered = filtered.filter((p) => p.category === category);
      }
      setPdfs(filtered);
    });

    return () => {
      unsubscribe();
    };
  }, [category, onlyPublished]);

  const openPdf = (keyOrUrlOrId: string, title?: string) => {
    pdfService.openPdf(keyOrUrlOrId, title);
  };

  const downloadPdf = (keyOrUrlOrId: string, filename?: string) => {
    pdfService.downloadPdf(keyOrUrlOrId, filename);
  };

  const getPdfByKey = (key: string) => {
    return pdfService.getPdfByKey(key);
  };

  const resolvePdf = (identifier: string) => {
    return pdfService.resolvePdf(identifier);
  };

  return {
    pdfs,
    loading,
    openPdf,
    downloadPdf,
    getPdfByKey,
    resolvePdf,
    allPdfs: pdfService.getAllPdfs()
  };
}
