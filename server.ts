/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client initialization
function getBackendSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

export interface GalleryImageBackend {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable large payloads for base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure persistent directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded images statically with long-term cache headers
app.use(
  '/uploads',
  express.static(UPLOADS_DIR, {
    maxAge: '30d',
    immutable: true,
  })
);

// Database Helper Functions
const INITIAL_GALLERY_SEED: GalleryImageBackend[] = [
  {
    id: 'seed-ov-1',
    title: 'Professor Global School Campus View',
    category: 'overview',
    imageUrl: 'https://pgsbaprola.org/images/infra/activity&playarea-1.jpg',
    thumbnailUrl: 'https://pgsbaprola.org/images/infra/activity&playarea-1.jpg',
    description: 'Vibrant school campus with activity and play areas.',
    createdAt: '2026-07-20T10:00:00.000Z'
  },
  {
    id: 'seed-ov-2',
    title: 'Interactive Smart Classroom',
    category: 'overview',
    imageUrl: 'https://pgsbaprola.org/images/infra/activity&playarea-4.jpg',
    thumbnailUrl: 'https://pgsbaprola.org/images/infra/activity&playarea-4.jpg',
    description: 'Modern interactive learning spaces equipped with digital aids.',
    createdAt: '2026-07-19T10:00:00.000Z'
  },
  {
    id: 'seed-ov-3',
    title: 'Science Innovation Laboratory',
    category: 'overview',
    imageUrl: 'https://pgsbaprola.org/images/infra/science-lab.jpg',
    thumbnailUrl: 'https://pgsbaprola.org/images/infra/science-lab.jpg',
    description: 'Advanced laboratories for physics, chemistry, and biology research.',
    createdAt: '2026-07-18T10:00:00.000Z'
  },
  {
    id: 'seed-ev-1',
    title: 'Annual Cultural Festival & Celebrations',
    category: 'events',
    imageUrl: 'https://pgsbaprola.org/images/infra/activity&playarea-2.jpg',
    thumbnailUrl: 'https://pgsbaprola.org/images/infra/activity&playarea-2.jpg',
    description: 'Students showcasing music, performing arts, and festive joy.',
    createdAt: '2026-07-17T10:00:00.000Z'
  },
  {
    id: 'seed-ev-2',
    title: 'Interactive Play Area & Sports Zone',
    category: 'events',
    imageUrl: 'https://pgsbaprola.org/images/infra/activity&playarea-3.jpg',
    thumbnailUrl: 'https://pgsbaprola.org/images/infra/activity&playarea-3.jpg',
    description: 'Outdoor play arena and inter-house athletic events.',
    createdAt: '2026-07-16T10:00:00.000Z'
  },
  {
    id: 'seed-ac-1',
    title: 'Sports Wing & Athletic Honors',
    category: 'achievements',
    imageUrl: 'https://pgsbaprola.org/images/infra/activity&playarea-5.jpg',
    thumbnailUrl: 'https://pgsbaprola.org/images/infra/activity&playarea-5.jpg',
    description: 'Celebrating athletics and CBSE sports honors.',
    createdAt: '2026-07-15T10:00:00.000Z'
  },
  {
    id: 'seed-st-1',
    title: 'High-Tech Computer & Coding Lab',
    category: 'pgs-stars',
    imageUrl: 'https://pgsbaprola.org/images/infra/computer-lab.jpg',
    thumbnailUrl: 'https://pgsbaprola.org/images/infra/computer-lab.jpg',
    description: 'Young innovators mastering coding, robotics, and digital design.',
    createdAt: '2026-07-14T10:00:00.000Z'
  },
  {
    id: 'seed-ac-2',
    title: 'Dedicated Medical Care Room',
    category: 'achievements',
    imageUrl: 'https://pgsbaprola.org/images/infra/MedicalRoom.jpg',
    thumbnailUrl: 'https://pgsbaprola.org/images/infra/MedicalRoom.jpg',
    description: 'Comprehensive healthcare support and student wellness.',
    createdAt: '2026-07-13T10:00:00.000Z'
  }
];

function readGallery(): GalleryImageBackend[] {
  try {
    if (!fs.existsSync(GALLERY_FILE)) {
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(INITIAL_GALLERY_SEED, null, 2), 'utf-8');
      return [...INITIAL_GALLERY_SEED];
    }
    const content = fs.readFileSync(GALLERY_FILE, 'utf-8');
    const data = JSON.parse(content);
    if (!Array.isArray(data) || data.length === 0) {
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(INITIAL_GALLERY_SEED, null, 2), 'utf-8');
      return [...INITIAL_GALLERY_SEED];
    }
    return data;
  } catch (err) {
    console.error('Error reading gallery.json:', err);
    return [...INITIAL_GALLERY_SEED];
  }
}

