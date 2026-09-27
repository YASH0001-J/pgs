/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Sparkles,
  Calendar,
  FileText,
  Clock,
  Download,
  ChevronRight,
  Pin,
  Flame,
  ArrowUpRight,
  X,
  FileCheck2,
  Share2
} from 'lucide-react';
import { communicationService } from '../services/communicationService';
import { NoticeItem, NoticeCategory } from '../types';
import { useToast } from '../context/ToastContext';
import { ScrollReveal } from './ScrollReveal';

export const LatestUpdatesSection: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  useEffect(() => {
    // Load published notices
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

  // Filter notices
  const filteredNotices = notices.filter((item) => {
    if (activeTab === 'All') return true;
    return item.category === activeTab;
  });

  // Sort pinned first, then by date, and take latest 5
  const displayItems = [...filteredNotices]
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    })
    .slice(0, 5);

  const getCategoryBadgeStyle = (category: NoticeCategory) => {
    switch (category) {
      case 'Important Announcements':
        return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/20';
      case 'Exam Schedule':
        return 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-blue-500/20';
      case 'Upcoming Events':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20';
      case 'Circulars':
        return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20';
      case 'Holiday Notices':
        return 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/20';
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-600/20';
    }
  };

  const handleDownload = (e: React.MouseEvent, item: NoticeItem) => {
    e.stopPropagation();
    showToast({
      type: 'download',
      title: 'Download Started',
      message: `Downloading "${item.attachmentName || item.title}.pdf"`
    });
    if (item.pdfUrl) {
      window.open(item.pdfUrl, '_blank');
    }
  };

  const handleShare = (e: React.MouseEvent, item: NoticeItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/#/notices?id=${item.id}`);
    showToast({
      type: 'success',
      title: 'Link Copied!',
      message: 'Notice direct link copied to clipboard.'
    });
  };

  const getCategoryRedirectPath = (category: string) => {
    switch (category) {
      case 'Exam Schedule':
        return '/exams';
      case 'Upcoming Events':
        return '/events';
      case 'Circulars':
      case 'Holiday Notices':
        return '/downloads';
      default:
        return '/notices';
    }
  };

  return (
    <section id="updates" className="py-16 md:py-24 bg-gradient-to-b from-slate-900 via-[#0b132b] to-[#00276a] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <ScrollReveal direction="up">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 text-white shadow-lg shadow-orange-500/20">
                <Flame className="w-4 h-4 animate-pulse text-amber-200" />
                <span>Live Communication Hub</span>
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                Latest Updates & Circulars
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl">
                Stay informed with official school announcements, board examination timetables, holiday schedules, and event updates.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <button
              onClick={() => navigate(getCategoryRedirectPath(activeTab))}
              className="group px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer shrink-0"
            >
              <span>Explore All Updates</span>
              <ArrowUpRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </ScrollReveal>
        </div>

        {/* Category Filter Pills (Scrollable on Mobile) */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105 border border-white/20'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {cat === 'All' && <Bell className="w-3.5 h-3.5 text-amber-400" />}
                  {cat === 'Important Announcements' && <Sparkles className="w-3.5 h-3.5 text-purple-300" />}
                  {cat === 'Exam Schedule' && <FileText className="w-3.5 h-3.5 text-sky-300" />}
                  {cat === 'Upcoming Events' && <Calendar className="w-3.5 h-3.5 text-emerald-300" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayItems.length === 0 ? (
              <div className="col-span-full bg-white/5 backdrop-blur-md rounded-3xl p-12 text-center border border-white/10">
                <FileCheck2 className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                <p className="text-slate-300 font-bold">No updates found under "{activeTab}" category.</p>
                <button
                  onClick={() => setActiveTab('All')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-colors"
                >
                  View All Categories
                </button>
              </div>
            ) : (
              displayItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setSelectedNotice(item)}
                  className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/15 hover:border-amber-400/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle top gradient bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${getCategoryBadgeStyle(item.category)}`}>
                          {item.category}
                        </span>

                        {item.isNew && (
                          <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full animate-pulse shadow-md">
                            NEW
                          </span>
                        )}

                        {item.isPinned && (
                          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Pin className="w-3 h-3 rotate-45 text-amber-400" />
                            <span>Pinned</span>
                          </span>
                        )}
                      </div>

                      {item.pdfUrl && (
                        <span className="p-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl flex items-center gap-1 text-[11px] font-bold shrink-0" title="PDF Attachment Available">
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{item.pdfSize || 'PDF'}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-3">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6 font-medium">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(item.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.pdfUrl && (
                        <button
                          onClick={(e) => handleDownload(e, item)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => handleShare(e, item)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        title="Share Notice"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <span className="inline-flex items-center gap-1 text-amber-400 font-bold group-hover:translate-x-1 transition-transform ml-1">
                        <span>Read</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Banner Bar */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-orange-500/20">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">Looking for Exam Date Sheets & Syllabi Downloads?</h4>
                <p className="text-slate-300 text-xs sm:text-sm font-medium">Access official CBSE circulars, fee brochures, and holiday homework worksheets.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => navigate('/exams')}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer text-center"
              >
                Exam Timetables
              </button>
              <button
                onClick={() => navigate('/downloads')}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-lg transition-all cursor-pointer text-center"
              >
                Downloads Center
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Detail Modal Reader */}
      <AnimatePresence>
        {selectedNotice && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-white/20 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Image if available */}
              {selectedNotice.coverImage && selectedNotice.coverImage.trim() !== '' && (
                <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
                  <img src={selectedNotice.coverImage.trim()} alt={selectedNotice.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
              )}

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getCategoryBadgeStyle(selectedNotice.category)}`}>
                  {selectedNotice.category}
                </span>

                {selectedNotice.isNew && (
                  <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    NEW
                  </span>
                )}

                <span className="text-slate-400 text-xs font-semibold">
                  Published: {new Date(selectedNotice.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-black text-white mb-4 leading-snug">
                {selectedNotice.title}
              </h3>

              {/* Author badge */}
              {selectedNotice.author && (
                <div className="text-xs font-bold text-amber-400 mb-6 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-xl inline-block">
                  Issued by: {selectedNotice.author}
                </div>
              )}

              {/* Content Body */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 font-sans">
                {selectedNotice.content}
              </div>

              {/* PDF Attachment Bar */}
              {selectedNotice.pdfUrl && (
                <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-4 rounded-2xl border border-blue-500/30 flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-white text-sm">{selectedNotice.attachmentName || 'Official PDF Attachment'}</h5>
                      <p className="text-slate-400 text-xs">Size: {selectedNotice.pdfSize || '1.5 MB'} • Official Document</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDownload(e, selectedNotice)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    Download
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={(e) => handleShare(e, selectedNotice)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all cursor-pointer"
                >
                  Close Notice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
