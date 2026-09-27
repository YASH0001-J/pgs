/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import { GALLERY_CATEGORIES, GalleryCategory, GalleryImage } from '../services/galleryService';

interface EditImageModalProps {
  isOpen: boolean;
  image: GalleryImage | null;
  onClose: () => void;
  onSave: (id: string, newTitle: string, newDescription: string, newCategory: GalleryCategory) => Promise<void>;
}

export const EditImageModal: React.FC<EditImageModalProps> = ({
  isOpen,
  image,
  onClose,
  onSave,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      setDisplayName(image.title || '');
      setDescription(image.description || '');
      setCategory(image.category || 'overview');
      setErrorMsg(null);
    }
  }, [image]);

  if (!isOpen || !image) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = displayName.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName) {
      setErrorMsg('Display Name is mandatory.');
      return;
    }

    if (trimmedName.length > 80) {
      setErrorMsg('Display Name cannot exceed 80 characters.');
      return;
    }

    if (trimmedDesc.length > 250) {
      setErrorMsg('Description cannot exceed 250 characters.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(image.id, trimmedName, trimmedDesc, category);
      setIsSaving(false);
      onClose();
    } catch (err) {
      console.error('Failed to save changes:', err);
      setIsSaving(false);
      setErrorMsg('Failed to update image details.');
    }
  };

  const isFormValid =
    displayName.trim().length > 0 &&
    displayName.trim().length <= 80 &&
    description.trim().length <= 250 &&
    !isSaving;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-outline-variant/30 max-w-md w-full p-6 space-y-5 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                <Edit3 className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-extrabold text-lg text-primary">
                Edit Image Details
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-surface-container text-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Thumbnail Preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-16 h-16 rounded-xl object-cover border border-outline-variant/30 shadow-sm shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-primary truncate">{image.title}</p>
              <p className="text-[10px] text-secondary mt-0.5">
                Uploaded: {new Date(image.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                className="w-full text-xs font-bold text-primary bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-primary cursor-pointer"
              >
                {GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Name */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                  Display Name <span className="text-red-600">*</span>
                </label>
                <span className={`text-[10px] font-mono ${displayName.length > 80 ? 'text-red-600 font-bold' : 'text-secondary'}`}>
                  {displayName.length}/80
                </span>
              </div>
              <input
                type="text"
                maxLength={80}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Annual Sports Day 2026"
                required
                className="w-full text-xs font-bold text-primary px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                  Description (Optional)
                </label>
                <span className={`text-[10px] font-mono ${description.length > 250 ? 'text-red-600 font-bold' : 'text-secondary'}`}>
                  {description.length}/250
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={250}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a short description (optional)"
                className="w-full text-xs font-medium text-primary px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-secondary hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isFormValid}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs bg-primary text-white hover:bg-primary-dark shadow-md disabled:opacity-40 transition-all flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
