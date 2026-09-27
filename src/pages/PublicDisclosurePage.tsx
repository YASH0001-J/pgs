/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  FileText, 
  Award, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Eye, 
  Search, 
  Youtube, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  FileCheck, 
  Info, 
  Wifi, 
  School, 
  Copy, 
  Check, 
  BookOpen,
  X,
  FileSpreadsheet,
  Lock,
  Unlock,
  Trash2,
  Plus,
  AlertCircle
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { pdfService } from '../services/pdfService';
import { useSupabaseDocuments } from '../hooks/useSupabaseDocuments';
import { useQueries } from '../context/QueryContext';

// Data strictly extracted from official CBSE Appendix-IX Disclosure Images
export const GENERAL_INFO_DATA = [
  { slNo: 1, label: "NAME OF THE SCHOOL", value: "PROFESSOR'S GLOBAL SCHOOL", icon: School },
  { slNo: 2, label: "AFFILIATION NO. (IF APPLICABLE)", value: "2730923", icon: ShieldCheck, highlight: true },
  { slNo: 3, label: "SCHOOL CODE (IF APPLICABLE)", value: "25571", icon: Award, highlight: true },
  { 
    slNo: 4, 
    label: "COMPLETE ADDRESS WITH PIN CODE", 
    value: "KH. NO. 46/11 AND 20/1 JAI VIHAR, BAPROLA, NAJAFGARH NANGLOI ROAD, SOUTH WEST DELHI, DELHI - 110043", 
    icon: MapPin 
  },
  { slNo: 5, label: "PRINCIPAL NAME", value: "Ms. TANYA GUPTA", icon: User },
  { slNo: 6, label: "PRINCIPAL QUALIFICATION", value: "M.Phil, MA , B.Ed", icon: GraduationCap },
  { slNo: 7, label: "SCHOOL EMAIL ID", value: "cbsepgsbaprola24@gmail.com", icon: Mail, isLink: true, linkPrefix: "mailto:" },
  { slNo: 8, label: "CONTACT DETAILS (LANDLINE/MOBILE)", value: "8769667336", icon: Phone, isLink: true, linkPrefix: "tel:" }
];

export const DOCUMENTS_DATA = [
  {
    slNo: 1,
    key: "cbse_affiliation_letter",
    title: "COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION, IF ANY",
    shortTitle: "CBSE Affiliation / Extension Letter",
    url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/CBSE-Affiliation-Letter-Front-Page%20(1).pdf",
    type: "PDF",
    date: "Valid 2026-27"
  },
  {
    slNo: 2,
    key: "society_registration_certificate",
    title: "COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE, AS APPLICABLE",
    shortTitle: "Society / Trust Registration Certificate",
    url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/SocietyRegistrationCertificate.pdf",
    type: "PDF",
    date: "Verified"
  },
  {
    slNo: 3,
    key: "noc_state_govt",
    title: "COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT",
    shortTitle: "State Govt. No Objection Certificate (NOC)",
    url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/NOC.pdf",
    type: "PDF",
    date: "Verified"
  },
  {
    slNo: 4,
    key: "rte_recognition_certificate",
    title: "COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND IT'S RENEWAL IF APPLICABLE",
    shortTitle: "RTE Act Recognition Certificate",
    url: "",
    type: "PDF",
    date: "Verified"
  },
  {
    slNo: 5,
    key: "building_safety_certificate",
    title: "COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE",
    shortTitle: "National Building Code Safety Certificate",
    url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/BuildingCertificate.pdf",
    type: "PDF",
    date: "Valid"
  },
  {
    slNo: 6,
    key: "fire_safety_certificate",
    title: "COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY",
    shortTitle: "Competent Authority Fire Safety Certificate",
    url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/FireCertificate.pdf",
    type: "PDF",
    date: "Valid"
  },
  {
    slNo: 7,
    key: "deo_self_certification",
    title: "COPY OF THE SELF CERTIFICATION SUBMITTED BY THE SCHOOL FOR AFFILIATION/UPGRADATION/EXTENSION OF AFFILIATION",
    shortTitle: "DEO / School Self Certification",
    url: "",
    type: "PDF",
    date: "Verified"
  },
  {
    slNo: 8,
    key: "water_health_sanitation_certificate",
    title: "COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES",
    shortTitle: "Water, Health & Sanitation Certificate",
    url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/WaterHealthCertificate.pdf",
    type: "PDF",
    date: "Valid"
  }
];

