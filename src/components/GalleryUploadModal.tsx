/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Upload,
  FileImage,
  Layers,
  Trash2
} from 'lucide-react';
import { GALLERY_CATEGORIES, GalleryCategory, GalleryService } from '../services/galleryService';

interface GalleryUploadModalProps {
  isOpen: boolean;
  defaultCategory?: GalleryCategory;
  onClose: () => void;
  onUploadSuccess: () => void;
}

type UploadMode = 'files' | 'bulk_urls' | 'single_url';

// Helper to extract all valid URLs from any text (space, newline, comma separated)
const extractUrls = (text: string): string[] => {
  if (!text || !text.trim()) return [];
  const urlRegex = /https?:\/\/[^\s,;"'<>()[\]{}]+/g;
  const matches = text.match(urlRegex) || [];
  const cleaned = matches.map((u) => u.trim().replace(/[.,;:]$/, '')).filter((u) => u.length > 0);
  return Array.from(new Set(cleaned));
};

export const GalleryUploadModal: React.FC<GalleryUploadModalProps> = ({
  isOpen,
  defaultCategory = 'overview',
  onClose,
  onUploadSuccess,
}) => {
  const [category, setCategory] = useState<GalleryCategory>(defaultCategory);
  const [uploadMode, setUploadMode] = useState<UploadMode>('files');
  
  // Multiple files state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Bulk URLs state
  const [bulkUrlsText, setBulkUrlsText] = useState('');
  
  // Single URL state
  const [imageUrl, setImageUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);

  // Optional titles & description
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync category when defaultCategory changes
  useEffect(() => {
    setCategory(defaultCategory);
  }, [defaultCategory]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([]);
      setFilePreviews([]);
      setBulkUrlsText('');
      setImageUrl('');
      setIsUrlValid(null);
      setUrlValidationError(null);
      setDisplayName('');
      setDescription('');
      setErrorMsg(null);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // File selection handlers
  const handleFilesSelected = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    const newFiles = Array.from(filesList).filter((file) => file.type.startsWith('image/'));
    
    if (newFiles.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WebP, etc.).');
      return;
    }

    setErrorMsg(null);
    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);

    // Generate previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  // Single URL input handler
  const handleUrlChange = (val: string) => {
    setImageUrl(val);
    setErrorMsg(null);
    setUrlValidationError(null);

    // If user pasted multiple URLs into single URL input, automatically switch to bulk URLs mode
    const detectedUrls = extractUrls(val);
    if (detectedUrls.length > 1) {
      setBulkUrlsText(detectedUrls.join('\n'));
      setUploadMode('bulk_urls');
      setImageUrl('');
      return;
    }

    const trimmed = val.trim();
    if (!trimmed) {
      setIsUrlValid(null);
      setIsValidatingUrl(false);
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setIsUrlValid(false);
      setUrlValidationError('URL must start with http:// or https://');
      return;
    }

    setIsValidatingUrl(true);
    setIsUrlValid(null);

    const img = new Image();
    img.onload = () => {
      setIsUrlValid(true);
      setIsValidatingUrl(false);
      setUrlValidationError(null);
    };
    img.onerror = () => {
      const hasImgPattern = /\.(jpg|jpeg|png|webp|gif|avif|svg)($|\?)/i.test(trimmed) || 
        trimmed.includes('unsplash') || 
        trimmed.includes('cloudinary') || 
        trimmed.includes('images') || 
        trimmed.includes('cdn');

      if (hasImgPattern) {
        setIsUrlValid(true);
        setIsValidatingUrl(false);
        setUrlValidationError(null);
      } else {
        setIsUrlValid(false);
        setIsValidatingUrl(false);
        setUrlValidationError('Unable to load image from URL. Ensure it is a direct public image link.');
      }
    };
    img.src = trimmed;
  };

  // Parse bulk URLs (handles spaces, newlines, commas)
  const parsedBulkUrls = extractUrls(bulkUrlsText);

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (uploadMode === 'files') {
        if (selectedFiles.length === 0) {
          setErrorMsg('Please select at least one image file to upload.');
          setIsSubmitting(false);
          return;
        }

        await GalleryService.addMultipleFiles(
          category,
          selectedFiles,
          displayName || undefined,
          description || undefined
        );
      } else if (uploadMode === 'bulk_urls') {
        const urlsToUpload = extractUrls(bulkUrlsText);
        if (urlsToUpload.length === 0) {
          setErrorMsg('Please paste at least one valid HTTP/HTTPS image URL.');
          setIsSubmitting(false);
          return;
        }

        await GalleryService.addMultipleImageUrls(
          category,
          urlsToUpload,
          displayName || undefined,
          description || undefined
        );
      } else {
        // single_url mode
        const detectedUrls = extractUrls(imageUrl);
        if (detectedUrls.length > 1) {
          // If multiple URLs were entered in single URL field, upload all in bulk
          await GalleryService.addMultipleImageUrls(
            category,
            detectedUrls,
            displayName || undefined,
            description || undefined
          );
        } else if (detectedUrls.length === 1) {
          await GalleryService.addImageUrl(
            category,
            detectedUrls[0],
            displayName || undefined,
            description || undefined
          );
        } else {
          const trimmedUrl = imageUrl.trim();
          if (!trimmedUrl) {
            setErrorMsg('Image URL is required.');
            setIsSubmitting(false);
            return;
          }

          await GalleryService.addImageUrl(
            category,
            trimmedUrl,
            displayName || undefined,
            description || undefined
          );
        }
      }

      setIsSubmitting(false);
      onUploadSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to upload/save images:', err);
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to save images. Please check your data and try again.');
    }
  };

  const isFormValid =
    !isSubmitting &&
    ((uploadMode === 'files' && selectedFiles.length > 0) ||
      (uploadMode === 'bulk_urls' && parsedBulkUrls.length > 0) ||
      (uploadMode === 'single_url' && (imageUrl.trim().length > 0 || extractUrls(imageUrl).length > 0) && isUrlValid !== false));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-outline-variant/30 max-w-xl w-full p-6 sm:p-7 space-y-5 relative overflow-hidden my-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-primary">
                  Upload Campus Photos
                </h3>
                <p className="text-xs text-secondary">
                  Multiple file upload & bulk URL support
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container text-secondary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Dropdown */}
            <div className="space-y-1.5">
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

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-surface-container-low border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setUploadMode('files')}
                className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  uploadMode === 'files'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary hover:text-primary hover:bg-white/50'
                }`}
              >
                <FileImage className="w-3.5 h-3.5" />
                <span>Multiple Files</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadMode('bulk_urls')}
                className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  uploadMode === 'bulk_urls'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary hover:text-primary hover:bg-white/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Bulk URLs</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadMode('single_url')}
                className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  uploadMode === 'single_url'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary hover:text-primary hover:bg-white/50'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Single URL</span>
              </button>
            </div>

            {/* MODE 1: MULTIPLE FILES */}
            {uploadMode === 'files' && (
              <div className="space-y-3">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-primary bg-primary/5 scale-[1.01]'
                      : 'border-outline-variant/40 hover:border-primary/60 bg-surface-container-lowest'
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    id="multi-image-input"
                    className="hidden"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />
                  <label htmlFor="multi-image-input" className="cursor-pointer space-y-2 block">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">
                        Drag & Drop multiple image files here, or <span className="text-blue-600 underline">browse</span>
                      </p>
                      <p className="text-[10px] text-secondary mt-0.5">
                        Supports PNG, JPG, WEBP, GIF. Select multiple files at once.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Selected Files Preview Grid */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-primary">
                      <span>Selected Photos ({selectedFiles.length})</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFiles([]);
                          setFilePreviews([]);
                        }}
                        className="text-red-600 hover:underline text-[11px]"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-2 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                      {filePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-outline-variant/30 bg-white">
                          {preview && preview.trim() !== '' ? (
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: BULK URLS */}
            {uploadMode === 'bulk_urls' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                  Paste Multiple Image URLs (Space, newline, or comma separated) <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={5}
                  value={bulkUrlsText}
                  onChange={(e) => setBulkUrlsText(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2...&#10;(or paste space-separated URLs)"
                  className="w-full text-xs font-mono text-primary p-3 rounded-xl border border-outline-variant/40 bg-white focus:outline-none focus:border-primary transition-all resize-none"
                />
                
                <div className="flex items-center justify-between text-[11px] font-bold text-secondary px-1">
                  <span>Detected URLs: {parsedBulkUrls.length}</span>
                  {parsedBulkUrls.length > 0 && (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for bulk upload ({parsedBulkUrls.length} images)
                    </span>
                  )}
                </div>

                {/* Previews for bulk URLs (first few) */}
                {parsedBulkUrls.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-primary">Previewing first {Math.min(parsedBulkUrls.length, 6)} images:</p>
                    <div className="grid grid-cols-6 gap-2 p-2 bg-surface-container-low rounded-xl border border-outline-variant/30 max-h-24 overflow-y-auto">
                      {parsedBulkUrls.slice(0, 6).map((url, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-outline-variant/30 bg-white">
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 3: SINGLE URL */}
            {uploadMode === 'single_url' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                  Image URL <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    required={uploadMode === 'single_url'}
                    className={`w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition-colors ${
                      urlValidationError
                        ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                        : isUrlValid
                        ? 'border-emerald-500'
                        : 'border-outline-variant/40 focus:border-primary'
                    }`}
                  />
                  {isValidatingUrl && (
                    <div className="absolute right-3 top-2.5 text-primary animate-spin">
                      <Loader2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {urlValidationError && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{urlValidationError}</span>
                  </p>
                )}

                {/* Live Preview */}
                {imageUrl.trim() && isUrlValid && (
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-container-low border border-emerald-300">
                    <img
                      src={imageUrl.trim()}
                      alt="URL Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-outline-variant/30 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Image URL Verified
                      </p>
                      <p className="text-[10px] text-secondary truncate mt-0.5">{imageUrl.trim()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Common Title & Description */}
            <div className="space-y-3 pt-2 border-t border-outline-variant/20">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                    Photo Title / Base Title (Optional)
                  </label>
                  <span className="text-[10px] font-mono text-secondary">
                    {displayName.length}/80
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={80}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={
                    uploadMode === 'files' || uploadMode === 'bulk_urls'
                      ? "e.g. Annual Sports Day 2026 (Auto-numbered if multiple)"
                      : "e.g. Annual Athletic Meet 2026"
                  }
                  className="w-full text-xs font-bold text-primary px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                    Description (Optional)
                  </label>
                  <span className="text-[10px] font-mono text-secondary">
                    {description.length}/250
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a short description..."
                  className="w-full text-xs font-medium text-primary px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Error Banner */}
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
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-secondary hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isFormValid}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs bg-primary text-white hover:bg-primary-dark shadow-md disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving to Gallery...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>
                      {uploadMode === 'files'
                        ? `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ''} Photos`
                        : uploadMode === 'bulk_urls'
                        ? `Add ${parsedBulkUrls.length > 0 ? parsedBulkUrls.length : ''} Image URLs`
                        : 'Add Image URL'}
                    </span>
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
