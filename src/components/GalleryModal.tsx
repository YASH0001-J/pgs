/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Upload, 
  Lock, 
  Unlock, 
  Trash2, 
  FolderSync, 
  Maximize2, 
  Sparkles,
  Filter,
  Edit3,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { GALLERY_CATEGORIES, GalleryCategory, GalleryImage, GalleryService } from '../services/galleryService';
import { GalleryLightbox } from './GalleryLightbox';
import { GalleryUploadModal } from './GalleryUploadModal';
import { EditImageModal } from './EditImageModal';
import { DeleteImageConfirmModal } from './DeleteImageConfirmModal';
import { ToastNotification } from './ToastNotification';
import { useQueries } from '../context/QueryContext';

interface GalleryModalProps {
  isOpen: boolean;
  initialCategory?: GalleryCategory;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  initialCategory = 'overview',
  onClose,
}) => {
  const { isAuthenticated, login, logout } = useQueries();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>(initialCategory);
  const [images, setImages] = useState<GalleryImage[]>(() => GalleryService.getCachedImagesSync() || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => GalleryService.getCachedImagesSync() === null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showAdminLoginPrompt, setShowAdminLoginPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination / Load More state (10 images per batch)
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Reset pagination when category or search query changes
  useEffect(() => {
    setVisibleCount(10);
  }, [activeCategory, searchQuery]);

  const handleSaveImageEdit = async (id: string, newTitle: string, newDescription: string, newCategory: GalleryCategory) => {
    await GalleryService.updateImage(id, {
      title: newTitle,
      description: newDescription || undefined,
      category: newCategory,
    });
    await loadImages();
    setToastMessage('Image details updated successfully.');
  };

  // Sync category when initialCategory prop changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Load Images
  const loadImages = async () => {
    const data = await GalleryService.getAllImages();
    setImages(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  // Handle storage or custom event updates
  useEffect(() => {
    const handleUpdate = () => loadImages();
    window.addEventListener('galleryUpdated', handleUpdate);
    return () => window.removeEventListener('galleryUpdated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  // Filter Images
  const categoryImages = images.filter((img) => img.category === activeCategory);
  const filteredImages = categoryImages.filter((img) =>
    img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (img.description && img.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Batch / Paginated slice of images
  const displayedImages = filteredImages.slice(0, visibleCount);

  const activeCategoryMeta = GALLERY_CATEGORIES.find((c) => c.id === activeCategory);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login('admin@gmail.com', adminPassword);
    if (success) {
      setShowAdminLoginPrompt(false);
      setAdminPassword('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleDeleteImage = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    await GalleryService.deleteImage(deleteTargetId);
    await loadImages();
    if (lightboxIndex !== null) setLightboxIndex(null);
    setIsDeleting(false);
    setDeleteTargetId(null);
    setToastMessage('Image deleted successfully.');
  };

  const handleMoveCategory = async (id: string, newCategory: GalleryCategory) => {
    await GalleryService.moveImageCategory(id, newCategory);
    loadImages();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="bg-white rounded-3xl shadow-2xl border border-outline-variant/30 max-w-6xl w-full h-[92vh] flex flex-col overflow-hidden relative"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-6 bg-surface-container-low border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-white shadow-sm border border-outline-variant/30">
                {activeCategoryMeta?.icon}
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-primary leading-tight">
                  {activeCategoryMeta?.title} Gallery
                </h2>
                <p className="text-xs text-secondary">
                  Showing {filteredImages.length} photos in {activeCategoryMeta?.title}
                </p>
              </div>
            </div>

            {/* Action Buttons & Admin Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search Bar */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 text-xs font-bold text-primary pl-9 pr-3 py-2 rounded-xl border border-outline-variant/30 bg-white focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Upload Button (Admin only) */}
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-primary text-white font-extrabold text-xs hover:bg-primary-dark shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo URL</span>
                </button>
              ) : null}

              {/* Admin Toggle Button */}
              {isAuthenticated ? (
                <button
                  onClick={() => logout()}
                  className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 transition-all flex items-center gap-1.5 shrink-0"
                  title="Click to logout from admin mode"
                >
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Admin Active</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAdminLoginPrompt(true)}
                  className="px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-secondary font-bold text-xs border border-outline-variant/30 transition-all flex items-center gap-1.5 shrink-0"
                  title="Admin Portal Login"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Login</span>
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-container-high text-secondary transition-colors"
                aria-label="Close Gallery"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="px-4 sm:px-6 py-3 bg-white border-b border-outline-variant/30 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            {GALLERY_CATEGORIES.map((cat) => {
              const count = images.filter((img) => img.category === cat.id).length;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-full font-bold text-xs tracking-wide transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-white shadow-md scale-[1.02]'
                      : 'bg-surface-container-low hover:bg-surface-container text-secondary'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-outline-variant/20 text-secondary'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Gallery Main Image Grid Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-surface-container-lowest">
            {isLoading && images.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl h-64 bg-slate-100 animate-pulse border border-outline-variant/30 p-3 flex flex-col justify-between space-y-3"
                  >
                    <div className="w-full h-44 bg-slate-200 rounded-xl" />
                    <div className="w-3/4 h-4 bg-slate-200 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-primary/5 text-primary flex items-center justify-center text-3xl shadow-inner">
                  {activeCategoryMeta?.icon}
                </div>
                <h3 className="font-extrabold text-lg text-primary">No images added yet.</h3>
                <p className="text-xs text-secondary max-w-sm">
                  {searchQuery
                    ? `No photos matching "${searchQuery}" in ${activeCategoryMeta?.title}.`
                    : `There are currently no photos uploaded in ${activeCategoryMeta?.title}.`}
                </p>
                {isAuthenticated && (
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Photo URL</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {displayedImages.map((img, idx) => (
                    <motion.div
                      key={img.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="group relative rounded-2xl overflow-hidden bg-white border border-outline-variant/30 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
                    >
                      {/* Thumbnail Image */}
                      <div
                        onClick={() => setLightboxIndex(idx)}
                        className="relative h-48 sm:h-52 w-full overflow-hidden cursor-pointer bg-surface-container"
                      >
                        {Boolean((img.thumbnailUrl && img.thumbnailUrl.trim()) || (img.imageUrl && img.imageUrl.trim())) ? (
                          <img
                            src={(img.thumbnailUrl && img.thumbnailUrl.trim()) || (img.imageUrl && img.imageUrl.trim()) || ''}
                            alt={img.title || 'Gallery image'}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                            <ImageIcon className="w-8 h-8 opacity-40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                            <Maximize2 className="w-5 h-5" />
                          </div>
                        </div>
                      </div>

                      {/* Card Content Footer */}
                      <div className="p-3 bg-white flex flex-col justify-between flex-1 border-t border-outline-variant/20">
                        <div>
                          <h4 className="font-bold text-sm text-primary leading-tight">
                            {img.title}
                          </h4>
                          {img.description && (
                            <p className="text-xs text-secondary mt-1 leading-normal">
                              {img.description}
                            </p>
                          )}
                        </div>

                        {/* Admin Controls on Card */}
                        {isAuthenticated && (
                          <div className="mt-2.5 pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                            <select
                              value={img.category}
                              onChange={(e) => handleMoveCategory(img.id, e.target.value as GalleryCategory)}
                              className="text-[10px] font-bold text-secondary bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/30 focus:outline-none cursor-pointer"
                            >
                              {GALLERY_CATEGORIES.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.shortName}
                                </option>
                              ))}
                            </select>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingImage(img)}
                                className="p-1.5 rounded-lg text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                                title="Edit title & description"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteImage(img.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Load More Pagination Button */}
                {filteredImages.length > visibleCount && (
                  <div className="pt-6 pb-4 flex flex-col items-center justify-center gap-2">
                    <p className="text-xs font-semibold text-secondary">
                      Showing <span className="text-primary font-black">{displayedImages.length}</span> of <span className="text-primary font-black">{filteredImages.length}</span> photos
                    </p>
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 10)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-extrabold text-xs shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/20"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Load More Images (+10)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Admin Quick Password Modal */}
        {showAdminLoginPrompt && (
          <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-outline-variant/30"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg text-primary flex items-center gap-2">
                  <Lock className="w-5 h-5 text-on-tertiary-container" />
                  <span>Admin Authentication</span>
                </h3>
                <button
                  onClick={() => setShowAdminLoginPrompt(false)}
                  className="p-1 text-secondary hover:text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-secondary">
                Enter admin password to enable uploading, editing, and deleting photos.
              </p>

              <form onSubmit={handleAdminLoginSubmit} className="space-y-3">
                <div>
                  <input
                    type="password"
                    placeholder="Enter Admin Password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setLoginError(false);
                    }}
                    className="w-full text-xs font-bold text-primary p-3 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:border-primary"
                    autoFocus
                  />
                  {loginError && (
                    <p className="text-[11px] font-bold text-red-600 mt-1">
                      Incorrect password. Please try again.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary text-white font-extrabold text-xs hover:bg-primary-dark shadow-md transition-all"
                >
                  Log In & Unlock Controls
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <GalleryLightbox
            isOpen={lightboxIndex !== null}
            images={filteredImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={(index) => setLightboxIndex(index)}
            isAdmin={isAuthenticated}
            onDeleteImage={handleDeleteImage}
            onMoveCategory={handleMoveCategory}
          />
        )}

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <GalleryUploadModal
            isOpen={isUploadModalOpen}
            defaultCategory={activeCategory}
            onClose={() => setIsUploadModalOpen(false)}
            onUploadSuccess={() => {
              loadImages();
            }}
          />
        )}

        {/* Edit Image Details Modal */}
        {editingImage && (
          <EditImageModal
            isOpen={editingImage !== null}
            image={editingImage}
            onClose={() => setEditingImage(null)}
            onSave={handleSaveImageEdit}
          />
        )}

        {/* Delete Image Confirmation Dialog */}
        <DeleteImageConfirmModal
          isOpen={deleteTargetId !== null}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />

        {/* Toast Notification */}
        <ToastNotification
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </AnimatePresence>
  );
};
