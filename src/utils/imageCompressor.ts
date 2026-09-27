/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utility to compress and resize images client-side before upload
 * to ensure small file sizes, fast network transfers, and fast server processing.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 - 1.0
  mimeType?: 'image/jpeg' | 'image/webp';
}

/**
 * Compress an image file or data URL to JPEG with max dimensions and quality.
 */
export function compressImage(
  source: File | string,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();

    // If source is a File, create an Object URL
    let objectUrl: string | null = null;
    if (source instanceof File) {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    } else {
      img.src = source;
    }

    img.onload = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      let { width, height } = img;

      // Calculate aspect ratio and new dimensions
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D canvas context'));
        return;
      }

      // Smooth resizing algorithm
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw white background for transparent PNGs converted to JPEG
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      try {
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(compressedDataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      reject(new Error('Failed to load image for compression'));
    };
  });
}

/**
 * Generate a small thumbnail (e.g., max 450px, 0.75 quality) for fast grid rendering.
 */
export function generateThumbnail(
  source: File | string,
  options: CompressionOptions = {}
): Promise<string> {
  return compressImage(source, {
    maxWidth: options.maxWidth || 450,
    maxHeight: options.maxHeight || 450,
    quality: options.quality || 0.75,
    mimeType: options.mimeType || 'image/jpeg',
  });
}
