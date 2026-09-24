import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
// Allow service role key or fallback to anon key for server-side operations
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url_here') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✓ Supabase client initialized on server');
  } catch (err) {
    console.warn('! Supabase client initialization warning:', err.message);
  }
} else {
  console.warn('! Supabase credentials not found in environment. Wishlist persistence requires Supabase keys in server/.env');
}

/**
 * Helper to get a Supabase client scoped with a user's JWT
 */
export function getScopedSupabase(accessToken) {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}
