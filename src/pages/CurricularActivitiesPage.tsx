/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Compass, 
  FlaskConical, 
  MessageSquareQuote, 
  Users, 
  Palette, 
  Calculator, 
  BookOpen, 
  Activity, 
  Sparkles, 
  ChevronRight, 
  ExternalLink, 
  ArrowRight,
  CheckCircle2,
  Award,
  GraduationCap
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export const CurricularActivitiesPage: React.FC = () => {
  const APPLY_URL = "https://pgs.udtweb.com/online-document/branch-enquiry";

  const activities = [
    {
      title: "Field Trips & Excursions",
      icon: <Compass className="w-8 h-8 text-emerald-600" />,
      badge: "Experiential",
      gradient: "from-emerald-500/15 via-teal-500/5 to-transparent",
      borderColor: "border-emerald-500/30",
      accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Real-world exposure through historical visits, botanical gardens, science centers, and industrial tours.",
      highlights: ["Historical & Cultural Tours", "Nature Observations", "Museum Visits"]
    },
    {
      title: "Science Experiments & Labs",
      icon: <FlaskConical className="w-8 h-8 text-blue-600" />,
      badge: "STEM Practical",
      gradient: "from-blue-500/15 via-indigo-500/5 to-transparent",
      borderColor: "border-blue-500/30",
      accentBg: "bg-blue-50 text-blue-700 border-blue-200",
      description: "Hands-on chemistry, physics simulations, biological microscopy, and robotics in high-tech laboratories.",
      highlights: ["Interactive Experiments", "Robotics & Innovation", "Scientific Method"]
    },
    {
      title: "Debates & Elocution",
      icon: <MessageSquareQuote className="w-8 h-8 text-purple-600" />,
      badge: "Communication",
      gradient: "from-purple-500/15 via-pink-500/5 to-transparent",
      borderColor: "border-purple-500/30",
      accentBg: "bg-purple-50 text-purple-700 border-purple-200",
      description: "Developing articulate public speaking, logical argumentation, critical reasoning, and Model UN debates.",
      highlights: ["Parliamentary Debates", "Elocution Competitions", "Model UN"]
    },
    {
      title: "Group Projects",
      icon: <Users className="w-8 h-8 text-amber-600" />,
      badge: "Collaboration",
      gradient: "from-amber-500/15 via-orange-500/5 to-transparent",
      borderColor: "border-amber-500/30",
      accentBg: "bg-amber-50 text-amber-700 border-amber-200",
      description: "Fostering peer teamwork, research methodologies, model creation, and interactive group presentations.",
      highlights: ["Team Research", "Working Models", "Peer Presentations"]
    },
    {
      title: "Art & Music Projects",
      icon: <Palette className="w-8 h-8 text-rose-600" />,
      badge: "Creative Expression",
      gradient: "from-rose-500/15 via-red-500/5 to-transparent",
      borderColor: "border-rose-500/30",
      accentBg: "bg-rose-50 text-rose-700 border-rose-200",
      description: "Unleashing creative potential through painting, sculpture, vocal classical music, instruments, and drama.",
      highlights: ["Visual Art Studios", "Vocal & Instrumental", "Cultural Expositions"]
    },
    {
      title: "Mathematical Challenges",
      icon: <Calculator className="w-8 h-8 text-cyan-600" />,
      badge: "Analytical Skills",
      gradient: "from-cyan-500/15 via-teal-500/5 to-transparent",
      borderColor: "border-cyan-500/30",
      accentBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      description: "Mental math leagues, Rubik's cube, Sudoku championships, Vedic math techniques, and Math Olympiads.",
      highlights: ["Math Olympiads", "Logical Puzzles", "Vedic Math Workshops"]
    },
    {
      title: "Language & Phonetics Labs",
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      badge: "Literacy & Speech",
      gradient: "from-indigo-500/15 via-purple-500/5 to-transparent",
      borderColor: "border-indigo-500/30",
      accentBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      description: "Audio-visual pronunciation tools, creative writing circles, speed reading, and literature clubs.",
      highlights: ["Phonetics Practice", "Creative Writing", "Literature Forums"]
    },
    {
      title: "Physical Education & Sports",
      icon: <Activity className="w-8 h-8 text-orange-600" />,
      badge: "Fitness & Agility",
      gradient: "from-orange-500/15 via-amber-500/5 to-transparent",
      borderColor: "border-orange-500/30",
      accentBg: "bg-orange-50 text-orange-700 border-orange-200",
      description: "Comprehensive physical training, team sports, athletics, gymnastics, yoga, and sportsmanship values.",
      highlights: ["Annual Sports Meet", "Yoga & Meditation", "Team Sports Leagues"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 font-sans text-on-surface">
      
      {/* 1. Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,147,98,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.2),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-purple-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-purple-400" />
            <span className="text-white font-semibold">Curricular Activities</span>
          </div>

          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-300 text-xs font-extrabold uppercase tracking-widest shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Holistic Learning Beyond Textbooks</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Curricular <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-pink-300">Activities</span>
            </h1>

            <p className="text-purple-100 text-base sm:text-lg lg:text-xl leading-relaxed">
              Empowering students through hands-on experiences, creative expression, teamwork, and practical application of knowledge across diverse disciplines.
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
                href="#activities-grid"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3.5 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300"
              >
                <span>View All Activities</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Main Overview Statement */}
      <section className="py-16 md:py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="relative bg-gradient-to-br from-white via-slate-50 to-purple-50/50 rounded-3xl p-8 sm:p-10 md:p-14 border border-purple-100 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 absolute top-0 left-0 right-0" />
            
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
                <GraduationCap className="w-9 h-9" />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tight">
                Our Educational Philosophy
              </h2>

              <blockquote className="text-base sm:text-lg md:text-xl text-slate-700 font-medium italic leading-relaxed bg-white/80 p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
                "Curricular activities in PGS include field trips, science experiments, debates, group projects, art and music projects, mathematical challenges, language labs, and physical education activities. These activities enhance learning by providing hands-on experiences, fostering creativity, teamwork, and applying knowledge in practical contexts."
              </blockquote>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-extrabold text-slate-600">
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Experiential Learning
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> Creative Problem Solving
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Collaborative Teamwork
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Animated Grid Layout */}
      <section id="activities-grid" className="py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-100 px-4 py-1.5 rounded-full inline-block">
              Activity Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              Diverse Curricular Offerings
            </h2>
            <p className="text-secondary text-sm sm:text-base">
              Each activity is thoughtfully designed to ignite curiosity, skill acquisition, and real-world competence.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((act, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`h-full bg-white rounded-3xl p-6 sm:p-7 border ${act.borderColor} shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${act.gradient} opacity-40 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {act.icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${act.accentBg}`}>
                      {act.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-primary tracking-tight">
                    {act.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="relative z-10 pt-5 mt-4 border-t border-slate-100 space-y-1.5">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Key Highlights:</p>
                  {act.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-white/10 px-4 py-1.5 rounded-full inline-block border border-white/10">
                Enrollment Open 2026-27
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                Give Your Child the Advantage of Experiential Learning
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
                Connect with our admissions desk or complete our branch enquiry form online.
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
