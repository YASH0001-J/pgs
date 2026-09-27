/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidConfig = Boolean(
  supabaseUrl &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.trim().startsWith('http') &&
  supabasePublishableKey &&
  supabasePublishableKey.trim().length > 0
);

// Fallback placeholder URL and key to safely allow module import before user sets env variables
const safeUrl = isValidConfig ? supabaseUrl.trim() : 'https://placeholder-school-pdfs.supabase.co';
const safeKey = isValidConfig ? supabasePublishableKey.trim() : 'placeholder-anon-key';

export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const isSupabaseConfigured = (): boolean => isValidConfig;

