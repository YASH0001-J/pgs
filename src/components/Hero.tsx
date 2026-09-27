/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { CarouselSlide } from '../types';

const HERO_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/jyghqytp/image/upload/v1784909652/25_iy7fmf.jpg',
    heading: 'Inspiring Minds, Shaping Character, Building Leaders',
    subtitle: 'Professor Global School provides a transformative learning journey rooted in values and fueled by innovation.',
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/jyghqytp/image/upload/v1784910249/dash_p1jojb.jpg',
    heading: 'Global Standard Curriculum with Neoclassical Campus',
    subtitle: 'Nurturing academic achievement, critical thinking, and artistic exploration in safe, state-of-the-art interactive smart classrooms.',
  },
  {     
    id: 3,
    image: 'https://res.cloudinary.com/jyghqytp/image/upload/v1784909645/activity_playarea-1_s7bhyd.jpg',
    heading: 'Where Excellence Meets Elite Holistic Development',
    subtitle: 'Our students thrive in advanced science laboratories, coding hubs, creative visual studios, and premium Olympic-sized sports facilities.',
  },
];

export const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isPaused, setIsPaused] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});

  // Preload and keep all hero slide images in memory cache
  const preloadImage = useCallback((url: string, retriesLeft = 3) => {
    if (imageCacheRef.current[url]) {
      setLoadedImages((prev) => ({ ...prev, [url]: true }));
      return;
    }

    const img = new Image();
    img.src = url;
    img.onload = () => {
      imageCacheRef.current[url] = img;
      setLoadedImages((prev) => ({ ...prev, [url]: true }));
    };
    img.onerror = () => {
      if (retriesLeft > 0) {
        setTimeout(() => preloadImage(url, retriesLeft - 1), 1500);
      }
    };
  }, []);

  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      preloadImage(slide.image);
    });
  }, [preloadImage]);

  const handleNext = useCallback(() => {
    setDirection('right');
    setCurrentIndex((prev) => {
      const nextIdx = prev === HERO_SLIDES.length - 1 ? 0 : prev + 1;
      const nextImg = HERO_SLIDES[nextIdx].image;
      // If next image is not loaded yet, trigger preload retry and stay on current index until loaded
      if (!loadedImages[nextImg]) {
        preloadImage(nextImg);
        return prev;
      }
      return nextIdx;
    });
  }, [loadedImages, preloadImage]);

  const handlePrev = useCallback(() => {
    setDirection('left');
    setCurrentIndex((prev) => {
      const prevIdx = prev === 0 ? HERO_SLIDES.length - 1 : prev - 1;
      const prevImg = HERO_SLIDES[prevIdx].image;
      if (!loadedImages[prevImg]) {
        preloadImage(prevImg);
        return prev;
      }
      return prevIdx;
    });
  }, [loadedImages, preloadImage]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 7000); // 7 seconds autoplay delay
    return () => clearInterval(timer);
  }, [handleNext, isPaused]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50; // min swipe distance

    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const currentSlide = HERO_SLIDES[currentIndex];

  const slideVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 1.8,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 1.8,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  const imageVariants = {
    initial: {
      opacity: 0,
      scale: 1.15,
    },
    animate: {
      opacity: 1,
      scale: 1.02,
      transition: {
        opacity: { duration: 1.8, ease: [0.25, 1, 0.5, 1] },
        scale: { duration: 7.2, ease: [0.25, 1, 0.5, 1] }, // Ken Burns slow zoom
      },
    },
    exit: {
      opacity: 0,
      scale: 1.0,
      transition: {
        opacity: { duration: 1.8, ease: [0.25, 1, 0.5, 1] },
        scale: { duration: 1.8, ease: [0.25, 1, 0.5, 1] },
      },
    },
  };

  const headingVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { 
        duration: 1.5, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  const subtitleVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.8, 
        delay: 0.15, // elegant slight stagger
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -15, 
      transition: { 
        duration: 1.5, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.8, 
        delay: 0.3, // elegant delay
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      transition: { 
        duration: 1.5, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  return (
    <section 
      id="home"
      className="relative h-screen min-h-[580px] w-full flex items-center overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hidden preloader elements to lock image cache in DOM */}
      <div className="hidden" aria-hidden="true">
        {HERO_SLIDES.map((slide) => (
          <img
            key={slide.id}
            src={slide.image}
            alt=""
            loading="eager"
            decoding="sync"
          />
        ))}
      </div>

      {/* Synchronized Slideshow Layer */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={currentIndex}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full flex items-center"
        >
          {/* Background Slideshow with Slide + Zoom (Ken Burns) effect */}
          <div className="absolute inset-0 z-0">
            <motion.img
              src={currentSlide.image}
              alt={currentSlide.heading}
              variants={imageVariants}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
              decoding="sync"
            />
            {/* Dark overlay & radial gradient for high-contrast luxury look */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-transparent mix-blend-multiply z-[1]" />
            <div className="absolute inset-0 bg-black/40 z-[1]" />
          </div>

          {/* Slide Content */}
          <div className="relative z-10 px-4 sm:px-8 md:px-20 max-w-5xl mx-auto w-full text-left pt-6 sm:pt-10 md:pt-0 -translate-y-10 sm:-translate-y-12 md:translate-y-0">
            <div className="space-y-4 sm:space-y-6">
              <motion.h1 
                variants={headingVariants}
                className="text-[28px] xs:text-[34px] sm:text-[42px] md:text-[52px] lg:text-[64px] xl:text-[72px] font-extrabold text-white leading-[1.15] md:leading-tight font-sans tracking-tight whitespace-normal break-words"
              >
                {currentSlide.heading.split(' ').map((word, i) => (
                  <span key={i} className="inline-block mr-2 sm:mr-3 break-words max-w-full">
                    {word === 'Quality' || word === 'Excellence' || word === 'Innovation' || word === 'Leaders' ? (
                      <span className="bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#facc15] bg-clip-text text-transparent underline decoration-[#fc9362]/40 underline-offset-4">{word}</span>
                    ) : (
                      word
                    )}
                  </span>
                ))}
              </motion.h1>

              <motion.p 
                variants={subtitleVariants}
                className="text-white/90 text-sm sm:text-base md:text-lg lg:text-[18px] font-normal max-w-2xl font-sans leading-relaxed"
              >
                {currentSlide.subtitle}
              </motion.p>

              <motion.div 
                variants={buttonVariants}
                className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <a
                  href="https://pgs.udtweb.com/online-document/branch-enquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#fc9362] via-[#f97316] to-[#ea580c] text-white px-7 py-4 rounded-full font-extrabold text-sm sm:text-base md:text-[18px] shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto"
                >
                  Apply Online Now
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/80 text-white px-7 py-4 rounded-full font-bold text-sm sm:text-base md:text-[18px] backdrop-blur-sm bg-white/10 hover:bg-white hover:text-primary hover:border-white hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto shadow-lg"
                >
                  Explore Campus Life
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Hidden on mobile to avoid covering text, visible on tablet and desktop */}
      <button 
        onClick={handlePrev}
        className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 bg-black/20 hover:bg-white hover:text-primary text-white backdrop-blur-sm items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={handleNext}
        className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 bg-black/20 hover:bg-white hover:text-primary text-white backdrop-blur-sm items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const targetImg = HERO_SLIDES[index].image;
              if (!loadedImages[targetImg]) {
                preloadImage(targetImg);
              }
              setDirection(index > currentIndex ? 'right' : 'left');
              setCurrentIndex(index);
            }}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              index === currentIndex ? 'w-8 bg-on-tertiary-container' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/50 animate-bounce">
        <span className="text-[10px] uppercase tracking-widest font-bold">Scroll Down</span>
        <ChevronRight className="w-4 h-4 rotate-90" />
      </div>
    </section>
  );
};