function writeGallery(items: GalleryImageBackend[]): void {
  try {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing gallery.json:', err);
  }
}

// Helper to handle base64 image save to disk
function processImageUrl(imageUrl: string, prefix = 'img'): string {
  if (imageUrl && imageUrl.startsWith('data:image/')) {
    try {
      const matches = imageUrl.match(/^data:image\/([a-zA-Z0-9-+.]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const rawExt = matches[1];
        const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
        const base64Data = matches[2];
        const fileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        return `/uploads/${fileName}`;
      }
    } catch (err) {
      console.error('Error saving base64 image file:', err);
    }
  }
  return imageUrl;
}

// Gallery API Routes
app.get('/api/gallery', (req, res) => {
  const items = readGallery();
  // Sort descending by createdAt
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(items);
});

app.post('/api/gallery', (req, res) => {
  // Support both single item and bulk items payload
  if (Array.isArray(req.body) || (req.body.items && Array.isArray(req.body.items))) {
    const rawItems: any[] = Array.isArray(req.body) ? req.body : req.body.items;
    const gallery = readGallery();
    const added: GalleryImageBackend[] = [];

    for (const item of rawItems) {
      if (!item.imageUrl || typeof item.imageUrl !== 'string' || !item.imageUrl.trim()) {
        continue;
      }

      const savedImageUrl = processImageUrl(item.imageUrl.trim(), 'img');
      const savedThumbnailUrl = item.thumbnailUrl && typeof item.thumbnailUrl === 'string' && item.thumbnailUrl.trim()
        ? processImageUrl(item.thumbnailUrl.trim(), 'thumb')
        : undefined;

      const newImage: GalleryImageBackend = {
        id: item.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: item.title && typeof item.title === 'string' && item.title.trim() ? item.title.trim() : 'Campus Photo',
        category: item.category || 'overview',
        imageUrl: savedImageUrl,
        thumbnailUrl: savedThumbnailUrl || savedImageUrl,
        description: item.description ? String(item.description).trim() : undefined,
        videoUrl: item.videoUrl ? String(item.videoUrl).trim() : undefined,
        createdAt: item.createdAt || new Date().toISOString(),
      };

      gallery.unshift(newImage);
      added.push(newImage);
    }

    writeGallery(gallery);
    res.status(201).json({ success: true, count: added.length, items: added });
    return;
  }

  const { title, category, imageUrl, thumbnailUrl, description, videoUrl } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: 'Display Name (title) is required.' });
    return;
  }

  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
    res.status(400).json({ error: 'Image URL or file payload is required.' });
    return;
  }

  const savedImageUrl = processImageUrl(imageUrl.trim(), 'img');
  const savedThumbnailUrl = thumbnailUrl && typeof thumbnailUrl === 'string' && thumbnailUrl.trim()
    ? processImageUrl(thumbnailUrl.trim(), 'thumb')
    : undefined;

  const newImage: GalleryImageBackend = {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim(),
    category: category || 'overview',
    imageUrl: savedImageUrl,
    thumbnailUrl: savedThumbnailUrl || savedImageUrl,
    description: description ? description.trim() : undefined,
    videoUrl: videoUrl ? videoUrl.trim() : undefined,
    createdAt: new Date().toISOString(),
  };

  const gallery = readGallery();
  gallery.unshift(newImage);
  writeGallery(gallery);

  res.status(201).json(newImage);
});

app.post('/api/gallery/bulk', (req, res) => {
  const rawItems: any[] = Array.isArray(req.body) ? req.body : req.body?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    res.status(400).json({ error: 'Array of items is required.' });
    return;
  }

  const gallery = readGallery();
  const added: GalleryImageBackend[] = [];

  for (const item of rawItems) {
    if (!item.imageUrl || typeof item.imageUrl !== 'string' || !item.imageUrl.trim()) {
      continue;
    }

    const savedImageUrl = processImageUrl(item.imageUrl.trim(), 'img');
    const savedThumbnailUrl = item.thumbnailUrl && typeof item.thumbnailUrl === 'string' && item.thumbnailUrl.trim()
      ? processImageUrl(item.thumbnailUrl.trim(), 'thumb')
      : undefined;

    const newImage: GalleryImageBackend = {
      id: item.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: item.title && typeof item.title === 'string' && item.title.trim() ? item.title.trim() : 'Campus Photo',
      category: item.category || 'overview',
      imageUrl: savedImageUrl,
      thumbnailUrl: savedThumbnailUrl || savedImageUrl,
      description: item.description ? String(item.description).trim() : undefined,
      videoUrl: item.videoUrl ? String(item.videoUrl).trim() : undefined,
      createdAt: item.createdAt || new Date().toISOString(),
    };

    gallery.unshift(newImage);
    added.push(newImage);
  }

  writeGallery(gallery);
  res.status(201).json({ success: true, count: added.length, items: added });
});

