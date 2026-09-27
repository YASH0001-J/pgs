/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Grid,
  List,
  Sparkles,
  X,
  CheckCircle2,
  Ticket,
  UserCheck
} from 'lucide-react';
import { communicationService } from '../services/communicationService';
import { SchoolEventItem } from '../types';
import { useToast } from '../context/ToastContext';
import { ScrollReveal } from '../components/ScrollReveal';

export const EventsPage: React.FC = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<SchoolEventItem[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'timeline'>('card');
  const [registeringEvent, setRegisteringEvent] = useState<SchoolEventItem | null>(null);

  // Form fields
  const [regForm, setRegForm] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    className: 'Class X'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loaded = communicationService.getEvents().filter((e) => e.isPublished);
    setEvents(loaded);
  }, []);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringEvent) return;

    setIsSubmitting(true);
    setTimeout(() => {
      communicationService.registerForEvent({
        eventId: registeringEvent.id,
        studentName: regForm.studentName,
        parentName: regForm.parentName,
        email: regForm.email,
        phone: regForm.phone,
        className: regForm.className
      });

      // Reload events
      setEvents(communicationService.getEvents().filter((ev) => ev.isPublished));

      setIsSubmitting(false);
      setRegisteringEvent(null);
      setRegForm({ studentName: '', parentName: '', email: '', phone: '', className: 'Class X' });

      showToast({
        type: 'success',
        title: 'Event Ticket Confirmed!',
        message: `Registered successfully for "${registeringEvent.title}". Check your email for pass details.`
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      
      {/* Banner Header */}
      <section className="bg-gradient-to-r from-[#00276a] via-[#123d8f] to-[#1e3a8a] text-white py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4 text-center md:text-left">
          <span className="text-emerald-300 font-extrabold text-xs uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full inline-block backdrop-blur-md border border-white/20">
            Campus Life & Sports
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Upcoming Campus Events
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl font-medium">
            Join our sports meets, STEM robotics expos, cultural symphonies, and Model UN conferences. Register online for visitor passes.
          </p>
        </div>
      </section>

      {/* View Switcher Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 md:px-12 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
            Display Mode:
          </span>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('card')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Card Grid</span>
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-blue-600 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10">
        
        {/* CARD VIEW */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <ScrollReveal key={event.id} direction="up">
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                  {/* Image */}
                  <div className="h-56 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                    {event.image && event.image.trim() !== '' ? (
                      <img
                        src={event.image.trim()}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center">
                        <Calendar className="w-10 h-10 opacity-30 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                      {event.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-primary group-hover:text-blue-600 transition-colors leading-snug">
                        {event.title}
                      </h3>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer / RSVP */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{event.registeredCount} Registered {event.capacity ? `/ ${event.capacity}` : ''}</span>
                      </div>

                      <button
                        onClick={() => setRegisteringEvent(event)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>RSVP / Register</span>
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* TIMELINE VIEW */}
        {viewMode === 'timeline' && (
          <div className="relative border-l-2 border-emerald-500/30 ml-4 sm:ml-8 space-y-12 py-4">
            {events.map((event, idx) => (
              <ScrollReveal key={event.id} direction="right" delay={idx * 0.05}>
                <div className="relative pl-6 sm:pl-10">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 font-bold text-xs">
                    {idx + 1}
                  </div>

                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-start">
                    {event.image && event.image.trim() !== '' ? (
                      <img
                        src={event.image.trim()}
                        alt={event.title}
                        className="w-full md:w-48 h-40 rounded-2xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-full md:w-48 h-40 rounded-2xl bg-slate-100 flex flex-col items-center justify-center shrink-0 border border-slate-200 text-slate-400">
                        <Calendar className="w-8 h-8 opacity-40 mb-1" />
                        <span className="text-[9px] font-extrabold uppercase tracking-wider">No Image</span>
                      </div>
                    )}

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
                          {event.category}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">{event.date} • {event.time}</span>
                      </div>

                      <h3 className="text-xl font-black text-primary leading-tight">
                        {event.title}
                      </h3>

                      <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                        {event.description}
                      </p>

                      <div className="flex items-center justify-between gap-4 pt-2">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {event.venue}
                        </span>

                        <button
                          onClick={() => setRegisteringEvent(event)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Register Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>

      {/* Registration Modal */}
      <AnimatePresence>
        {registeringEvent && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <button
                onClick={() => setRegisteringEvent(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                  <Ticket className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-xl font-black text-primary">Event Registration</h3>
                  <p className="text-slate-500 text-xs font-medium">{registeringEvent.title}</p>
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 my-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.studentName}
                    onChange={(e) => setRegForm({ ...regForm, studentName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.parentName}
                    onChange={(e) => setRegForm({ ...regForm, parentName: e.target.value })}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      placeholder="e.g. parent@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grade / Wing *</label>
                  <select
                    value={regForm.className}
                    onChange={(e) => setRegForm({ ...regForm, className: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Primary Wing (I - V)">Primary Wing (I - V)</option>
                    <option value="Middle Wing (VI - VIII)">Middle Wing (VI - VIII)</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class X">Class X</option>
                    <option value="Class XI Science/Commerce">Class XI Science/Commerce</option>
                    <option value="Class XII Science/Commerce">Class XII Science/Commerce</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Ticket Booking</span>
                      </>
                    )}
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
