/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, ArrowUp, Facebook, Twitter, Instagram, Youtube, Award, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="relative bg-primary text-white border-t border-white/10 pt-12 pb-8 md:pt-20 md:pb-12 px-4 sm:px-6 md:px-12 overflow-hidden">
      {/* Decorative subtle background waves */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,147,98,0.06),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12 md:mb-16 relative z-10">
        
        {/* Brand Information Column */}
        <div className="md:col-span-4 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-white border border-white/20 flex items-center justify-center shrink-0">
              <img src="/src/assets/images/school_logo_1784036754445.jpg" alt="Professor Global School Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <div className="text-center sm:text-left">
              <span className="font-extrabold text-xl md:text-2xl tracking-tight block leading-tight">Professor's Global School</span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-on-tertiary-container font-black mt-0.5 block">
                "The School with the Difference"
              </span>
            </div>
          </div>
          
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Empowering children with holistic education, global standards, and neoclassic infrastructural safety to make them global leaders of tomorrow.
          </p>

          <div className="flex gap-3 justify-center md:justify-start">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-on-tertiary-container hover:text-on-tertiary hover:border-on-tertiary-container transition-all duration-300">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-on-tertiary-container hover:text-on-tertiary hover:border-on-tertiary-container transition-all duration-300">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/pgsbaprola_delhi?igsh=eGhhZnRidHVscDhs" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-on-tertiary-container hover:text-on-tertiary hover:border-on-tertiary-container transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-on-tertiary-container hover:text-on-tertiary hover:border-on-tertiary-container transition-all duration-300">
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start w-full">
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium text-white/80">
              <Award className="w-4 h-4 text-on-tertiary-container" />
              Affiliated to CBSE, New Delhi
            </span>
            <a
              href="https://pgs.udtweb.com/online-document/branch-enquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#fc9362] text-white px-4 py-1.5 rounded-full font-extrabold text-xs tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-2 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="font-bold text-sm uppercase tracking-wider text-on-tertiary-container">Quick Links</h4>
          <ul className="space-y-3 flex flex-col items-center md:items-start">
            <li>
              <a href="#home" onClick={(e) => handleLinkClick('home', e)} className="text-white/75 hover:text-white text-xs transition-colors duration-300">
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleLinkClick('about', e)} className="text-white/75 hover:text-white text-xs transition-colors duration-300">
                About School
              </a>
            </li>
            <li>
              <a href="#academics" onClick={(e) => handleLinkClick('academics', e)} className="text-white/75 hover:text-white text-xs transition-colors duration-300">
                Academic Programs
              </a>
            </li>
            <li>
              <a href="#facilities" onClick={(e) => handleLinkClick('facilities', e)} className="text-white/75 hover:text-white text-xs transition-colors duration-300">
                Our Facilities
              </a>
            </li>
            <li>
              <a href="#gallery" onClick={(e) => handleLinkClick('gallery', e)} className="text-white/75 hover:text-white text-xs transition-colors duration-300">
                Campus Gallery
              </a>
            </li>
          </ul>
        </div>

        {/* Co-Curricular Activities Column */}
        <div className="md:col-span-2 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="font-bold text-sm uppercase tracking-wider text-on-tertiary-container">Co-Curricular</h4>
          <ul className="space-y-3 flex flex-col items-center md:items-start">
            <li>
              <Link to="/assembly" className="text-white/75 hover:text-white text-xs transition-colors duration-300">
                Morning Assembly
              </Link>
            </li>
            <li>
              <Link to="/curricular-activities" className="text-white/75 hover:text-white text-xs transition-colors duration-300">
                Curricular Activities
              </Link>
            </li>
            <li>
              <Link to="/house-system" className="text-white/75 hover:text-white text-xs transition-colors duration-300">
                House System
              </Link>
            </li>
            <li>
              <Link to="/workshops" className="text-white/75 hover:text-white text-xs transition-colors duration-300">
                Workshops & Seminars
              </Link>
            </li>
            <li className="pt-1">
              <a
                href="https://pgs.udtweb.com/online-document/branch-enquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-on-tertiary-container hover:text-white text-[11px] font-extrabold uppercase tracking-wider transition-colors"
              >
                <span>Branch Enquiry</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us Column */}
        <div className="md:col-span-3 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="font-bold text-sm uppercase tracking-wider text-on-tertiary-container">Contact Us</h4>
          <ul className="space-y-4 flex flex-col items-center md:items-start w-full">
            <li className="flex flex-col items-center sm:flex-row text-center sm:text-left gap-3 text-sm text-white/75 leading-relaxed">
              <MapPin className="text-on-tertiary-container w-5 h-5 shrink-0" />
              <span>Street Number 5, Bapraula Extension, Jai Vihar, Baprola, New Delhi – 110043</span>
            </li>
            <li className="flex flex-col items-center sm:flex-row text-center sm:text-left gap-3 text-sm text-white/75">
              <Phone className="text-on-tertiary-container w-5 h-5 shrink-0" />
              <div className="flex flex-col items-center sm:items-start">
                <span>+91 11 2233 4455</span>
                <span className="text-white/50 text-xs">+91 98765 43210</span>
              </div>
            </li>
            <li className="flex flex-col items-center sm:flex-row text-center sm:text-left gap-3 text-sm text-white/75">
              <Mail className="text-on-tertiary-container w-5 h-5 shrink-0" />
              <span>info@professorglobalschool.edu.in</span>
            </li>
          </ul>
        </div>

        {/* Live Interactive Map Column */}
        <div className="md:col-span-3 space-y-6 flex flex-col items-center md:items-start text-center md:text-left w-full">
          <h4 className="font-bold text-sm uppercase tracking-wider text-on-tertiary-container">Campus Map</h4>
          <div className="rounded-2xl overflow-hidden h-44 border border-white/10 shadow-lg relative bg-white/5 w-full max-w-sm mx-auto md:max-w-none">
            {/* Embedded functional Google Map */}
            <iframe
              src="https://maps.google.com/maps?q=Professor's+Global+School,+Street+Number+5,+Bapraula+Extension,+Jai+Vihar,+Baprola,+New+Delhi+%E2%80%93+110043&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Professor's Global School Map Location"
              className="grayscale brightness-90 contrast-110 hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

      </div>

      <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 text-center sm:text-left">
        <p className="text-white/50 text-xs font-medium">
          © {new Date().getFullYear()} Professor's Global School. All Rights Reserved. Affiliation No. 1234567.
        </p>
        
        <div className="flex items-center gap-6">
          <Link
            to="/admin"
            className="text-white/40 hover:text-white/80 text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            Staff Portal
          </Link>
          
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-on-tertiary-container text-white/70 hover:text-on-tertiary flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-on-tertiary-container group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
