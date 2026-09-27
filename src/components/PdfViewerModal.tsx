/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  Maximize2,
  Minimize2,
  RefreshCw,
  Printer
} from 'lucide-react';
import { PDFDocument } from '../types';
import { pdfService } from '../services/pdfService';

export const PdfViewerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePdf, setActivePdf] = useState<PDFDocument | null>(null);
  const [fallbackTitle, setFallbackTitle] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);

  useEffect(() => {
    // Register listener for pdf viewer modal events from pdfService
    const unsubscribe = pdfService.onOpenViewerModal((pdf, title) => {
      setActivePdf(pdf);
      setFallbackTitle(title || pdf?.title || 'School Document');
      setIsLoadingIframe(true);
      setIsOpen(true);
    });

    return () => unsubscribe();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsFullscreen(false);
    setActivePdf(null);
  };

  const hasValidUrl = Boolean(
    activePdf?.pdfUrl &&
    activePdf.pdfUrl.trim() !== '' &&
    !activePdf.pdfUrl.startsWith('data:image/svg+xml')
  );

  const handleDownload = () => {
    if (activePdf?.pdfUrl) {
      pdfService.downloadPdf(activePdf.id, `${activePdf.title || 'document'}.pdf`);
    }
  };

  const handleOpenExternal = () => {
    if (activePdf?.pdfUrl) {
      window.open(activePdf.pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePrint = () => {
    if (hasValidUrl) {
      const iframe = document.getElementById('pdf-modal-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.print();
        } catch (e) {
          window.open(activePdf!.pdfUrl, '_blank');
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full bg-slate-900 border border-slate-700/80 shadow-2xl rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden z-10 transition-all ${
            isFullscreen ? 'h-full max-h-screen' : 'h-[90vh] max-w-5xl'
          }`}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/95 border-b border-slate-800 text-white select-none">
            <div className="flex items-center gap-3 min-w-0 pr-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-white truncate">
                  {activePdf?.title || fallbackTitle}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="capitalize">{activePdf?.category?.replace('_', ' ') || 'Official Document'}</span>
                  {activePdf?.academicYear && (
                    <>
                      <span>•</span>
                      <span>Session {activePdf.academicYear}</span>
                    </>
                  )}
                  {hasValidUrl && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified PDF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {hasValidUrl && (
                <>
                  <button
                    onClick={handlePrint}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                    title="Print Document"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>

                  <button
                    onClick={handleOpenExternal}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="hidden sm:inline-flex p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </>
              )}

              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors cursor-pointer ml-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="relative flex-1 w-full h-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
            {hasValidUrl ? (
              <div className="relative w-full h-full">
                {isLoadingIframe && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 z-10 text-slate-400">
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-xs font-semibold">Loading official document...</p>
                  </div>
                )}
                <iframe
                  id="pdf-modal-iframe"
                  src={`${activePdf!.pdfUrl}#toolbar=1&view=FitH`}
                  title={activePdf!.title}
                  onLoad={() => setIsLoadingIframe(false)}
                  className="w-full h-full border-0 bg-white"
                />
              </div>
            ) : (
              /* Clean Pending Document Notice */
              <div className="max-w-md w-full mx-auto p-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                  <Clock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Document Update in Progress
                  </span>
                  <h4 className="text-xl font-extrabold text-white">
                    {activePdf?.title || fallbackTitle}
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    This official document is currently being updated and digitized in the school repository.
                    It will be available for online preview and download shortly.
                  </p>
                </div>

                {/* School Contact Quick Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Need this document urgently?
                  </p>
                  <div className="flex flex-col gap-2 text-xs text-slate-300">
                    <a
                      href="tel:+919354220255"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>+91 9354220255 / +91 9555873828</span>
                    </a>
                    <a
                      href="mailto:pgsbaprola@gmail.com"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>pgsbaprola@gmail.com</span>
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold transition-all cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
