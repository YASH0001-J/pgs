/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '../context/QueryContext';
import { 
  GraduationCap, 
  Inbox, 
  Trash2, 
  Eye, 
  Mail, 
  MailOpen, 
  LogOut, 
  Search, 
  Filter, 
  ChevronDown, 
  Clock, 
  Phone, 
  User, 
  ShieldAlert, 
  Menu, 
  X,
  FileCheck,
  CalendarCheck,
  ArrowUpDown,
  Images,
  Plus,
  Upload,
  FolderSync,
  ExternalLink,
  Edit3,
  Bell,
  Calendar,
  Download,
  FileText,
  BarChart2,
  Image as ImageIcon
} from 'lucide-react';
import { Query } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryService, GalleryImage, GalleryCategory, GALLERY_CATEGORIES } from '../services/galleryService';
import { GalleryUploadModal } from '../components/GalleryUploadModal';
import { EditImageModal } from '../components/EditImageModal';
import { DeleteImageConfirmModal } from '../components/DeleteImageConfirmModal';
import { ToastNotification } from '../components/ToastNotification';
import { communicationService } from '../services/communicationService';
import { AdminAnalyticsView } from '../components/admin/AdminAnalyticsView';
import { AdminNoticesManager } from '../components/admin/AdminNoticesManager';
import { AdminExamsManager } from '../components/admin/AdminExamsManager';
import { AdminEventsManager } from '../components/admin/AdminEventsManager';
import { AdminDownloadsManager } from '../components/admin/AdminDownloadsManager';
import { AdminPdfManager } from '../components/admin/AdminPdfManager';

