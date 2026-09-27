/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  Download,
  FileText,
  Search,
  CheckCircle,
  X,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { communicationService } from '../services/communicationService';
import { ExamScheduleItem } from '../types';
import { useToast } from '../context/ToastContext';
import { ScrollReveal } from '../components/ScrollReveal';

export const ExamSchedulePage: React.FC = () => {
  const { showToast } = useToast();
  const [exams, setExams] = useState<ExamScheduleItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [activeModal, setActiveModal] = useState<ExamScheduleItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loaded = communicationService.getExams().filter((e) => e.isPublished);
    setExams(loaded);
  }, []);

  const classList = ['All', 'Class XII (Science & Commerce)', 'Class X (CBSE Stream)', 'Middle Wing (Grades VI - VIII)'];

  const filteredExams = exams.filter((item) => {
    if (selectedClass === 'All') return true;
    return item.className === selectedClass;
  });

  const handleDownload = (item: ExamScheduleItem) => {
    showToast({
      type: 'download',
      title: 'Downloading Date Sheet',
      message: `Downloading date sheet PDF for ${item.className}`
    });
    if (item.pdfUrl) {
      window.open(item.pdfUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      
      {/* Banner Header */}
      <section className="bg-gradient-to-r from-[#00276a] via-[#123d8f] to-[#1e3a8a] text-white py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4 text-center md:text-left">
          <span className="text-amber-300 font-extrabold text-xs uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full inline-block backdrop-blur-md border border-white/20">
            Assessment & Board Timetables
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Examination Schedules 2026-27
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl font-medium">
            View verified subject-wise exam timetables, reporting timings, code guidelines, and download printable date sheet PDFs.
          </p>
        </div>
      </section>

      {/* Class Filter Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 md:px-12 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">
            Select Wing / Class:
          </span>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {classList.map((cls) => {
              const isActive = selectedClass === cls;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cls}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10">
        <div className="space-y-8">
          {filteredExams.map((exam) => (
            <ScrollReveal key={exam.id} direction="up">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 absolute top-0 left-0 right-0" />

                {/* Card Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="bg-sky-100 text-sky-800 text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-2 border border-sky-200">
                      {exam.className}
                    </span>
                    <h2 className="text-2xl font-black text-primary leading-tight">
                      {exam.examName}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        Duration: {exam.startDate} to {exam.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        Timings: {exam.timing}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveModal(exam)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-primary font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>View Timetable</span>
                    </button>

                    <button
                      onClick={() => handleDownload(exam)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Subject Timetable Summary Table */}
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-200">
                        <th className="py-3 px-4 rounded-l-xl">Date & Day</th>
                        <th className="py-3 px-4">Subject Name</th>
                        <th className="py-3 px-4">Subject Code</th>
                        <th className="py-3 px-4 rounded-r-xl">Time Slot</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {exam.subjectList.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-extrabold text-primary">
                            {sub.date} ({sub.day})
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{sub.subject}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-500">{sub.code}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-600">{sub.timing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Instructions preview */}
                {exam.instructions && exam.instructions.length > 0 && (
                  <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-xs text-primary uppercase tracking-wider mb-1">Key Examination Instructions:</h4>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                        {exam.instructions.slice(0, 2).map((inst, idx) => (
                          <li key={idx}>{inst}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>

      {/* Modal View */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-2">
                {activeModal.className}
              </span>

              <h2 className="text-2xl font-black text-primary leading-tight mb-4">
                {activeModal.examName}
              </h2>

              {/* Complete Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Date & Day</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Timings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {activeModal.subjectList.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-primary">{sub.date} ({sub.day})</td>
                        <td className="py-3 px-4 font-extrabold text-slate-800">{sub.subject}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{sub.code}</td>
                        <td className="py-3 px-4 font-medium text-slate-600">{sub.timing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* All Instructions */}
              <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 mb-6 space-y-2">
                <h4 className="font-extrabold text-xs text-amber-900 uppercase tracking-wider">Official Exam Protocols:</h4>
                <ul className="text-xs text-amber-800 space-y-1.5 list-disc list-inside font-medium">
                  {activeModal.instructions.map((inst, idx) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleDownload(activeModal)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Date Sheet</span>
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
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
