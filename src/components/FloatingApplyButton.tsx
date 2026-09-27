/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export const FloatingApplyButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Optional subtle scroll behavior: ensure it's always visible or smoothly rendered
  useEffect(() => {
    const handleScroll = () => {
      // Keep visible at all times
      setIsVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-[20px] right-[20px] z-50 flex items-center group select-none">
          {/* Outer Ambient Glow Effect */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-red-600 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse" />

          {/* Floating Action Button */}
          <motion.a
            href="https://pgs.udtweb.com/online-document/branch-enquiry"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative flex items-center gap-2.5 bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:via-[#f97316] hover:to-[#fc9362] text-white px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full font-extrabold text-xs sm:text-sm md:text-base tracking-wide shadow-[0_10px_25px_-3px_rgba(249,115,22,0.5)] hover:shadow-[0_20px_35px_-5px_rgba(249,115,22,0.75)] border border-white/30 transition-all duration-300 backdrop-blur-md cursor-pointer"
            aria-label="Apply Online Now"
          >
            {/* Admissions Open Pulse Badge */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>

            {/* Icon */}
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-300 group-hover:rotate-12" />

            {/* Button Label */}
            <span className="font-extrabold whitespace-nowrap drop-shadow-sm">
              Apply Now
            </span>

            {/* Subtle Sparkle / Arrow Icon */}
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300" />
            </motion.div>
          </motion.a>
        </div>
      )}
    </AnimatePresence>
  );
};
