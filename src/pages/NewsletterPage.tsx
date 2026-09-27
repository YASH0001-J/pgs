/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, 
  FileText, 
  ExternalLink, 
  Download, 
  Eye, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Upload, 
  Calendar, 
  CheckCircle2, 
  X, 
  Check, 
  ShieldCheck, 
  Grid, 
  List, 
  AlertCircle,
  FilePlus,
  Copy,
  BookOpen
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { pdfService } from '../services/pdfService';
import { useSupabaseDocuments } from '../hooks/useSupabaseDocuments';
import { useQueries } from '../context/QueryContext';
import { useToast } from '../context/ToastContext';

export interface PDFItem {
  id: string;
  title: string;
  url: string;
  addedDate?: string;
}

export interface NewsletterGroup {
  id: string;
  month: string;
  year: number;
  label: string;
  isLatest?: boolean;
  pdfs: PDFItem[];
}

// Initial seed data
const INITIAL_NEWSLETTERS: NewsletterGroup[] = [
  {
    id: "july-2026",
    month: "July",
    year: 2026,
    label: "Monthly School Chronicle - July Edition",
    isLatest: true,
    pdfs: [
      {
        id: "pdf-july-2026-1",
        title: "July 2026 Official Newsletter (Full Edition)",
        url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/july-2026.pdf",
        addedDate: "July 2026"
      }
    ]
  },
  {
    id: "may-2026",
    month: "May",
    year: 2026,
    label: "Monthly School Chronicle - May Edition",
    pdfs: [
      {
        id: "pdf-may-2026-1",
        title: "May 2026 Official Newsletter",
        url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/may-2026.pdf",
        addedDate: "May 2026"
      }
    ]
  },
  {
    id: "april-2026",
    month: "April",
    year: 2026,
    label: "Monthly School Chronicle - April Edition",
    pdfs: [
      {
        id: "pdf-april-2026-1",
        title: "April 2026 Official Newsletter",
        url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/april-2026.pdf",
        addedDate: "April 2026"
      }
    ]
  },
  {
    id: "february-2026",
    month: "February",
    year: 2026,
    label: "Monthly School Chronicle - February Edition",
    pdfs: [
      {
        id: "pdf-february-2026-1",
        title: "February 2026 Official Newsletter",
        url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/February26.pdf",
        addedDate: "February 2026"
      }
    ]
  },
  {
    id: "january-2026",
    month: "January",
    year: 2026,
    label: "Monthly School Chronicle - January Edition",
    pdfs: [
      {
        id: "pdf-january-2026-1",
        title: "January 2026 Official Newsletter",
        url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/january26.pdf",
        addedDate: "January 2026"
      }
    ]
  },
  {
    id: "december-2025",
    month: "December",
    year: 2025,
    label: "Monthly School Chronicle - December Edition",
    pdfs: [
      {
        id: "pdf-december-2025-1",
        title: "December 2025 Official Newsletter",
        url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/december25.pdf",
        addedDate: "December 2025"
      }
    ]
  },
  {
    id: "november-2025",
    month: "November",
    year: 2025,
    label: "Monthly School Chronicle - November Edition",
    pdfs: [
      {
        id: "pdf-november-2025-1",
        title: "November 2025 Official Newsletter",
        url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/november25.pdf",
        addedDate: "November 2025"
      }
    ]
  }
];

const STORAGE_KEY = "pgs_school_newsletters_v8";

