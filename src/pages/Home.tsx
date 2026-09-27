/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { ScrollReveal } from '../components/ScrollReveal';
import { Counter } from '../components/Counter';
import { GallerySection } from '../components/GallerySection';
import { motion, AnimatePresence } from 'motion/react';
const chairpersonImg = 'https://res.cloudinary.com/jyghqytp/image/upload/v1784964594/chairperson_j2lmff.jpg';
const principalImg = 'https://res.cloudinary.com/jyghqytp/image/upload/v1784964594/chair_person_cmvx9u.jpg';
import { 
  BookOpen, 
  Tv, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  CheckCircle,
  Star,
  Flame,
  FlameKindling,
  Users,
  Compass,
  Laptop,
  Flame as SportsIcon,
  ChevronLeft,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { GalleryItem, SchoolEvent, Testimonial, FAQItem } from '../types';

// Leadership Data Arrays
const CHAIRPERSON_SLIDES = [
  {
    id: 1,
    role: "Chairperson",
    name: "Prof. (Dr.) Rajbir Solanki",
    qualificationsHeader: "Experience",
    qualifications: [
      "Former Vice-Chancellor, CRSU (Chaudhary Ranbir Singh University)",
      "Former Vice-Chancellor, CDLU (Chaudhary Devi Lal University)",
      "Former Principal, Dr. B.R. Ambedkar College, University of Delhi",
      "Former Director, Maharaja Surajmal Institute, Guru Gobind Singh Indraprastha University (GGSIPU)"
    ],
    quote: "Education is a liberating force fostering mental, physical, social, and psychological growth. Professor's Global School provides a nurturing environment with smart classrooms, personalized attention, and activity-based learning, ensuring holistic child development. Our approach equips students with essential life skills in a safe, friendly, and hygienic atmosphere for stress-free learning.",
    image: chairpersonImg
  },
  {
    id: 2,
    role: "Chairperson",
    name: "Prof. (Dr.) Rajbir Solanki",
    qualificationsHeader: "Experience",
    qualifications: [
      "Former Vice-Chancellor, CRSU (Chaudhary Ranbir Singh University)",
      "Former Vice-Chancellor, CDLU (Chaudhary Devi Lal University)",
      "Former Principal, Dr. B.R. Ambedkar College, University of Delhi",
      "Former Director, Maharaja Surajmal Institute, Guru Gobind Singh Indraprastha University (GGSIPU)"
    ],
    quote: "We believe in empowering students with a global perspective while keeping them deeply rooted in our rich cultural values. Professor Global School is more than just a school; it is a collaborative sanctuary where future innovators, empathetic leaders, and lifelong learners are carefully nurtured.",
    image: chairpersonImg
  }
];

const PRINCIPAL_SLIDES = [
  {
    id: 1,
    role: "Principal",
    name: "Tanya Gupta",
    qualificationsHeader: "Qualifications",
    qualifications: [
      "M.Phil.",
      "M.Ed.",
      "Master's in English (Honours)"
    ],
    quote: "We are devoted to nurturing the intellectual, emotional, social, and ethical development of every student. Our approach centers on fostering strong character and instilling core values, cultivating thoughtful, principled individuals who lead with integrity and compassion.",
    image: principalImg
  },
  {
    id: 2,
    role: "Principal",
    name: "Tanya Gupta",
    qualificationsHeader: "Qualifications",
    qualifications: [
      "M.Phil.",
      "M.Ed.",
      "Master's in English (Honours)"
    ],
    quote: "True education lies in fostering curiosity, adaptability, and resilience. At Professor Global School, we create vibrant learning pathways that inspire students to explore their full potential, appreciate diversity, and embrace collaboration as a key strength.",
    image: principalImg
  }
];

const ADVISORY_BOARD_MEMBERS = [
  {
    id: 1,
    name: "Dr. Ritu Chhikara",
    designation: "Senior Associate Professor - South Asian University (SAARC), New Delhi",
    description: "Dr. Ritu Chhikara is an accomplished academic with extensive experience in higher education, research, and curriculum development. As a Senior Associate Professor at South Asian University (SAARC), New Delhi, she has made significant contributions to academic excellence and interdisciplinary learning.",
    image: "https://res.cloudinary.com/jyghqytp/image/upload/v1784912373/l2_mcaqut.jpg"
  },
  {
    id: 2,
    name: "Mrs. Deepika Solanki",
    designation: "Infrastructure Investment Professional Sydney, Australia",
    description: "Mrs. Deepika Solanki is a distinguished infrastructure investment professional with extensive international experience across the Asia-Pacific region and Australia. She brings strategic expertise in infrastructure investment, project development, and sustainable growth, providing valuable global insights to the Advisory Board.",
    image: "https://res.cloudinary.com/jyghqytp/image/upload/v1784912706/l5_ddfhmk.jpg"
  },
  {
    id: 3,
    name: "Shri Krishna Solanki",
    designation: "EX-PRINCIPAL Delhi Government | RECIPIENT OF THE BEST PRINCIPAL AWARD (2016)",
    description: "Shri Krishna Solanki is a respected educationist and former Principal with decades of experience in school leadership and academic administration. Recognized with the Best Principal Award in 2016, he has been instrumental in promoting excellence in education, discipline, and holistic student development.",
    image: "https://res.cloudinary.com/jyghqytp/image/upload/v1784912704/l6_o8rem2.jpg"
  }
];

// Asset Data Arrays
const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, image: 'https://pgsbaprola.org/images/infra/activity&playarea-1.jpg', title: 'Professor Global School Campus View', category: 'all' },
  { id: 2, image: 'https://pgsbaprola.org/images/infra/activity&playarea-2.jpg', title: 'Annual Cultural Festival', category: 'events' },
  { id: 3, image: 'https://pgsbaprola.org/images/infra/activity&playarea-3.jpg', title: 'Interactive Play Area', category: 'sports' },
  { id: 4, image: 'https://pgsbaprola.org/images/infra/activity&playarea-4.jpg', title: 'Interactive Smart Classroom', category: 'activities' },
  { id: 5, image: 'https://pgsbaprola.org/images/infra/activity&playarea-5.jpg', title: 'Sports wing', category: 'all' },
  { id: 6, image: 'https://pgsbaprola.org/images/infra/MedicalRoom.jpg', title: 'Medical Room', category: 'activities' },
  { id: 7, image: 'https://pgsbaprola.org/images/infra/science-lab.jpg', title: 'Science Laboratory', category: 'events' },
  { id: 8, image: 'https://pgsbaprola.org/images/infra/computer-lab.jpg', title: 'Computer Lab', category: 'sports' },
  { id: 9, video: 'https://pgsbaprola.org/videos/computer-lab.mp4', title: 'School Tour', category: 'sports' },
];

