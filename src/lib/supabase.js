import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if valid credentials are provided
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
