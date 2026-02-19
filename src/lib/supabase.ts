import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if env vars are not set (for development)
const isDevelopment = !supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseAnonKey || supabaseAnonKey.includes('placeholder');

export const supabase = isDevelopment 
  ? null as any // Will be handled in AuthContext
  : createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = !isDevelopment;
