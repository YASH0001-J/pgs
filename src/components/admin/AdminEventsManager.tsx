/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Calendar, MapPin, Users, Ticket, X } from 'lucide-react';
import { SchoolEventItem, EventRegistration } from '../../types';
import { communicationService } from '../../services/communicationService';
import { useToast } from '../../context/ToastContext';

export const AdminEventsManager: React.FC = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<SchoolEventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegistrationsEvent, setSelectedRegistrationsEvent] = useState<SchoolEventItem | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);

  const [formData, setFormData] = useState<Omit<SchoolEventItem, 'id' | 'registeredCount'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM - 01:00 PM',
    venue: 'Main Campus Auditorium',
    description: '',
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800',
    isPublished: true,
    registrationOpen: true,
    capacity: 200,
    organizer: 'Event Management Committee'
  });

  const loadData = () => {
    setEvents(communicationService.getEvents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete event?')) {
      communicationService.deleteEvent(id);
      loadData();
      showToast({ type: 'info', title: 'Event Deleted', message: 'Event removed.' });
    }
  };

  const handleViewRegistrations = (ev: SchoolEventItem) => {
    setSelectedRegistrationsEvent(ev);
    setRegistrations(communicationService.getEventRegistrations(ev.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    communicationService.addEvent(formData);
    showToast({ type: 'success', title: 'Event Added', message: 'New event created.' });
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-primary text-lg">Upcoming Events Manager</h3>
          <p className="text-slate-500 text-xs font-medium">Create campus events, manage registration quotas & track RSVPs.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="h-40 relative bg-slate-100 flex items-center justify-center">
              {ev.image && ev.image.trim() !== '' ? (
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <Calendar className="w-8 h-8 opacity-40 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                </div>
              )}
              <span className="absolute top-3 left-3 bg-emerald-500 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">
                {ev.category}
              </span>
            </div>

            <div className="p-6 space-y-3">
              <h4 className="font-black text-primary text-base">{ev.title}</h4>
              <p className="text-xs text-slate-500 font-semibold">{ev.date} • {ev.venue}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  RSVPs: {ev.registeredCount} / {ev.capacity || '∞'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewRegistrations(ev)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-primary font-bold text-xs"
                  >
                    View RSVPs
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
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

              <h3 className="text-xl font-black text-primary mb-4">Create New Event</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Event Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Venue</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs"
                  />
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
                    Create Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View RSVPs Modal */}
      <AnimatePresence>
        {selectedRegistrationsEvent && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <button onClick={() => setSelectedRegistrationsEvent(null)} className="absolute top-5 right-5 text-slate-400">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-black text-primary mb-1">Event Registrations</h3>
              <p className="text-xs font-bold text-slate-500 mb-4">{selectedRegistrationsEvent.title}</p>

              {registrations.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-8 text-center">No student RSVPs received yet.</p>
              ) : (
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 font-extrabold text-slate-600">
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Parent Name</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {registrations.map((r) => (
                        <tr key={r.id}>
                          <td className="p-3 font-bold text-primary">{r.studentName}</td>
                          <td className="p-3">{r.parentName}</td>
                          <td className="p-3 font-semibold">{r.className}</td>
                          <td className="p-3 font-mono">{r.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
