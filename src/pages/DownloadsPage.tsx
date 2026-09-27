/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Eye,
  FileText,
  Search,
  CheckCircle,
  X,
  Sparkles,
  Calendar,
  Layers,
  Lock,
  Unlock,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { communicationService } from '../services/communicationService';
import { DownloadResource, DownloadCategory } from '../types';
import { useToast } from '../context/ToastContext';
import { ScrollReveal } from '../components/ScrollReveal';
import { pdfService } from '../services/pdfService';
import { useSupabaseDocuments } from '../hooks/useSupabaseDocuments';
import { useQueries } from '../context/QueryContext';

export const DownloadsPage: React.FC = () => {
  const { showToast } = useToast();
  const [downloads, setDownloads] = useState<DownloadResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState<DownloadResource | null>(null);

  // Centralized Admin integration
  const { isAuthenticated, login, logout } = useQueries();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formSubCategory, setFormSubCategory] = useState<DownloadCategory>('Circulars');
  const [formDescription, setFormDescription] = useState('');
  const [formSession, setFormSession] = useState('2026-27');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loaded = communicationService.getDownloads().filter((d) => d.isPublished);
    setDownloads(loaded);
  }, []);

  const categories: string[] = [
    'All',
    'Date Sheets',
    'Circulars',
    'Admission Forms',
    'Fee Structure',
    'Holiday Homework',
    'Syllabus',
    'Prospectus'
  ];

  // Load dynamic Supabase documents (all of them)
  const { documents: supabaseDownloads, addDocument: addSupabaseDoc, deleteDocument: deleteSupabaseDoc } = useSupabaseDocuments('downloads', false);

  const dynamicDownloads: DownloadResource[] = supabaseDownloads
    .filter((item) => isAuthenticated || item.is_published !== false)
    .map((item) => {
      // Parse serialized year: subcategory|description|session
      const parts = item.year ? item.year.split('|') : [];
      const subCategory = parts[0] || 'Circulars';
      const desc = parts[1] || 'Official PDF Download Resource';
      const session = parts[2] || '2026-27';

      return {
        id: `supabase_${item.id}`,
        title: item.title,
        description: session ? `${desc} (Session: ${session})` : desc,
        category: subCategory as DownloadCategory,
        fileUrl: item.pdf_url,
        fileSize: 'External PDF',
        downloadsCount: 0,
        isPublished: true,
        addedDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'
      };
    });

  const combinedDownloads = [...downloads, ...dynamicDownloads];

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login('admin@gmail.com', passwordInput);
    if (success) {
      setShowPasswordModal(false);
      setPasswordError(null);
      setPasswordInput('');
    } else {
      setPasswordError('Invalid security password. Please try again.');
    }
  };

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter a document title.');
      return;
    }
    if (!formUrl.trim() || !formUrl.startsWith('http')) {
      alert('Please enter a valid public URL starting with http:// or https://.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Serialize extra fields into year: subcategory|description|session
      const serializedMeta = `${formSubCategory}|${formDescription.trim() || 'Official Document Resource'}|${formSession}`;
      await addSupabaseDoc(formTitle.trim(), formUrl.trim(), 'downloads', serializedMeta);
      setFormSuccessMessage(`Successfully published "${formTitle}" to ${formSubCategory}!`);
      setFormTitle('');
      setFormUrl('');
      setFormDescription('');
      setTimeout(() => setFormSuccessMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Could not add document.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDocument = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}" permanently?`)) {
      try {
        await deleteSupabaseDoc(id);
      } catch (err: any) {
        alert(err.message || 'Could not delete document.');
      }
    }
  };

  const filteredDownloads = combinedDownloads.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownloadTrigger = (item: DownloadResource) => {
    if (item.id.startsWith("supabase_")) {
      window.open(item.fileUrl, "_blank");
      return;
    }

    communicationService.incrementDownloadCount(item.id);
    setDownloads(communicationService.getDownloads().filter((d) => d.isPublished));

    showToast({
      type: 'download',
      title: 'Download Initialized',
      message: `Downloading "${item.title}" (${item.fileSize})`
    });

    if (item.fileUrl) {
      pdfService.downloadPdf(item.fileUrl, `${item.title}.pdf`);
    }
  };

  const handlePreviewTrigger = (item: DownloadResource) => {
    if (item.id.startsWith("supabase_")) {
      window.open(item.fileUrl, "_blank");
      return;
    }

    if (item.fileUrl) {
      pdfService.openPdf(item.fileUrl, item.title);
    } else {
      setPreviewItem(item);
    }
  };

  const getCategoryBadgeColor = (cat: DownloadCategory) => {
    switch (cat) {
      case 'Date Sheets':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Admission Forms':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Fee Structure':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Holiday Homework':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Syllabus':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Prospectus':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      
      {/* Banner Header */}
      <section className="bg-gradient-to-r from-[#00276a] via-[#123d8f] to-[#1e3a8a] text-white py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center md:text-left">
            <span className="text-amber-300 font-extrabold text-xs uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full inline-block backdrop-blur-md border border-white/20">
              Document Repository
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Resource & Downloads Vault
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl font-medium">
              Access official school prospectus brochures, fee schedules, admission application forms, holiday homework packets, and syllabi guidelines.
            </p>
          </div>

          {/* Admin Unlock button on right side */}
          <button
            type="button"
            onClick={() => isAuthenticated ? logout() : setShowPasswordModal(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
              isAuthenticated 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' 
                : 'bg-white/10 hover:bg-white/20 border border-white/15 text-amber-300'
            }`}
          >
            {isAuthenticated ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-200" />
                <span>Admin: Unlocked</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Control Mode</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 md:px-12 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forms, syllabi, brochures..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10">

        {/* Admin Form */}
        <AnimatePresence>
          {isAuthenticated && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <form onSubmit={handleSaveDocument} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-orange-500" />
                    <h4 className="text-sm font-black uppercase tracking-wider text-[#00276a]">
                      Add PDF Document (Downloads Vault)
                    </h4>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                    Live Form
                  </span>
                </div>

                {formSuccessMessage && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{formSuccessMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Document Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Fee Structure 2026-27"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00276a] outline-none"
                    />
                  </div>

                  {/* SubCategory select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Sub-Category</label>
                    <select
                      value={formSubCategory}
                      onChange={(e) => setFormSubCategory(e.target.value as DownloadCategory)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00276a] outline-none"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Academic Session */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Academic Session / Year</label>
                    <input
                      type="text"
                      value={formSession}
                      onChange={(e) => setFormSession(e.target.value)}
                      placeholder="e.g. 2026-27"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00276a] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Short Description */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Short Description</label>
                    <input
                      type="text"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="e.g. Official prospectus brochure containing detailed guidelines on curriculum..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-950 focus:ring-2 focus:ring-[#00276a] outline-none"
                    />
                  </div>

                  {/* Public PDF URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Public PDF URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        placeholder="https://example.com/document.pdf"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-950 focus:ring-2 focus:ring-[#00276a] outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shrink-0 transition-colors cursor-pointer"
                      >
                        {isSubmitting ? 'Adding...' : 'Add URL'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDownloads.map((item) => (
            <ScrollReveal key={item.id} direction="up">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-600 to-amber-500 absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getCategoryBadgeColor(item.category)}`}>
                      {item.category}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md font-bold">
                      {item.fileType} • {item.fileSize}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-primary group-hover:text-blue-600 transition-colors leading-snug mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed font-medium line-clamp-3 mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Target: <strong>{item.targetClass || 'All Classes'}</strong></span>
                    <span>{item.downloadsCount} Downloads</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreviewTrigger(item)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-primary font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleDownloadTrigger(item)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    {isAuthenticated && item.id.startsWith("supabase_") && (
                      <button
                        onClick={() => handleDeleteDocument(item.id.replace("supabase_", ""), item.title)}
                        className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center shrink-0"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase border inline-block mb-3 ${getCategoryBadgeColor(previewItem.category)}`}>
                {previewItem.category}
              </span>

              <h2 className="text-2xl font-black text-primary leading-tight mb-2">
                {previewItem.title}
              </h2>

              <p className="text-xs text-slate-500 font-semibold mb-6">
                Uploaded: {previewItem.uploadDate} • Target Group: {previewItem.targetClass || 'All'} • Format: {previewItem.fileType} ({previewItem.fileSize})
              </p>

              {/* Simulated Document Reader */}
              <div className="bg-slate-100 rounded-2xl p-8 text-center border border-slate-200 space-y-4 mb-6">
                <FileText className="w-16 h-16 text-blue-600 mx-auto opacity-80" />
                <div>
                  <h4 className="font-extrabold text-primary text-sm">{previewItem.title}</h4>
                  <p className="text-slate-500 text-xs mt-1">{previewItem.description}</p>
                </div>
                <div className="inline-block bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm border border-slate-200">
                  Ready for instant print or local download
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleDownloadTrigger(previewItem)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Start File Download ({previewItem.fileSize})</span>
                </button>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Auth Password Lock Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPasswordModal(false)}
            className="fixed inset-0 z-[10001] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6 text-white relative"
            >
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-white">Unlock Admin Control</h3>
                <p className="text-xs text-slate-300 font-medium">
                  Enter admin security password to enable upload and deletion tools.
                </p>
              </div>

              <form onSubmit={handleAdminAuth} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-amber-300">Admin Password</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password..."
                    autoFocus
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {passwordError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-lg"
                  >
                    Unlock Control
                  </button>
                </div>
              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
