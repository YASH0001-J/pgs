/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Download, Upload, FileText, Search, X } from 'lucide-react';
import { DownloadResource, DownloadCategory } from '../../types';
import { communicationService } from '../../services/communicationService';
import { useToast } from '../../context/ToastContext';

export const AdminDownloadsManager: React.FC = () => {
  const { showToast } = useToast();
  const [downloads, setDownloads] = useState<DownloadResource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<DownloadResource, 'id' | 'downloadsCount'>>({
    title: '',
    category: 'Admission Forms',
    description: '',
    fileSize: '1.2 MB',
    uploadDate: new Date().toISOString().split('T')[0],
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'PDF',
    academicYear: '2026-27',
    isPublished: true,
    targetClass: 'All Classes'
  });

  const categories: DownloadCategory[] = [
    'Date Sheets',
    'Circulars',
    'Admission Forms',
    'Fee Structure',
    'Holiday Homework',
    'Syllabus',
    'Prospectus'
  ];

  const loadData = () => {
    setDownloads(communicationService.getDownloads());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete download resource?')) {
      communicationService.deleteDownload(id);
      loadData();
      showToast({ type: 'info', title: 'Resource Removed', message: 'File deleted.' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    communicationService.addDownload(formData);
    showToast({ type: 'success', title: 'Resource Uploaded', message: 'File is active.' });
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-primary text-lg">Downloads & Resource Manager</h3>
          <p className="text-slate-500 text-xs font-medium">Upload admission forms, syllabi packets, prospectus brochures, and fee schedules.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {downloads.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{item.fileSize}</span>
              </div>
              <h4 className="font-black text-primary text-sm leading-snug">{item.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>{item.downloadsCount} downloads</span>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-black text-primary mb-4">Upload New Resource</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Official Prospectus 2026-27"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as DownloadCategory })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Class</label>
                    <input
                      type="text"
                      value={formData.targetClass}
                      onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                      placeholder="e.g. Grades IX - XII"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow">
                    Upload & Publish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