export const ACADEMIC_DOCUMENTS = [
  {
    slNo: 1,
    key: "fee_structure",
    title: "FEE STRUCTURE OF THE SCHOOL",
    url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/FeeStructure.pdf",
    type: "PDF",
    session: "Academic Session 2026-27"
  },
  {
    slNo: 2,
    key: "academic_calendar",
    title: "ANNUAL ACADEMIC CALENDER",
    url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/Academic-Calendar-2025-2026.pdf",
    type: "PDF",
    session: "2026-2027"
  },
  {
    slNo: 3,
    key: "school_management_committee",
    title: "LIST OF SCHOOL MANAGEMENT COMMITTEE (SMC)",
    url: "",
    type: "PDF",
    session: "Current Term"
  },
  {
    slNo: 4,
    key: "pta_members_list",
    title: "LIST OF PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS",
    url: "https://jwjviikmxolsyqvgbbvy.supabase.co/storage/v1/object/public/school-pdfs/List_pta.pdf",
    type: "PDF",
    session: "Current Executive"
  },
  {
    slNo: 5,
    key: "board_examination_results",
    title: "LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION AS PER APPLICABILITY",
    url: "#results-section",
    isAnchor: true,
    type: "TABLE",
    session: "CBSE Class X & XII"
  }
];

export const STAFF_TEACHING_DATA = {
  principal: "MS. TANYA GUPTA",
  totalTeachers: 46,
  pgt: 6,
  tgt: 16,
  prt: 24,
  teacherSectionRatio: "1:1.5",
  specialEducator: 1,
  counsellorAndWellnessTeacher: 1
};

