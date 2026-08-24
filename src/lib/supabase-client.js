import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

export function isSupabaseConfigured() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (url.includes('xxxx') || anonKey === 'xxxx') return false;

  return true;
}

export function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı olmalı');
  }

  cachedClient = createClient(url, anonKey);
  return cachedClient;
}
