/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Copy,
  ExternalLink,
  RefreshCw,
  FolderOpen,
  HardDrive,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import { PDF_CATEGORIES } from '../../data/initialPdfs';
import { PDFCategory, PDFDocument } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useSupabaseDocuments } from '../../hooks/useSupabaseDocuments';
import { LinkIcon } from 'lucide-react';

export const AdminPdfManager: React.FC = () => {
  const { showToast } = useToast();
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'uploaded' | 'published' | 'unpublished' | 'pending'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Sub-tab selection state (files: standard, urls: pasted URLs in Supabase documents table)
  const [activeTab, setActiveTab] = useState<'files' | 'urls'>('files');

  // Supabase Database documents hook
  const {
    documents: supabaseDocs,
    addDocument: addSupabaseDoc,
    deleteDocument: deleteSupabaseDoc,
    togglePublishStatus: toggleSupabasePublishStatus,
    loading: supabaseLoading
  } = useSupabaseDocuments('all', false); // Get all, including hidden ones

  // Paste URL form and modal state
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');
  const [pasteCategory, setPasteCategory] = useState<string>('public_disclosure');
  const [pasteYear, setPasteYear] = useState('2026-27');
  const [isPasteSubmitting, setIsPasteSubmitting] = useState(false);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [targetPdf, setTargetPdf] = useState<PDFDocument | null>(null);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<PDFCategory>('public_disclosure');
  const [formKey, setFormKey] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAcademicYear, setFormAcademicYear] = useState('2026-27');
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to real-time PDF updates
  useEffect(() => {
    const unsubscribe = pdfService.subscribe((list) => {
      setPdfs(list);
    });
    return () => unsubscribe();
  }, []);

  // Filtered PDFs
  const filteredPdfs = pdfs.filter((item) => {
    const isUploaded = Boolean(item.pdfUrl && item.pdfUrl.trim() !== '' && !item.pdfUrl.startsWith('data:image/svg+xml'));
    const isPub = item.isPublished !== false;
    
    if (statusFilter === 'uploaded' && !isUploaded) return false;
    if (statusFilter === 'pending' && isUploaded) return false;
    if (statusFilter === 'published' && (!isPub || !isUploaded)) return false;
    if (statusFilter === 'unpublished' && (isPub && isUploaded)) return false;

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.key && item.key.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered Supabase external URLs
  const filteredSupabaseDocs = supabaseDocs.filter((item) => {
    // Filter by visibility based on statusFilter
    if (statusFilter === 'published' && item.is_published === false) return false;
    if (statusFilter === 'unpublished' && item.is_published !== false) return false;
    // 'uploaded', 'pending' filters are not applicable to external pasted URLs
    if (statusFilter === 'uploaded' || statusFilter === 'pending') return true;

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pdf_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.year && item.year.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate statistics
  const uploadedCount = pdfs.filter((p) => p.pdfUrl && p.pdfUrl.trim() !== '' && !p.pdfUrl.startsWith('data:image/svg+xml')).length;
  const publishedCount = pdfs.filter((p) => p.isPublished !== false && p.pdfUrl && p.pdfUrl.trim() !== '' && !p.pdfUrl.startsWith('data:image/svg+xml')).length;
  const pendingCount = pdfs.length - uploadedCount;
  const totalDownloads = pdfs.reduce((acc, p) => acc + (p.downloadCount || 0), 0);

  const handleFileChange = (file: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      showToast({
        type: 'error',
        title: 'Invalid File Format',
        message: 'Please select a valid PDF (.pdf) file.'
      });
      return;
    }
    setSelectedFile(file);

    // Duplicate detection check
    const existing = pdfService.findDuplicateFile(file.name);
    if (existing) {
      setDuplicateWarning(`A document with file "${file.name}" is already registered as "${existing.title}".`);
    } else {
      setDuplicateWarning(null);
    }

    if (!formTitle) {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setFormTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
    }
    if (!formKey) {
      setFormKey(file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '_'));
    }
  };

  const handleTogglePublish = async (item: PDFDocument) => {
    const nextStatus = item.isPublished === false ? true : false;
    try {
      await pdfService.togglePublishStatus(item.id, nextStatus);
      showToast({
        type: 'success',
        title: nextStatus ? 'Document Published' : 'Document Unpublished',
        message: `"${item.title}" is now ${nextStatus ? 'visible to public website visitors' : 'hidden from public view'}.`
      });
    } catch (e) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not change document visibility.'
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFormTitle('');
    setFormCategory('public_disclosure');
    setFormKey('');
    setFormDescription('');
    setFormAcademicYear('2026-27');
    setFormIsPublished(true);
    setUploadProgress(null);
    setIsSubmitting(false);
    setTargetPdf(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast({
        type: 'error',
        title: 'Missing File',
        message: 'Please choose or drag a PDF document.'
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      await pdfService.uploadPdfFile(
        selectedFile,
        {
          title: formTitle.trim(),
          category: formCategory,
          key: formKey.trim() || undefined,
          description: formDescription.trim() || undefined,
          academicYear: formAcademicYear,
          isPublished: formIsPublished,
          uploadedBy: 'School Administrator'
        },
        (percent) => {
          setUploadProgress(percent);
        }
      );

      showToast({
        type: 'success',
        title: 'PDF Uploaded Successfully',
        message: `"${formTitle}" is now live in Supabase Storage ('school-pdfs' bucket) and registered in Firestore.`
      });

      setIsUploadModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('PDF upload error:', err);
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err?.message || 'Could not upload PDF document. Please check Supabase configuration and retry.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasteSubmitting(true);
    try {
      await addSupabaseDoc(pasteTitle, pasteUrl, pasteCategory, pasteYear);
      showToast({
        type: 'success',
        title: 'PDF URL Registered Successfully',
        message: `"${pasteTitle}" has been saved permanently to the Supabase Database documents table.`
      });
      setIsPasteModalOpen(false);
      // Reset form fields
      setPasteTitle('');
      setPasteUrl('');
      setPasteCategory('public_disclosure');
      setPasteYear('2026-27');
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Registration Failed',
        message: err.message || 'Could not register PDF URL.'
      });
    } finally {
      setIsPasteSubmitting(false);
    }
  };

  const handleReplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPdf || !selectedFile) {
      showToast({
        type: 'error',
        title: 'Missing File',
        message: 'Please select a PDF file to upload.'
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(15);

    try {
      await pdfService.replacePdfFile(
        targetPdf.id,
        selectedFile,
        (percent) => {
          setUploadProgress(percent);
        }
      );

      showToast({
        type: 'success',
        title: 'Document File Connected',
        message: `"${targetPdf.title}" has been uploaded to Supabase Storage and connected in Firestore.`
      });

      setIsReplaceModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Replace PDF error:', err);
      showToast({
        type: 'error',
        title: 'Upload Error',
        message: err?.message || 'Could not connect PDF file. Please retry.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPdf) return;

    try {
      await pdfService.updatePdfRecord(targetPdf.id, {
        title: targetPdf.title,
        category: targetPdf.category,
        key: targetPdf.key,
        description: targetPdf.description,
        academicYear: targetPdf.academicYear,
        isPublished: targetPdf.isPublished
      });

      showToast({
        type: 'success',
        title: 'Metadata Updated',
        message: `Changes saved for "${targetPdf.title}".`
      });

      setIsEditModalOpen(false);
      setTargetPdf(null);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update document metadata.'
      });
    }
  };

  const handleDelete = async (item: PDFDocument) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"? This removes the record from Firestore and any uploaded file from Firebase Storage.`)) {
      try {
        await pdfService.deletePdfRecord(item.id, item.storagePath);
        showToast({
          type: 'info',
          title: 'Document Deleted',
          message: `"${item.title}" has been removed.`
        });
      } catch (err) {
        showToast({
          type: 'error',
          title: 'Delete Failed',
          message: 'Error deleting PDF record.'
        });
      }
    }
  };

  const handleCopyKey = (keyOrId: string) => {
    navigator.clipboard.writeText(keyOrId);
    showToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: `Key "${keyOrId}" copied.`
    });
  };

  const handleReseed = async () => {
    if (window.confirm('Sync and ensure all official CBSE Appendix-IX and school document slots exist in Firestore? (Existing uploaded files will be preserved).')) {
      await pdfService.seedInitialDocuments();
      showToast({
        type: 'success',
        title: 'Slots Synchronized',
        message: 'Official document directory synchronized with Firestore.'
      });
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header & Metrics Banner */}
      <div className="bg-gradient-to-r from-[#00276a] via-[#123d8f] to-[#1e3a8a] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 backdrop-blur-md border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Supabase Storage (bucket: school-pdfs) &amp; Firebase Firestore</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Official PDF Documents Vault
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed">
              Upload and manage CBSE statutory disclosure certificates, admission forms, fee structures, APAAR consents, and monthly newsletters to Supabase Storage (<code className="bg-white/10 px-1 py-0.5 rounded text-amber-200 font-mono">school-pdfs</code>) with document metadata recorded in Firebase Firestore.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setIsUploadModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#ea580c] hover:scale-105 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New PDF</span>
            </button>
            <button
              onClick={() => {
                setIsPasteModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-[#00276a] hover:scale-105 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Paste Public PDF URL</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold block">Total Documents</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{pdfs.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold block">Uploaded to Cloud</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-300">{uploadedCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-amber-200 font-bold block">Pending Upload</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300">{pendingCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold block">External PDF URLs</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{supabaseDocs.length}</span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-1">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-6 py-3.5 border-b-2 text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'files'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Uploaded Files ({pdfs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('urls')}
          className={`flex items-center gap-2 px-6 py-3.5 border-b-2 text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'urls'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Pasted Public URLs ({supabaseDocs.length})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PDF by title, key, or filename..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Status Filters & View Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({pdfs.length})
              </button>
              <button
                onClick={() => setStatusFilter('uploaded')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'uploaded' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Uploaded ({uploadedCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'published' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Published ({publishedCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'pending' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Pending ({pendingCount})</span>
              </button>
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#00276a] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({pdfs.length})
          </button>
          {PDF_CATEGORIES.map((cat) => {
            const count = pdfs.filter((p) => p.category === cat.id).length;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#00276a] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document List / Table */}
      {activeTab === 'files' ? (
        filteredPdfs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-base">No Matching Documents</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No PDF documents matched your filter settings.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Document Title & Stable Key</th>
                  <th className="py-4 px-4">Category & Folder</th>
                  <th className="py-4 px-4">Cloud Status</th>
                  <th className="py-4 px-4">Live Visibility</th>
                  <th className="py-4 px-4">Session</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPdfs.map((item) => {
                  const hasFile = Boolean(item.pdfUrl && item.pdfUrl.trim() !== '' && !item.pdfUrl.startsWith('data:image/svg+xml'));
                  const isPub = item.isPublished !== false;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                            hasFile ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' : 'bg-amber-50 border border-amber-200 text-amber-600'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <span
                              className="font-black text-slate-900 text-sm block leading-snug hover:text-blue-600 cursor-pointer"
                              onClick={() => pdfService.openPdf(item.id, item.title)}
                            >
                              {item.title}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                                key: {item.key || 'none'}
                              </span>
                              {item.key && (
                                <button
                                  onClick={() => handleCopyKey(item.key!)}
                                  className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                                  title="Copy Key"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              )}
                              <span className="text-slate-400 font-sans">• {item.fileName}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize">
                            {item.category.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            /{item.storagePath || `pdfs/${item.category}/`}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {hasFile ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Live in Cloud</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Upload</span>
                          </span>
                        )}
                      </td>

                      {/* 1-Click Visibility Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            isPub
                              ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200'
                          }`}
                          title={isPub ? 'Click to hide from public website' : 'Click to publish on public website'}
                        >
                          <Eye className={`w-3.5 h-3.5 ${isPub ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span>{isPub ? 'Public' : 'Hidden'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-slate-600 font-bold text-xs">{item.academicYear || '2026-27'}</span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click Upload / Replace Button */}
                          <button
                            onClick={() => {
                              setTargetPdf(item);
                              setSelectedFile(null);
                              setIsReplaceModalOpen(true);
                            }}
                            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                              hasFile
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-105 text-white shadow-amber-500/20'
                            }`}
                            title={hasFile ? 'Replace with new PDF file' : 'Upload PDF file now'}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{hasFile ? 'Replace PDF' : 'Upload PDF'}</span>
                          </button>

                          <button
                            onClick={() => pdfService.openPdf(item.id, item.title)}
                            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                            title="View / Preview PDF"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {hasFile && (
                            <button
                              onClick={() => pdfService.downloadPdf(item.id, item.fileName)}
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                              title="Download PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setTargetPdf(item);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPdfs.map((item) => {
            const hasFile = Boolean(item.pdfUrl && item.pdfUrl.trim() !== '' && !item.pdfUrl.startsWith('data:image/svg+xml'));
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize">
                      {item.category.replace('_', ' ')}
                    </span>
                    {hasFile ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Live</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-600">
                        <Clock className="w-3 h-3" />
                        <span>Pending Upload</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      hasFile ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' : 'bg-amber-50 border border-amber-100 text-amber-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className="font-black text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors cursor-pointer"
                        onClick={() => pdfService.openPdf(item.id, item.title)}
                      >
                        {item.title}
                      </h4>
                      {item.key && (
                        <span className="text-[10px] font-mono text-slate-400 block mt-1">
                          key: {item.key}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setTargetPdf(item);
                      setSelectedFile(null);
                      setIsReplaceModalOpen(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      hasFile
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{hasFile ? 'Replace File' : 'Upload File'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        item.isPublished !== false
                          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                      title={item.isPublished !== false ? 'Published (Click to hide from public)' : 'Hidden (Click to publish)'}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {hasFile && (
                      <button
                        onClick={() => pdfService.downloadPdf(item.id, item.fileName)}
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setTargetPdf(item);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )) : (
        filteredSupabaseDocs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <LinkIcon className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base">No Matching Registered URLs</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No external public PDF URLs have been registered under the selected filters.
              </p>
            </div>
            <button
              onClick={() => {
                setIsPasteModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              Paste Your First PDF URL
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-4 px-6">Document Title</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Public PDF URL</th>
                    <th className="py-4 px-4">Live Visibility</th>
                    <th className="py-4 px-4">Session/Year</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredSupabaseDocs.map((item) => {
                    const matchedCat = PDF_CATEGORIES.find((c) => c.id === item.category);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          <div className="flex flex-col">
                            <span>{item.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">id: {item.id.slice(0, 8)}...</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-black uppercase border border-slate-200">
                            <span>{matchedCat?.icon || "📁"}</span>
                            <span>{matchedCat?.label || item.category}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-[10px] text-slate-500 max-w-xs truncate">
                          <a
                            href={item.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span>{item.pdf_url}</span>
                          </a>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleSupabasePublishStatus(item.id, !item.is_published)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all border ${
                              item.is_published !== false
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${item.is_published !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{item.is_published !== false ? 'Published' : 'Hidden'}</span>
                          </button>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-600">
                          {item.year || '2026-27'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.pdf_url);
                                showToast({
                                  type: 'success',
                                  title: 'Link Copied',
                                  message: 'The public PDF URL has been copied to your clipboard.'
                                });
                              }}
                              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                              title="Copy PDF Link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                window.open(item.pdf_url, '_blank');
                              }}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Open in New Tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to permanently delete "${item.title}" from Supabase Database?`)) {
                                  try {
                                    await deleteSupabaseDoc(item.id);
                                    showToast({
                                      type: 'success',
                                      title: 'Document Deleted',
                                      message: 'The URL registration was deleted successfully.'
                                    });
                                  } catch (err: any) {
                                    showToast({
                                      type: 'error',
                                      title: 'Deletion Failed',
                                      message: err.message || 'Could not delete record.'
                                    });
                                  }
                                }
                              }}
                              className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Upload New Document Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  resetForm();
                }}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Supabase Storage + Firestore Metadata</span>
                </div>
                <h3 className="text-xl font-black text-primary">Upload PDF Document</h3>
                <p className="text-slate-500 text-xs">
                  Files are saved directly to Supabase Storage bucket (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">school-pdfs</code>) with metadata registered in Firestore.
                </p>
              </div>

              {/* Duplicate Detection Warning Banner */}
              {duplicateWarning && (
                <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-extrabold block">Potential Duplicate File Detected</span>
                    <p className="text-amber-700 leading-relaxed">{duplicateWarning}</p>
                    <span className="text-[11px] text-amber-600 font-medium block">
                      Uploading will create a new versioned entry. If you wish to replace the existing document file instead, close this and use the "Replace PDF" button.
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                
                {/* Drag & Drop File Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-blue-600 bg-blue-50/50'
                      : selectedFile
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 text-sm block truncate max-w-xs mx-auto">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                        </span>
                      </div>
                      <span className="text-[11px] text-blue-600 font-bold underline block">
                        Click to choose a different file
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-700 text-sm block">
                          Click to browse or drag & drop PDF here
                        </span>
                        <span className="text-xs text-slate-400">
                          Supports high-res documents up to 35MB
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Title */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. CBSE Senior Secondary Affiliation Letter 2026-27"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                {/* Category & Academic Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Category & Storage Folder *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as PDFCategory)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                    >
                      {PDF_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.label} (/{c.folder}/)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Academic Year / Session
                    </label>
                    <input
                      type="text"
                      value={formAcademicYear}
                      onChange={(e) => setFormAcademicYear(e.target.value)}
                      placeholder="e.g. 2026-27 or Permanent"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Stable Identifier Key */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-extrabold text-slate-700">
                      Stable Binding Key (Optional)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">e.g. cbse_affiliation_letter</span>
                  </div>
                  <input
                    type="text"
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="e.g. cbse_affiliation_letter, fee_structure"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Used by website buttons to dynamically link to this file regardless of filename changes.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Description & Summary
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of the document contents and issuing authority..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                {/* Publish Visibility Toggle */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Publish on Public Website</span>
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      When enabled, this PDF is immediately visible in public disclosure and downloads.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPublished}
                      onChange={(e) => setFormIsPublished(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Upload Progress */}
                {uploadProgress !== null && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Uploading to Supabase Storage ('school-pdfs')...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#ea580c] hover:scale-105 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload to Supabase</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Paste Public PDF URL Modal */}
      <AnimatePresence>
        {isPasteModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                onClick={() => {
                  setIsPasteModalOpen(false);
                }}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Supabase Database documents table</span>
                </div>
                <h3 className="text-xl font-black text-primary font-sans">Paste Public PDF URL</h3>
                <p className="text-slate-500 text-xs font-medium">
                  Register a public PDF URL directly to your database. It will immediately show up on the public website pages and synchronize in real-time.
                </p>
              </div>

              <form onSubmit={handlePasteSubmit} className="space-y-4">
                {/* Document Title */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={pasteTitle}
                    onChange={(e) => setPasteTitle(e.target.value)}
                    placeholder="e.g. CBSE Senior Secondary Affiliation Letter 2026-27"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                {/* Public PDF URL */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Public PDF URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={pasteUrl}
                    onChange={(e) => setPasteUrl(e.target.value)}
                    placeholder="https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                {/* Category & Session Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={pasteCategory}
                      onChange={(e) => setPasteCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                    >
                      {PDF_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Academic Year / Session
                    </label>
                    <input
                      type="text"
                      value={pasteYear}
                      onChange={(e) => setPasteYear(e.target.value)}
                      placeholder="e.g. 2026-27"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasteModalOpen(false);
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPasteSubmitting || !pasteTitle || !pasteUrl}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-[#00276a] hover:scale-105 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                  >
                    {isPasteSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        <span>Add URL</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Replace / Connect File Modal for an Existing Slot */}
      <AnimatePresence>
        {isReplaceModalOpen && targetPdf && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                onClick={() => {
                  setIsReplaceModalOpen(false);
                  resetForm();
                }}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Connect PDF to Slot</span>
                </div>
                <h3 className="text-xl font-black text-primary">
                  Upload PDF for &quot;{targetPdf.title}&quot;
                </h3>
                <p className="text-slate-500 text-xs">
                  Target storage path: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-blue-700">pdfs/{targetPdf.category}/{targetPdf.fileName}</code>
                </p>
              </div>

              <form onSubmit={handleReplaceSubmit} className="space-y-4">
                {/* Drag & Drop File Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => replaceFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-blue-600 bg-blue-50/50'
                      : selectedFile
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={replaceFileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 text-sm block truncate max-w-xs mx-auto">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                        </span>
                      </div>
                      <span className="text-[11px] text-blue-600 font-bold underline block">
                        Click to change file
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-700 text-sm block">
                          Select {targetPdf.fileName} from your device
                        </span>
                        <span className="text-xs text-slate-400">
                          Click to browse or drag & drop PDF here
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {uploadProgress !== null && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Uploading to Supabase Storage ('school-pdfs')...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReplaceModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading File...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload to Supabase</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Metadata Modal */}
      <AnimatePresence>
        {isEditModalOpen && targetPdf && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setTargetPdf(null);
                }}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Metadata</span>
                </div>
                <h3 className="text-xl font-black text-primary">Update Document Details</h3>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={targetPdf.title}
                    onChange={(e) => setTargetPdf({ ...targetPdf, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">Category</label>
                    <select
                      value={targetPdf.category}
                      onChange={(e) => setTargetPdf({ ...targetPdf, category: e.target.value as PDFCategory })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                    >
                      {PDF_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">Academic Year</label>
                    <input
                      type="text"
                      value={targetPdf.academicYear || ''}
                      onChange={(e) => setTargetPdf({ ...targetPdf, academicYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Stable Key</label>
                  <input
                    type="text"
                    value={targetPdf.key || ''}
                    onChange={(e) => setTargetPdf({ ...targetPdf, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={targetPdf.description || ''}
                    onChange={(e) => setTargetPdf({ ...targetPdf, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                  />
                </div>

                {/* Publish Visibility Toggle */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Public Website Visibility</span>
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {targetPdf.isPublished !== false ? 'Currently published & visible on public pages' : 'Currently hidden from public pages'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={targetPdf.isPublished !== false}
                      onChange={(e) => setTargetPdf({ ...targetPdf, isPublished: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setTargetPdf(null);
                    }}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                  >
                    Save Changes
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
