/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit2,
  Trash2,
  Pin,
  Sparkles,
  CheckCircle,
  XCircle,
  FileText,
  Upload,
  Calendar,
  Search,
  X,
  Bell
} from 'lucide-react';
import { NoticeItem, NoticeCategory } from '../../types';
import { communicationService } from '../../services/communicationService';
import { useToast } from '../../context/ToastContext';

export const AdminNoticesManager: React.FC = () => {
  const { showToast } = useToast();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NoticeItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<NoticeItem, 'id'>>({
    title: '',
    category: 'Latest Notices',
    description: '',
    content: '',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    isNew: true,
    isPinned: false,
    isPublished: true,
    pdfUrl: '',
    pdfSize: '1.5 MB',
    attachmentName: '',
    coverImage: '',
    author: 'Principal Office',
    academicYear: '2026-27'
  });

  const categories: NoticeCategory[] = [
    'Latest Notices',
    'Important Announcements',
    'Upcoming Events',
    'Exam Schedule',
    'Circulars',
    'Holiday Notices'
  ];

  const loadData = () => {
    setNotices(communicationService.getNotices());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Latest Notices',
      description: '',
      content: '',
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      isNew: true,
      isPinned: false,
      isPublished: true,
      pdfUrl: '',
      pdfSize: '1.5 MB',
      attachmentName: '',
      coverImage: '',
      author: 'Principal Office',
      academicYear: '2026-27'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NoticeItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      content: item.content,
      publishDate: item.publishDate,
      expiryDate: item.expiryDate || '',
      isNew: item.isNew,
      isPinned: item.isPinned,
      isPublished: item.isPublished,
      pdfUrl: item.pdfUrl || '',
      pdfSize: item.pdfSize || '1.5 MB',
      attachmentName: item.attachmentName || '',
      coverImage: item.coverImage || '',
      author: item.author || 'Principal Office',
      academicYear: item.academicYear
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      communicationService.deleteNotice(id);
      loadData();
      showToast({
        type: 'info',
        title: 'Notice Removed',
        message: 'The circular record was permanently deleted.'
      });
    }
  };

  const handleTogglePublish = (item: NoticeItem) => {
    communicationService.updateNotice(item.id, { isPublished: !item.isPublished });
    loadData();
    showToast({
      type: 'success',
      title: item.isPublished ? 'Notice Unpublished' : 'Notice Published',
      message: `"${item.title}" status updated.`
    });
  };

  const handleTogglePin = (item: NoticeItem) => {
    communicationService.updateNotice(item.id, { isPinned: !item.isPinned });
    loadData();
    showToast({
      type: 'success',
      title: item.isPinned ? 'Unpinned Notice' : 'Pinned Notice to Top',
      message: `"${item.title}" pin state updated.`
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      communicationService.updateNotice(editingItem.id, formData);
      showToast({
        type: 'success',
        title: 'Notice Updated',
        message: 'Changes saved successfully.'
      });
    } else {
      communicationService.addNotice(formData);
      showToast({
        type: 'success',
        title: 'Notice Published Successfully',
        message: `"${formData.title}" is now active.`
      });
    }
    setIsModalOpen(false);
    loadData();
  };

  // Handle PDF upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        attachmentName: file.name,
        pdfSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }));
      showToast({
        type: 'success',
        title: 'PDF File Attached',
        message: `Attached ${file.name}`
      });
    }
  };

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices & circulars..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-600"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Notice</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6">Notice Details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Publish Date</th>
                <th className="py-4 px-6">Badges</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredNotices.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-primary max-w-xs">
                    <div className="line-clamp-1">{item.title}</div>
                    <div className="text-xs text-slate-400 font-normal line-clamp-1">{item.description}</div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-600">
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-extrabold text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-500">{item.publishDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.isPinned && (
                        <span className="p-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold" title="Pinned">
                          <Pin className="w-3 h-3" />
                        </span>
                      )}
                      {item.isNew && (
                        <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                          NEW
                        </span>
                      )}
                      {item.pdfUrl && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          PDF
                        </span>
                      )}
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          item.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {item.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTogglePin(item)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.isPinned ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Toggle Pin"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-black text-primary mb-6">
                {editingItem ? 'Edit Notice' : 'Publish New Notice'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. CBSE Board Examination Date Sheet 2026-27"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as NoticeCategory })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Issuing Authority</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="e.g. Principal Office / Sports Dept"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Short Description *</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief 1-2 sentence overview for home feed cards"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Detailed Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write complete notice text with guidelines..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Publish Date</label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    />
                  </div>
                </div>

                {/* PDF File Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attach PDF Document</label>
                  <div className="border-2 border-dashed border-slate-200 p-4 rounded-xl text-center bg-slate-50 relative">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-blue-600 block">
                      {formData.attachmentName || 'Click or drag PDF file to attach'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Checkbox options */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Pin to Top</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Show 'NEW' Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Publish Immediately</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Save & Publish
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
