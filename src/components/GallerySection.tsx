/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Images, Sparkles, Layers } from 'lucide-react';
import { GALLERY_CATEGORIES, GalleryCategory, GalleryImage, GalleryService } from '../services/galleryService';
import { GalleryModal } from './GalleryModal';

export const GallerySection: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>(() => GalleryService.getCachedImagesSync() || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => GalleryService.getCachedImagesSync() === null);
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<GalleryCategory | null>(null);

  const loadImages = async () => {
    const data = await GalleryService.getAllImages();
    setImages(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadImages();
    const handleUpdate = () => loadImages();
    window.addEventListener('galleryUpdated', handleUpdate);
    return () => window.removeEventListener('galleryUpdated', handleUpdate);
  }, []);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-sky-50/20 to-white px-4 sm:px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 px-5 py-2 rounded-full inline-block shadow-md">
              Campus Photo Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight mt-2">
              Explore Our Campus & Achievements
            </h2>
            <p className="text-secondary text-sm sm:text-base font-medium">
              Discover vibrant moments from campus life, student awards, events, and academic excellence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategoryModal('overview')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00276a] via-[#123d8f] to-[#1e40af] hover:from-[#123d8f] hover:to-[#00276a] text-white font-extrabold text-xs transition-all duration-300 shadow-md shadow-blue-900/20 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Images className="w-4 h-4" />
              <span>Open Full Gallery</span>
            </button>
          </div>
        </div>

        {/* 4 Category Cards Grid or Skeleton Loader */}
        {isLoading && images.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="rounded-3xl h-72 sm:h-80 bg-slate-100 animate-pulse border border-outline-variant/30 p-6 flex flex-col justify-end space-y-3"
              >
                <div className="w-20 h-6 bg-slate-200 rounded-xl" />
                <div className="w-3/4 h-6 bg-slate-200 rounded-lg" />
                <div className="w-full h-4 bg-slate-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GALLERY_CATEGORIES.map((category) => {
              const categoryImages = images.filter((img) => img.category === category.id);
              const validCategoryImages = categoryImages.filter((img) => {
                const url = (img.thumbnailUrl && img.thumbnailUrl.trim()) || (img.imageUrl && img.imageUrl.trim());
                return Boolean(url && url.length > 0);
              });
              const photoCount = categoryImages.length;
              const rawCover = validCategoryImages.length > 0
                ? (validCategoryImages[0].thumbnailUrl?.trim() || validCategoryImages[0].imageUrl?.trim())
                : null;
              const coverImage = rawCover && rawCover.length > 0 ? rawCover : null;
              const hasCover = Boolean(coverImage);

              return (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedCategoryModal(category.id)}
                  className="group relative rounded-3xl overflow-hidden h-72 sm:h-80 shadow-lg border border-outline-variant/30 cursor-pointer bg-primary flex flex-col justify-end p-6"
                >
                  {/* Background Cover Image or Empty Clean Gradient */}
                  <div className="absolute inset-0 z-0">
                    {hasCover && coverImage ? (
                      <>
                        <img
                          src={coverImage}
                          alt={category.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-black/20 group-hover:from-primary/90 transition-all duration-300" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary via-primary-dark to-slate-900 p-6 flex flex-col items-center justify-center text-center opacity-90 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-2xl shadow-inner mb-3 group-hover:scale-110 transition-transform">
                          {category.icon}
                        </div>
                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
                          No images added yet
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Glassmorphism Badge at Top */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-black text-[11px] tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                      <span className="text-sm">{category.icon}</span>
                      <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                    </span>
                  </div>

                  {/* Card Bottom Text */}
                  <div className="relative z-10 text-white space-y-2">
                    <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight flex items-center justify-between">
                      <span>{category.title}</span>
                      <ArrowRight className="w-5 h-5 text-on-tertiary-container transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Gallery Modal */}
      {selectedCategoryModal && (
        <GalleryModal
          isOpen={selectedCategoryModal !== null}
          initialCategory={selectedCategoryModal}
          onClose={() => setSelectedCategoryModal(null)}
        />
      )}
    </section>
  );
};