export const AdminDashboard: React.FC = () => {
  const { queries, toggleReadStatus, deleteQuery, isAuthenticated, logout, refreshQueries } = useQueries();
  const navigate = useNavigate();

  // Route Protection Check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Listen for the custom "queriesUpdated" event and cross-tab "storage" event to reload queries
  useEffect(() => {
    const handleQueriesUpdated = () => {
      refreshQueries();
    };

    window.addEventListener('queriesUpdated', handleQueriesUpdated);
    window.addEventListener('storage', handleSync);

    function handleSync(e: StorageEvent) {
      if (e.key === 'pgs_queries') {
        refreshQueries();
      }
    }

    return () => {
      window.removeEventListener('queriesUpdated', handleQueriesUpdated);
      window.removeEventListener('storage', handleSync);
    };
  }, [refreshQueries]);

  // UI States
  const [activeSection, setActiveSection] = useState<'analytics' | 'enquiries' | 'notices' | 'exams' | 'events' | 'downloads' | 'pdfs' | 'gallery'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // Gallery Management States
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(() => GalleryService.getCachedImagesSync() || []);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<GalleryCategory | 'all'>('all');
  const [adminGalleryVisibleCount, setAdminGalleryVisibleCount] = useState<number>(10);
  const [isGalleryUploadOpen, setIsGalleryUploadOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [galleryDeleteTargetId, setGalleryDeleteTargetId] = useState<string | null>(null);
  const [isGalleryDeleting, setIsGalleryDeleting] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeletingAllGallery, setIsDeletingAllGallery] = useState(false);
  const [galleryToastMessage, setGalleryToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setAdminGalleryVisibleCount(10);
  }, [galleryCategoryFilter]);

  const loadGalleryImages = async () => {
    const imgs = await GalleryService.getAllImages();
    setGalleryImages(imgs);
  };

  useEffect(() => {
    loadGalleryImages();
    const handleGalleryUpdate = () => loadGalleryImages();
    window.addEventListener('galleryUpdated', handleGalleryUpdate);
    return () => window.removeEventListener('galleryUpdated', handleGalleryUpdate);
  }, []);

  const handleConfirmGalleryDelete = async () => {
    if (!galleryDeleteTargetId) return;
    setIsGalleryDeleting(true);
    await GalleryService.deleteImage(galleryDeleteTargetId);
    await loadGalleryImages();
    setIsGalleryDeleting(false);
    setGalleryDeleteTargetId(null);
    setGalleryToastMessage('Image deleted successfully.');
  };

  const handleDeleteAllGalleryImages = async () => {
    setIsDeletingAllGallery(true);
    console.log("Deleting all images...");
    try {
      await GalleryService.deleteAllImages();
      setGalleryImages([]);
      setGalleryToastMessage('All images deleted successfully.');
      console.log("All images deleted successfully");
    } catch (e) {
      console.error("Failed to delete all images from Firestore:", e);
      setGalleryToastMessage('Failed to delete all images. Please try again.');
    } finally {
      setIsDeletingAllGallery(false);
      setIsDeleteAllModalOpen(false);
    }
  };

  const handleMoveGalleryCategory = async (id: string, newCat: GalleryCategory) => {
    await GalleryService.moveImageCategory(id, newCat);
    await loadGalleryImages();
  };

  const handleSaveGalleryEdit = async (id: string, newTitle: string, newDescription: string, newCategory: GalleryCategory) => {
    await GalleryService.updateImage(id, {
      title: newTitle,
      description: newDescription || undefined,
      category: newCategory,
    });
    await loadGalleryImages();
    setGalleryToastMessage('Image details updated successfully.');
  };

  if (!isAuthenticated) {
    return null; // Prevents flashing during redirect
  }

  // Real-time Dashboard Analytics Cards Calculation
  const totalQueries = queries.length;
  const unreadQueries = queries.filter((q) => !q.read).length;
  const readQueries = queries.filter((q) => q.read).length;
  
  // Today's Queries Count
  const todaysQueries = queries.filter((q) => {
    const qDate = new Date(q.timestamp).toDateString();
    const today = new Date().toDateString();
    return qDate === today;
  }).length;

  // Filter & Search Logic
  const processedQueries = queries
    .filter((q) => {
      // 1. Tab Filtering
      if (filterType === 'unread') return !q.read;
      if (filterType === 'read') return q.read;
      return true;
    })
    .filter((q) => {
      // 2. Search query matching
      const target = searchQuery.toLowerCase().trim();
      if (!target) return true;
      return (
        q.name.toLowerCase().includes(target) ||
        q.email.toLowerCase().includes(target) ||
        q.phone.toLowerCase().includes(target) ||
        q.subject.toLowerCase().includes(target) ||
        q.message.toLowerCase().includes(target)
      );
    })
    .sort((a, b) => {
      // 3. Sorting by timestamp
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleViewQuery = (q: Query) => {
    setSelectedQuery(q);
    // Auto-mark as read when viewed
    if (!q.read) {
      toggleReadStatus(q.id);
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmationId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmationId) {
      deleteQuery(deleteConfirmationId);
      if (selectedQuery?.id === deleteConfirmationId) {
        setSelectedQuery(null);
      }
      setDeleteConfirmationId(null);
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex font-sans">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-white border-r border-white/10 shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-white/20 flex items-center justify-center">
            <img src="/src/assets/images/school_logo_1784036754445.jpg" alt="Professor Global School Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-none">Staff Portal</h1>
            <span className="text-[10px] text-white/50 tracking-widest uppercase font-bold">Administration</span>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider px-3 mb-1">Overview</div>
          <button 
            onClick={() => { setActiveSection('analytics'); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeSection === 'analytics'
                ? 'bg-on-tertiary-container text-on-tertiary shadow-lg' 
                : 'hover:bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart2 className="w-4.5 h-4.5" />
              <span>Dashboard Analytics</span>
            </div>
          </button>

          <div className="pt-2 border-t border-white/10">
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider px-3 mb-1">Inquiries</div>
            <button 
              onClick={() => { setActiveSection('enquiries'); setFilterType('all'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeSection === 'enquiries'
                  ? 'bg-on-tertiary-container text-on-tertiary shadow-lg' 
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4.5 h-4.5" />
                <span>Admission Enquiries</span>
              </div>
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs font-mono">{totalQueries}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-white/10">
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider px-3 mb-1">Communication Hub</div>
            
            <button 
              onClick={() => { setActiveSection('notices'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeSection === 'notices'
                  ? 'bg-on-tertiary-container text-on-tertiary shadow-lg' 
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4.5 h-4.5" />
                <span>Notices & Circulars</span>
              </div>
            </button>

            <button 
              onClick={() => { setActiveSection('exams'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeSection === 'exams'
                  ? 'bg-on-tertiary-container text-on-tertiary shadow-lg' 
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4.5 h-4.5" />
                <span>Exam Schedules</span>
              </div>
            </button>

            <button 
              onClick={() => { setActiveSection('events'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeSection === 'events'
                  ? 'bg-on-tertiary-container text-on-tertiary shadow-lg' 
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4.5 h-4.5" />
                <span>Upcoming Events</span>
              </div>
            </button>

            <button 
              onClick={() => { setActiveSection('downloads'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeSection === 'downloads'
                  ? 'bg-on-tertiary-container text-on-tertiary shadow-lg' 
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4.5 h-4.5" />
                <span>Downloads Vault</span>
              </div>
            </button>

            <button 
              onClick={() => { setActiveSection('pdfs'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeSection === 'pdfs'
                  ? 'bg-on-tertiary-container text-on-tertiary shadow-lg' 
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4.5 h-4.5" />
                <span>PDF Documents Vault</span>
              </div>
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase">
                New
              </span>
            </button>
          </div>

          <div className="pt-2 border-t border-white/10">
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider px-3 mb-1">Campus Media</div>
            <button 
              onClick={() => { setActiveSection('gallery'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeSection === 'gallery'
                  ? 'bg-on-tertiary-container text-on-tertiary shadow-lg' 
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Images className="w-4.5 h-4.5" />
                <span>Photo Gallery</span>
              </div>
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs font-mono">{galleryImages.length}</span>
            </button>
          </div>
        </nav>


        {/* Footer actions inside sidebar */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-4 py-3 bg-white/5 rounded-xl text-xs space-y-1">
            <p className="text-white/40 font-bold uppercase tracking-wider">Logged In As</p>
            <p className="text-white/80 font-mono truncate">admin@gmail.com</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all focus:outline-none"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAW */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-xs bg-primary text-white h-full flex flex-col z-10"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-white border border-white/20 flex items-center justify-center">
                    <img src="/src/assets/images/school_logo_1784036754445.jpg" alt="Professor Global School Logo" className="w-full h-full object-contain p-0.5" />
                  </div>
                  <span className="font-extrabold text-lg">Staff Portal</span>
                </div>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-white/70 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
                <button 
                  onClick={() => { setActiveSection('analytics'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeSection === 'analytics' ? 'bg-on-tertiary-container text-on-tertiary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart2 className="w-4.5 h-4.5" />
                    <span>Analytics</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setActiveSection('enquiries'); setFilterType('all'); setSearchQuery(''); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeSection === 'enquiries' ? 'bg-on-tertiary-container text-on-tertiary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Inbox className="w-4.5 h-4.5" />
                    <span>Enquiries</span>
                  </div>
                  <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">{totalQueries}</span>
                </button>

                <button 
                  onClick={() => { setActiveSection('notices'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeSection === 'notices' ? 'bg-on-tertiary-container text-on-tertiary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4.5 h-4.5" />
                    <span>Notices</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setActiveSection('exams'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeSection === 'exams' ? 'bg-on-tertiary-container text-on-tertiary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4.5 h-4.5" />
                    <span>Exams</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setActiveSection('events'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeSection === 'events' ? 'bg-on-tertiary-container text-on-tertiary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4.5 h-4.5" />
                    <span>Events</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setActiveSection('downloads'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeSection === 'downloads' ? 'bg-on-tertiary-container text-on-tertiary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4.5 h-4.5" />
                    <span>Downloads</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setActiveSection('pdfs'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeSection === 'pdfs' ? 'bg-on-tertiary-container text-on-tertiary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4.5 h-4.5" />
                    <span>PDF Vault</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setActiveSection('gallery'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeSection === 'gallery' ? 'bg-on-tertiary-container text-on-tertiary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Images className="w-4.5 h-4.5" />
                    <span>Gallery</span>
                  </div>
                </button>
              </nav>

              <div className="p-4 border-t border-white/10 space-y-3">
                <button
                  onClick={() => { handleLogout(); setIsMobileSidebarOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Secure Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* TOP INTERACTIVE ACTION HEADER */}
        <header className="bg-white border-b border-outline-variant/40 h-16 px-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-surface-container rounded-lg text-primary"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 lg:gap-0">
              <span className="font-extrabold text-primary text-lg tracking-tight hidden sm:inline-block">Registrar Desk</span>
              <span className="text-secondary text-xs sm:before:content-['•'] sm:before:mx-2 font-medium">
                Real-time Inquiry Pipeline
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-800 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              System Online
            </span>
          </div>
        </header>

        {/* SCROLLABLE INTERACTIVE AREA */}
        <main className="flex-grow overflow-y-auto p-6 space-y-6">

          {activeSection === 'analytics' && (
            <AdminAnalyticsView
              totalQueries={totalQueries}
              unreadQueries={unreadQueries}
              notices={communicationService.getNotices()}
              exams={communicationService.getExams()}
              events={communicationService.getEvents()}
              downloads={communicationService.getDownloads()}
            />
          )}

          {activeSection === 'notices' && <AdminNoticesManager />}
          {activeSection === 'exams' && <AdminExamsManager />}
          {activeSection === 'events' && <AdminEventsManager />}
          {activeSection === 'downloads' && <AdminDownloadsManager />}
          {activeSection === 'pdfs' && <AdminPdfManager />}

          {activeSection === 'gallery' && (
            <div className="space-y-6">
              {/* Gallery Management Header Card */}
              <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-primary font-black text-xl">
                    <Images className="w-6 h-6 text-on-tertiary-container" />
                    <span>Campus Photo Gallery Manager</span>
                  </div>
                  <p className="text-secondary text-xs mt-1">
                    Upload and manage photos across Overview, Our Achievements, Events & Celebrations, and PGS Stars.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {galleryImages.length > 0 && (
                    <button
                      onClick={() => setIsDeleteAllModalOpen(true)}
                      disabled={isDeletingAllGallery}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs tracking-wide shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      title="Delete all photos from Firestore"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{isDeletingAllGallery ? 'Deleting...' : 'Delete All Images'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsGalleryUploadOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-xs tracking-wide shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Image URL</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <button
                  onClick={() => setGalleryCategoryFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    galleryCategoryFilter === 'all'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-secondary hover:bg-surface-container border border-outline-variant/30'
                  }`}
                >
                  All Categories ({galleryImages.length})
                </button>

                {GALLERY_CATEGORIES.map((cat) => {
                  const count = galleryImages.filter((img) => img.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setGalleryCategoryFilter(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        galleryCategoryFilter === cat.id
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white text-secondary hover:bg-surface-container border border-outline-variant/30'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.title}</span>
                      <span className="opacity-70 font-mono text-[11px]">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Gallery Grid */}
              {(() => {
                const filtered = galleryCategoryFilter === 'all'
                  ? galleryImages
                  : galleryImages.filter((img) => img.category === galleryCategoryFilter);

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white p-12 rounded-3xl border border-outline-variant/30 text-center space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-primary/5 text-primary flex items-center justify-center text-3xl mx-auto shadow-inner">
                        📸
                      </div>
                      <h3 className="text-xl font-extrabold text-primary">No images added yet.</h3>
                      <p className="text-secondary text-sm max-w-md mx-auto leading-relaxed">
                        Upload files or enter image URLs to add photos to this category. All images are saved permanently in Firebase Firestore cloud database.
                      </p>
                      <button
                        onClick={() => setIsGalleryUploadOpen(true)}
                        className="px-6 py-3 rounded-xl bg-primary text-white font-extrabold text-xs uppercase tracking-wider hover:bg-primary-dark shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Photos</span>
                      </button>
                    </div>
                  );
                }

                const displayed = filtered.slice(0, adminGalleryVisibleCount);

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {displayed.map((img) => {
                        const catMeta = GALLERY_CATEGORIES.find((c) => c.id === img.category);
                        return (
                          <div
                            key={img.id}
                            className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                          >
                            <div className="relative h-48 bg-surface-container overflow-hidden">
                              {Boolean((img.thumbnailUrl && img.thumbnailUrl.trim()) || (img.imageUrl && img.imageUrl.trim())) ? (
                                <img
                                  src={(img.thumbnailUrl && img.thumbnailUrl.trim()) || (img.imageUrl && img.imageUrl.trim()) || ''}
                                  alt={img.title || 'Gallery item'}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                  <ImageIcon className="w-8 h-8 opacity-40" />
                                </div>
                              )}
                              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <span>{catMeta?.icon}</span>
                                <span>{catMeta?.title}</span>
                              </div>
                            </div>

                            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-sm text-primary line-clamp-1">{img.title}</h4>
                                {img.description && (
                                  <p className="text-xs text-secondary line-clamp-2 mt-1">{img.description}</p>
                                )}
                              </div>

                              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                                <select
                                  value={img.category}
                                  onChange={(e) => handleMoveGalleryCategory(img.id, e.target.value as GalleryCategory)}
                                  className="text-[11px] font-bold text-secondary bg-surface-container border border-outline-variant/30 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                                >
                                  {GALLERY_CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.icon} {cat.title}
                                    </option>
                                  ))}
                                </select>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setEditingImage(img)}
                                    className="p-2 rounded-lg text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                                    title="Edit title & description"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setGalleryDeleteTargetId(img.id)}
                                    className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                                    title="Delete image"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Load More Button */}
                    {filtered.length > adminGalleryVisibleCount && (
                      <div className="pt-4 pb-2 flex flex-col items-center justify-center gap-2">
                        <p className="text-xs font-semibold text-secondary">
                          Showing <span className="text-primary font-black">{displayed.length}</span> of <span className="text-primary font-black">{filtered.length}</span> photos
                        </p>
                        <button
                          onClick={() => setAdminGalleryVisibleCount((prev) => prev + 10)}
                          className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-xs tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Load More Images (+10)</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Gallery Upload Modal */}
              {isGalleryUploadOpen && (
                <GalleryUploadModal
                  isOpen={isGalleryUploadOpen}
                  defaultCategory={galleryCategoryFilter === 'all' ? 'overview' : galleryCategoryFilter}
                  onClose={() => setIsGalleryUploadOpen(false)}
                  onUploadSuccess={() => {
                    loadGalleryImages();
                  }}
                />
              )}

              {/* Edit Image Details Modal */}
              {editingImage && (
                <EditImageModal
                  isOpen={editingImage !== null}
                  image={editingImage}
                  onClose={() => setEditingImage(null)}
                  onSave={handleSaveGalleryEdit}
                />
              )}

              {/* Delete Confirmation Modal */}
              <DeleteImageConfirmModal
                isOpen={galleryDeleteTargetId !== null}
                onClose={() => setGalleryDeleteTargetId(null)}
                onConfirm={handleConfirmGalleryDelete}
                isDeleting={isGalleryDeleting}
              />

              {/* Delete All Images Confirmation Modal */}
              <DeleteImageConfirmModal
                isOpen={isDeleteAllModalOpen}
                onClose={() => setIsDeleteAllModalOpen(false)}
                onConfirm={handleDeleteAllGalleryImages}
                isDeleting={isDeletingAllGallery}
                title="Delete All Images"
                message="Are you sure you want to delete all images?"
              />

              {/* Toast Notification */}
              <ToastNotification
                message={galleryToastMessage}
                onClose={() => setGalleryToastMessage(null)}
              />
            </div>
          )}

          {activeSection === 'enquiries' && (
            <>

              {/* DASHBOARD STATS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white p-3 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center shrink-0">
                <Inbox className="w-5 sm:w-5.5 h-5 sm:h-5.5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">Total</span>
                <span className="block text-lg sm:text-2xl font-black text-primary font-mono">{totalQueries}</span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 sm:w-5.5 h-5 sm:h-5.5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">Unread</span>
                <span className="block text-lg sm:text-2xl font-black text-red-600 font-mono">{unreadQueries}</span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 sm:w-5.5 h-5 sm:h-5.5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">Processed</span>
                <span className="block text-lg sm:text-2xl font-black text-green-600 font-mono">{readQueries}</span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-on-tertiary-container/15 text-on-tertiary-container flex items-center justify-center shrink-0">
                <CalendarCheck className="w-5 sm:w-5.5 h-5 sm:h-5.5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">Today's</span>
                <span className="block text-lg sm:text-2xl font-black text-on-tertiary-container font-mono">{todaysQueries}</span>
              </div>
            </div>

          </div>

          {/* TABLE CONTROLS (SEARCH, SORT, TABS) */}
          <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-4 sm:p-6 space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Tabs for query filters */}
              <div className="flex border-b border-outline-variant/30 overflow-x-auto scrollbar-none whitespace-nowrap -mx-4 px-4 md:mx-0 md:px-0">
                {(['all', 'unread', 'read'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4.5 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 -mb-px transition-colors shrink-0 ${
                      filterType === type
                        ? 'border-primary text-primary'
                        : 'border-transparent text-secondary hover:text-primary'
                    }`}
                  >
                    {type === 'all' && `All (${totalQueries})`}
                    {type === 'unread' && `Unread (${unreadQueries})`}
                    {type === 'read' && `Read (${readQueries})`}
                  </button>
                ))}
              </div>

              {/* Sort selector & layout switcher */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="inline-flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-primary px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Date: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
                </button>
              </div>

            </div>

            {/* Search Input bar */}
            <div className="relative">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-secondary/60 w-4.5 h-4.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search queries by candidate name, email address, contact numbers, or description..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low text-on-surface placeholder-secondary/50 text-sm border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all duration-300 font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4.5 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary/70 hover:text-primary"
                >
                  Clear
                </button>
              )}
            </div>

            {/* PIPELINE LISTING WORKSPACE */}
            <div className="overflow-hidden rounded-xl border border-outline-variant/25 bg-white">
              <div className="hidden md:grid grid-cols-12 gap-4 bg-surface-container-low p-4 font-bold text-xs uppercase tracking-wider text-primary">
                <div className="col-span-3">Applicant & contact</div>
                <div className="col-span-3">Inquiry subject</div>
                <div className="col-span-4">Query preview</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-outline-variant/20">
                {processedQueries.length === 0 ? (
                  <div className="p-12 text-center text-secondary/60 space-y-2">
                    <Inbox className="w-12 h-12 mx-auto text-secondary/35" />
                    <p className="font-bold text-sm">No Enquiries Found</p>
                    <p className="text-xs">No records matched your specific filters or search text.</p>
                  </div>
                ) : (
                  processedQueries.map((q) => (
                    <div 
                      key={q.id}
                      onClick={() => handleViewQuery(q)}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 sm:p-5 hover:bg-surface-container-lowest transition-colors cursor-pointer relative items-center ${
                        !q.read ? 'bg-primary-container/[0.02] border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                      }`}
                    >
                      {/* Name & Contact */}
                      <div className="col-span-3 space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-extrabold text-sm ${!q.read ? 'text-primary font-black' : 'text-on-surface'}`}>
                            {q.name}
                          </span>
                          {!q.read && (
                            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="New" />
                          )}
                        </div>
                        <div className="space-y-0.5 text-xs text-secondary font-medium">
                          <p className="truncate">{q.email}</p>
                          <p className="font-mono">{q.phone}</p>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="col-span-3 space-y-1">
                        <span className="font-bold text-sm text-primary line-clamp-1">
                          {q.subject}
                        </span>
                        <div className="flex items-center gap-1.5 text-secondary text-[11px] font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(q.timestamp)}</span>
                        </div>
                      </div>

                      {/* Short Message Preview */}
                      <div className="col-span-4">
                        <p className="text-on-surface-variant text-xs sm:text-sm line-clamp-2 leading-relaxed">
                          {q.message}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-3 border-t border-outline-variant/15 md:border-t-0 md:pt-0" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewQuery(q)}
                            className="p-2 rounded-lg bg-surface-container hover:bg-primary/10 text-primary transition-colors"
                            title="View detailed query"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleReadStatus(q.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              q.read 
                                ? 'bg-surface-container text-secondary hover:bg-primary-container/10 hover:text-primary' 
                                : 'bg-primary-container/10 text-primary hover:bg-primary hover:text-white'
                            }`}
                            title={q.read ? "Mark as unread" : "Mark as processed"}
                          >
                            {q.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                          </button>
                        </div>

                        <button
                          onClick={(e) => handleDeleteClick(q.id, e)}
                          className="p-2 rounded-lg bg-surface-container hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
            </>
          )}

        </main>
      </div>

      {/* DETAILED VIEW MODAL ENQUIRY PANEL OVERLAY */}
      <AnimatePresence>
        {selectedQuery && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full border border-outline-variant/30 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            >
              <div className="bg-primary p-6 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-5.5 h-5.5 text-on-tertiary-container" />
                  <span className="font-extrabold text-base">Enquiry Workspace</span>
                </div>
                <button 
                  onClick={() => setSelectedQuery(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(95vh-70px)]">
                
                {/* Meta details header card */}
                <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Candidate Name</span>
                    <span className="text-sm font-extrabold text-primary flex items-center gap-1.5">
                      <User className="w-4 h-4 text-on-tertiary-container" />
                      {selectedQuery.name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Receipt Timestamp</span>
                    <span className="text-sm font-extrabold text-primary flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-on-tertiary-container" />
                      {formatDate(selectedQuery.timestamp)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Candidate Email</span>
                    <span className="text-sm font-bold text-primary truncate block">{selectedQuery.email}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Candidate Phone</span>
                    <span className="text-sm font-mono font-bold text-primary flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-on-tertiary-container" />
                      {selectedQuery.phone}
                    </span>
                  </div>
                </div>

                {/* Subject & Query message body */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Subject</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-primary tracking-tight">
                    {selectedQuery.subject}
                  </h3>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Inquiry Description</span>
                  <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-2xl max-h-56 overflow-y-auto text-on-surface-variant text-sm sm:text-base leading-relaxed custom-scrollbar whitespace-pre-wrap font-sans">
                    {selectedQuery.message}
                  </div>
                </div>

                {/* Footer management buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                  <button
                    onClick={() => {
                      deleteQuery(selectedQuery.id);
                      setSelectedQuery(null);
                    }}
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-xs uppercase tracking-wider px-4 py-2.5 bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Registry</span>
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleReadStatus(selectedQuery.id)}
                      className="inline-flex items-center gap-2 text-primary hover:bg-primary-container/10 border border-outline-variant/50 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                    >
                      {selectedQuery.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                      <span>{selectedQuery.read ? 'Mark Unread' : 'Mark Processed'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedQuery(null)}
                      className="bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                    >
                      Close Workspace
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE MODAL OVERLAY */}
      <AnimatePresence>
        {deleteConfirmationId && (
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 border border-outline-variant/30 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary">Confirm Deletion</h3>
              <p className="text-secondary text-xs sm:text-sm">
                Are you absolutely sure you want to delete this enquiry from the local registries? This action is irreversible.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmationId(null)}
                  className="flex-grow border border-outline-variant/50 hover:bg-surface-container py-2.5 rounded-xl text-xs font-bold text-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-grow bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
