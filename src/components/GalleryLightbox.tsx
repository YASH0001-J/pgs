/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  FolderSync, 
  Calendar,
  Sparkles,
  Info,
  Image as ImageIcon
} from 'lucide-react';
import { GalleryImage, GALLERY_CATEGORIES, GalleryCategory } from '../services/galleryService';

interface GalleryLightboxProps {
  isOpen: boolean;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  isAdmin?: boolean;
  onDeleteImage?: (id: string) => void;
  onMoveCategory?: (id: string, newCategory: GalleryCategory) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
  isAdmin = false,
  onDeleteImage,
  onMoveCategory,
}) => {
  const currentImage = images[currentIndex];

  // Keyboard Navigation Handlers
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || !currentImage) return null;

  const currentCategoryMeta = GALLERY_CATEGORIES.find((c) => c.id === currentImage.category);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 md:p-8"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between text-white z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl">{currentCategoryMeta?.icon || '📸'}</span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                {currentCategoryMeta?.title || 'Campus Gallery'}
              </h3>
              <p className="text-xs text-white/60">
                Photo {currentIndex + 1} of {images.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onDeleteImage && (
              <button
                onClick={() => {
                  onDeleteImage(currentImage.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all"
                title="Delete Image (Admin)"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all border border-white/10"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Lightbox Image View */}
        <div className="relative flex-1 flex items-center justify-center my-4">
          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1)}
                className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/15 transition-all shadow-2xl"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <button
                onClick={() => onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1)}
                className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/15 transition-all shadow-2xl"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          {/* Image Display */}
          <motion.div
            key={currentImage.id}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="max-w-5xl max-h-[75vh] w-full flex items-center justify-center p-2"
          >
            {Boolean((currentImage.imageUrl && currentImage.imageUrl.trim()) || (currentImage.thumbnailUrl && currentImage.thumbnailUrl.trim())) ? (
              <img
                src={(currentImage.imageUrl && currentImage.imageUrl.trim()) || (currentImage.thumbnailUrl && currentImage.thumbnailUrl.trim()) || ''}
                alt={currentImage.title || 'Gallery image'}
                decoding="async"
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/10 select-none"
              />
            ) : (
              <div className="w-64 h-64 flex flex-col items-center justify-center bg-white/10 rounded-2xl text-white/50 border border-white/10">
                <ImageIcon className="w-12 h-12 mb-2" />
                <span className="text-xs font-semibold">Image not available</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Info Bar & Admin Action Panel */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-5 max-w-4xl mx-auto w-full text-white space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 font-bold uppercase tracking-wider text-white/90">
                  {currentCategoryMeta?.title}
                </span>
                <span className="text-xs text-white/50 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(currentImage.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-extrabold text-base sm:text-lg text-white">
                {currentImage.title}
              </h4>
              {currentImage.description && (
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  {currentImage.description}
                </p>
              )}
            </div>

            {/* Category Transfer for Admin */}
            {isAdmin && onMoveCategory && (
              <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/10 shrink-0">
                <FolderSync className="w-4 h-4 text-on-tertiary-container" />
                <span className="text-xs font-bold text-white/80">Move Category:</span>
                <select
                  value={currentImage.category}
                  onChange={(e) => onMoveCategory(currentImage.id, e.target.value as GalleryCategory)}
                  className="bg-white/20 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none border border-white/20 cursor-pointer"
                >
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                      {cat.icon} {cat.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
