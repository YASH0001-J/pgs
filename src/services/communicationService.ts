/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  NoticeItem,
  ExamScheduleItem,
  SchoolEventItem,
  DownloadResource,
  EventRegistration
} from '../types';

const NOTICES_KEY = 'pgs_notices_v1';
const EXAMS_KEY = 'pgs_exams_v1';
const EVENTS_KEY = 'pgs_events_v1';
const DOWNLOADS_KEY = 'pgs_downloads_v1';
const REGISTRATIONS_KEY = 'pgs_event_registrations_v1';

// Seed Data
const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'n-101',
    title: 'CBSE Board Examination Date Sheet & Guidelines 2026-27',
    category: 'Exam Schedule',
    description: 'Official schedule release for Class X and XII Board Examinations along with admit card collection protocols.',
    content: 'Dear Parents & Students,\n\nThe Central Board of Secondary Education (CBSE) has officially released the Class X and XII Board Examination Date Sheet for 2026-27. All students must collect their verified admit cards from the Senior Wing Administrative Office between 09:00 AM and 01:00 PM on working days.\n\nPlease ensure all school dues are cleared prior to admit card issuance. Detailed subject-wise timing and examination center instructions are attached in the official notification document.',
    publishDate: '2026-07-24',
    isNew: true,
    isPinned: true,
    isPublished: true,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfSize: '1.8 MB',
    attachmentName: 'CBSE_Board_Exam_Datesheet_2026.pdf',
    author: 'Controller of Examinations',
    academicYear: '2026-27'
  },
  {
    id: 'n-102',
    title: 'Annual Inter-School Sports Meet & Track Trials Announcement',
    category: 'Upcoming Events',
    description: 'Registration opens for the 15th Annual Track & Field Championship. Selection trials begin August 5th.',
    content: 'We are thrilled to announce the 15th Annual Inter-School Sports Championship. Events include 100m/200m relays, lawn tennis, badminton singles, high jump, and swimming relays.\n\nStudents from Grades VI to XII interested in participating in trial runs must submit their entry forms to the Sports Department by August 2nd, 2026. Fitness clearance certificates signed by parents are mandatory.',
    publishDate: '2026-07-22',
    isNew: true,
    isPinned: true,
    isPublished: true,
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800',
    author: 'Sports Directorate',
    academicYear: '2026-27'
  },
  {
    id: 'n-103',
    title: 'Summer Vacation Advisory & Holiday Homework Portals',
    category: 'Holiday Notices',
    description: 'Guidelines for summer break projects, digital library access, and school reopening schedules.',
    content: 'The school will remain closed for Summer Vacations from June 1st to July 10th. Holiday homework packets for all subjects have been published under the Downloads section.\n\nStudents are encouraged to utilize our digital library portal for reading assignments and interactive STEM modules during the break.',
    publishDate: '2026-07-18',
    isNew: false,
    isPinned: false,
    isPublished: true,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfSize: '2.4 MB',
    attachmentName: 'Summer_Holiday_Homework_Packet.pdf',
    author: 'Academic Coordinator',
    academicYear: '2026-27'
  },
  {
    id: 'n-104',
    title: 'Parent-Teacher Meeting (PTM) for Term 1 Academic Progress',
    category: 'Latest Notices',
    description: 'Mandatory PTM scheduled for Saturday, August 8th. Slot booking available online.',
    content: 'Parent-Teacher Meeting for evaluating Term 1 academic performance will take place on Saturday, August 8th from 08:30 AM to 01:30 PM. Parents can choose preferred meeting slots through the Parent Portal or register at the reception desk upon arrival.',
    publishDate: '2026-07-15',
    isNew: false,
    isPinned: false,
    isPublished: true,
    author: 'Principal Office',
    academicYear: '2026-27'
  },
  {
    id: 'n-105',
    title: 'School Transport & Smart RFID Bus Tracking Circular',
    category: 'Circulars',
    description: 'Implementation of upgraded GPS and real-time RFID bus tracking for student safety on all 24 routes.',
    content: 'In line with our safety protocols, all 24 school transport buses are now integrated with real-time GPS tracking and automated RFID card attendance systems. Parents will receive automated SMS notifications when their ward boards and disembarks.',
    publishDate: '2026-07-10',
    isNew: false,
    isPinned: false,
    isPublished: true,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfSize: '950 KB',
    attachmentName: 'Transport_RFID_Guidelines_2026.pdf',
    author: 'Transport Manager',
    academicYear: '2026-27'
  },
  {
    id: 'n-106',
    title: 'Revised Fee Structure & Digital Payment Gateway 2026-27',
    category: 'Important Announcements',
    description: 'Updated fee schedule and zero-convenience-fee online payment portal instructions.',
    content: 'The revised Fee Schedule for Academic Year 2026-27 has been ratified by the Management Board. Quarter 2 fee payments can be conveniently completed via UPI, NetBanking, or Credit Cards with zero gateway fees.',
    publishDate: '2026-07-05',
    isNew: false,
    isPinned: true,
    isPublished: true,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfSize: '1.1 MB',
    attachmentName: 'Fee_Structure_Circular_2026.pdf',
    author: 'Finance & Accounts',
    academicYear: '2026-27'
  }
];