const EVENTS: SchoolEvent[] = [
  {
    id: 1,
    date: '24',
    month: 'JUL',
    title: 'Inter-School Tech Innovation Summit',
    time: '09:00 AM - 03:00 PM',
    location: 'Srinivasa Ramanujan Innovation Hub',
    description: 'Over 15 schools across Delhi NCR compete in sustainable coding, robotics, and futuristic design thinking workshops.',
  },
  {
    id: 2,
    date: '08',
    month: 'AUG',
    title: 'Annual Founders Day & Awards Gala',
    time: '05:00 PM - 08:30 PM',
    location: 'Open-Air Auditorium',
    description: 'A celebration of our 20-year educational legacy, showcasing multi-cultural plays, orchestral orchestras, and academic laurels.',
  },
  {
    id: 3,
    date: '19',
    month: 'AUG',
    title: 'Inter-House Aquatic Championship',
    time: '08:30 AM - 01:00 PM',
    location: 'Olympic Swimming Arena',
    description: 'An elite sports contest across swimming relays, free-styling, and backstroke categories targeting state selections.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Mr. Devendra Gupta',
    role: 'Parent of Shreyas (Grade 10)',
    avatar: '',
    content: 'The academic rigor combined with a wide array of co-curricular activities has helped my son build immense confidence. The school has truly changed his perspective towards learning.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Dr. Priya Rawat',
    role: 'Scientist & Parent of Aisha (Grade 12)',
    avatar: '',
    content: 'The teachers at Professor Global School do not just teach; they mentor. The advanced smart science labs and coding infrastructure prepares students perfectly for high-tier international universities.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Mrs. Shalini Sharma',
    role: 'Parent of Kiara (Grade 2)',
    avatar: '',
    content: 'My daughter has grown incredibly creative and expressive since joining the pre-primary section. The affectionate staff, safety practices, and digital classroom standards are truly world-class.',
    rating: 5,
  },
];

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: 'What is the teacher-student ratio maintained at Professor Global School?',
    answer: 'We maintain an average of 1:15 ratio across all classes. This ensures that every child receives highly personalized guidance, support, and developmental focus from our elite educators.',
  },
  {
    id: 2,
    question: 'Is Professor’s Global School affiliated with any specific board?',
    answer: 'Yes, Professor Global School is fully affiliated with the Central Board of Secondary Education (CBSE), New Delhi, following NCERT guidelines. We integrate a global, inquiry-based curriculum style.',
  },
  {
    id: 3,
    question: 'What premium sports and physical infrastructures are available?',
    answer: 'Our campus boasts a semi-Olympic sized heated swimming pool, synthetic tennis and basketball courts, professional turf football arenas, indoor air-conditioned visual gymnastics studios, and dedicated yoga rooms.',
  },
  {
    id: 4,
    question: 'How do parent-teacher associations operate?',
    answer: 'We utilize a highly advanced online parent portal for real-time tracking of grades, transport status, and safety alerts, supplemented by monthly interactive parent-educator meets.',
  },
];

