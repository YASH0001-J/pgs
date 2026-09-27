/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Shield, 
  Trophy, 
  Users, 
  Flame, 
  Sun, 
  Waves, 
  Trees, 
  ChevronRight, 
  ExternalLink, 
  ArrowRight,
  CheckCircle2,
  Award,
  Sparkles
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export const HouseSystemPage: React.FC = () => {
  const APPLY_URL = "https://pgs.udtweb.com/online-document/branch-enquiry";

  const houses = [
    {
      id: "gir",
      name: "Gir House",
      colorName: "Red",
      symbol: "Lion of Gir",
      motto: "Courage Conquers All",
      icon: <Flame className="w-8 h-8 text-red-500" />,
      bgGradient: "from-red-600 via-rose-600 to-red-800",
      cardBorder: "border-red-500/40 hover:border-red-500",
      accentBg: "bg-red-500/20 text-red-200 border-red-400/30",
      badgeColor: "bg-red-600 text-white",
      description: "Named after the majestic Gir Lion, symbolizing undaunted courage, strength, passion, and natural leadership in all endeavors.",
      keyTraits: ["Courage & Valour", "Passionate Leadership", "Resilient Spirit"]
    },
    {
      id: "chhilka",
      name: "Chhilka House",
      colorName: "Yellow",
      symbol: "Golden Sun & Eagle",
      motto: "Shine With Knowledge",
      icon: <Sun className="w-8 h-8 text-amber-400" />,
      bgGradient: "from-amber-500 via-yellow-600 to-amber-700",
      cardBorder: "border-amber-400/40 hover:border-amber-400",
      accentBg: "bg-amber-500/20 text-amber-200 border-amber-400/30",
      badgeColor: "bg-amber-500 text-slate-900 font-extrabold",
      description: "Inspired by the serene, soaring beauty of Chilika, representing intellect, radiant optimism, warmth, and academic brilliance.",
      keyTraits: ["Soaring Intellect", "Radiant Optimism", "Academic Excellence"]
    },
    {
      id: "kanha",
      name: "Kanha House",
      colorName: "Blue",
      symbol: "Royal Kanha Tiger",
      motto: "Strive for Excellence",
      icon: <Waves className="w-8 h-8 text-blue-400" />,
      bgGradient: "from-blue-600 via-indigo-600 to-blue-800",
      cardBorder: "border-blue-400/40 hover:border-blue-400",
      accentBg: "bg-blue-500/20 text-blue-200 border-blue-400/30",
      badgeColor: "bg-blue-600 text-white",
      description: "Drawing power from the pristine wilderness of Kanha, embodying depth, tranquility, unwavering discipline, and competitive stamina.",
      keyTraits: ["Unwavering Discipline", "Deep Resilience", "Sportsmanship"]
    },
    {
      id: "sariska",
      name: "Sariska House",
      colorName: "Green",
      symbol: "Forest Phoenix",
      motto: "Grow and Flourish",
      icon: <Trees className="w-8 h-8 text-emerald-400" />,
      bgGradient: "from-emerald-600 via-teal-600 to-emerald-800",
      cardBorder: "border-emerald-400/40 hover:border-emerald-400",
      accentBg: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
      badgeColor: "bg-emerald-600 text-white",
      description: "Reflecting the lush greens of the Sariska Reserve, symbolizing continuous growth, vitality, environmental stewardship, and renewal.",
      keyTraits: ["Continuous Growth", "Eco Consciousness", "Harmonious Unity"]
    }
  ];

  const competitions = [
    {
      title: "Inter-House Sports Leagues",
      desc: "Annual track & field, football, basketball, cricket tournaments, and gymnastics competitions.",
      icon: <Trophy className="w-6 h-6 text-amber-500" />
    },
    {
      title: "Debates & Quiz Championships",
      desc: "Intellectual parliamentary debate rounds, Science & General Knowledge quiz bowls.",
      icon: <Award className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Cultural & Performing Arts Fest",
      desc: "Music ensemble, folk dance, theatrical drama, and visual art exhibitions.",
      icon: <Sparkles className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Discipline & Cleanliness Shield",
      desc: "Weekly evaluation of house orderliness, assembly decorum, and campus stewardship.",
      icon: <Shield className="w-6 h-6 text-emerald-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16 font-sans text-white">
      
      {/* 1. Hero Header */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,147,98,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.2),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-slate-500" />
            <span className="text-white font-semibold">House System</span>
          </div>

          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-extrabold uppercase tracking-widest shadow-lg">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Camaraderie & Competition</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">House System</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed">
              Fostering team spirit, leadership, healthy rivalry, and lifelong friendships across our four dynamic house pillars: Gir, Chhilka, Kanha, and Sariska.
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
                href="#house-cards"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3.5 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300"
              >
                <span>Meet the 4 Houses</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Main Description Section */}
      <section className="py-16 md:py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="relative bg-gradient-to-br from-slate-800 via-slate-800/90 to-indigo-950 rounded-3xl p-8 sm:p-10 md:p-14 border border-white/15 shadow-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-500 via-amber-400 via-blue-500 to-emerald-500 absolute top-0 left-0 right-0" />
            
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center mx-auto border border-white/20 shadow-inner">
                <Trophy className="w-9 h-9" />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                Heartbeat of School Culture
              </h2>

              <blockquote className="text-base sm:text-lg md:text-xl text-slate-200 font-medium italic leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-inner">
                "The school is structured around a dynamic house system designed to foster healthy competition, leadership, camaraderie, and team spirit among students from primary to senior levels. Each student is assigned to one of our four prestigious houses, participating in intra-house debates, sports leagues, cultural fests, and academic quizzes throughout the academic year."
              </blockquote>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-extrabold text-slate-300">
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Intra-House Competitions
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Student Captaincy & Mentorship
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Annual Championship Trophy
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. The 4 House Cards Grid with Hover Zoom Effect */}
      <section id="house-cards" className="py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full inline-block border border-amber-400/20">
              The Four Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Our Four Prestigious Houses
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Hover over each house card to explore its distinct identity, values, and motto.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {houses.map((house, idx) => (
            <ScrollReveal key={house.id} direction="up" delay={idx * 0.1}>
              <motion.div
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`h-full bg-slate-800/80 rounded-3xl p-6 sm:p-7 border ${house.cardBorder} shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${house.bgGradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-white/20 via-white/60 to-white/20" />

                <div className="relative z-10 space-y-5">
                  
                  {/* Header Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900/90 border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {house.icon}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${house.badgeColor}`}>
                      {house.colorName} House
                    </span>
                  </div>

                  {/* Title & Motto */}
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {house.name}
                    </h3>
                    <p className="text-xs font-bold text-amber-300 italic mt-1">
                      "{house.motto}"
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {house.description}
                  </p>
                </div>

                {/* Key Traits List */}
                <div className="relative z-10 pt-5 mt-5 border-t border-white/10 space-y-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">House Ethos:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {house.keyTraits.map((trait, tIdx) => (
                      <span key={tIdx} className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${house.accentBg}`}>
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. Inter-House Competitions Section */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-slate-950 border-y border-white/10 my-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <ScrollReveal direction="up">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full inline-block border border-blue-500/20">
                Annual Shield
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Inter-House Tournament Leagues
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                Throughout the session, houses compete for the prestigious Overall Champion Trophy.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitions.map((comp, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
                <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-white/20 hover:bg-slate-800/80 transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center">
                      {comp.icon}
                    </div>
                    <h3 className="text-lg font-extrabold text-white">
                      {comp.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {comp.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Bottom Call-To-Action */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/15">
            <div className="space-y-3 text-center md:text-left max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-white/10 px-4 py-1.5 rounded-full inline-block border border-white/10">
                Be a Part of the Pride
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                Empower Your Child to Lead with Honor
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Admissions open for Academic Session 2026-27. Apply online now.
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
