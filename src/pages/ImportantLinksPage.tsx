/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Link as LinkIcon, 
  FileText, 
  ExternalLink, 
  Download, 
  Eye, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Copy, 
  Check, 
  X,
  FileCheck,
  Building2,
  Calendar,
  Briefcase,
  Layers,
  Grid,
  List,
  Lock,
  Unlock,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Plus,
  FilePlus,
  ShieldCheck
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { pdfService } from '../services/pdfService';
import { useSupabaseDocuments } from '../hooks/useSupabaseDocuments';
import { useQueries } from '../context/QueryContext';

export interface ImportantLinkItem {
  slNo: number;
  key?: string;
  title: string;
  category: 'Certificates' | 'Academic' | 'APAAR Consent' | 'Careers';
  url: string;
  fileType: 'PDF' | 'JPG' | 'PNG' | 'URL';
  fileSize?: string;
  updatedDate: string;
  description: string;
}

export const IMPORTANT_LINKS_DATA: ImportantLinkItem[] = [
  {
    slNo: 1,
    key: "transfer_certificate",
    title: "Transfer Certificate",
    category: "Certificates",
    url: "",
    fileType: "PDF",
    fileSize: "PDF Document",
    updatedDate: "Official Record",
    description: "Official Transfer Certificate (TC) format and verified issuance document for student records."
  },
  {
    slNo: 2,
    key: "academic_calendar_2025_26",
    title: "Academic Planner",
    category: "Academic",
    url: "",
    fileType: "PDF",
    fileSize: "PDF Document",
    updatedDate: "Session 2025-2026",
    description: "Comprehensive yearly academic calendar, holiday schedule, examination dates, and activity planner."
  },
  {
    slNo: 3,
    key: "apaar_letter_hindi",
    title: "APAAR Letter - Hindi Format",
    category: "APAAR Consent",
    url: "",
    fileType: "PDF",
    fileSize: "PDF Document",
    updatedDate: "Mandatory Government Form",
    description: "Automated Permanent Academic Account Registry (APAAR) parent consent letter format in Hindi."
  },
  {
    slNo: 4,
    key: "apaar_letter_english",
    title: "APAAR Letter - English Format",
    category: "APAAR Consent",
    url: "",
    fileType: "PDF",
    fileSize: "PDF Document",
    updatedDate: "Mandatory Government Form",
    description: "Automated Permanent Academic Account Registry (APAAR) parent consent letter format in English."
  },
  {
    slNo: 5,
    key: "vacancies_1",
    title: "Vacancies 1",
    category: "Careers",
    url: "https://pgsbaprola.org/assets/images/notice/vacancies.jpg",
    fileType: "JPG",
    fileSize: "Image Announcement",
    updatedDate: "Current Opening",
    description: "Official faculty and staff recruitment notification detailing required qualifications and open positions."
  },
  {
    slNo: 6,
    key: "vacancies_2",
    title: "Vacancies 2",
    category: "Careers",
    url: "https://pgsbaprola.org/assets/images/notice/vacancies2.jpg",
    fileType: "JPG",
    fileSize: "Image Announcement",
    updatedDate: "Current Opening",
    description: "Supplementary teaching and administrative job vacancies announcement for Professor's Global School."
  }
];

