/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  X, 
  BookOpen, 
  Award, 
  Users, 
  Leaf, 
  Heart, 
  GraduationCap, 
  ArrowRight,
  Maximize2,
  TrendingUp,
  Building2,
  ShieldCheck,
  Star,
  Target,
  MessageSquare,
  Volume2,
  Video,
  UserCheck
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export interface WorkshopData {
  id: string;
  title: string;
  date: string;
  time?: string;
  occasion?: string;
  venue?: string;
  organizedBy?: string;
  speaker?: {
    name: string;
    role: string;
    organization?: string;
    bio?: string;
  };
  category: string;
  categoryColor: string;
  gradient: string;
  accentBg: string;
  overview: string[];
  objectives?: string[];
  highlights: string[];
  impact?: string;
  feedback?: string;
  conclusion?: string;
  posterInfo?: {
    inviteText: string;
    points: string[];
    principal: string;
  };
  images: {
    url: string;
    caption: string;
  }[];
}

export const WORKSHOPS_DATA: WorkshopData[] = [
  {
    id: "e-waste",
    title: 'One-Day Workshop: "Awareness about E-Waste"',
    date: "December 27, 2024",
    venue: "Professor's Global School",
    category: "Environmental Sustainability",
    categoryColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accentBg: "bg-emerald-50/80 border-emerald-100",
    overview: [
      "Professor's Global School organized a one-day workshop titled \"Awareness about E-Waste\" on December 27th. The workshop aimed to educate students about the growing problem of electronic waste and the importance of proper e-waste management.",
      "The sessions focused on identifying different types of e-waste, the impact of improper disposal, and simple strategies to reduce, reuse, and recycle electronic items. Through interactive discussions and engaging activities, students learned how small actions can contribute to a cleaner and healthier environment.",
      "As part of the workshop, students participated in a waste segregation activity where they learned to correctly separate electronic waste from general waste. The event concluded with students taking a pledge to minimize e-waste in their daily lives."
    ],
    highlights: [
      "Identification of different types of electronic waste and environmental hazards.",
      "Impact of improper disposal on ecosystem and human health.",
      "Practical strategies to reduce, reuse, and recycle electronic components.",
      "Hands-on waste segregation activity separating e-waste from general waste.",
      "Student environmental pledge to minimize electronic waste in daily routines."
    ],
    conclusion: "Overall, the workshop not only raised awareness but also inspired students to take responsibility for their surroundings, reinforcing the significance of sustainable practices for a better future.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
        caption: "Students analyzing electronic recycling sorting techniques"
      },
      {
        url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=800",
        caption: "E-waste awareness presentation and interactive quiz session"
      },
      {
        url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
        caption: "Green campus drive & electronic disposal collection booth"
      }
    ]
  },
  {
    id: "womens-day",
    title: 'Women\'s Day Special Workshop: "Financial Independence for Women"',
    date: "March 8, 2025",
    occasion: "International Women's Day",
    venue: "Virtual via Zoom",
    organizedBy: "Professor's Global School in collaboration with SEBI (Securities and Exchange Board of India)",
    speaker: {
      name: "Ms. Himani Lath",
      role: "SEBI Smart Trainer",
      organization: "Securities and Exchange Board of India (SEBI)",
      bio: "Expert financial trainer specializing in wealth management, securities planning, and financial security for educators."
    },
    category: "Women Empowerment & Financial Literacy",
    categoryColor: "bg-pink-100 text-pink-800 border-pink-300",
    gradient: "from-pink-600 via-rose-600 to-purple-600",
    accentBg: "bg-pink-50/80 border-pink-100",
    overview: [
      "On the occasion of International Women's Day, Professor's Global School collaborated with SEBI (Securities and Exchange Board of India) to organize a special webinar for teachers on March 8, 2025. The session aimed to empower women by equipping them with essential knowledge about financial independence and effective money-saving strategies for the future."
    ],
    objectives: [
      "The importance of financial independence for women in leadership and education.",
      "Smart saving and investment strategies across diverse asset options.",
      "Managing personal finances for long-term security and retirement."
    ],
    highlights: [
      "Inspiring address by Ms. Himani Lath emphasizing financial self-reliance and empowerment.",
      "Detailed breakdown of investment options including mutual funds, fixed deposits, and retirement plans.",
      "Actionable guidelines on budgeting, saving discipline, and risk management.",
      "Interactive Q&A session with active teacher participation regarding investment planning."
    ],
    conclusion: "The webinar successfully imparted valuable financial knowledge to teachers, helping them take significant steps toward achieving financial independence. The initiative was well-received, encouraging educators to be more proactive in planning for their financial futures. Conducted virtually via Zoom, this session marked an important milestone in fostering financial security for women.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
        caption: "SEBI Smart Trainer Ms. Himani Lath addressing the financial webinar"
      },
      {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
        caption: "Faculty members participating in virtual investment planning discussions"
      },
      {
        url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
        caption: "Q&A session on financial security and smart savings"
      }
    ]
  },
  {
    id: "schand",
    title: "Workshop by S. Chand Publications",
    date: "March 29, 2025",
    venue: "Professor's Global School",
    organizedBy: "S. Chand Publications",
    category: "Pedagogy & Curriculum Development",
    categoryColor: "bg-blue-100 text-blue-800 border-blue-300",
    gradient: "from-blue-600 via-indigo-600 to-cyan-600",
    accentBg: "bg-blue-50/80 border-blue-100",
    overview: [
      "On March 29, 2025, a workshop was conducted at Professor's Global School by a renowned publisher to provide valuable insights into the latest editions of English, Mathematics, and Science books. The session was attended by teachers from various departments who actively participated in the discussion.",
      "The workshop aimed to familiarize educators with the updated curriculum, new teaching methodologies, and the enhanced content of the textbooks."
    ],
    highlights: [
      "The alignment of content with the latest CBSE educational standards and framework.",
      "Interactive and engaging activities included in the books to enhance student learning.",
      "Supplementary resources and digital tools available for better teaching outcomes.",
      "Doubt clarification and direct publisher feedback loop regarding textbook materials."
    ],
    conclusion: "Overall, the workshop was highly informative and beneficial for teachers, equipping them with the necessary knowledge to effectively utilize the new textbooks in their classrooms. Such initiatives contribute significantly to improving the quality of education and keeping educators updated with the latest trends in teaching and learning.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
        caption: "Faculty members reviewing S. Chand curriculum enhancements"
      },
      {
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
        caption: "Resource team elaborating on interactive science and math modules"
      },
      {
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
        caption: "Interactive department discussion on digital teaching resources"
      }
    ]
  },
  {
    id: "career-counselling",
    title: "Career Counselling Session for Grade 11 Students and Parents",
    date: "Sunday, March 16, 2025",
    time: "10:00 AM Onwards",
    venue: "Professor's Global School",
    speaker: {
      name: "Ms. Shruti Dahiya",
      role: "Child Counsellor",
      organization: "Professor's Global School",
      bio: "M.Sc in Clinical Psychology; specialist in adolescent guidance, stream mapping, and academic stress reduction."
    },
    organizedBy: "Prof. (Dr.) R.B. Solanki & School Management",
    category: "Career Guidance & Academic Planning",
    categoryColor: "bg-amber-100 text-amber-900 border-amber-300",
    gradient: "from-amber-600 via-orange-600 to-yellow-600",
    accentBg: "bg-amber-50/80 border-amber-100",
    overview: [
      "A comprehensive career counselling session was conducted for Grade 11 students and their parents by Ms. Shruti Dahiya, an esteemed Career Counsellor on 16 March 2025. The session aimed to provide valuable insights into academic and career planning, helping students make informed decisions about their future.",
      "Ms. Dahiya emphasized the importance of early career exploration, guiding students to start thinking about their aspirations and available opportunities. She provided detailed subject selection guidance, ensuring students align their academic choices with their career goals. Additionally, she helped them in identifying their strengths and interests, enabling them to make confident and well-informed decisions.",
      "The session also covered university and career path insights, offering clarity on different educational routes, entrance exams, and global opportunities. Ms. Dahiya highlighted the significance of skill development, encouraging students to cultivate essential competencies beyond academics. Furthermore, she discussed networking opportunities, stressing the value of mentorship, internships, and professional connections in career growth.",
      "Recognizing the stress that students often face, Ms. Dahiya shared strategies for reducing pressure, promoting a balanced approach to academics and career planning. The interactive session allowed students and parents to ask questions, ensuring a deeper understanding of their options."
    ],
    highlights: [
      "Early Career Exploration: Inspiring early vision and goal-setting.",
      "Subject Selection Guidance: Stream choices aligned with career aspirations.",
      "Identifying Strengths & Interests: Aptitude awareness for confident choices.",
      "University & Career Path Insights: Entrance exams, degree routes & global scope.",
      "Skill Development: Fostering soft skills and modern competencies.",
      "Networking & Mentorship: Value of internships and professional connections.",
      "Stress Reduction: Practical strategies for academic pressure management."
    ],
    posterInfo: {
      inviteText: "Prof. (Dr.) R.B. Solanki and Management invite all parents and students to the Career Counselling Workshop for students of Grade 10 followed by an interaction with Management.",
      points: [
        "1. Early Career Exploration",
        "2. Subject Selection Guidance",
        "3. Identifying Strengths and Interests",
        "4. University and Career Path Insights",
        "5. Skill Development",
        "6. Networking Opportunities",
        "7. Reducing Pressure"
      ],
      principal: "Regards Tanya Gupta, Principal"
    },
    conclusion: "The session was highly informative and well-received, equipping students with the knowledge and confidence to make thoughtful career choices. Parents also appreciated the insights, as they play a crucial role in guiding their children. The school looks forward to organizing more such sessions to support students in their academic and professional journeys.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
        caption: "Ms. Shruti Dahiya presenting university path insights to Grade 10 & 11"
      },
      {
        url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
        caption: "Interactive Q&A desk with parents and management team"
      },
      {
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
        caption: "Students reviewing stream selection roadmaps and entrance guides"
      }
    ]
  },
  {
    id: "phonics",
    title: "Phonics Workshop Report",
    date: "21st May 2025",
    occasion: "Summer Camp 2025 – Day One",
    venue: "Professor's Global School",
    speaker: {
      name: "Ms. Moni Tripathi",
      role: "Product Manager & Teacher Trainer",
      organization: "S. Chand Publications",
      bio: "Seasoned educationist with over 15 years of experience in curriculum development and teacher training."
    },
    category: "Foundational Early Education",
    categoryColor: "bg-purple-100 text-purple-900 border-purple-300",
    gradient: "from-purple-600 via-violet-600 to-indigo-600",
    accentBg: "bg-purple-50/80 border-purple-100",
    overview: [
      "As part of the inaugural day of Summer Camp 2025, Professor's Global School successfully organised a Phonics Workshop to enhance early literacy and reading fluency among young learners. The session was conducted by Ms. Moni Tripathi, a seasoned educationist with over 15 years of experience in curriculum development and teacher training."
    ],
    highlights: [
      "The session began with an engaging introduction to phonemic awareness and the importance of phonics in foundational learning.",
      "Ms. Tripathi used interactive methods to explain how sound-letter correspondence helps in building strong reading skills.",
      "Through a blend of storytelling, audio-visual aids, and real-life examples, she demonstrated practical strategies for both parents and students to follow at home.",
      "Activities focused on blending, segmenting, and decoding helped children connect sounds with words.",
      "Special emphasis was placed on parental involvement in supporting phonics-based learning at home."
    ],
    impact: "Students responded enthusiastically to the interactive elements of the workshop. Parents found the session insightful, gaining effective tools to support their children's reading journey. The workshop fostered an environment of shared learning and parent-child bonding.",
    feedback: "Participants appreciated Ms. Tripathi's clear explanations, energy, and deep knowledge of early literacy. Many parents requested follow-up sessions or take-home materials to continue phonics learning beyond the summer camp.",
    conclusion: "The Phonics Workshop was a resounding success, contributing significantly to the literacy goals of the Summer Camp. The session not only empowered students but also equipped parents with valuable strategies to reinforce learning at home. Professor's Global School expresses gratitude to Ms. Moni Tripathi for her expertise and inspiring presence.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
        caption: "Ms. Moni Tripathi demonstrating phonemic sound actions"
      },
      {
        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
        caption: "Young learners engaging in blending and segmenting word games"
      },
      {
        url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
        caption: "Parent-child phonics activity session on Day 1 of Summer Camp"
      }
    ]
  }
];

