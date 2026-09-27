/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Query {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
}

export interface AdminSession {
  token: string;
  email: string;
  loginTime: string;
}

export interface CarouselSlide {
  id: number;
  image: string;
  heading: string;
  subtitle: string;
}

export interface Achievement {
  id: number;
  icon: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface GalleryItem {
  id: number;
  image?: string;
  video?: string;
  title: string;
  category: 'all' | 'events' | 'sports' | 'activities';
}

export interface SchoolEvent {
  id: number;
  date: string;
  month: string;
  title: string;
  time: string;
  location: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export type NoticeCategory =
  | 'Latest Notices'
  | 'Important Announcements'
  | 'Upcoming Events'
  | 'Exam Schedule'
  | 'Circulars'
  | 'Holiday Notices';

export interface NoticeItem {
  id: string;
  title: string;
  category: NoticeCategory;
  description: string;
  content: string;
  publishDate: string; // ISO or YYYY-MM-DD
  expiryDate?: string;
  isNew: boolean;
  isPinned: boolean;
  isPublished: boolean;
  pdfUrl?: string;
  pdfSize?: string;
  attachmentName?: string;
  coverImage?: string;
  author?: string;
  academicYear: string;
}

export interface ExamScheduleItem {
  id: string;
  className: string;
  examName: string;
  startDate: string;
  endDate: string;
  timing: string;
  academicYear: string;
  pdfUrl?: string;
  pdfSize?: string;
  subjectList: Array<{
    date: string;
    day: string;
    subject: string;
    code: string;
    timing: string;
  }>;
  instructions: string[];
  isPublished: boolean;
}

export interface SchoolEventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  venue: string;
  description: string;
  category: string;
  image: string;
  isPublished: boolean;
  registrationOpen: boolean;
  registeredCount: number;
  capacity?: number;
  organizer?: string;
}

export type DownloadCategory =
  | 'Date Sheets'
  | 'Circulars'
  | 'Admission Forms'
  | 'Fee Structure'
  | 'Holiday Homework'
  | 'Syllabus'
  | 'Prospectus';

export type PDFCategory =
  | 'public_disclosure'
  | 'notices'
  | 'circulars'
  | 'syllabus'
  | 'forms'
  | 'admission'
  | 'academics'
  | 'newsletters'
  | 'downloads'
  | 'other';

export interface PDFCategoryMeta {
  id: PDFCategory;
  label: string;
  folder: string;
  icon?: string;
  description: string;
}

export interface PDFDocument {
  id: string;
  key?: string; // Stable key for quick button bindings (e.g. 'cbse_affiliation_letter')
  title: string;
  category: PDFCategory;
  fileName: string;
  storagePath: string; // e.g. "pdfs/public_disclosure/CBSE-Affiliation-Letter-Front-Page.pdf"
  pdfUrl: string; // Direct download / Firebase Storage / CDN URL
  fileSize?: string;
  academicYear?: string;
  uploadedBy?: string;
  description?: string;
  isPublished?: boolean;
  downloadCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface DownloadResource {
  id: string;
  title: string;
  category: DownloadCategory;
  description: string;
  fileSize: string;
  uploadDate: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOCX' | 'ZIP' | 'XLSX';
  downloadsCount: number;
  academicYear: string;
  isPublished: boolean;
  targetClass?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  className: string;
  registeredAt: string;
}