export const NewsletterPage: React.FC = () => {
  const { showToast } = useToast();
  const { isAuthenticated, login, logout } = useQueries();

  const [newsletters, setNewsletters] = useState<NewsletterGroup[]>(() => {
    let list = INITIAL_NEWSLETTERS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      }
    } catch (err) {
      console.error("Error reading localStorage", err);
    }
    
    // Ensure February 2026, July 2026, May 2026, April 2026, January 2026, December 2025, and November 2025 PDFs always have the correct URLs
    return list.map(g => {
      if (!g) return null;
      if (g.id === "february-2026") {
        return {
          ...g,
          pdfs: Array.isArray(g.pdfs) ? g.pdfs.map(p => {
            if (p.id === "pdf-february-2026-1" || (p.title && p.title.toLowerCase().includes("february 2026"))) {
              return {
                ...p,
                url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/February26.pdf"
              };
            }
            return p;
          }) : []
        };
      }
      if (g.id === "july-2026") {
        return {
          ...g,
          pdfs: Array.isArray(g.pdfs) ? g.pdfs.map(p => {
            if (p.id === "pdf-july-2026-1" || (p.title && p.title.toLowerCase().includes("july 2026"))) {
              return {
                ...p,
                url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/july-2026.pdf"
              };
            }
            return p;
          }) : []
        };
      }
      if (g.id === "may-2026") {
        return {
          ...g,
          pdfs: Array.isArray(g.pdfs) ? g.pdfs.map(p => {
            if (p.id === "pdf-may-2026-1" || (p.title && p.title.toLowerCase().includes("may 2026"))) {
              return {
                ...p,
                url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/may-2026.pdf"
              };
            }
            return p;
          }) : []
        };
      }
      if (g.id === "april-2026") {
        return {
          ...g,
          pdfs: Array.isArray(g.pdfs) ? g.pdfs.map(p => {
            if (p.id === "pdf-april-2026-1" || (p.title && p.title.toLowerCase().includes("april 2026"))) {
              return {
                ...p,
                url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/april-2026.pdf"
              };
            }
            return p;
          }) : []
        };
      }
      if (g.id === "january-2026") {
        return {
          ...g,
          pdfs: Array.isArray(g.pdfs) ? g.pdfs.map(p => {
            if (p.id === "pdf-january-2026-1" || (p.title && p.title.toLowerCase().includes("january 2026"))) {
              return {
                ...p,
                url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/january26.pdf"
              };
            }
            return p;
          }) : []
        };
      }
      if (g.id === "december-2025") {
        return {
          ...g,
          pdfs: Array.isArray(g.pdfs) ? g.pdfs.map(p => {
            if (p.id === "pdf-december-2025-1" || (p.title && p.title.toLowerCase().includes("december 2025"))) {
              return {
                ...p,
                url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/december25.pdf"
              };
            }
            return p;
          }) : []
        };
      }
      if (g.id === "november-2025") {
        return {
          ...g,
          pdfs: Array.isArray(g.pdfs) ? g.pdfs.map(p => {
            if (p.id === "pdf-november-2025-1" || (p.title && p.title.toLowerCase().includes("november 2025"))) {
              return {
                ...p,
                url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/november25.pdf"
              };
            }
            return p;
          }) : []
        };
      }
      return g;
    }).filter(Boolean) as NewsletterGroup[];
  });

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Search & Filter Controls
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Load dynamic Supabase documents for newsletters
  const { documents: supabaseNewsletters, addDocument: addSupabaseDoc, deleteDocument: deleteSupabaseDoc } = useSupabaseDocuments('newsletter', false);

  // Form State for Inline Upload (Admin Mode)
  const [formMonth, setFormMonth] = useState<string>('August');
  const [formYear, setFormYear] = useState<number>(2026);
  const [formLabel, setFormLabel] = useState<string>('School Newsletter');
  const [pdfTitle, setPdfTitle] = useState<string>('');
  const [pdfUrlInput, setPdfUrlInput] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<{ title: string; url: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newsletters));
    } catch (err) {
      console.error("Failed to save to localStorage", err);
    }
  }, [newsletters]);

  // Handle Admin Unlock Password Verification
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login('admin@gmail.com', passwordInput);
    if (success) {
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError(null);
    } else {
      setPasswordError('Invalid security password. Please try again.');
    }
  };

  const handleLockAdmin = () => {
    logout();
  };

  // Handle Local PDF File Upload / File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const newItems = files.map((file: File) => {
        const objectUrl = URL.createObjectURL(file);
        return {
          title: file.name.replace(/\.[^/.]+$/, ""),
          url: objectUrl
        };
      });
      setUploadedFiles(prev => [...prev, ...newItems]);
    }
  };

  // Add URL input to temporary upload list
  const handleAddUrlToList = () => {
    if (!pdfUrlInput.trim()) return;
    const title = pdfTitle.trim() || `${formMonth} ${formYear} Newsletter Document`;
    setUploadedFiles(prev => [...prev, { title, url: pdfUrlInput.trim() }]);
    setPdfUrlInput('');
    setPdfTitle('');
  };

  // Remove single item from upload queue
  const handleRemoveFromQueue = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Save new Newsletter Group or append PDFs to existing group
  const handleSaveNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedFiles.length === 0 && !pdfUrlInput.trim()) {
      alert("Please upload at least one PDF file or enter a valid document URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalPdfList = [...uploadedFiles];
      if (pdfUrlInput.trim()) {
        const docTitle = pdfTitle.trim() || `${formMonth} ${formYear} Official Newsletter`;
        const docUrl = pdfUrlInput.trim();
        
        // Also upload to Supabase to make it permanent
        await addSupabaseDoc(docTitle, docUrl, 'newsletter', formYear.toString());
        
        finalPdfList.push({
          title: docTitle,
          url: docUrl
        });
      }

      const groupId = `${formMonth.toLowerCase()}-${formYear}`;

      setNewsletters(prev => {
        const existingIdx = prev.findIndex(item => item.id === groupId);

        const newPdfs: PDFItem[] = finalPdfList.map((item, idx) => ({
          id: `pdf-${groupId}-${Date.now()}-${idx}`,
          title: item.title,
          url: item.url,
          addedDate: `${formMonth} ${formYear}`
        }));

        if (existingIdx !== -1) {
          // Append to existing month group
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            pdfs: [...updated[existingIdx].pdfs, ...newPdfs]
          };
          return updated;
        } else {
          // Add new Month Group
          const newGroup: NewsletterGroup = {
            id: groupId,
            month: formMonth,
            year: formYear,
            label: formLabel || `School Newsletter - ${formMonth} ${formYear}`,
            pdfs: newPdfs
          };
          // Unmark previous latest if new item is in current or future year
          return [newGroup, ...prev];
        }
      });

      setUploadedFiles([]);
      setPdfUrlInput('');
      setPdfTitle('');
      setFormSuccessMessage(`Successfully published newsletter for ${formMonth} ${formYear}!`);
      setTimeout(() => setFormSuccessMessage(null), 3500);
    } catch (err: any) {
      alert("Error saving newsletter to database: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an entire Month Group or a single PDF
  const handleDeletePdf = async (groupId: string, pdfId: string) => {
    if (window.confirm("Are you sure you want to delete this newsletter document?")) {
      if (pdfId.startsWith("supabase-")) {
        try {
          await deleteSupabaseDoc(pdfId.replace("supabase-", ""));
          showToast({ message: "Successfully deleted database document.", type: "success" });
        } catch (err: any) {
          alert("Error deleting newsletter from database: " + err.message);
        }
      } else {
        setNewsletters(prev => {
          return prev.map(group => {
            if (group.id === groupId) {
              const remainingPdfs = Array.isArray(group.pdfs) ? group.pdfs.filter(pdf => pdf.id !== pdfId) : [];
              return { ...group, pdfs: remainingPdfs };
            }
            return group;
          }).filter(group => Array.isArray(group.pdfs) && group.pdfs.length > 0); // remove empty month groups
        });
      }
    }
  };

  // Reset to seed data
  const handleResetDefaultData = () => {
    if (window.confirm("Reset newsletters to default official list?")) {
      setNewsletters(INITIAL_NEWSLETTERS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Copy Direct Link
  const handleCopyLink = (url: string, title: string) => {
    navigator.clipboard.writeText(url);
    setCopiedNotification(title);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  // Filter calculations
  const computedNewsletters = React.useMemo(() => {
    const mergedList: NewsletterGroup[] = JSON.parse(JSON.stringify(newsletters));

    if (Array.isArray(supabaseNewsletters)) {
      supabaseNewsletters.forEach((item) => {
        const year = parseInt(item.year) || (item.created_at ? new Date(item.created_at).getFullYear() : 2026);
        
        let month = "Monthly";
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for (const m of months) {
          if (item.title && item.title.toLowerCase().includes(m.toLowerCase())) {
            month = m;
            break;
          }
        }
        if (month === "Monthly" && item.created_at) {
          const dateMonth = new Date(item.created_at).getMonth();
          if (!isNaN(dateMonth) && months[dateMonth]) {
            month = months[dateMonth];
          }
        }

        const safeMonth = month || "Monthly";
        const groupId = `supabase-${safeMonth.toLowerCase()}-${year}`;
        const pdfItem: PDFItem = {
          id: `supabase-${item.id}`,
          title: item.title || "Untitled Document",
          url: item.pdf_url || "",
          addedDate: item.year ? `${safeMonth} ${item.year}` : safeMonth
        };

        const existingGroup = mergedList.find(g => (g.month || "").toLowerCase() === safeMonth.toLowerCase() && Number(g.year) === Number(year));
        if (existingGroup) {
          if (Array.isArray(existingGroup.pdfs) && !existingGroup.pdfs.some(p => p.url === item.pdf_url)) {
            existingGroup.pdfs.push(pdfItem);
          } else if (!existingGroup.pdfs) {
            existingGroup.pdfs = [pdfItem];
          }
        } else {
          mergedList.push({
            id: groupId,
            month: safeMonth,
            year,
            label: `${safeMonth} ${year} Edition (Pasted URL)`,
            pdfs: [pdfItem]
          });
        }
      });
    }

    const monthsOrder = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    return mergedList.sort((a, b) => {
      if (Number(b.year) !== Number(a.year)) {
        return Number(b.year) - Number(a.year);
      }
      const aMonthIdx = a.month ? monthsOrder.indexOf(a.month.toLowerCase()) : -1;
      const bMonthIdx = b.month ? monthsOrder.indexOf(b.month.toLowerCase()) : -1;
      return bMonthIdx - aMonthIdx;
    });
  }, [newsletters, supabaseNewsletters]);

  const availableYears = Array.from(new Set(computedNewsletters.map(n => Number(n.year) || 2026))).sort((a: number, b: number) => b - a);

  const filteredNewsletters = computedNewsletters.filter(group => {
    const yearStr = (group.year || "").toString();
    const matchesYear = selectedYear === 'All' || yearStr === selectedYear;
    const matchesSearch = 
      (group.month || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      yearStr.includes(searchTerm) ||
      (group.label || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(group.pdfs) && group.pdfs.some(p => (p.title || "").toLowerCase().includes(searchTerm.toLowerCase())));

    return matchesYear && matchesSearch;
  });

  const totalPdfsCount = computedNewsletters.reduce((acc, g) => acc + (Array.isArray(g.pdfs) ? g.pdfs.length : 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans text-slate-800">
      
      {/* 1. Header Banner */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-[#001230] via-[#00276a] to-slate-950 text-white overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,147,98,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.2),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-blue-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-orange-400" />
            <span className="text-white font-semibold">General</span>
            <ChevronRight className="w-4 h-4 text-orange-400" />
            <span className="text-white font-semibold">School Newsletters</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-black uppercase tracking-widest shadow-md">
                <Newspaper className="w-4 h-4 text-amber-400" />
                <span>Monthly Official Gazette • Publications</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                School <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-pink-300">Newsletter Archive</span>
              </h1>

              <p className="text-blue-100 text-sm sm:text-base md:text-lg leading-relaxed">
                Explore monthly editions of the Professor's Global School newsletter — featuring student achievements, upcoming events, academic highlights, campus activities, and official notices.
              </p>

              {/* Status Badges & Admin Trigger */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{totalPdfsCount} PDF Editions Available</span>
                </div>

                {/* ADMIN UNLOCK BUTTON */}
                <button
                  onClick={() => isAuthenticated ? handleLockAdmin() : setShowPasswordModal(true)}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black transition-all shadow-lg cursor-pointer ${
                    isAuthenticated
                      ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-300/50'
                      : 'bg-white/15 hover:bg-white/25 text-amber-300 border border-amber-300/40'
                  }`}
                >
                  {isAuthenticated ? (
                    <>
                      <Unlock className="w-4 h-4 text-slate-950" />
                      <span>Admin Control Active (Click to Lock)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-300" />
                      <span>Admin Control Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Summary Box */}
            <div className="w-full lg:w-80 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl space-y-4 shrink-0">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-300 border-b border-white/15 pb-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Archive Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-amber-400">{newsletters.length}</p>
                  <p className="text-[11px] font-bold text-slate-300">Months Published</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-orange-400">July 2026</p>
                  <p className="text-[11px] font-bold text-slate-300">Latest Edition</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-emerald-400">100%</p>
                  <p className="text-[11px] font-bold text-slate-300">PDF Access</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-cyan-400">2025-26</p>
                  <p className="text-[11px] font-bold text-slate-300">Active Years</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Admin Inline Control Section (Visible ONLY when Unlocked) */}
      <AnimatePresence>
        {isAuthenticated && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-500/10 border-b-2 border-amber-400 py-8 px-4 sm:px-6 md:px-12 transition-all"
          >
            <div className="max-w-7xl mx-auto space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-500/15 p-4 rounded-2xl border border-amber-300/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-amber-950">
                      Admin Publishing Control Console
                    </h3>
                    <p className="text-xs text-amber-900 font-medium">
                      Upload new monthly newsletters, attach multiple PDFs, or delete existing publications instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetDefaultData}
                    className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-800 text-xs font-extrabold border border-slate-300 transition-all cursor-pointer shadow-xs"
                  >
                    Reset to Default Data
                  </button>

                  <button
                    onClick={handleLockAdmin}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lock Admin Mode</span>
                  </button>
                </div>
              </div>

              {/* Upload Form Card */}
              <form onSubmit={handleSaveNewsletter} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-orange-500" />
                    <h4 className="text-sm font-black uppercase tracking-wider text-[#00276a]">
                      Add / Update Newsletter Documents
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
                  
                  {/* Select Month */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Select Month</label>
                    <select
                      value={formMonth}
                      onChange={(e) => setFormMonth(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00276a] outline-none"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Year */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Select Year</label>
                    <select
                      value={formYear}
                      onChange={(e) => setFormYear(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00276a] outline-none"
                    >
                      {[2027, 2026, 2025, 2024].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Edition Label */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Edition Title / Headline</label>
                    <input
                      type="text"
                      value={formLabel}
                      onChange={(e) => setFormLabel(e.target.value)}
                      placeholder="e.g. Monthly School Chronicle"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00276a] outline-none"
                    />
                  </div>

                </div>

                {/* Multiple PDF Options */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <FilePlus className="w-4 h-4 text-blue-600" />
                      Attach PDF Documents (Upload or Paste Link)
                    </h5>
                    <span className="text-[11px] font-semibold text-slate-500">Multiple files supported</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* File Upload Trigger */}
                    <div className="p-4 rounded-xl bg-white border border-dashed border-blue-300 text-center space-y-2 hover:bg-blue-50/50 transition-colors">
                      <Upload className="w-6 h-6 text-blue-600 mx-auto" />
                      <div>
                        <p className="text-xs font-black text-slate-800">Upload Local PDF File(s)</p>
                        <p className="text-[11px] text-slate-500">Click to select PDF from your device</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="newsletter-file-input"
                      />
                      <label
                        htmlFor="newsletter-file-input"
                        className="inline-block px-4 py-2 rounded-xl bg-[#00276a] text-white text-xs font-extrabold cursor-pointer hover:bg-[#00173e] transition-all shadow-sm"
                      >
                        Choose Local PDF(s)
                      </label>
                    </div>

                    {/* Direct URL Input */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                      <p className="text-xs font-black text-slate-800">OR Paste Public PDF URL</p>
                      <input
                        type="text"
                        value={pdfTitle}
                        onChange={(e) => setPdfTitle(e.target.value)}
                        placeholder="Document Title (e.g. July Part 2)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium"
                      />
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={pdfUrlInput}
                          onChange={(e) => setPdfUrlInput(e.target.value)}
                          placeholder="https://example.com/newsletter.pdf"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleAddUrlToList}
                          className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shrink-0"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Queued Attachments Preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Queued PDF Files ({uploadedFiles.length}):
                      </p>
                      <div className="space-y-1.5">
                        {uploadedFiles.map((f, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                            <span className="font-bold text-slate-800 truncate">{f.title}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFromQueue(idx)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Newsletter to Archive</span>
                  </button>
                </div>

              </form>

            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 3. Sticky Filter & Controls Sub-Navbar */}
      <section className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Year Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
            <span className="text-xs font-black uppercase text-slate-500 mr-2 shrink-0">Year:</span>
            <button
              onClick={() => setSelectedYear('All')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedYear === 'All'
                  ? 'bg-[#00276a] text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>All Years</span>
              <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px]">
                {newsletters.length}
              </span>
            </button>

            {availableYears.map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr.toString())}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  selectedYear === yr.toString()
                    ? 'bg-[#00276a] text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{yr}</span>
              </button>
            ))}
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search month or year..."
                className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 text-xs font-bold pl-10 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00276a]"
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

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-[#00276a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Cards View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#00276a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Copy Toast Alert */}
      <AnimatePresence>
        {copiedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-emerald-600 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400"
          >
            <Check className="w-4 h-4 text-emerald-200" />
            <span>Copied URL for "{copiedNotification}"!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Main Newsletters Grid / Table */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10">
        
        {filteredNewsletters.length > 0 ? (
          viewMode === 'cards' ? (
            /* CARDS LAYOUT */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNewsletters.map((group) => (
                <ScrollReveal key={group.id} direction="up">
                  <motion.div
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className={`bg-white rounded-3xl border shadow-lg hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between h-full relative ${
                      group.isLatest 
                        ? 'border-amber-400/80 ring-2 ring-amber-400/20' 
                        : 'border-slate-200/90 hover:border-blue-300'
                    }`}
                  >
                    
                    {/* Header Banner */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#00276a] text-white font-black text-xs">
                            {group.month} {group.year}
                          </span>
                          {group.isLatest && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                              Latest Edition
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-bold text-slate-400">
                          {Array.isArray(group.pdfs) ? group.pdfs.length : 0} {Array.isArray(group.pdfs) && group.pdfs.length === 1 ? 'PDF' : 'PDFs'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600">
                          School Newsletter
                        </span>
                        <h3 className="text-lg font-black text-slate-900 leading-tight">
                          {group.label}
                        </h3>
                      </div>
                    </div>

                    {/* PDF List inside Card */}
                    <div className="p-6 pt-0 space-y-3">
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        {Array.isArray(group.pdfs) && group.pdfs.map((pdf) => (
                          <div 
                            key={pdf.id}
                            className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 group/pdf hover:bg-amber-50/40 hover:border-amber-300 transition-colors"
                          >
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <p className="text-xs font-extrabold text-slate-900 truncate">
                                {pdf.title}
                              </p>
                              <p className="text-[10px] font-mono text-slate-500">
                                PDF Document
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {pdf.url.startsWith('http') ? (
                                <a
                                  href={pdf.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl bg-[#00276a] hover:bg-[#00173e] text-white transition-all shadow-xs cursor-pointer inline-flex items-center justify-center"
                                  title="View PDF"
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                                </a>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    pdfService.openPdf(pdf.url, pdf.title);
                                  }}
                                  className="p-2 rounded-xl bg-[#00276a] hover:bg-[#00173e] text-white transition-all shadow-xs cursor-pointer"
                                  title="View PDF"
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  pdfService.downloadPdf(pdf.url, `${pdf.title}.pdf`);
                                }}
                                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
                                title="Download PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleCopyLink(pdf.url, pdf.title)}
                                className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all cursor-pointer"
                                title="Copy Link"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* DELETE BUTTON (Visible only when Admin is Unlocked) */}
                              {isAuthenticated && (
                                <button
                                  onClick={() => handleDeletePdf(group.id, pdf.id)}
                                  className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 transition-all cursor-pointer ml-1"
                                  title="Delete Document (Admin)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {Array.isArray(group.pdfs) && group.pdfs[0] && (
                        group.pdfs[0].url.startsWith('http') ? (
                          <a
                            href={group.pdfs[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#00173e] to-[#00276a] hover:from-[#00276a] hover:to-[#00173e] text-white text-xs font-black py-3 rounded-2xl shadow-md hover:scale-[1.02] transition-all cursor-pointer mt-2"
                          >
                            <Eye className="w-4 h-4 text-amber-400" />
                            <span>View Official Publication</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              pdfService.openPdf(group.pdfs[0].url, group.pdfs[0].title);
                            }}
                            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#00173e] to-[#00276a] hover:from-[#00276a] hover:to-[#00173e] text-white text-xs font-black py-3 rounded-2xl shadow-md hover:scale-[1.02] transition-all cursor-pointer mt-2"
                          >
                            <Eye className="w-4 h-4 text-amber-400" />
                            <span>View Official Publication</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                          </button>
                        )
                      )}
                    </div>

                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* STRUCTURED TABLE LAYOUT */
            <ScrollReveal direction="up">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#001230] to-[#00276a] p-6 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Newspaper className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">Monthly Newsletters Master Table</h2>
                      <p className="text-xs text-blue-200 font-medium">Archive of all published PDF newsletters</p>
                    </div>
                  </div>

                  <span className="text-xs font-black px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">
                    {filteredNewsletters.length} Months Listed
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-xs font-black text-slate-700 uppercase tracking-wider">
                        <th className="py-4 px-6 w-16 text-center">SL NO</th>
                        <th className="py-4 px-6">PUBLICATION MONTH & YEAR</th>
                        <th className="py-4 px-6">HEAD TITLE</th>
                        <th className="py-4 px-6 text-center">PDF DOCUMENTS</th>
                        <th className="py-4 px-6 text-center">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-medium">
                      {filteredNewsletters.map((group, idx) => (
                        <tr 
                          key={group.id}
                          className={`transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                          } hover:bg-amber-50/40`}
                        >
                          <td className="py-4 px-6 text-center font-black text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="py-4 px-6 font-black text-[#00276a]">
                            <div className="flex items-center gap-2">
                              <span>{group.month} {group.year}</span>
                              {group.isLatest && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px]">
                                  LATEST
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-800">
                            {group.label}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold">
                              {Array.isArray(group.pdfs) ? group.pdfs.length : 0} Document(s)
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              {Array.isArray(group.pdfs) && group.pdfs.map((pdf) => (
                                <div key={pdf.id} className="flex items-center gap-1">
                                  {pdf.url.startsWith('http') ? (
                                    <a
                                      href={pdf.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 bg-[#00276a] hover:bg-[#00173e] text-white text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
                                      title={pdf.title}
                                    >
                                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                                      <span>View PDF</span>
                                    </a>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        pdfService.openPdf(pdf.url, pdf.title);
                                      }}
                                      className="inline-flex items-center gap-1 bg-[#00276a] hover:bg-[#00173e] text-white text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
                                      title={pdf.title}
                                    >
                                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                                      <span>View PDF</span>
                                    </button>
                                  )}

                                  {isAuthenticated && (
                                    <button
                                      onClick={() => handleDeletePdf(group.id, pdf.id)}
                                      className="p-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 transition-all cursor-pointer"
                                      title="Delete PDF"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ))}
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
            <h3 className="text-xl font-black text-slate-800">No newsletters found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No publication records match "{searchTerm}". Try clearing your search term or selecting another year.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedYear('All'); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00276a] text-white text-xs font-bold shadow-md hover:bg-[#00173e] transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      {/* 5. Password Modal for Admin Mode */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPasswordModal(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
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