const INITIAL_EXAMS: ExamScheduleItem[] = [
  {
    id: 'ex-201',
    className: 'Class XII (Science & Commerce)',
    examName: 'Mid-Term Board Assessment 2026',
    startDate: '2026-09-10',
    endDate: '2026-09-25',
    timing: '08:30 AM - 11:30 AM',
    academicYear: '2026-27',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfSize: '1.2 MB',
    isPublished: true,
    instructions: [
      'Reporting time is strictly 08:00 AM in uniform.',
      '15 minutes reading time will be allotted before writing.',
      'Transparent water bottles and writing boards permitted only.',
      'Mobile phones and electronic gadgets are strictly prohibited.'
    ],
    subjectList: [
      { date: '2026-09-10', day: 'Thursday', subject: 'English Core', code: '301', timing: '08:30 AM - 11:30 AM' },
      { date: '2026-09-14', day: 'Monday', subject: 'Physics / Accountancy', code: '042 / 055', timing: '08:30 AM - 11:30 AM' },
      { date: '2026-09-17', day: 'Thursday', subject: 'Chemistry / Business Studies', code: '043 / 054', timing: '08:30 AM - 11:30 AM' },
      { date: '2026-09-21', day: 'Monday', subject: 'Mathematics / Applied Math', code: '041 / 241', timing: '08:30 AM - 11:30 AM' },
      { date: '2026-09-25', day: 'Friday', subject: 'Computer Science / Biology / Economics', code: '083 / 044 / 030', timing: '08:30 AM - 11:30 AM' }
    ]
  },
  {
    id: 'ex-202',
    className: 'Class X (CBSE Stream)',
    examName: 'Periodic Test 2 Evaluation',
    startDate: '2026-09-12',
    endDate: '2026-09-22',
    timing: '09:00 AM - 11:00 AM',
    academicYear: '2026-27',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfSize: '980 KB',
    isPublished: true,
    instructions: [
      'Students must carry standard stationery items in a clear pouch.',
      'Syllabus covers Chapters 1 through 5 in all core subjects.'
    ],
    subjectList: [
      { date: '2026-09-12', day: 'Saturday', subject: 'Mathematics Standard / Basic', code: '041 / 241', timing: '09:00 AM - 11:00 AM' },
      { date: '2026-09-15', day: 'Tuesday', subject: 'Science', code: '086', timing: '09:00 AM - 11:00 AM' },
      { date: '2026-09-18', day: 'Friday', subject: 'Social Science', code: '087', timing: '09:00 AM - 11:00 AM' },
      { date: '2026-09-22', day: 'Tuesday', subject: 'English Language & Literature', code: '184', timing: '09:00 AM - 11:00 AM' }
    ]
  },
  {
    id: 'ex-203',
    className: 'Middle Wing (Grades VI - VIII)',
    examName: 'Half-Yearly Examinations 2026',
    startDate: '2026-09-15',
    endDate: '2026-09-24',
    timing: '08:45 AM - 11:15 AM',
    academicYear: '2026-27',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfSize: '850 KB',
    isPublished: true,
    instructions: [
      'Revision sessions conducted during 1st period prior to paper.',
      'Buses will depart at 11:45 AM on exam days.'
    ],
    subjectList: [
      { date: '2026-09-15', day: 'Tuesday', subject: 'General Science', code: 'SCI-68', timing: '08:45 AM - 11:15 AM' },
      { date: '2026-09-18', day: 'Friday', subject: 'Mathematics', code: 'MATH-68', timing: '08:45 AM - 11:15 AM' },
      { date: '2026-09-21', day: 'Monday', subject: 'Social Studies', code: 'SST-68', timing: '08:45 AM - 11:15 AM' },
      { date: '2026-09-24', day: 'Thursday', subject: 'Third Language (Sanskrit/French)', code: 'LANG-3', timing: '08:45 AM - 11:15 AM' }
    ]
  }
];

