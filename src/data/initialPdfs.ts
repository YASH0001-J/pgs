/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PDFCategoryMeta, PDFDocument } from '../types';

export const PDF_CATEGORIES: PDFCategoryMeta[] = [
  {
    id: 'public_disclosure',
    label: 'Public Disclosure (CBSE)',
    folder: 'pdfs/public_disclosure',
    icon: '🏛️',
    description: 'Mandatory CBSE Appendix-IX certificates, affiliation letters, safety orders, and society registration.'
  },
  {
    id: 'notices',
    label: 'Notices',
    folder: 'notices',
    icon: '📢',
    description: 'Official announcements, holiday declarations, student event circulars, and notifications.'
  },
  {
    id: 'circulars',
    label: 'Circulars',
    folder: 'circulars',
    icon: '📄',
    description: 'Directorate of Education directives, POCSO child safety guidelines, and school circulars.'
  },
  {
    id: 'syllabus',
    label: 'Syllabus & Date Sheets',
    folder: 'syllabus',
    icon: '🗓️',
    description: 'Class-wise periodic syllabus blueprints, unit test date sheets, and board exam schedules.'
  },
  {
    id: 'admission',
    label: 'Admission & Prospectus',
    folder: 'admission',
    icon: '🎓',
    description: 'Admission application forms, fee schedule breakdown, and official school prospectus.'
  },
  {
    id: 'forms',
    label: 'Official Forms & Consents',
    folder: 'forms',
    icon: '📝',
    description: 'APAAR consent forms (English & Hindi), Transfer Certificate (TC) formats, and parent undertakings.'
  },
  {
    id: 'academics',
    label: 'Academics & Planners',
    folder: 'academics',
    icon: '📚',
    description: 'Annual academic calendars, monthly activity planners, SMC list, and PTA member executive committee.'
  },
  {
    id: 'newsletters',
    label: 'Newsletters',
    folder: 'newsletters',
    icon: '📰',
    description: 'Mindscape monthly school chronicles, event highlights, competitions, and editorial reflections.'
  },
  {
    id: 'downloads',
    label: 'Downloads Vault',
    folder: 'downloads',
    icon: '📥',
    description: 'Stationery lists, transport routes, uniform guidelines, and general downloadable resources.'
  },
  {
    id: 'other',
    label: 'Other Documents',
    folder: 'other',
    icon: '📁',
    description: 'Miscellaneous statutory documents, press coverages, awards, and inspection reports.'
  }
];

/**
 * Initial empty catalog.
 * Ready for fresh PDF documents to be uploaded/registered.
 */
export const INITIAL_PDF_DOCUMENTS: PDFDocument[] = [];