app.put('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, imageUrl, thumbnailUrl, description, videoUrl } = req.body;

  const gallery = readGallery();
  const index = gallery.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Image not found.' });
    return;
  }

  const existing = gallery[index];
  let newImageUrl = existing.imageUrl;
  let newThumbnailUrl = existing.thumbnailUrl;

  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
    newImageUrl = processImageUrl(imageUrl.trim(), 'img');
  }

  if (thumbnailUrl && typeof thumbnailUrl === 'string' && thumbnailUrl.trim()) {
    newThumbnailUrl = processImageUrl(thumbnailUrl.trim(), 'thumb');
  }

  const updated: GalleryImageBackend = {
    ...existing,
    title: title !== undefined ? String(title).trim() : existing.title,
    category: category !== undefined ? String(category) : existing.category,
    description: description !== undefined ? (description ? String(description).trim() : undefined) : existing.description,
    videoUrl: videoUrl !== undefined ? (videoUrl ? String(videoUrl).trim() : undefined) : existing.videoUrl,
    imageUrl: newImageUrl,
    thumbnailUrl: newThumbnailUrl || newImageUrl,
    updatedAt: new Date().toISOString(),
  };

  gallery[index] = updated;
  writeGallery(gallery);

  res.json(updated);
});

app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const gallery = readGallery();
  const index = gallery.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Image not found.' });
    return;
  }

  const target = gallery[index];

  // Remove files from disk if local in /uploads/
  const removeFile = (urlStr?: string) => {
    if (urlStr && urlStr.startsWith('/uploads/')) {
      try {
        const fileName = path.basename(urlStr);
        const filePath = path.join(UPLOADS_DIR, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Error removing local uploaded file:', err);
      }
    }
  };

  removeFile(target.imageUrl);
  if (target.thumbnailUrl !== target.imageUrl) {
    removeFile(target.thumbnailUrl);
  }

  gallery.splice(index, 1);
  writeGallery(gallery);

  res.json({ success: true, id });
});

app.delete('/api/gallery', (req, res) => {
  writeGallery([]);
  res.json({ success: true, count: 0 });
});

// Secure Admin Password Verification Endpoint
app.post('/api/admin/verify-password', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'pgsbaprola';
  if (password === adminPassword) {
    res.json({ success: true, token: 'auth-pgs-token-xyz' });
  } else {
    res.status(401).json({ error: 'Incorrect security password. Please try again.' });
  }
});

// Supabase PDF Storage API Routes
app.get('/api/admin/supabase-pdf/status', (req, res) => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY);
  const isConfigured = Boolean(url && key);

  res.json({
    isConfigured,
    bucket: 'school-pdfs',
    hasServiceRoleKey,
    hasPublishableKey: Boolean(process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY),
  });
});

app.post('/api/admin/supabase-pdf/upload', async (req, res) => {
  try {
    const supabase = getBackendSupabase();
    if (!supabase) {
      res.status(503).json({
        error: 'Supabase is not configured on the server. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY or SUPABASE_SERVICE_ROLE_KEY.',
      });
      return;
    }

    const { base64Data, storagePath, bucket = 'school-pdfs', contentType = 'application/pdf' } = req.body;

    if (!base64Data || !storagePath) {
      res.status(400).json({ error: 'Missing base64Data or storagePath in request body.' });
      return;
    }

    // Strip data URL prefix if present
    const base64Clean = base64Data.replace(/^data:application\/pdf;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error('Supabase server upload error:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    res.json({
      success: true,
      publicUrl: publicUrlData.publicUrl,
      storagePath: data.path,
    });
  } catch (err: any) {
    console.error('Server PDF upload exception:', err);
    res.status(500).json({ error: err.message || 'Internal server error during PDF upload.' });
  }
});

app.post('/api/admin/supabase-pdf/delete', async (req, res) => {
  try {
    const supabase = getBackendSupabase();
    if (!supabase) {
      res.status(503).json({ error: 'Supabase is not configured on the server.' });
      return;
    }

    const { storagePath, bucket = 'school-pdfs' } = req.body;
    if (!storagePath) {
      res.status(400).json({ error: 'storagePath is required.' });
      return;
    }

    const { error } = await supabase.storage.from(bucket).remove([storagePath]);

    if (error) {
      console.warn('Supabase server delete warning:', error.message);
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ success: true, storagePath });
  } catch (err: any) {
    console.error('Server PDF delete exception:', err);
    res.status(500).json({ error: err.message || 'Internal server error during PDF deletion.' });
  }
});

async function startServer() {
  // Vite middleware in dev mode / static build in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