export const WorkshopPage: React.FC = () => {
  const APPLY_URL = "https://pgs.udtweb.com/online-document/branch-enquiry";
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption: string; title: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredWorkshops = activeTab === "all" 
    ? WORKSHOPS_DATA 
    : WORKSHOPS_DATA.filter(w => w.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 font-sans text-slate-800">
      
      {/* 1. Hero Header */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#00173e] via-[#00276a] to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,147,98,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.25),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-blue-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-orange-400" />
            <span className="text-white font-semibold">Activities & Workshops</span>
          </div>

          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-extrabold uppercase tracking-widest shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Admissions Open 2026–27 • Skill Enrichment</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Workshops & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-pink-300">Learning Seminars</span>
            </h1>

            <p className="text-blue-100 text-base sm:text-lg lg:text-xl leading-relaxed">
              Discover comprehensive reports, resource speaker sessions, and interactive workshops organized at Professor's Global School — covering E-Waste Awareness, Women's Financial Empowerment, S. Chand Pedagogy, Career Guidance, and Phonics Literacy.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#fc9362] text-white font-extrabold text-sm px-7 py-3.5 rounded-full shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Apply Online Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="#workshop-list"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3.5 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300"
              >
                <span>Explore All Sessions</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Quick Filter Tabs */}
      <section className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === "all"
                ? "bg-[#00276a] text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Workshops ({WORKSHOPS_DATA.length})
          </button>
          {WORKSHOPS_DATA.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveTab(w.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
                activeTab === w.id
                  ? "bg-[#00276a] text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {w.id === 'e-waste' && '🌱 E-Waste'}
              {w.id === 'womens-day' && '🌸 Women\'s Day'}
              {w.id === 'schand' && '📚 S. Chand'}
              {w.id === 'career-counselling' && '🎓 Career Guidance'}
              {w.id === 'phonics' && '🔤 Phonics Literacy'}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Main Workshops List */}
      <section id="workshop-list" className="py-12 md:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        
        {filteredWorkshops.map((workshop, idx) => (
          <ScrollReveal key={workshop.id} direction="up" delay={idx * 0.05}>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              
              {/* Colorful Header Banner */}
              <div className={`bg-gradient-to-r ${workshop.gradient} p-6 sm:p-8 text-white relative overflow-hidden`}>
                <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                  <Sparkles className="w-64 h-64" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {workshop.category}
                    </span>

                    {workshop.occasion && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black tracking-wide">
                        {workshop.occasion}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                    {workshop.title}
                  </h2>

                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-semibold text-white/90 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Date: <strong className="text-white">{workshop.date}</strong></span>
                    </div>

                    {workshop.time && (
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Time: <strong className="text-white">{workshop.time}</strong></span>
                      </div>
                    )}

                    {workshop.venue && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Venue: <strong className="text-white">{workshop.venue}</strong></span>
                      </div>
                    )}

                    {workshop.organizedBy && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Organized By: <strong className="text-white">{workshop.organizedBy}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-6 sm:p-8 md:p-10 space-y-8">
                
                {/* Speaker Spotlight Badge if applicable */}
                {workshop.speaker && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-500/10 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-amber-900">
                        Resource Person / Key Speaker
                      </p>
                      <h4 className="text-base sm:text-lg font-black text-slate-900">
                        {workshop.speaker.name} <span className="text-xs font-bold text-slate-600">({workshop.speaker.role})</span>
                      </h4>
                      {workshop.speaker.bio && (
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {workshop.speaker.bio}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Main Detailed Narrative Paragraphs */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#00276a] flex items-center gap-2 border-b border-slate-100 pb-2">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    Detailed Workshop Overview & Context
                  </h3>

                  <div className="space-y-3">
                    {workshop.overview.map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Specific Sections: Objectives / Highlights / Poster Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Objectives / Impact / Feedback */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* Objectives if any */}
                    {workshop.objectives && workshop.objectives.length > 0 && (
                      <div className={`p-5 rounded-2xl border ${workshop.accentBg} space-y-3`}>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <Target className="w-4 h-4 text-indigo-600" />
                          Objectives of the Workshop
                        </h4>
                        <ul className="space-y-2">
                          {workshop.objectives.map((obj, oIdx) => (
                            <li key={oIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-2" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Impact if any */}
                    {workshop.impact && (
                      <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          Workshop Impact
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          {workshop.impact}
                        </p>
                      </div>
                    )}

                    {/* Feedback if any */}
                    {workshop.feedback && (
                      <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200/80 space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                          Participant Feedback & Requests
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          {workshop.feedback}
                        </p>
                      </div>
                    )}

                    {/* Poster Card Rendering for Career Counselling */}
                    {workshop.posterInfo && (
                      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 rounded-2xl text-white shadow-lg space-y-4 border border-white/20 relative overflow-hidden">
                        <div className="flex items-center justify-between border-b border-white/20 pb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                            Official Event Announcement
                          </span>
                          <span className="text-xs font-extrabold">{workshop.posterInfo.principal}</span>
                        </div>

                        <p className="text-xs sm:text-sm font-extrabold leading-snug">
                          "{workshop.posterInfo.inviteText}"
                        </p>

                        <div className="space-y-2 pt-1">
                          <p className="text-xs font-black uppercase tracking-widest text-amber-200">
                            Why Attend? Key Topics Covered:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-white">
                            {workshop.posterInfo.points.map((pt, ptIdx) => (
                              <div key={ptIdx} className="bg-black/20 p-2 rounded-lg border border-white/10">
                                {pt}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right Column: Key Highlights & Modules */}
                  <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#00276a] flex items-center gap-2 border-b border-slate-200 pb-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                      Key Session Highlights & Modules
                    </h4>

                    <div className="space-y-3">
                      {workshop.highlights.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-orange-300 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-2" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Conclusion Banner */}
                {workshop.conclusion && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#00276a] text-white space-y-2 shadow-md">
                    <p className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      Conclusion & Summary Outcome
                    </p>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {workshop.conclusion}
                    </p>
                  </div>
                )}

                {/* Photo Gallery Grid with Modal Lightbox */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Event Media & Photo Highlights
                    </p>
                    <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                      Click image to view full view
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {workshop.images.map((img, imgIdx) => (
                      <div
                        key={imgIdx}
                        onClick={() => img.url && img.url.trim() !== '' && setSelectedImage({ url: img.url.trim(), caption: img.caption, title: workshop.title })}
                        className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group/img cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                      >
                        {img.url && img.url.trim() !== '' ? (
                          <img
                            src={img.url.trim()}
                            alt={img.caption}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <Maximize2 className="w-8 h-8 opacity-40 mb-1" />
                            <span className="text-[10px] font-bold">No Image</span>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                          <div className="self-end p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-extrabold line-clamp-2 drop-shadow-md">
                            {img.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </ScrollReveal>
        ))}

      </section>

      {/* 4. Full-Screen Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-3xl max-w-4xl w-full border border-white/20 shadow-2xl overflow-hidden relative flex flex-col"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                {selectedImage.url && selectedImage.url.trim() !== '' ? (
                  <img
                    src={selectedImage.url.trim()}
                    alt={selectedImage.caption}
                    className="max-h-[70vh] w-auto max-w-full object-contain"
                  />
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-white/50">
                    <Maximize2 className="w-12 h-12 mb-2 opacity-40" />
                    <span className="text-sm font-semibold">Image not available</span>
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-900 text-white space-y-2 border-t border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  {selectedImage.title}
                </span>
                <p className="text-base font-extrabold text-white">
                  {selectedImage.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Bottom Call-To-Action Banner */}
      <section className="py-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-[#00173e] via-[#00276a] to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
            <div className="space-y-3 text-center md:text-left max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-white/10 px-4 py-1.5 rounded-full inline-block border border-white/10">
                Future-Ready Holistic Education
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                Empower Your Academic Journey at PGS
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Connect with our admissions desk to learn more about upcoming interactive workshops, seminars, and CBSE enrollment guidelines.
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
