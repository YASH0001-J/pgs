/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration using provided project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAygGva9jvI7TwUnpGftrUDEnuCYQskhf4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pgs-school-gallery.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pgs-school-gallery",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pgs-school-gallery.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "863148826906",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:863148826906:web:36062640b60361bcaa0ca3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6YNCPGSMJD"
};

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("🔥 Firebase initialized successfully.");
  console.log("📊 Connected Firestore Project ID:", firebaseConfig.projectId);
  console.log("📦 Connected Firebase Storage Bucket:", firebaseConfig.storageBucket);
} catch (e) {
  console.error("❌ Firebase initialization error:", e);
}

export { app, db, storage };
