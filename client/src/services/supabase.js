import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_url_here' &&
  !supabaseUrl.includes('example.com')
);

// Fallback dummy client to prevent runtime crashes if env vars are not yet populated
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({
          error: { message: 'Supabase credentials not configured in client/.env. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' }
        }),
        signUp: async () => ({
          error: { message: 'Supabase credentials not configured in client/.env. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' }
        }),
        signOut: async () => ({ error: null })
      }
    };
