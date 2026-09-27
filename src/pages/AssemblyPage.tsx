/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sun, 
  ShieldCheck, 
  Users, 
  Heart, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  Music,
  Mic,
  Calendar
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export const AssemblyPage: React.FC = () => {
  const APPLY_URL = "https://pgs.udtweb.com/online-document/branch-enquiry";

  const pillars = [
    {
      title: "Discipline & Punctuality",
      icon: <ShieldCheck className="w-7 h-7 text-amber-500" />,
      bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
      borderColor: "border-amber-500/30",
      description: "Cultivating respect, uniform standards, posture, and attentive silence from the very first minute of the school day.",
      tags: ["Punctuality", "Uniform Check", "Quiet Decorum"]
    },
    {
      title: "Student Participation",
      icon: <Users className="w-7 h-7 text-blue-500" />,
      bgGradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
      borderColor: "border-blue-500/30",
      description: "Empowering students across all grades to conduct prayers, present thought for the day, read news, and showcase talents.",
      tags: ["Student Anchors", "Public Speaking", "Confidence"]
    },
    {
      title: "Values & Character",
      icon: <Heart className="w-7 h-7 text-rose-500" />,
      bgGradient: "from-rose-500/10 via-pink-500/5 to-transparent",
      borderColor: "border-rose-500/30",
      description: "Instilling moral integrity, patriotic pride, empathy, and environmental consciousness through daily inspirational messages.",
      tags: ["School Pledge", "Ethical Guidance", "Patriotism"]
    },
    {
      title: "Diverse Activities",
      icon: <Sparkles className="w-7 h-7 text-emerald-500" />,
      bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      borderColor: "border-emerald-500/30",
      description: "Celebrating achievements, birthday greetings, cultural performances, inter-house recognitions, and school updates.",
      tags: ["Awards", "Celebrations", "Principal Talks"]
    }
  ];

  const orderOfCeremony = [
    {
      time: "08:00 AM",
      title: "School Prayer & Sacred Hymn",
      desc: "Unifying the entire school community in reverent reflection and seeking wisdom for the day ahead.",
      icon: <Music className="w-5 h-5 text-blue-600" />,
      color: "border-blue-500 bg-blue-50"
    },
    {
      time: "08:05 AM",
      title: "Thought for the Day & Word Builder",
      desc: "A inspiring daily quote and vocabulary enhancement presented by student representatives.",
      icon: <BookOpen className="w-5 h-5 text-purple-600" />,
      color: "border-purple-500 bg-purple-50"
    },
    {
      time: "08:10 AM",
      title: "National & Global News Headlines",
      desc: "Concise bulletin covering national affairs, international developments, sports highlights, and weather.",
      icon: <Mic className="w-5 h-5 text-amber-600" />,
      color: "border-amber-500 bg-amber-50"
    },
    {
      time: "08:15 AM",
      title: "Special Presentations & Accolades",
      desc: "House speeches, birthday felicitations, inter-school tournament trophies, and merit certificates.",
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      color: "border-emerald-500 bg-emerald-50"
    },
    {
      time: "08:20 AM",
      title: "Principal Address & National Anthem",
      desc: "Words of guidance from the Principal followed by singing the National Anthem with dignity.",
      icon: <Sun className="w-5 h-5 text-orange-600" />,
      color: "border-orange-500 bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 font-sans text-on-surface">
      
      {/* 1. Hero Header Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950 text-white overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,147,98,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.2),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-blue-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-blue-400" />
            <span className="text-white font-semibold">Morning Assembly</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-300 text-xs font-extrabold uppercase tracking-widest shadow-lg">
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span>Daily Inspiration & Unity</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Morning <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-300">Assembly</span>
              </h1>

              <p className="text-blue-100 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl">
                A structured, energetic, and inspiring start to every school day—fostering confidence, moral values, national pride, and holistic student growth.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#fc9362] text-white font-extrabold text-sm px-7 py-3.5 rounded-full shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span>Apply For Admission</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href="#overview"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3.5 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300"
                >
                  <span>Explore Schedule</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <div className="relative group rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-purple-950/50">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000"
                  alt="School Morning Assembly"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Daily Campus Routine</p>
                  <p className="text-sm font-extrabold mt-0.5">Where Leadership & Community Flourish</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Featured Core Description Section */}
      <section id="overview" className="py-16 md:py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="relative bg-gradient-to-br from-white via-slate-50 to-blue-50/50 rounded-3xl p-8 sm:p-10 md:p-14 border border-blue-100 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 absolute top-0 left-0 right-0" />
            
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
                <Sun className="w-9 h-9 text-amber-500" />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tight">
                Purposeful & Inspiring Beginning
              </h2>

              <blockquote className="text-base sm:text-lg md:text-xl text-slate-700 font-medium italic leading-relaxed bg-white/80 p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
                "Our Morning assembly includes a structured program with announcements and activities, student participation, emphasis on school values and discipline, diverse elements like prayers, songs, news and talks, efficient time management, and engaging content. These ensure a purposeful and inspiring start to the school day for all students."
              </blockquote>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-extrabold text-slate-600">
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Efficient Time Management
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Student-Led Presentations
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> Holistic Value Integration
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Core Pillars (4 Colorful Cards) */}
      <section className="py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-4 py-1.5 rounded-full inline-block">
              Key Elements
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              Pillars of Our Morning Assembly
            </h2>
            <p className="text-secondary text-sm sm:text-base">
              Designed to nurture character, confidence, and togetherness across all grade levels.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`h-full bg-white rounded-3xl p-6 sm:p-7 border ${pillar.borderColor} shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>

                  <h3 className="text-xl font-extrabold text-primary tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="relative z-10 pt-5 mt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {pillar.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. Assembly Order of Ceremony (Timeline Schedule) */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-white border-y border-slate-200/80 my-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <ScrollReveal direction="up">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full inline-block border border-blue-200">
                Daily Schedule
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                Order of Assembly Proceedings
              </h2>
              <p className="text-secondary text-sm sm:text-base max-w-xl mx-auto">
                A seamless 25-minute morning routine designed for peak focus and inspiring start.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {orderOfCeremony.map((step, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-primary bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                      {step.time}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-extrabold text-primary group-hover:text-blue-700 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-primary via-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-white/10 px-4 py-1.5 rounded-full inline-block border border-white/10">
                Admissions Open 2026-27
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                Join the Vibrant Community at Professor's Global School
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Experience world-class education, discipline, and rich co-curricular opportunities.
              </p>
            </div>

            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2.5 bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#fc9362] text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Apply Online Now</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
