/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGeneralDropdownOpen, setIsGeneralDropdownOpen] = useState(false);
  const [isMobileGeneralOpen, setIsMobileGeneralOpen] = useState(false);
  const [isActivitiesDropdownOpen, setIsActivitiesDropdownOpen] = useState(false);
  const [isMobileActivitiesOpen, setIsMobileActivitiesOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  // Detect scroll to style navbar dynamically on Home page
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      } else {
        setScrollProgress(0);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close mobile menu on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileGeneralOpen(false);
    setIsMobileActivitiesOpen(false);
    setIsActivitiesDropdownOpen(false);
    setIsGeneralDropdownOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Home', path: '/', isAnchor: true, elementId: 'home' },
    { label: 'About', path: '/', isAnchor: true, elementId: 'about' },
    { label: 'Academics', path: '/', isAnchor: true, elementId: 'academics' },
    { label: 'Facilities', path: '/', isAnchor: true, elementId: 'facilities' },
    { label: 'Campus Life', path: '/', isAnchor: true, elementId: 'gallery' },
    { label: 'Contact', path: '/', isAnchor: true, elementId: 'contact' },
  ];

  const generalMenuItems = [
    { label: 'Public Disclosure', path: '/public-disclosure' },
    { label: 'Important Link', path: '/important-links' },
    { label: 'Newsletter', path: '/newsletter' },
    { label: 'Circulars', path: '#' },
    { label: 'Fee Structure', path: '/public-disclosure' },
    { label: 'Uniform', path: '#' },
    { label: 'School Timing', path: '#' },
    { label: 'List Of Holiday', path: '#' },
  ];

  const activitiesMenuItems = [
    { label: 'Morning Assembly', path: '/assembly' },
    { label: 'Curricular Activities', path: '/curricular-activities' },
    { label: 'House System', path: '/house-system' },
    { label: 'Workshops & Seminars', path: '/workshops' },
  ];

  const executeScroll = (elementId: string, event: React.MouseEvent) => {
    if (location.pathname !== '/') {
      // Allow standard link behavior
      return;
    }
    event.preventDefault();
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 80; // navbar height
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

  const isHomePage = location.pathname === '/';
  const headerBgClass = !isHomePage
    ? 'bg-[#00276a] backdrop-blur-md py-3.5 shadow-lg border-b border-white/10'
    : isScrolled
    ? 'bg-[#00276a]/95 backdrop-blur-md py-3 shadow-xl border-b border-white/10'
    : 'bg-transparent py-5 border-b border-transparent';

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${headerBgClass}`}
      >
        {/* Scroll Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-[3px] bg-on-tertiary-container transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={(e) => executeScroll('home', e)}
            className="flex items-center gap-2.5 md:gap-3 group focus:outline-none max-w-[75%] sm:max-w-md md:max-w-xl lg:max-w-2xl -ml-7 md:-ml-8 pr-1 pt-1"
          >
            <div className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden bg-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img
                src="https://res.cloudinary.com/jyghqytp/image/upload/v1784969854/PGS_Logo_1_1_-fin_xsdzrv.png"
                alt="Professor's Global School Logo"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight tracking-tight text-white font-sans group-hover:text-on-tertiary-container transition-colors whitespace-normal break-words">
                Professor's Global School
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] uppercase tracking-widest text-white/75 font-bold leading-tight truncate">
                "The School with the Difference"
              </span>
              <span className="text-[8.5px] sm:text-[10px] md:text-[11.5px] lg:text-[12.5px] font-medium text-white/90 leading-tight tracking-tight mt-0.5 whitespace-normal md:whitespace-nowrap">
                Co-Educational, English Medium, Affiliated to CBSE (XII)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-5 lg:gap-7 items-center">
            {navLinks.map((link, idx) => (
              <React.Fragment key={idx}>
                <a
                  href={`#${link.elementId}`}
                  onClick={(e) => executeScroll(link.elementId, e)}
                  className="text-white/80 hover:text-on-tertiary-container font-medium text-sm tracking-wide transition-colors duration-300 relative py-2 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-on-tertiary-container transition-all duration-300 group-hover:w-full" />
                </a>

                {/* General Dropdown Menu */}
                {link.label === 'Academics' && (
                  <div
                    className="relative group py-2"
                    onMouseEnter={() => setIsGeneralDropdownOpen(true)}
                    onMouseLeave={() => setIsGeneralDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setIsGeneralDropdownOpen(!isGeneralDropdownOpen)}
                      className="text-white/80 hover:text-on-tertiary-container font-medium text-sm tracking-wide transition-colors duration-300 flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      <span>General</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isGeneralDropdownOpen ? 'rotate-180 text-on-tertiary-container' : ''
                        }`}
                      />
                    </button>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-on-tertiary-container transition-all duration-300 group-hover:w-full" />

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isGeneralDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-slate-900/85 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 border border-white/20 py-2.5 text-white z-50 overflow-hidden"
                        >
                          <div className="flex flex-col space-y-0.5 px-1.5">
                            {generalMenuItems.map((item, subIdx) => 
                              item.path.startsWith('/') ? (
                                <Link
                                  key={subIdx}
                                  to={item.path}
                                  onClick={() => setIsGeneralDropdownOpen(false)}
                                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200 flex items-center justify-between group/item"
                                >
                                  <span>{item.label}</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                </Link>
                              ) : (
                                <a
                                  key={subIdx}
                                  href={item.path}
                                  onClick={(e) => {
                                    if (item.path === '#') {
                                      e.preventDefault();
                                    }
                                    setIsGeneralDropdownOpen(false);
                                  }}
                                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200 flex items-center justify-between group/item"
                                >
                                  <span>{item.label}</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                </a>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Co-Curricular / Activities Dropdown Menu */}
                {link.label === 'Campus Life' && (
                  <div
                    className="relative group py-2"
                    onMouseEnter={() => setIsActivitiesDropdownOpen(true)}
                    onMouseLeave={() => setIsActivitiesDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setIsActivitiesDropdownOpen(!isActivitiesDropdownOpen)}
                      className="text-white/80 hover:text-on-tertiary-container font-medium text-sm tracking-wide transition-colors duration-300 flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      <span>Activities</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isActivitiesDropdownOpen ? 'rotate-180 text-on-tertiary-container' : ''
                        }`}
                      />
                    </button>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-on-tertiary-container transition-all duration-300 group-hover:w-full" />

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isActivitiesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 border border-white/20 py-2.5 text-white z-50 overflow-hidden"
                        >
                          <div className="flex flex-col space-y-0.5 px-1.5">
                            {activitiesMenuItems.map((item, subIdx) => (
                              <Link
                                key={subIdx}
                                to={item.path}
                                onClick={() => setIsActivitiesDropdownOpen(false)}
                                className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200 flex items-center justify-between group/item"
                              >
                                <span>{item.label}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Call-to-action Action Group */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/admin"
              className="text-white/80 hover:text-white font-bold text-xs uppercase tracking-wider py-2 pr-4 pl-[19px] ml-[21px] bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              Portal Login
            </Link>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-on-tertiary-container p-2 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-primary/98 backdrop-blur-xl flex flex-col justify-center px-6"
          >
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(252,147,98,0.08),transparent_40%)]" />

            <div className="space-y-3 text-center max-w-sm mx-auto w-full relative z-10 max-h-[85vh] overflow-y-auto py-6 px-2">
              {navLinks.map((link, idx) => (
                <React.Fragment key={idx}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <a
                      href={`#${link.elementId}`}
                      onClick={(e) => {
                        setIsMobileMenuOpen(false);
                        executeScroll(link.elementId, e);
                      }}
                      className="block text-2xl font-extrabold text-white/90 hover:text-on-tertiary-container py-2 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </motion.div>

                  {link.label === 'Academics' && (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx + 0.5) * 0.04 }}
                      className="w-full"
                    >
                      <button
                        type="button"
                        onClick={() => setIsMobileGeneralOpen(!isMobileGeneralOpen)}
                        className="flex items-center justify-center gap-2 text-2xl font-extrabold text-white/90 hover:text-on-tertiary-container py-2 transition-colors duration-300 mx-auto cursor-pointer focus:outline-none"
                      >
                        <span>General</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isMobileGeneralOpen ? 'rotate-180 text-on-tertiary-container' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isMobileGeneralOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden bg-white/10 rounded-2xl p-2 my-2 border border-white/15 space-y-1 backdrop-blur-md"
                          >
                            {generalMenuItems.map((item, subIdx) => 
                              item.path.startsWith('/') ? (
                                <Link
                                  key={subIdx}
                                  to={item.path}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsMobileGeneralOpen(false);
                                  }}
                                  className="block text-sm font-bold text-white/85 hover:text-on-tertiary-container py-1.5 px-3 rounded-xl hover:bg-white/10 transition-colors text-center"
                                >
                                  {item.label}
                                </Link>
                              ) : (
                                <a
                                  key={subIdx}
                                  href={item.path}
                                  onClick={(e) => {
                                    if (item.path === '#') e.preventDefault();
                                    setIsMobileMenuOpen(false);
                                    setIsMobileGeneralOpen(false);
                                  }}
                                  className="block text-sm font-bold text-white/85 hover:text-on-tertiary-container py-1.5 px-3 rounded-xl hover:bg-white/10 transition-colors text-center"
                                >
                                  {item.label}
                                </a>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {link.label === 'Campus Life' && (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx + 0.5) * 0.04 }}
                      className="w-full"
                    >
                      <button
                        type="button"
                        onClick={() => setIsMobileActivitiesOpen(!isMobileActivitiesOpen)}
                        className="flex items-center justify-center gap-2 text-2xl font-extrabold text-white/90 hover:text-on-tertiary-container py-2 transition-colors duration-300 mx-auto cursor-pointer focus:outline-none"
                      >
                        <span>Activities</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isMobileActivitiesOpen ? 'rotate-180 text-on-tertiary-container' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isMobileActivitiesOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden bg-white/10 rounded-2xl p-2 my-2 border border-white/15 space-y-1 backdrop-blur-md"
                          >
                            {activitiesMenuItems.map((item, subIdx) => (
                              <Link
                                key={subIdx}
                                to={item.path}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setIsMobileActivitiesOpen(false);
                                }}
                                className="block text-sm font-bold text-white/85 hover:text-on-tertiary-container py-1.5 px-3 rounded-xl hover:bg-white/10 transition-colors text-center"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-6 border-t border-white/10 space-y-4"
              >
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-white/60 hover:text-white font-bold text-sm tracking-widest uppercase py-2"
                >
                  Staff Portal Login
                </Link>
                <a
                  href="https://pgs.udtweb.com/online-document/branch-enquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                  className="inline-flex w-full justify-center items-center gap-2 bg-on-tertiary-container text-on-tertiary font-bold text-base py-3.5 px-6 rounded-full shadow-xl"
                >
                  Apply Online Now
                  <ArrowRight className="w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