const INITIAL_EVENTS: SchoolEventItem[] = [
  {
    id: 'ev-301',
    title: 'Grand Annual Sports Day & Olympiad 2026',
    date: '2026-08-22',
    time: '08:30 AM - 02:00 PM',
    venue: 'Main Athletic Stadium & Sports Complex',
    description: 'A day of athletics, marching drills, gymnastics showcases, and inter-house relay cups featuring Chief Guest Olympian athletes.',
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800',
    isPublished: true,
    registrationOpen: true,
    registeredCount: 142,
    capacity: 300,
    organizer: 'Physical Education Department'
  },
  {
    id: 'ev-302',
    title: 'National Robotics & Artificial Intelligence Expo',
    date: '2026-09-05',
    time: '09:30 AM - 04:00 PM',
    venue: 'Turing STEM Lab & Main Auditorium',
    description: 'Showcasing student-designed autonomous rovers, AI IoT projects, 3D printing solutions, and drone flight maneuvers.',
    category: 'STEM & Innovation',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800',
    isPublished: true,
    registrationOpen: true,
    registeredCount: 88,
    capacity: 200,
    organizer: 'Robotics & Coding Club'
  },
  {
    id: 'ev-303',
    title: 'Cultural Kaleidoscope & Music Symphonies Fest',
    date: '2026-09-20',
    time: '05:00 PM - 08:30 PM',
    venue: 'Open-Air Campus Amphitheatre',
    description: 'An enchanting evening of classical sitar, contemporary band performances, folk dance troupes, and theatrical plays.',
    category: 'Arts & Culture',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800',
    isPublished: true,
    registrationOpen: true,
    registeredCount: 210,
    capacity: 500,
    organizer: 'Performing Arts Wing'
  },
  {
    id: 'ev-304',
    title: 'Global Model United Nations (PGS MUN) 2026',
    date: '2026-10-10',
    time: '08:00 AM - 05:00 PM',
    venue: 'International Conference Wing',
    description: 'Simulating UN Security Council, UNEP, and Human Rights Assembly to debate global climate action and diplomacy.',
    category: 'Leadership & Debating',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800',
    isPublished: true,
    registrationOpen: true,
    registeredCount: 95,
    capacity: 150,
    organizer: 'Debating Society'
  }
];

