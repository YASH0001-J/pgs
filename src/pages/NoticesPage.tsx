/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Download,
  Share2,
  Printer,
  Calendar,
  Pin,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  Sparkles,
  ArrowUpDown,
  Check,
  FileCheck
} from 'lucide-react';
import { communicationService } from '../services/communicationService';
import { NoticeItem, NoticeCategory } from '../types';
import { useToast } from '../context/ToastContext';
import { ScrollReveal } from '../components/ScrollReveal';

export const NoticesPage: React.FC = () => {
  const { showToast } = useToast();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [activeNoticeModal, setActiveNoticeModal] = useState<NoticeItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loaded = communicationService.getNotices().filter((n) => n.isPublished);
    setNotices(loaded);
  }, []);

  const categories = [
    'All',
    'Latest Notices',
    'Important Announcements',
    'Upcoming Events',
    'Exam Schedule',
    'Circulars',
    'Holiday Notices'
  ];

  const academicYears = ['All', '2026-27', '2025-26'];

  // Filter & Sort
  const filteredNotices = useMemo(() => {
    return notices
      .filter((n) => {
        const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
        const matchesYear = selectedYear === 'All' || n.academicYear === selectedYear;
        const matchesSearch =
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (n.author && n.author.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesYear && matchesSearch;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        const timeA = new Date(a.publishDate).getTime();
        const timeB = new Date(b.publishDate).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [notices, searchQuery, selectedCategory, selectedYear, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage) || 1;
  const paginatedNotices = filteredNotices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownload = (item: NoticeItem) => {
    showToast({
      type: 'download',
      title: 'Download Triggered',
      message: `Downloading "${item.attachmentName || item.title}.pdf"`
    });
    if (item.pdfUrl) {
      window.open(item.pdfUrl, '_blank');
    }
  };

  const handleShare = (item: NoticeItem) => {
    navigator.clipboard.writeText(`${window.location.href}?id=${item.id}`);
    showToast({
      type: 'success',
      title: 'Share Link Copied',
      message: 'Notice web link copied to clipboard.'
    });
  };

  const handlePrint = (item: NoticeItem) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Professor's Global School - Official Notice</title>
            <style>
              body { font-family: 'Arial', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
              .header { text-align: center; border-bottom: 2px solid #00276a; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { color: #00276a; margin: 0; font-size: 24px; }
              .header p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; }
              .meta { margin-bottom: 25px; background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 13px; }
              .title { font-size: 20px; color: #00276a; font-weight: bold; margin-bottom: 15px; }
              .content { font-size: 15px; white-space: pre-line; margin-bottom: 30px; }
              .footer { border-top: 1px solid #e2e8f0; pt: 20px; margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>PROFESSOR'S GLOBAL SCHOOL</h1>
              <p>Jai Vihar, Baprola, New Delhi – 110043 | Official Circular Registry</p>
            </div>
            <div class="meta">
              <strong>Category:</strong> ${item.category} | <strong>Date:</strong> ${item.publishDate} | <strong>Issued By:</strong> ${item.author || 'Registry Office'}
            </div>
            <div class="title">${item.title}</div>
            <div class="content">${item.content}</div>
            <div class="footer">
              This is an official digital communication record verified by Professor's Global School Management System.
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getCategoryBadgeStyle = (category: NoticeCategory) => {
    switch (category) {
      case 'Important Announcements':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Exam Schedule':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'Upcoming Events':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Circulars':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Holiday Notices':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      
      {/* Banner Header */}
      <section className="bg-gradient-to-r from-[#00276a] via-[#123d8f] to-[#1e3a8a] text-white py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4 text-center md:text-left">
          <span className="text-amber-300 font-extrabold text-xs uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full inline-block backdrop-blur-md border border-white/20">
            Official Registry Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Notices & Circulars Hub
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl font-medium">
            Search, filter, download, and review authentic academic circulars, administrative guidelines, and exam schedules.
          </p>
        </div>
      </section>

      {/* Sticky Search & Filter Bar */}
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm py-4 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, keywords, or author..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 text-slate-800 text-xs sm:text-sm border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                {academicYears.map((y) => (
                  <option key={y} value={y}>{y === 'All' ? 'All Academic Years' : `Year ${y}`}</option>
                ))}
              </select>
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
              <span>{sortBy === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10">
        
        {/* Results Metadata */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 text-xs sm:text-sm font-semibold">
            Showing <strong className="text-primary">{filteredNotices.length}</strong> official records
          </p>

          {(selectedCategory !== 'All' || selectedYear !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedYear('All');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Cards Grid */}
        {paginatedNotices.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-4">
            <FileCheck className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="text-lg font-black text-primary">No Notices Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">
              We couldn't find any circular matching your search criteria. Try broadening your filter selections.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedNotices.map((notice) => (
              <motion.div
                key={notice.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveNoticeModal(notice)}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
              >
                <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getCategoryBadgeStyle(notice.category)}`}>
                      {notice.category}
                    </span>

                    {notice.isPinned && (
                      <span className="p-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-200" title="Pinned Notice">
                        <Pin className="w-3.5 h-3.5 rotate-45" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-primary group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-2">
                    {notice.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6 font-medium">
                    {notice.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(notice.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {notice.pdfUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(notice);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Download Attachment"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(notice);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Share Notice"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-[#00276a] to-[#123d8f] text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Notice Detail Reader Modal */}
      <AnimatePresence>
        {activeNoticeModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getCategoryBadgeStyle(activeNoticeModal.category)}`}>
                  {activeNoticeModal.category}
                </span>
                <span className="text-slate-500 text-xs font-semibold">
                  Year: {activeNoticeModal.academicYear}
                </span>
              </div>

              <h2 className="text-2xl font-black text-primary leading-tight mb-2">
                {activeNoticeModal.title}
              </h2>

              <p className="text-xs font-bold text-slate-500 mb-6">
                Published on {new Date(activeNoticeModal.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {activeNoticeModal.author && ` • Issued by ${activeNoticeModal.author}`}
              </p>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 font-sans">
                {activeNoticeModal.content}
              </div>

              {activeNoticeModal.pdfUrl && (
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/60 flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600 shrink-0" />
                    <div>
                      <h5 className="font-extrabold text-primary text-sm">{activeNoticeModal.attachmentName || 'Official PDF Attachment'}</h5>
                      <p className="text-slate-500 text-xs">Size: {activeNoticeModal.pdfSize || '1.8 MB'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(activeNoticeModal)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Download PDF
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint(activeNoticeModal)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Notice</span>
                  </button>

                  <button
                    onClick={() => handleShare(activeNoticeModal)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveNoticeModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#00276a] text-white font-extrabold text-xs hover:bg-[#123d8f] transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
