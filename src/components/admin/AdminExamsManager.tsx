/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Calendar, FileText, Upload, Search, X } from 'lucide-react';
import { ExamScheduleItem } from '../../types';
import { communicationService } from '../../services/communicationService';
import { useToast } from '../../context/ToastContext';

export const AdminExamsManager: React.FC = () => {
  const { showToast } = useToast();
  const [exams, setExams] = useState<ExamScheduleItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExamScheduleItem | null>(null);

  const [formData, setFormData] = useState<Omit<ExamScheduleItem, 'id'>>({
    className: 'Class X (CBSE Stream)',
    examName: 'Periodic Assessment 2',
    startDate: '2026-09-10',
    endDate: '2026-09-20',
    timing: '08:30 AM - 11:30 AM',
    academicYear: '2026-27',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfSize: '1.2 MB',
    isPublished: true,
    instructions: [
      'Students must report strictly by 08:00 AM.',
      'Calculators & smartwatches are strictly forbidden.'
    ],
    subjectList: [
      { date: '2026-09-10', day: 'Thursday', subject: 'Mathematics', code: '041', timing: '08:30 AM - 11:30 AM' }
    ]
  });

  const loadData = () => {
    setExams(communicationService.getExams());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this exam schedule?')) {
      communicationService.deleteExam(id);
      loadData();
      showToast({ type: 'info', title: 'Schedule Removed', message: 'Exam timetable deleted.' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      communicationService.updateExam(editingItem.id, formData);
      showToast({ type: 'success', title: 'Exam Schedule Updated', message: 'Timetable saved.' });
    } else {
      communicationService.addExam(formData);
      showToast({ type: 'success', title: 'Exam Schedule Created', message: 'Timetable published.' });
    }
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-primary text-lg">Exam Schedule Manager</h3>
          <p className="text-slate-500 text-xs font-medium">Publish wing-wise assessment date sheets and instructions.</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Date Sheet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
                {exam.className}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(exam.id)}
                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h4 className="font-black text-primary text-base">{exam.examName}</h4>
            <p className="text-xs text-slate-500 font-semibold">{exam.startDate} to {exam.endDate} • {exam.timing}</p>

            <div className="pt-3 border-t border-slate-100 text-xs font-bold text-slate-600">
              {exam.subjectList.length} subjects listed in date sheet
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-black text-primary mb-4">Add Exam Date Sheet</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Examination Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.examName}
                    onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow">
                    Save Schedule
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