export const INFRASTRUCTURE_DATA = [
  { slNo: 1, label: "TOTAL CAMPUS AREA OF THE SCHOOL (IN SQ MTR)", value: "4095", unit: "Sq Mtr" },
  { slNo: 2, label: "NO. AND SIZE OF THE CLASS ROOMS (IN SQ MTR)", value: "39 Rooms", subValue: "47 Sq Mtr each" },
  { slNo: 3, label: "NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)", value: "4 Labs", subValue: "112 Sq Mtr each" },
  { slNo: 4, label: "INTERNET FACILITY", value: "YES", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { slNo: 5, label: "NO. OF GIRLS TOILETS", value: "20", unit: "Units" },
  { slNo: 6, label: "NO. OF BOYS TOILETS", value: "20", unit: "Units" },
  { 
    slNo: 7, 
    label: "LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL COVERING THE INFRASTRUCTURE OF THE SCHOOL", 
    value: "https://www.youtube.com/watch?v=T0vib4iWffQ", 
    isVideo: true,
    embedUrl: "https://www.youtube.com/embed/T0vib4iWffQ"
  }
];

export const PublicDisclosurePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('general');
  const [previewPdfUrl, setPreviewPdfUrl] = useState<{ url: string; title: string } | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>('compliance');

  // Centralized Admin integration
  const { isAuthenticated, login, logout } = useQueries();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Form states for uploading documents from Section B & Section C
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDocType, setFormDocType] = useState<'public_disclosure' | 'academics'>('public_disclosure');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Load dynamic Supabase documents for both categories
  const { documents: supabaseDocs, addDocument: addSupabaseDoc, deleteDocument: deleteSupabaseDoc } = useSupabaseDocuments('all', false);

  const publicDisclosureDocs = supabaseDocs.filter(d => d.category === 'public_disclosure' && (isAuthenticated || d.is_published !== false));
  const academicsDocs = supabaseDocs.filter(d => d.category === 'academics' && (isAuthenticated || d.is_published !== false));

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

  const handleSaveDocument = async (category: 'public_disclosure' | 'academics', yearTag: string) => {
    if (!formTitle.trim()) {
      alert('Please enter a document title.');
      return;
    }
    if (!formUrl.trim() || !formUrl.startsWith('http')) {
      alert('Please enter a valid public PDF URL starting with http:// or https://.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addSupabaseDoc(formTitle.trim(), formUrl.trim(), category, yearTag);
      setFormSuccessMessage(`Successfully published "${formTitle}" to Section ${category === 'public_disclosure' ? 'B' : 'C'}!`);
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

  // Handle scroll active tab highlight
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['general', 'documents', 'academics', 'staff', 'infrastructure', 'compliance'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const dynamicPublicDisclosureDocs = publicDisclosureDocs.map((item, idx) => ({
    slNo: DOCUMENTS_DATA.length + idx + 1,
    key: `supabase_${item.id}`,
    title: item.title,
    shortTitle: item.title,
    url: item.pdf_url,
    type: "PDF",
    date: item.year || "Valid"
  }));

  const combinedDocs = [...DOCUMENTS_DATA, ...dynamicPublicDisclosureDocs];

  const filteredDocs = combinedDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.shortTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dynamicAcademicDocs = academicsDocs.map((item, idx) => ({
    slNo: ACADEMIC_DOCUMENTS.length + idx + 1,
    key: `supabase_${item.id}`,
    title: item.title,
    url: item.pdf_url,
    type: "PDF",
    session: item.year || "2026-27"
  }));

  const combinedAcademics = [...ACADEMIC_DOCUMENTS, ...dynamicAcademicDocs];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans text-slate-800">
      
      {/* 1. Header Banner */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-[#001230] via-[#00276a] to-slate-950 text-white overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,147,98,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.2),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-blue-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-orange-400" />
            <span className="text-white font-semibold">Mandatory Public Disclosure (Appendix-IX)</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-black uppercase tracking-widest shadow-md">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>CBSE Appendix - IX Compliance Portal</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                Mandatory <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-pink-300">Public Disclosure</span>
              </h1>

              <p className="text-blue-100 text-sm sm:text-base md:text-lg leading-relaxed">
                Official transparency portal for <strong>Professor's Global School</strong> in compliance with CBSE affiliation bye-laws (Appendix - IX). Access verified affiliation documents, safety certificates, academic records, staff ratios, and infrastructure specifications.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Affiliation No: <strong>2730923</strong></span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-400" />
                  <span>School Code: <strong>25571</strong></span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Session 2026-27</span>
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

            {/* Quick Stats Grid Card */}
            <div className="w-full lg:w-80 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl space-y-4 shrink-0">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-300 border-b border-white/15 pb-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Disclosure Quick Summary
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-amber-400">8</p>
                  <p className="text-[11px] font-bold text-slate-300">NOC & Safety Docs</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-orange-400">46</p>
                  <p className="text-[11px] font-bold text-slate-300">Teaching Staff</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-emerald-400">4095 m²</p>
                  <p className="text-[11px] font-bold text-slate-300">Campus Area</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/10">
                  <p className="text-2xl font-black text-cyan-400">1:1.5</p>
                  <p className="text-[11px] font-bold text-slate-300">Teacher Ratio</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Sticky Sub-Navigation Bar */}
      <nav className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'general', label: 'General Info', icon: Building2 },
              { id: 'documents', label: 'Documents & Certificates', icon: FileCheck },
              { id: 'academics', label: 'Results & Academics', icon: BookOpen },
              { id: 'staff', label: 'Teaching Staff', icon: Users },
              { id: 'infrastructure', label: 'Infrastructure', icon: School },
              { id: 'compliance', label: 'Mandatory Note', icon: ShieldCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#00276a] text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {copiedText && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="hidden md:flex items-center gap-2 bg-emerald-600 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Copied {copiedText}!</span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </nav>

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10 space-y-16">

        {/* SECTION A: GENERAL INFORMATION */}
        <section id="general" className="scroll-mt-32">
          <ScrollReveal direction="up">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-[#00173e] via-[#00276a] to-indigo-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                      SECTION A • APPENDIX - IX
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                      General Information
                    </h2>
                  </div>
                </div>

                <div className="px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                  8 Records Listed
                </div>
              </div>

              {/* Grid / Table Layout */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Visual Highlight Cards for Key Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-900">Affiliation No.</span>
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-black text-[#00276a]">2730923</p>
                    <p className="text-xs text-slate-600 font-medium">CBSE Senior Secondary Recognized</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-900">School Code</span>
                      <ShieldCheck className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-2xl font-black text-amber-900">25571</p>
                    <p className="text-xs text-slate-600 font-medium">Official Examination Board Code</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-900">Principal</span>
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-lg font-black text-emerald-950">Ms. TANYA GUPTA</p>
                    <p className="text-xs text-slate-600 font-medium">Qualifications: M.Phil, MA, B.Ed</p>
                  </div>
                </div>

                {/* Complete Structured Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-xs font-black text-slate-700 uppercase tracking-wider">
                        <th className="py-4 px-4 sm:px-6 w-16 text-center">SL NO</th>
                        <th className="py-4 px-4 sm:px-6 w-1/3">INFORMATION</th>
                        <th className="py-4 px-4 sm:px-6">DETAILS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-medium">
                      {GENERAL_INFO_DATA.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <tr 
                            key={item.slNo}
                            className={`transition-colors ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                            } hover:bg-amber-50/40`}
                          >
                            <td className="py-4 px-4 sm:px-6 text-center font-black text-slate-500">
                              {item.slNo}
                            </td>
                            <td className="py-4 px-4 sm:px-6 font-bold text-slate-800 flex items-center gap-2.5">
                              <Icon className="w-4 h-4 text-[#00276a] shrink-0" />
                              <span>{item.label}</span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-slate-900 font-semibold">
                              {item.isLink ? (
                                <a 
                                  href={`${item.linkPrefix}${item.value}`}
                                  className="text-indigo-600 hover:text-indigo-800 underline font-bold inline-flex items-center gap-1.5"
                                >
                                  <span>{item.value}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <div className="flex items-center justify-between gap-3">
                                  <span className={item.highlight ? "font-black text-[#00276a] text-base" : ""}>
                                    {item.value}
                                  </span>
                                  <button
                                    onClick={() => handleCopy(item.value, item.label)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
                                    title="Copy details"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          </ScrollReveal>
        </section>


        {/* SECTION B: DOCUMENTS AND INFORMATION */}
        <section id="documents" className="scroll-mt-32">
          <ScrollReveal direction="up">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    <FileCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-300">
                      SECTION B • APPENDIX - IX
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                      Documents & Compliance Certificates
                    </h2>
                  </div>
                </div>

                {/* Filter Search Input */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search documents..."
                    className="w-full bg-white/10 text-white placeholder-slate-300 text-xs font-semibold pl-10 pr-4 py-2.5 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-md"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                    <strong>Mandatory CBSE Notice:</strong> Self-attested copies of all certificates listed below are signed by the Management & Principal and uploaded on the school server. Click <strong>"View Document"</strong> or <strong>"Download PDF"</strong> to inspect.
                  </p>
                </div>

                {/* Admin Form Section B */}
                <AnimatePresence>
                  {isAuthenticated && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                          <Plus className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800">
                            ADD PDF DOCUMENT (Section B)
                          </h4>
                        </div>

                        {formSuccessMessage && (
                          <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{formSuccessMessage}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-700 uppercase">Document Title</label>
                            <input
                              type="text"
                              value={formTitle}
                              onChange={(e) => setFormTitle(e.target.value)}
                              placeholder="e.g. BUILDING SAFETY CERTIFICATE 2026"
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-extrabold text-slate-700 uppercase">Public PDF URL</label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={formUrl}
                                onChange={(e) => setFormUrl(e.target.value)}
                                placeholder="https://example.com/safety_cert.pdf"
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveDocument('public_disclosure', 'Valid')}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg shrink-0 transition-all cursor-pointer"
                              >
                                {isSubmitting ? 'Adding...' : 'Add URL'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Table of Documents */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-xs font-black text-slate-700 uppercase tracking-wider">
                        <th className="py-4 px-4 sm:px-6 w-16 text-center">SL NO</th>
                        <th className="py-4 px-4 sm:px-6">DOCUMENTS / INFORMATION</th>
                        <th className="py-4 px-4 sm:px-6 w-32 text-center">STATUS</th>
                        <th className="py-4 px-4 sm:px-6 w-56 text-center">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-medium">
                      {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc, idx) => (
                          <tr 
                            key={doc.slNo}
                            className={`transition-colors ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                            } hover:bg-emerald-50/30`}
                          >
                            <td className="py-4 px-4 sm:px-6 text-center font-black text-slate-500">
                              {doc.slNo}
                            </td>
                            <td className="py-4 px-4 sm:px-6 space-y-1">
                              <p className="font-bold text-slate-900 leading-snug">
                                {doc.title}
                              </p>
                              <p className="text-xs text-slate-500 font-mono">
                                File: {doc.url ? decodeURIComponent(doc.url.split('/').pop() || '') : 'Pending Upload'}
                              </p>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-center">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{doc.date}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center justify-center gap-2">
                                {doc.url && /^https?:\/\//i.test(doc.url) ? (
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 bg-[#00276a] hover:bg-[#00173e] text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-sm hover:scale-105 transition-all cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View</span>
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      pdfService.openPdf(doc.url || doc.key || '', doc.title);
                                    }}
                                    className="inline-flex items-center gap-1.5 bg-[#00276a] hover:bg-[#00173e] text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-sm hover:scale-105 transition-all cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    pdfService.downloadPdf(doc.url || doc.key || '', `${doc.shortTitle}.pdf`);
                                  }}
                                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-sm hover:scale-105 transition-all cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download</span>
                                </button>

                                {isAuthenticated && doc.key?.startsWith('supabase_') && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDocument(doc.key!.replace('supabase_', ''), doc.title)}
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-500 font-bold">
                            No documents match your search query "{searchTerm}".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          </ScrollReveal>
        </section>


        {/* SECTION C: RESULT AND ACADEMICS */}
        <section id="academics" className="scroll-mt-32">
          <ScrollReveal direction="up">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-blue-300">
                      SECTION C • APPENDIX - IX
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                      Result and Academics
                    </h2>
                  </div>
                </div>

                <div className="px-4 py-1.5 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-200 text-xs font-black uppercase tracking-wider">
                  Academic Disclosure
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-8">

                {/* Admin Form Section C */}
                <AnimatePresence>
                  {isAuthenticated && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                          <Plus className="w-4 h-4 text-blue-600" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-blue-800">
                            ADD PDF DOCUMENT (Section C)
                          </h4>
                        </div>

                        {formSuccessMessage && (
                          <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{formSuccessMessage}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-700 uppercase">Document Title</label>
                            <input
                              type="text"
                              value={formTitle}
                              onChange={(e) => setFormTitle(e.target.value)}
                              placeholder="e.g. ANNUAL ACADEMIC CALENDER 2026-27"
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-extrabold text-slate-700 uppercase">Public PDF URL</label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={formUrl}
                                onChange={(e) => setFormUrl(e.target.value)}
                                placeholder="https://example.com/calendar.pdf"
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveDocument('academics', 'Academic Session 2026-27')}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-lg shrink-0 transition-all cursor-pointer"
                              >
                                {isSubmitting ? 'Adding...' : 'Add URL'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Academic Documents List */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#00276a] border-b border-slate-200 pb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                    Academic Reports & Committee Documents
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {combinedAcademics.map((doc) => (
                      <div 
                        key={doc.key || doc.slNo}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                              {doc.session}
                            </span>
                            <span className="text-xs font-extrabold text-slate-400">#0{doc.slNo}</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 leading-snug">
                            {doc.title}
                          </h4>
                        </div>

                        {doc.isAnchor ? (
                          <button
                            onClick={() => scrollToSection('results-section')}
                            className="inline-flex items-center justify-center gap-2 bg-[#00276a] hover:bg-[#00173e] text-white text-xs font-extrabold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                          >
                            <span>View Examination Results</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 pt-2">
                            {doc.url && /^https?:\/\//i.test(doc.url) ? (
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#00276a] hover:bg-[#00173e] text-white text-xs font-extrabold py-2.5 rounded-xl transition-all cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View PDF</span>
                              </a>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  pdfService.openPdf(doc.url || doc.key || '', doc.title);
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#00276a] hover:bg-[#00173e] text-white text-xs font-extrabold py-2.5 rounded-xl transition-all cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View PDF</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                pdfService.downloadPdf(doc.url || doc.key || '', `${doc.title}.pdf`);
                              }}
                              className="inline-flex items-center justify-center p-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl transition-all cursor-pointer"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {isAuthenticated && doc.key?.startsWith('supabase_') && (
                              <button
                                type="button"
                                onClick={() => handleDeleteDocument(doc.key!.replace('supabase_', ''), doc.title)}
                                className="inline-flex items-center justify-center p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer"
                                title="Delete Document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOARD RESULTS TABLES SECTION */}
                <div id="results-section" className="space-y-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#00276a] flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      Last Three-Year Result of Board Examination
                    </h3>
                  </div>

                  {/* CLASS X TABLE */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-black text-slate-800">
                      <span className="w-3 h-3 rounded-full bg-blue-600" />
                      <span>RESULT CLASS: X</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-xs font-black text-slate-700 uppercase">
                            <th className="py-3.5 px-4 w-16 text-center">SL NO</th>
                            <th className="py-3.5 px-4">YEAR</th>
                            <th className="py-3.5 px-4 text-center">NO. OF REGISTERED STUDENTS</th>
                            <th className="py-3.5 px-4 text-center">NO. OF STUDENTS PASSED</th>
                            <th className="py-3.5 px-4 text-center">PASS PERCENTAGE</th>
                            <th className="py-3.5 px-4">REMARKS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-xs font-medium">
                          <tr className="bg-white hover:bg-slate-50">
                            <td className="py-3.5 px-4 text-center font-bold">1</td>
                            <td className="py-3.5 px-4 font-bold text-slate-800">2023 - 2024</td>
                            <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                            <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                            <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                            <td className="py-3.5 px-4 text-slate-500 italic">As Per Applicability / First Senior Batch</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* CLASS XII TABLE */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-sm font-black text-slate-800">
                      <span className="w-3 h-3 rounded-full bg-indigo-600" />
                      <span>RESULT CLASS: XII</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-xs font-black text-slate-700 uppercase">
                            <th className="py-3.5 px-4 w-16 text-center">SL NO</th>
                            <th className="py-3.5 px-4">YEAR</th>
                            <th className="py-3.5 px-4 text-center">NO. OF REGISTERED STUDENTS</th>
                            <th className="py-3.5 px-4 text-center">NO. OF STUDENTS PASSED</th>
                            <th className="py-3.5 px-4 text-center">PASS PERCENTAGE</th>
                            <th className="py-3.5 px-4">REMARKS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-xs font-medium">
                          <tr className="bg-white hover:bg-slate-50">
                            <td className="py-3.5 px-4 text-center font-bold">1</td>
                            <td className="py-3.5 px-4 font-bold text-slate-800">2023 - 2024</td>
                            <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                            <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                            <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                            <td className="py-3.5 px-4 text-slate-500 italic">As Per Applicability / Senior Secondary Expansion</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </ScrollReveal>
        </section>


        {/* SECTION D: STAFF (TEACHING) */}
        <section id="staff" className="scroll-mt-32">
          <ScrollReveal direction="up">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-purple-300">
                      SECTION D • APPENDIX - IX
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                      Staff (Teaching) Details
                    </h2>
                  </div>
                </div>

                <div className="px-4 py-1.5 rounded-full bg-purple-400/20 border border-purple-400/30 text-purple-200 text-xs font-black uppercase tracking-wider">
                  Total 46 Faculty Members
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 space-y-8">
                
                {/* Staff Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">Principal</span>
                    <p className="text-lg font-black text-purple-950">{STAFF_TEACHING_DATA.principal}</p>
                    <p className="text-xs text-slate-600 font-semibold">Head of School</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900">Total Teachers</span>
                    <p className="text-3xl font-black text-indigo-950">{STAFF_TEACHING_DATA.totalTeachers}</p>
                    <p className="text-xs text-slate-600 font-semibold">Full-time Faculty</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">Teacher Section Ratio</span>
                    <p className="text-3xl font-black text-amber-950">{STAFF_TEACHING_DATA.teacherSectionRatio}</p>
                    <p className="text-xs text-slate-600 font-semibold">Optimal Classroom Attention</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">Special Educator & Wellness</span>
                    <p className="text-2xl font-black text-emerald-950">1 & 1</p>
                    <p className="text-xs text-slate-600 font-semibold">Dedicated Student Care</p>
                  </div>
                </div>

                {/* Teacher Breakdown Table */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#00276a]">
                    Faculty Cadre Breakdown
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-slate-500">PGT (Post Graduate Teachers)</p>
                        <p className="text-xl font-black text-slate-900">6 Members</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-black flex items-center justify-center text-sm">
                        PGT
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-slate-500">TGT (Trained Graduate Teachers)</p>
                        <p className="text-xl font-black text-slate-900">16 Members</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-sm">
                        TGT
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-slate-500">PRT (Primary Teachers)</p>
                        <p className="text-xl font-black text-slate-900">24 Members</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm">
                        PRT
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structured Official Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-xs font-black text-slate-700 uppercase">
                        <th className="py-3.5 px-4 w-16 text-center">SL NO</th>
                        <th className="py-3.5 px-4">INFORMATION</th>
                        <th className="py-3.5 px-4">DETAILS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-medium">
                      <tr className="bg-white">
                        <td className="py-3.5 px-4 text-center font-bold">1</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">PRINCIPAL</td>
                        <td className="py-3.5 px-4 font-black text-[#00276a]">{STAFF_TEACHING_DATA.principal}</td>
                      </tr>
                      <tr className="bg-slate-50/70">
                        <td className="py-3.5 px-4 text-center font-bold">2</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          TOTAL NO. OF TEACHERS
                          <div className="text-xs font-semibold text-slate-500 mt-1 pl-3 space-x-4">
                            <span>• PGT: 6</span>
                            <span>• TGT: 16</span>
                            <span>• PRT: 24</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900 text-base">46</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3.5 px-4 text-center font-bold">3</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">TEACHERS SECTION RATIO</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">1:1.5</td>
                      </tr>
                      <tr className="bg-slate-50/70">
                        <td className="py-3.5 px-4 text-center font-bold">4</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">DETAILS OF SPECIAL EDUCATOR</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">1</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3.5 px-4 text-center font-bold">5</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">DETAILS OF COUNSELLOR AND WELLNESS TEACHER</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          </ScrollReveal>
        </section>


        {/* SECTION E: SCHOOL INFRASTRUCTURE */}
        <section id="infrastructure" className="scroll-mt-32">
          <ScrollReveal direction="up">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-slate-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    <School className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-cyan-300">
                      SECTION E • APPENDIX - IX
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                      School Infrastructure
                    </h2>
                  </div>
                </div>

                <div className="px-4 py-1.5 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 text-xs font-black uppercase tracking-wider">
                  Campus Facilities Verified
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 space-y-8">
                
                {/* Infrastructure Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-900">Total Campus Area</span>
                    <p className="text-2xl font-black text-cyan-950">4095 Sq Mtr</p>
                    <p className="text-xs text-slate-600 font-medium">Spacious & Safe Premises</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-900">Classrooms</span>
                    <p className="text-2xl font-black text-blue-950">39 Classrooms</p>
                    <p className="text-xs text-slate-600 font-medium">Size: 47 Sq Mtr each</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900">Laboratories</span>
                    <p className="text-2xl font-black text-indigo-950">4 Labs</p>
                    <p className="text-xs text-slate-600 font-medium">Size: 112 Sq Mtr each</p>
                  </div>
                </div>

                {/* Structured Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-xs font-black text-slate-700 uppercase">
                        <th className="py-4 px-4 sm:px-6 w-16 text-center">SL NO</th>
                        <th className="py-4 px-4 sm:px-6">INFORMATION</th>
                        <th className="py-4 px-4 sm:px-6">DETAILS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-medium">
                      {INFRASTRUCTURE_DATA.map((item, idx) => (
                        <tr 
                          key={item.slNo}
                          className={`transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                          } hover:bg-cyan-50/30`}
                        >
                          <td className="py-4 px-4 sm:px-6 text-center font-black text-slate-500">
                            {item.slNo}
                          </td>
                          <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                            {item.label}
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-slate-900">
                            {item.isVideo ? (
                              <a
                                href={item.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all"
                              >
                                <Youtube className="w-4 h-4" />
                                <span>Watch Campus Inspection Video</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : item.badgeColor ? (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${item.badgeColor}`}>
                                <Wifi className="w-3.5 h-3.5" />
                                <span>{item.value}</span>
                              </span>
                            ) : (
                              <div className="font-extrabold">
                                <span>{item.value}</span>
                                {item.subValue && (
                                  <span className="text-slate-500 font-normal text-xs ml-2">
                                    ({item.subValue})
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* YOUTUBE INSPECTION VIDEO EMBED CARD */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#00276a] text-white space-y-4 shadow-lg border border-white/10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600/30 text-red-400 flex items-center justify-center border border-red-500/40">
                        <Youtube className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">Official Infrastructure Inspection Video</h4>
                        <p className="text-xs text-slate-300">CBSE Affiliation Verification Tour of Professor's Global School</p>
                      </div>
                    </div>

                    <a
                      href="https://www.youtube.com/watch?v=T0vib4iWffQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 underline"
                    >
                      <span>Open in YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Responsive Video Container */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl">
                    <iframe
                      src="https://www.youtube.com/embed/T0vib4iWffQ"
                      title="Inspection of Professor's Global School Infrastructure"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>

              </div>

            </div>
          </ScrollReveal>
        </section>


        {/* SECTION F: MANDATORY CBSE COMPLIANCE NOTICE */}
        <section id="compliance" className="scroll-mt-32">
          <ScrollReveal direction="up">
            <div className="bg-gradient-to-br from-slate-900 via-[#00173e] to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/15 relative overflow-hidden space-y-6">
              
              <div className="flex items-center gap-3 border-b border-white/15 pb-4">
                <ShieldCheck className="w-7 h-7 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                    STATUTORY DECLARATION
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Mandatory Self-Attestation & Compliance Note
                  </h3>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed font-mono uppercase tracking-wide">
                  "NOTE: THE SCHOOLS NEEDS TO UPLOAD THE SELF ATTESTED COPIES OF ABOVE LISTED DOCUMENTS BY CHAIRMAN/MANAGER/SECRETARY AND PRINCIPAL. IN CASE, IT IS NOTICED AT LATER STAGE THAT UPLOADED DOCUMENTS ARE NOT GENUINE THEN SCHOOL SHALL BE LIABLE FOR ACTION AS PER NORMS."
                </p>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-amber-300 font-bold border-t border-white/10">
                  <span>Professor's Global School Management & Administration</span>
                  <span>CBSE Affiliation No: 2730923</span>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </section>

      </main>

      {/* 4. Admin Password Verification Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-amber-100" />
                  <h3 className="text-base font-black uppercase tracking-wider">
                    Verify Admin Rights
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError(null);
                    setPasswordInput('');
                  }}
                  className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAdminAuth} className="p-6 space-y-4">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900 font-medium leading-relaxed">
                    Please enter the administrator password to unlock dynamic PDF uploading and document deletions.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    Security Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                </div>

                {passwordError && (
                  <p className="text-xs font-black text-rose-600 flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    <AlertCircle className="w-4 h-4" />
                    <span>{passwordError}</span>
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError(null);
                      setPasswordInput('');
                    }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl cursor-pointer transition-all border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-all"
                  >
                    Access Controls
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