const INITIAL_DOWNLOADS: DownloadResource[] = [
  {
    id: 'dl-401',
    title: 'CBSE Board Examination Date Sheet Class X & XII 2026-27',
    category: 'Date Sheets',
    description: 'Official verified date sheet issued by CBSE with exam center codes and subject timetables.',
    fileSize: '1.8 MB',
    uploadDate: '2026-07-24',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'PDF',
    downloadsCount: 1420,
    academicYear: '2026-27',
    isPublished: true,
    targetClass: 'Class X & XII'
  },
  {
    id: 'dl-402',
    title: 'School Prospectus & Information Brochure 2026-27',
    category: 'Prospectus',
    description: 'Comprehensive overview of global pedagogy, infrastructure, sports academies, and faculty profiles.',
    fileSize: '8.2 MB',
    uploadDate: '2026-07-01',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'PDF',
    downloadsCount: 3890,
    academicYear: '2026-27',
    isPublished: true,
    targetClass: 'All Classes'
  },
  {
    id: 'dl-403',
    title: 'New Admission Form & Registration Undertaking',
    category: 'Admission Forms',
    description: 'Printable application form for Nursery to Grade XI admissions with document checklist.',
    fileSize: '1.2 MB',
    uploadDate: '2026-06-15',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'PDF',
    downloadsCount: 2150,
    academicYear: '2026-27',
    isPublished: true,
    targetClass: 'New Admissions'
  },
  {
    id: 'dl-404',
    title: 'Approved Fee Structure & Transport Slab Guide 2026-27',
    category: 'Fee Structure',
    description: 'Detailed breakdown of tuition, lab fees, sports academies, and quarter-wise payment schedules.',
    fileSize: '980 KB',
    uploadDate: '2026-07-05',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'PDF',
    downloadsCount: 1840,
    academicYear: '2026-27',
    isPublished: true,
    targetClass: 'All Wings'
  },
  {
    id: 'dl-405',
    title: 'Summer Vacation Holiday Homework Packet (Primary Wing)',
    category: 'Holiday Homework',
    description: 'Curated creative projects, worksheets, and reading logs for Grades I to V.',
    fileSize: '4.5 MB',
    uploadDate: '2026-06-01',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'PDF',
    downloadsCount: 960,
    academicYear: '2026-27',
    isPublished: true,
    targetClass: 'Grades I - V'
  },
  {
    id: 'dl-406',
    title: 'Senior Secondary CBSE Curriculum & Syllabus Guide',
    category: 'Syllabus',
    description: 'Subject-wise unit breakdown, lab manual experiments, and weightage distribution for Science and Commerce streams.',
    fileSize: '3.1 MB',
    uploadDate: '2026-07-10',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'PDF',
    downloadsCount: 1290,
    academicYear: '2026-27',
    isPublished: true,
    targetClass: 'Grades XI - XII'
  },
  {
    id: 'dl-407',
    title: 'Academic Circular 38/2026 - Digital Attendance & Discipline Code',
    category: 'Circulars',
    description: 'Official circular detailing mandatory 75% attendance rules and smart card entry protocols.',
    fileSize: '720 KB',
    uploadDate: '2026-07-12',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'PDF',
    downloadsCount: 880,
    academicYear: '2026-27',
    isPublished: true,
    targetClass: 'All Students'
  }
];