export const ImportantLinksPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Centralized Admin integration
  const { isAuthenticated, login, logout } = useQueries();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Paste URL Form states
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formSubCategory, setFormSubCategory] = useState<'Certificates' | 'Academic' | 'APAAR Consent' | 'Careers'>('Certificates');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Load dynamic Supabase documents
  const { documents: supabaseDocs, addDocument: addSupabaseDoc, deleteDocument: deleteSupabaseDoc } = useSupabaseDocuments('important_links', false);

  const dynamicLinks: ImportantLinkItem[] = supabaseDocs
    .filter(item => isAuthenticated || item.is_published !== false)
    .map((item, idx) => ({
      slNo: IMPORTANT_LINKS_DATA.length + idx + 1,
      key: `supabase_${item.id}`,
      title: item.title,
      category: (item.year as any) || 'Certificates',
      url: item.pdf_url,
      fileType: 'PDF',
      fileSize: 'External PDF',
      updatedDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent',
      description: `Official PDF link published in subcategory: ${item.year || 'Certificates'}.`
    }));

  const combinedLinks = [...IMPORTANT_LINKS_DATA, ...dynamicLinks];

  const categories = ['All', 'Certificates', 'Academic', 'APAAR Consent', 'Careers'];

  const filteredLinks = combinedLinks.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (url: string, title: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(title);
    setTimeout(() => setCopiedLink(null), 2500);
  };

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
      await addSupabaseDoc(formTitle.trim(), formUrl.trim(), 'important_links', formSubCategory);
      setFormSuccessMessage(`Successfully published "${formTitle}" to ${formSubCategory}!`);
      setFormTitle('');
      setFormUrl('');
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

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans text-slate-800">
      
      {/* 1. Page Header Hero Section */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-[#001230] via-[#00276a] to-slate-950 text-white overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,147,98,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.2),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-blue-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-orange-400" />
            <Link to="/public-disclosure" className="hover:text-white transition-colors">General</Link>
            <ChevronRight className="w-4 h-4 text-orange-400" />
            <span className="text-white font-semibold">Important Links</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-black uppercase tracking-widest shadow-md">
                <LinkIcon className="w-4 h-4 text-amber-400" />
                <span>Quick Access Portal • Official Notices</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                Important <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-pink-300">Links & Notices</span>
              </h1>

              <p className="text-blue-100 text-sm sm:text-base md:text-lg leading-relaxed">
                Direct access to essential school documents, academic calendars, APAAR government consent letters, transfer certificate guidelines, and active employment recruitment notices for <strong>Professor's Global School</strong>.
              </p>

              {/* Status Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>{combinedLinks.length} Verified Documents Available</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-400" />
                  <span>Official Downloads Portal</span>
                </div>

                {/* Admin Mode Lock/Unlock Trigger */}
                <button
                  type="button"
                  onClick={() => isAuthenticated ? logout() : setShowPasswordModal(true)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
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
            </div>

            {/* Quick Filter Card */}
            <div className="w-full lg:w-80 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl space-y-4 shrink-0">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-300 border-b border-white/15 pb-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Quick Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-amber-400">4</p>
                  <p className="text-[11px] font-bold text-slate-300">PDF Documents</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-orange-400">2</p>
                  <p className="text-[11px] font-bold text-slate-300">Job Notices</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-emerald-400">2026</p>
                  <p className="text-[11px] font-bold text-slate-300">Academic Term</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-cyan-400">100%</p>
                  <p className="text-[11px] font-bold text-slate-300">Verified Links</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Controls & Search Bar (Sticky Sub-Header) */}
      <section className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#00276a] text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                {cat === 'All' && (
                  <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px]">
                    {IMPORTANT_LINKS_DATA.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right Side: Search Box + View Switcher */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search links or notices..."
                className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 text-xs font-bold pl-10 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00276a] transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-[#00276a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Card Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#00276a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Structured Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Copy Toast Alert */}
      <AnimatePresence>
        {copiedLink && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-emerald-600 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400"
          >
            <Check className="w-4 h-4 text-emerald-200" />
            <span>Copied URL for "{copiedLink}"!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Content Display */}
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
                      Add PDF Document (Important Link)
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Document Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Academic Calendar 2026"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00276a] outline-none"
                    />
                  </div>

                  {/* SubCategory */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Sub-Category</label>
                    <select
                      value={formSubCategory}
                      onChange={(e) => setFormSubCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00276a] outline-none"
                    >
                      {['Certificates', 'Academic', 'APAAR Consent', 'Careers'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
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
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00276a] outline-none"
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
        
        {filteredLinks.length > 0 ? (
          viewMode === 'cards' ? (
            /* CARDS GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((item) => (
                <ScrollReveal key={item.slNo} direction="up">
                  <motion.div 
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all overflow-hidden flex flex-col justify-between h-full"
                  >
                    
                    {/* Top Card Banner */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#00276a] font-black text-xs flex items-center justify-center">
                          0{item.slNo}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            item.fileType === 'PDF' 
                              ? 'bg-red-50 text-red-700 border border-red-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {item.fileType} Document
                          </span>

                          <button
                            onClick={() => handleCopy(item.url, item.title)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            title="Copy Direct Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-black text-slate-900 leading-tight">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-6 pt-0 space-y-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-extrabold text-slate-500">
                        <span>Tag: {item.updatedDate}</span>
                        <span>{item.fileSize}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => pdfService.openPdf(item.url || item.key || '', item.title)}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#00276a] hover:bg-[#00173e] text-white text-xs font-extrabold py-3 px-4 rounded-xl shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-amber-400" />
                          <span>View Document</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </button>

                        <button
                          type="button"
                          onClick={() => pdfService.downloadPdf(item.url || item.key || '', `${item.title}.pdf`)}
                          className="inline-flex items-center justify-center p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {isAuthenticated && item.key?.startsWith('supabase_') && (
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(item.key!.replace('supabase_', ''), item.title)}
                            className="inline-flex items-center justify-center p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* STRUCTURED TABLE VIEW */
            <ScrollReveal direction="up">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                
                <div className="bg-gradient-to-r from-[#001230] to-[#00276a] p-6 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">Important School Notices Table</h2>
                      <p className="text-xs text-blue-200 font-medium">Verified repository of official documents</p>
                    </div>
                  </div>

                  <span className="text-xs font-black px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">
                    {filteredLinks.length} Items Listed
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-xs font-black text-slate-700 uppercase tracking-wider">
                        <th className="py-4 px-6 w-20 text-center">SL NO</th>
                        <th className="py-4 px-6">HEAD (TITLE)</th>
                        <th className="py-4 px-6">CATEGORY</th>
                        <th className="py-4 px-6 text-center">FILE TYPE</th>
                        <th className="py-4 px-6 text-center">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-medium">
                      {filteredLinks.map((item, idx) => (
                        <tr 
                          key={item.slNo}
                          className={`transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                          } hover:bg-amber-50/40`}
                        >
                          <td className="py-4 px-6 text-center font-black text-slate-600">
                            {item.slNo}
                          </td>
                          <td className="py-4 px-6 space-y-1">
                            <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                            <p className="text-xs text-slate-500 font-medium line-clamp-1">{item.description}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-black uppercase ${
                              item.fileType === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.fileType}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => pdfService.openPdf(item.url || item.key || '', item.title)}
                                className="inline-flex items-center gap-1.5 bg-[#00276a] hover:bg-[#00173e] text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-sm hover:scale-105 transition-all cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => pdfService.downloadPdf(item.url || item.key || '', `${item.title}.pdf`)}
                                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-sm hover:scale-105 transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>

                              {isAuthenticated && item.key?.startsWith('supabase_') && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDocument(item.key!.replace('supabase_', ''), item.title)}
                                  className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-sm hover:scale-105 transition-all cursor-pointer"
                                  title="Delete Document"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </ScrollReveal>
          )
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800">No matching links found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We couldn't find any resources matching "{searchTerm}". Try clearing your search term or selecting another category.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00276a] text-white text-xs font-bold shadow-md hover:bg-[#00173e] transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      {/* Admin Verification Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative space-y-6 text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">Admin Authentication</h3>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
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
