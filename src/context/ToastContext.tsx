/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, Download, Bell, X, ExternalLink, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'download' | 'notice' | 'announcement';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  showAnnouncementModal: (title: string, message: string, pdfUrl?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [announcementModal, setAnnouncementModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    pdfUrl?: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const showToast = useCallback((toastData: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastItem = { ...toastData, id };

    setToasts((prev) => [...prev, newToast]);

    const timer = setTimeout(() => {
      removeToast(id);
    }, toastData.duration || 4500);

    return () => clearTimeout(timer);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showAnnouncementModal = (title: string, message: string, pdfUrl?: string) => {
    setAnnouncementModal({ isOpen: true, title, message, pdfUrl });
  };

  return (
    <ToastContext.Provider value={{ showToast, showAnnouncementModal }}>
      {children}

      {/* Floating Animated Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-4 flex items-start gap-3.5 relative overflow-hidden group"
            >
              {/* Colored Accent Line */}
              <div
                className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  toast.type === 'success'
                    ? 'bg-emerald-500'
                    : toast.type === 'download'
                    ? 'bg-sky-500'
                    : toast.type === 'notice'
                    ? 'bg-amber-500'
                    : toast.type === 'announcement'
                    ? 'bg-purple-600'
                    : 'bg-blue-600'
                }`}
              />

              {/* Icon */}
              <div className="p-2 rounded-xl shrink-0 mt-0.5">
                {toast.type === 'success' && (
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {toast.type === 'download' && (
                  <div className="p-2 bg-sky-100 text-sky-600 rounded-xl animate-bounce">
                    <Download className="w-5 h-5" />
                  </div>
                )}
                {toast.type === 'notice' && (
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                    <Bell className="w-5 h-5" />
                  </div>
                )}
                {toast.type === 'announcement' && (
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Info className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-6">
                <h4 className="font-extrabold text-primary text-sm leading-snug">{toast.title}</h4>
                <p className="text-secondary text-xs mt-0.5 leading-relaxed line-clamp-2">{toast.message}</p>

                {toast.actionLabel && toast.onAction && (
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      removeToast(toast.id);
                    }}
                    className="mt-2 text-xs font-bold text-blue-700 hover:text-blue-800 underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {toast.actionLabel}
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-3 right-3 text-secondary/50 hover:text-primary transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Important Announcement Modal */}
      <AnimatePresence>
        {announcementModal.isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 absolute top-0 left-0 right-0" />
              
              <button
                onClick={() => setAnnouncementModal((prev) => ({ ...prev, isOpen: false }))}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
                  <Sparkles className="w-6 h-6" />
                </span>
                <div>
                  <span className="text-[11px] uppercase tracking-widest font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    Important Announcement
                  </span>
                  <h3 className="text-xl font-black text-primary mt-1">{announcementModal.title}</h3>
                </div>
              </div>

              <p className="text-secondary text-sm leading-relaxed whitespace-pre-line my-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {announcementModal.message}
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {announcementModal.pdfUrl && (
                  <a
                    href={announcementModal.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs hover:bg-purple-100 transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official PDF</span>
                  </a>
                )}
                <button
                  onClick={() => setAnnouncementModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00276a] to-[#123d8f] text-white font-extrabold text-xs hover:shadow-lg transition-all cursor-pointer"
                >
                  Acknowledge & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