export const communicationService = {
  // NOTICES
  getNotices(): NoticeItem[] {
    const raw = localStorage.getItem(NOTICES_KEY);
    if (!raw) {
      localStorage.setItem(NOTICES_KEY, JSON.stringify(INITIAL_NOTICES));
      return INITIAL_NOTICES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTICES;
    }
  },

  saveNotices(notices: NoticeItem[]): void {
    localStorage.setItem(NOTICES_KEY, JSON.stringify(notices));
  },

  addNotice(notice: Omit<NoticeItem, 'id'>): NoticeItem {
    const notices = this.getNotices();
    const newNotice: NoticeItem = {
      ...notice,
      id: `n-${Date.now()}`
    };
    const updated = [newNotice, ...notices];
    this.saveNotices(updated);
    return newNotice;
  },

  updateNotice(id: string, updates: Partial<NoticeItem>): NoticeItem | null {
    const notices = this.getNotices();
    const idx = notices.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    notices[idx] = { ...notices[idx], ...updates };
    this.saveNotices(notices);
    return notices[idx];
  },

  deleteNotice(id: string): void {
    const notices = this.getNotices().filter((n) => n.id !== id);
    this.saveNotices(notices);
  },

  // EXAMS
  getExams(): ExamScheduleItem[] {
    const raw = localStorage.getItem(EXAMS_KEY);
    if (!raw) {
      localStorage.setItem(EXAMS_KEY, JSON.stringify(INITIAL_EXAMS));
      return INITIAL_EXAMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EXAMS;
    }
  },

  saveExams(exams: ExamScheduleItem[]): void {
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  },

  addExam(exam: Omit<ExamScheduleItem, 'id'>): ExamScheduleItem {
    const exams = this.getExams();
    const newExam: ExamScheduleItem = {
      ...exam,
      id: `ex-${Date.now()}`
    };
    const updated = [newExam, ...exams];
    this.saveExams(updated);
    return newExam;
  },

  updateExam(id: string, updates: Partial<ExamScheduleItem>): ExamScheduleItem | null {
    const exams = this.getExams();
    const idx = exams.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    exams[idx] = { ...exams[idx], ...updates };
    this.saveExams(exams);
    return exams[idx];
  },

  deleteExam(id: string): void {
    const updated = this.getExams().filter((e) => e.id !== id);
    this.saveExams(updated);
  },

  // EVENTS
  getEvents(): SchoolEventItem[] {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EVENTS;
    }
  },

  saveEvents(events: SchoolEventItem[]): void {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  },

  addEvent(event: Omit<SchoolEventItem, 'id' | 'registeredCount'>): SchoolEventItem {
    const events = this.getEvents();
    const newEvent: SchoolEventItem = {
      ...event,
      id: `ev-${Date.now()}`,
      registeredCount: 0
    };
    const updated = [newEvent, ...events];
    this.saveEvents(updated);
    return newEvent;
  },

  updateEvent(id: string, updates: Partial<SchoolEventItem>): SchoolEventItem | null {
    const events = this.getEvents();
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    events[idx] = { ...events[idx], ...updates };
    this.saveEvents(events);
    return events[idx];
  },

  deleteEvent(id: string): void {
    const updated = this.getEvents().filter((e) => e.id !== id);
    this.saveEvents(updated);
  },

  registerForEvent(registration: Omit<EventRegistration, 'id' | 'registeredAt'>): EventRegistration {
    const raw = localStorage.getItem(REGISTRATIONS_KEY);
    const regs: EventRegistration[] = raw ? JSON.parse(raw) : [];
    const newReg: EventRegistration = {
      ...registration,
      id: `reg-${Date.now()}`,
      registeredAt: new Date().toISOString()
    };
    regs.push(newReg);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(regs));

    // Increment count on event
    const events = this.getEvents();
    const ev = events.find((e) => e.id === registration.eventId);
    if (ev) {
      ev.registeredCount = (ev.registeredCount || 0) + 1;
      this.saveEvents(events);
    }
    return newReg;
  },

  getEventRegistrations(eventId?: string): EventRegistration[] {
    const raw = localStorage.getItem(REGISTRATIONS_KEY);
    const regs: EventRegistration[] = raw ? JSON.parse(raw) : [];
    if (eventId) {
      return regs.filter((r) => r.eventId === eventId);
    }
    return regs;
  },

  // DOWNLOADS
  getDownloads(): DownloadResource[] {
    const raw = localStorage.getItem(DOWNLOADS_KEY);
    if (!raw) {
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(INITIAL_DOWNLOADS));
      return INITIAL_DOWNLOADS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DOWNLOADS;
    }
  },

  saveDownloads(downloads: DownloadResource[]): void {
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
  },

  addDownload(download: Omit<DownloadResource, 'id' | 'downloadsCount'>): DownloadResource {
    const downloads = this.getDownloads();
    const newDownload: DownloadResource = {
      ...download,
      id: `dl-${Date.now()}`,
      downloadsCount: 0
    };
    const updated = [newDownload, ...downloads];
    this.saveDownloads(updated);
    return newDownload;
  },

  updateDownload(id: string, updates: Partial<DownloadResource>): DownloadResource | null {
    const downloads = this.getDownloads();
    const idx = downloads.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    downloads[idx] = { ...downloads[idx], ...updates };
    this.saveDownloads(downloads);
    return downloads[idx];
  },

  deleteDownload(id: string): void {
    const updated = this.getDownloads().filter((d) => d.id !== id);
    this.saveDownloads(updated);
  },

  incrementDownloadCount(id: string): void {
    const downloads = this.getDownloads();
    const item = downloads.find((d) => d.id === id);
    if (item) {
      item.downloadsCount += 1;
      this.saveDownloads(downloads);
    }
  }
};