export const Home: React.FC = () => {
  // Gallery Filters & Lightbox State
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'events' | 'sports' | 'activities'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Leadership Carousel States
  const [chairpersonIdx, setChairpersonIdx] = useState(0);
  const [principalIdx, setPrincipalIdx] = useState(0);

  const nextChairperson = () => {
    setChairpersonIdx((prev) => (prev === CHAIRPERSON_SLIDES.length - 1 ? 0 : prev + 1));
  };
  const prevChairperson = () => {
    setChairpersonIdx((prev) => (prev === 0 ? CHAIRPERSON_SLIDES.length - 1 : prev - 1));
  };

  const nextPrincipal = () => {
    setPrincipalIdx((prev) => (prev === PRINCIPAL_SLIDES.length - 1 ? 0 : prev + 1));
  };
  const prevPrincipal = () => {
    setPrincipalIdx((prev) => (prev === 0 ? PRINCIPAL_SLIDES.length - 1 : prev - 1));
  };

  // Testimonials Carousel State
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Filter Gallery Items
  const filteredGallery = GALLERY_ITEMS.filter(
    (item) => galleryFilter === 'all' || item.category === galleryFilter
  );

  // Accordion Toggle
  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  // Testimonial Navigation
  const nextTestimonial = () => {
    setTestimonialIdx((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };
  const prevTestimonial = () => {
    setTestimonialIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  return (
    <main className="overflow-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. About Section */}
      <section id="about" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-blue-50/60 to-indigo-50/40 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        {/* Soft background decorative glow blobs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* About Narrative & Counters */}
          <div className="space-y-6 text-center">
            <ScrollReveal direction="up" duration={0.8}>
              <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 px-5 py-2 rounded-full inline-block shadow-md">
                Our Educational Legacy
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary leading-tight font-sans tracking-tight mt-4">
                Two Decades of Nurturing Exceptional Leaders
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#eab308] rounded-full mx-auto mt-2" />
              
              <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed pt-4 max-w-3xl mx-auto text-center font-medium">
                At Professor's Global School, we believe that elite education goes far beyond textbooks. For over 20 years, we have provided an inspiring sanctuary in New Delhi where traditional Indian values merge seamlessly with global digital innovations.
              </p>
              
              <p className="text-on-surface-variant/90 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto text-center">
                Our neoclassical-style high-end campus is a vibrant ecosystem where children develop curiosity, safety consciousness, analytical clarity, and strong leadership roots to excel at Ivy League standards.
              </p>

              {/* Dynamic Counters Container */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 mt-8 border-t border-blue-100 max-w-3xl mx-auto">
                <div className="space-y-1.5 text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-t-4 border-blue-600 shadow-md hover:shadow-lg transition-all duration-300">
                  <span className="text-3xl md:text-4xl font-extrabold text-blue-950 block">
                    <Counter value={20} suffix="+" />
                  </span>
                  <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider block">Years Legacy</span>
                </div>
                <div className="space-y-1.5 text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-t-4 border-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
                  <span className="text-3xl md:text-4xl font-extrabold text-teal-950 block">
                    <Counter value={1200} suffix="+" />
                  </span>
                  <span className="text-[11px] font-extrabold text-teal-600 uppercase tracking-wider block">Elite Students</span>
                </div>
                <div className="space-y-1.5 text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-t-4 border-orange-500 shadow-md hover:shadow-lg transition-all duration-300">
                  <span className="text-3xl md:text-4xl font-extrabold text-orange-950 block">
                    <Counter value={85} suffix="+" />
                  </span>
                  <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider block">Ph.D & PG Staff</span>
                </div>
                <div className="space-y-1.5 text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-t-4 border-emerald-500 shadow-md hover:shadow-lg transition-all duration-300">
                  <span className="text-3xl md:text-4xl font-extrabold text-emerald-950 block">
                    <Counter value={100} suffix="%" />
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider block">Safety Verified</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* 3. Why Choose Us (Bento Grid) */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-sky-50/50 to-emerald-50/30 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        {/* Decorative soft blobs */}
        <div className="absolute top-1/4 -left-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <ScrollReveal direction="up">
              <span className="text-blue-900 font-extrabold text-xs tracking-widest uppercase bg-blue-100 border border-blue-200 px-4.5 py-1.5 rounded-full inline-block shadow-sm">
                Pillars of Excellence
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight mt-2">
                The Professor Global School Academic Advantage
              </h2>
              <p className="text-secondary text-sm sm:text-base font-medium">
                Discover why parents select Professor Global School for a comprehensive, safety-focused, and premium global educational trajectory.
              </p>
            </ScrollReveal>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1 */}
            <ScrollReveal direction="up" delay={0.05}>
              <div className="bg-white p-8 rounded-2xl border border-blue-100 border-t-4 border-t-blue-600 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">Distinguished Pedagogy</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Our teaching staff comprises international educators and syllabus developers dedicated to student-focused growth.
                </p>
              </div>
            </ScrollReveal>

            {/* Box 2 */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="bg-white p-8 rounded-2xl border border-teal-100 border-t-4 border-t-teal-500 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform mb-6">
                  <Tv className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">Interactive Classrooms</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Equipped with modern visual projectors, electronic boards, and advanced air-conditioning arrays for optimum learning.
                </p>
              </div>
            </ScrollReveal>

            {/* Box 3 */}
            <ScrollReveal direction="up" delay={0.15}>
              <div className="bg-white p-8 rounded-2xl border border-emerald-100 border-t-4 border-t-emerald-500 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">Advanced 24/7 Safety</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Monitored securely via high-definition camera grids, digital entry gates, and female-escorted GPS bus routes.
                </p>
              </div>
            </ScrollReveal>

            {/* Box 4 */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="bg-white p-8 rounded-2xl border border-purple-100 border-t-4 border-t-purple-500 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">Holistic Personality Curve</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Fusing mental math and standard coding with theatre, debates, creative arts, and spiritual mindfulness practices.
                </p>
              </div>
            </ScrollReveal>

            {/* Box 5 */}
            <ScrollReveal direction="up" delay={0.25}>
              <div className="bg-white p-8 rounded-2xl border border-amber-100 border-t-4 border-t-orange-500 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform mb-6">
                  <SportsIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">Premium Sports Arenas</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Enjoy heated Olympic swimming channels, professional synthetic tracks, lawn tennis zones, and indoor visual studios.
                </p>
              </div>
            </ScrollReveal>

            {/* Box 6 */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="bg-white p-8 rounded-2xl border border-cyan-100 border-t-4 border-t-cyan-500 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform mb-6">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">AI Innovation and research centre</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Empowering primary and senior secondary cohorts with coding literacy, electronics kits, and machine-learning platforms.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* 4. Our Leaders Section */}
      <section id="leaders" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-indigo-50/50 to-amber-50/30 border-y border-blue-100 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        {/* Soft background glow shapes */}
        <div className="absolute -top-10 left-1/3 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-96 h-96 bg-orange-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Header Section */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <ScrollReveal direction="down">
              <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-blue-600 to-indigo-600 px-4.5 py-1.5 rounded-full inline-block shadow-md mb-2">
                Visionary Leadership
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-[#0D2447] tracking-tight font-sans">
                Our Leaders
              </h2>
              
              {/* Divider lines with graduation cap */}
              <div className="flex items-center justify-center gap-4 my-3">
                <div className="h-[2.5px] w-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full" />
                <GraduationCap className="w-6 h-6 text-[#FC9362]" />
                <div className="h-[2.5px] w-16 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full" />
              </div>
              
              <p className="text-secondary text-sm sm:text-base font-medium">
                Guided by visionaries who inspire excellence and uphold the highest standards of global education.
              </p>
            </ScrollReveal>
          </div>

          {/* Cards Stack */}
          <div className="space-y-8 max-w-6xl mx-auto">
            
            {/* Card 1: Chairperson */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="bg-white/95 backdrop-blur-md rounded-[28px] border border-blue-100 shadow-xl hover:shadow-2xl overflow-hidden p-6 sm:p-8 md:p-10 relative flex flex-col md:flex-row items-center gap-6 md:gap-12 border-t-[6px] border-[#0D2447] transition-all duration-300">
                
                {/* Left arrow */}
                <button 
                  onClick={prevChairperson}
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0D2447] text-white flex items-center justify-center hover:bg-[#FC9362] active:scale-90 transition-all z-20 shadow-md cursor-pointer"
                  aria-label="Previous quote"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Left side circular photo */}
                <div className="relative shrink-0 mx-auto md:ml-6 md:mr-2 z-10">
                  <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-[#FC9362] p-1 bg-white shadow-xl">
                    <img 
                      src={CHAIRPERSON_SLIDES[chairpersonIdx].image} 
                      alt={CHAIRPERSON_SLIDES[chairpersonIdx].name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>

                {/* Right side content */}
                <div className="flex-1 min-w-0 px-6 md:px-0 text-center md:text-left space-y-4 md:mr-8">
                  <div className="min-h-[140px] md:min-h-[120px] flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={chairpersonIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-on-surface-variant text-sm sm:text-base leading-relaxed font-sans font-medium"
                      >
                        {CHAIRPERSON_SLIDES[chairpersonIdx].quote}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0D2447] font-sans tracking-tight">
                      {CHAIRPERSON_SLIDES[chairpersonIdx].name}
                    </h3>
                    <p className="text-orange-600 font-bold text-xs sm:text-sm uppercase tracking-wider font-sans">
                      {CHAIRPERSON_SLIDES[chairpersonIdx].role}
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto md:mx-0 mt-2 rounded-full" />
                  </div>

                  {/* Qualifications & Experience */}
                  <div className="pt-3 border-t border-slate-100 text-left space-y-2">
                    <p className="text-xs font-bold text-[#0D2447] uppercase tracking-wider flex items-center gap-1.5 justify-center md:justify-start">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span>{CHAIRPERSON_SLIDES[chairpersonIdx].qualificationsHeader}:</span>
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                      {CHAIRPERSON_SLIDES[chairpersonIdx].qualifications.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-gradient-to-r from-blue-50/80 to-slate-50 p-2.5 rounded-xl border border-blue-100/60 shadow-sm">
                          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span className="leading-snug text-[#0D2447]/90 font-semibold">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right arrow */}
                <button 
                  onClick={nextChairperson}
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0D2447] text-white flex items-center justify-center hover:bg-[#FC9362] active:scale-90 transition-all z-20 shadow-md cursor-pointer"
                  aria-label="Next quote"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

              </div>
            </ScrollReveal>

            {/* Card 2: Our Principal */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="bg-white/95 backdrop-blur-md rounded-[28px] border border-teal-100 shadow-xl hover:shadow-2xl overflow-hidden p-6 sm:p-8 md:p-10 relative flex flex-col md:flex-row items-center gap-6 md:gap-12 border-t-[6px] border-[#0D2447] transition-all duration-300">
                
                {/* Left arrow */}
                <button 
                  onClick={prevPrincipal}
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0D2447] text-white flex items-center justify-center hover:bg-[#FC9362] active:scale-90 transition-all z-20 shadow-md cursor-pointer"
                  aria-label="Previous quote"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Left side circular photo */}
                <div className="relative shrink-0 mx-auto md:ml-6 md:mr-2 z-10">
                  <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-[#FC9362] p-1 bg-white shadow-xl">
                    <img 
                      src={PRINCIPAL_SLIDES[principalIdx].image} 
                      alt={PRINCIPAL_SLIDES[principalIdx].name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>

                {/* Right side content */}
                <div className="flex-1 min-w-0 px-6 md:px-0 text-center md:text-left space-y-4 md:mr-8">
                  <div className="min-h-[140px] md:min-h-[120px] flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={principalIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-on-surface-variant text-sm sm:text-base leading-relaxed font-sans font-medium"
                      >
                        {PRINCIPAL_SLIDES[principalIdx].quote}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0D2447] font-sans tracking-tight">
                      {PRINCIPAL_SLIDES[principalIdx].name}
                    </h3>
                    <p className="text-orange-600 font-bold text-xs sm:text-sm uppercase tracking-wider font-sans">
                      {PRINCIPAL_SLIDES[principalIdx].role}
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto md:mx-0 mt-2 rounded-full" />
                  </div>

                  {/* Qualifications */}
                  <div className="pt-3 border-t border-slate-100 text-left space-y-2">
                    <p className="text-xs font-bold text-[#0D2447] uppercase tracking-wider flex items-center gap-1.5 justify-center md:justify-start">
                      <GraduationCap className="w-4 h-4 text-orange-500" />
                      <span>{PRINCIPAL_SLIDES[principalIdx].qualificationsHeader}:</span>
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs font-medium justify-center md:justify-start">
                      {PRINCIPAL_SLIDES[principalIdx].qualifications.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/60 text-teal-950 font-bold shadow-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right arrow */}
                <button 
                  onClick={nextPrincipal}
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0D2447] text-white flex items-center justify-center hover:bg-[#FC9362] active:scale-90 transition-all z-20 shadow-md cursor-pointer"
                  aria-label="Next quote"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* 4b. Leaders of Advisory Board Section */}
      <section id="advisory-board" className="py-16 md:py-24 bg-gradient-to-b from-white via-sky-50/40 to-indigo-50/20 border-b border-blue-100 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Header Section */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <ScrollReveal direction="down">
              <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-orange-500 to-amber-500 px-4.5 py-1.5 rounded-full inline-block shadow-md mb-2">
                Expert Guidance
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0D2447] tracking-tight font-sans">
                Leaders of Advisory Board
              </h2>
              
              {/* Divider lines with graduation cap */}
              <div className="flex items-center justify-center gap-4 my-3">
                <div className="h-[2.5px] w-16 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full" />
                <GraduationCap className="w-6 h-6 text-[#FC9362]" />
                <div className="h-[2.5px] w-16 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full" />
              </div>
              
              <p className="text-secondary text-sm sm:text-base font-medium">
                Distinguished educators and strategic thinkers guiding our academic standards and institutional vision.
              </p>
            </ScrollReveal>
          </div>

          {/* Cards Grid: 3-cols desktop, 2-cols tablet, 1-col mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {ADVISORY_BOARD_MEMBERS.map((member, index) => (
              <ScrollReveal key={member.id} direction="up" delay={index * 0.15}>
                <div className="bg-white rounded-[24px] border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full group border-t-[5px] border-[#0D2447] hover:border-orange-500">
                  
                  {/* Large Portrait Image Container with Hover Effect */}
                  <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Hover Dark Overlay & Centered Name */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-6 text-center z-10 backdrop-blur-[1px]">
                      <span className="text-white font-extrabold text-xl sm:text-2xl tracking-tight translate-y-2 group-hover:translate-y-0 transition-all duration-300 drop-shadow-md">
                        {member.name}
                      </span>
                    </div>
                  </div>

                  {/* Permanent Details Below Image */}
                  <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <h3 className="text-xl font-bold text-[#0D2447] font-sans tracking-tight">
                        {member.name}
                      </h3>
                      <p className="text-orange-600 font-bold text-xs sm:text-sm uppercase tracking-wider mt-1">
                        {member.designation}
                      </p>
                      <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-500 my-3 rounded-full" />
                      <p className="text-secondary text-sm leading-relaxed font-sans">
                        {member.description}
                      </p>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 5. World Class Facilities Section */}
      <section id="facilities" className="py-16 md:py-24 bg-gradient-to-br from-[#00276a] via-[#0d3480] to-[#081838] text-white px-4 sm:px-6 md:px-12 relative overflow-hidden">
        {/* Soft colorful ambient glow effects */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4 max-w-2xl">
              <ScrollReveal direction="right">
                <span className="text-on-tertiary-container font-black text-xs tracking-widest uppercase bg-on-tertiary-container/15 px-4.5 py-1.5 rounded-full inline-block">
                  Campus Facilities
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-2">
                  World-Class Campus Infrastructure
                </h2>
                <p className="text-white/80 text-sm sm:text-base">
                  We supply children with physical arenas that challenge, inspire, and keep them active under premium surveillance.
                </p>
              </ScrollReveal>
            </div>
            
            <ScrollReveal direction="left">
              <a 
                href="#contact" 
                className="inline-flex items-center gap-1.5 text-on-tertiary-container font-bold border-b-2 border-on-tertiary-container/30 pb-1 hover:border-on-tertiary-container transition-all"
              >
                Request a Campus Tour
                <ChevronRight className="w-4.5 h-4.5" />
              </a>
            </ScrollReveal>
          </div>

          {/* Facilities Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Library Card */}
            <ScrollReveal direction="up" delay={0.05}>
              <div className="relative h-[380px] rounded-3xl overflow-hidden group shadow-2xl border border-white/15">
                <img 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110" 
                  alt="Modern school reading library with expansive windows" 
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00276a] via-[#00276a]/40 to-transparent transition-opacity group-hover:opacity-90" />
                
                <div className="absolute bottom-8 left-8 right-8 space-y-2">
                  <span className="text-[11px] uppercase tracking-widest font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1.5 rounded-full inline-block shadow-md">
                    Resource Center
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">Neoclassical Global Library</h3>
                  <p className="text-white/85 text-xs sm:text-sm max-w-sm font-normal leading-relaxed">
                    Housing over 50,000 physical volumes, interactive study hubs, and high-speed portals to standard e-journals.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Science Lab Card */}
            <ScrollReveal direction="up" delay={0.15}>
              <div className="relative h-[380px] rounded-3xl overflow-hidden group shadow-2xl border border-white/15">
                <img 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110" 
                  alt="Advanced science laboratory with advanced digital microscopes" 
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00276a] via-[#00276a]/40 to-transparent transition-opacity group-hover:opacity-90" />
                
                <div className="absolute bottom-8 left-8 right-8 space-y-2">
                  <span className="text-[11px] uppercase tracking-widest font-black text-white bg-gradient-to-r from-teal-500 to-emerald-500 px-3.5 py-1.5 rounded-full inline-block shadow-md">
                    Research & STEM
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">Advanced Science Laboratories</h3>
                  <p className="text-white/85 text-xs sm:text-sm max-w-sm font-normal leading-relaxed">
                    Fitted with modern chemical analysis panels, computerized microscopes, and high-safety ventilation chambers.
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* 6. Academic Programs Section */}
      <section id="academics" className="py-16 md:py-24 bg-gradient-to-br from-blue-50/60 via-purple-50/30 to-amber-50/40 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        {/* Soft decorative background shapes */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <ScrollReveal direction="up">
              <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-2 rounded-full inline-block shadow-md">
                Our Curricula
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight mt-2">
                Premium Academic Divisions
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base font-medium">
                Explore our comprehensive divisions tailored to support the cognitive and visual growth curves of every student cohort.
              </p>
            </ScrollReveal>
          </div>

          {/* Academic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Division 1 */}
            <ScrollReveal direction="up" delay={0.05}>
              <div className="bg-white rounded-3xl overflow-hidden border border-orange-100 border-t-4 border-t-orange-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Pre Primary classroom learning session" 
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                    Ages 3 - 5
                  </div>
                </div>
                <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-primary">Pre-Primary Academy</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      A nurturing play-way framework combining visual phonics, motor skills, interactive toys, and music to foster safe creative expression.
                    </p>
                  </div>
                  <a href="#contact" className="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-bold text-sm hover:gap-2.5 transition-all pt-2">
                    Learn curriculum details
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Division 2 */}
            <ScrollReveal direction="up" delay={0.15}>
              <div className="bg-white rounded-3xl overflow-hidden border border-teal-100 border-t-4 border-t-teal-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Primary kids experimenting with tablets" 
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                    Ages 6 - 11
                  </div>
                </div>
                <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-primary">Primary & Middle School</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Laying strong milestones in advanced science, arithmetic, multiple languages, computing literacy, and team athletic values.
                    </p>
                  </div>
                  <a href="#contact" className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-bold text-sm hover:gap-2.5 transition-all pt-2">
                    Learn curriculum details
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Division 3 */}
            <ScrollReveal direction="up" delay={0.25}>
              <div className="bg-white rounded-3xl overflow-hidden border border-blue-100 border-t-4 border-t-blue-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Senior secondary classroom lecture" 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                    Ages 12 - 18
                  </div>
                </div>
                <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-primary">Secondary & Sr. Secondary</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Targeted preparation across Science, Commerce, and Humanities streams, incorporating mock boards, programming certifications, and career prep.
                    </p>
                  </div>
                  <a href="#contact" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-sm hover:gap-2.5 transition-all pt-2">
                    Learn curriculum details
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* 7. Achievements section (Visual Banner) */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-[#00276a] via-[#123d8f] to-[#1e3a8a] text-white px-4 sm:px-6 md:px-12 relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(252,147,98,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <ScrollReveal direction="up" delay={0.05}>
            <div className="space-y-2 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 hover:border-amber-400/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
              <h3 className="text-4xl md:text-5xl font-black text-amber-300 font-mono">
                <Counter value={98} suffix="%" />
              </h3>
              <p className="font-bold text-xs uppercase tracking-widest text-white/95">Distinction Rate</p>
              <p className="text-white/75 text-[11px]">Average CBSE Board scores exceed 88% annually.</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.15}>
            <div className="space-y-2 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 hover:border-amber-400/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
              <h3 className="text-4xl md:text-5xl font-black text-amber-300 font-mono">
                <Counter value={45} suffix="+" />
              </h3>
              <p className="font-bold text-xs uppercase tracking-widest text-white/95">Sports Trophies</p>
              <p className="text-white/75 text-[11px]">Awards across state relays, lawn tennis, and swimming.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.25}>
            <div className="space-y-2 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 hover:border-amber-400/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
              <h3 className="text-4xl md:text-5xl font-black text-amber-300 font-mono">
                <Counter value={100} suffix="%" />
              </h3>
              <p className="font-bold text-xs uppercase tracking-widest text-white/95">Digital Smartness</p>
              <p className="text-white/75 text-[11px]">All classrooms fitted with dynamic projector systems.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.35}>
            <div className="space-y-2 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 hover:border-amber-400/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
              <h3 className="text-4xl md:text-5xl font-black text-amber-300 font-mono">
                <Counter value={12} suffix="+" />
              </h3>
              <p className="font-bold text-xs uppercase tracking-widest text-white/95">Global Tie-Ups</p>
              <p className="text-white/75 text-[11px]">Student exchange programs with elite overseas institutions.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. Compact Campus Gallery Section */}
      <GallerySection />

      {/* 10. Testimonials Section (Carousel Slider) */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-slate-50 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-3">
            <ScrollReveal direction="up">
              <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-5 py-2 rounded-full inline-block shadow-md">
                Parent Feedback
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight mt-2">
                Trusted by Exceptional Parents
              </h2>
            </ScrollReveal>
          </div>

          {/* Testimonial Active Slider Card */}
          <ScrollReveal direction="up">
            <div className="bg-white/95 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-amber-200/60 shadow-xl relative overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 absolute top-0 left-0 w-full" />
              <div className="absolute top-6 right-8 text-6xl font-serif text-amber-500/15 pointer-events-none select-none">
                “
              </div>

              <div className="space-y-6">
                {/* Rating stars */}
                <div className="flex gap-1">
                  {[...Array(TESTIMONIALS[testimonialIdx].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-primary font-medium text-lg sm:text-xl leading-relaxed italic">
                  "{TESTIMONIALS[testimonialIdx].content}"
                </p>

                {/* Parent Profile */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  {TESTIMONIALS[testimonialIdx].avatar && TESTIMONIALS[testimonialIdx].avatar.trim() !== '' ? (
                    <img 
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-400 p-0.5 shadow-md" 
                      alt={TESTIMONIALS[testimonialIdx].name} 
                      src={TESTIMONIALS[testimonialIdx].avatar.trim()}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#0D2447] text-white font-extrabold text-sm flex items-center justify-center border-2 border-orange-400 shadow-md shrink-0">
                      {TESTIMONIALS[testimonialIdx].name
                        .split(' ')
                        .filter((p) => !p.startsWith('Mr.') && !p.startsWith('Mrs.') && !p.startsWith('Dr.'))
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('') || 'PG'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-primary text-base">{TESTIMONIALS[testimonialIdx].name}</h4>
                    <p className="text-orange-600 text-xs font-bold uppercase tracking-wider">{TESTIMONIALS[testimonialIdx].role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-white hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-all shadow-md border border-slate-200 active:scale-95 cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestimonialIdx(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === testimonialIdx ? 'w-8 bg-orange-500' : 'w-2.5 bg-slate-200 hover:bg-orange-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-white hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-all shadow-md border border-slate-200 active:scale-95 cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 11. FAQ Accordion Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-sky-50/50 via-indigo-50/40 to-slate-50 px-4 sm:px-6 md:px-12 border-y border-blue-100 relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-16 relative z-10">
          
          <div className="text-center space-y-3">
            <ScrollReveal direction="up">
              <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 rounded-full inline-block shadow-md">
                Common Inquiries
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight mt-2">
                Frequently Answered Queries
              </h2>
              <p className="text-on-surface-variant text-sm font-medium">
                Find clear guidance on core administrative protocols and scholastic norms.
              </p>
            </ScrollReveal>
          </div>

          {/* Accordion container */}
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <ScrollReveal key={faq.id} direction="up" delay={idx * 0.05}>
                  <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'border-blue-500 shadow-md ring-2 ring-blue-500/10' : 'border-blue-100 hover:border-blue-300 shadow-sm'
                  }`}>
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-6 flex justify-between items-center gap-4 text-primary hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="font-bold text-base sm:text-lg leading-tight tracking-tight">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronDown className="w-5 h-5 shrink-0 rotate-180 transition-transform text-orange-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 shrink-0 transition-transform text-secondary/60" />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-6 text-on-surface-variant text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* 12. Admission CTA Section (Banner) */}
      <section className="py-12 md:py-20 bg-white px-4 sm:px-6 md:px-12 text-center">
        <ScrollReveal direction="up">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#00276a] via-[#123d8f] to-[#1e1b4b] p-8 sm:p-14 md:p-20 rounded-3xl text-white relative overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none translate-x-12 -translate-y-12">
              <BookOpen className="w-[300px] h-[300px]" />
            </div>
            
            <div className="space-y-6 relative z-10 max-w-2xl mx-auto">
              <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-[#fc9362] to-[#ea580c] px-4.5 py-1.5 rounded-full inline-block shadow-md">
                Admissions Open 2026-27
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Secure Your Child’s Seat For 2026-27!
              </h2>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                Registrations are filling up rapidly for pre-primary, middle, and senior secondary streams. Connect with our admission counselor today.
              </p>
              
              <div className="pt-4">
                <a
                  href="https://pgs.udtweb.com/online-document/branch-enquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#fc9362] text-white font-extrabold text-base px-10 py-4.5 rounded-full hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/30 transition-all duration-300"
                >
                  Initiate Admission Enquiry
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 13. Contact & Online Enquiry Section */}
      <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/40 px-4 sm:px-6 md:px-12 relative border-t border-blue-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Quick contact values */}
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal direction="right">
              <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2 rounded-full inline-block shadow-md">
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight mt-3">
                Connect with the Registrar's Office
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                Have questions regarding fees, bus routes, sports eligibility, or CBSE board compliance? Contact our admissions desk or complete our official online enquiry form.
              </p>
              
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shrink-0">
                    <MapPin className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-primary text-sm">School Address</h4>
                    <p className="text-secondary text-sm">Street Number 5, Bapraula Extension, Jai Vihar, Baprola, New Delhi – 110043</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shrink-0">
                    <Phone className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-primary text-sm">Call Center</h4>
                    <p className="text-secondary text-sm">+91 11 2233 4455 / +91 98765 43210</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shrink-0">
                    <Mail className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-primary text-sm">Email Admissions</h4>
                    <p className="text-secondary text-sm">info@professorglobalschool.edu.in</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* External Enquiry Banner Card */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 md:p-12 rounded-3xl border border-blue-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-blue-600 via-teal-500 to-orange-500 absolute top-0 left-0 w-full" />
            <ScrollReveal direction="left">
              <div className="space-y-6 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Official Branch Portal</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-primary tracking-tight leading-tight">
                  Online Branch & Admission Enquiry
                </h3>

                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                  Submit your admission queries, prospectus requests, or fee details directly on our official branch portal. Click below to open the enquiry form in a new window.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-primary">Instant Document Upload</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-primary">Direct Counselor Review</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href="https://pgs.udtweb.com/online-document/branch-enquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#fc9362] text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 group/btn"
                  >
                    <span>Apply Online Now</span>
                    <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>

                  <span className="text-xs text-secondary font-medium text-center sm:text-left">
                    Opens external branch enquiry form
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* 14. Interactive Campus Location & Google Map Section */}
      <section id="map" className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-indigo-50/30 px-4 sm:px-6 md:px-12 relative border-t border-blue-100">
        <div className="max-w-6xl mx-auto space-y-8">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 rounded-full inline-block shadow-md">
                Interactive Location Map
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                Find Professor's Global School
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed font-medium">
                Street Number 5, Bapraula Extension, Jai Vihar, Baprola, New Delhi – 110043
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.15}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-100 bg-slate-100">
              {/* Responsive Iframe Container */}
              <div className="w-full h-[380px] sm:h-[450px] lg:h-[500px] relative">
                <iframe
                  src="https://maps.google.com/maps?q=Professor's+Global+School,+Street+Number+5,+Bapraula+Extension,+Jai+Vihar,+Baprola,+New+Delhi+%E2%80%93+110043&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Professor's Global School Google Map"
                  className="w-full h-full rounded-3xl"
                />
              </div>

              {/* Floating Address Overlay Card */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-xl max-w-xs sm:max-w-sm hidden sm:block">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-left">
                    <h4 className="font-extrabold text-primary text-sm leading-tight">
                      Professor's Global School
                    </h4>
                    <p className="text-secondary text-xs leading-relaxed">
                      Street Number 5, Bapraula Extension, Jai Vihar, Baprola, New Delhi – 110043
                    </p>
                    <a
                      href="https://www.google.com/maps/place/Professor's+Global+School,+Jai+Vihar,+Baprola,+New+Delhi-110043/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-orange-600 font-bold text-xs hover:underline pt-1"
                    >
                      <span>Open Directions on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};
