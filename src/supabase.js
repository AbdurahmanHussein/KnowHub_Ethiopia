import { createClient } from '@supabase/supabase-js';

// Support both standard Vite environment variables and standard Next/Vercel keys
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://purdagqmxwxjbrhjirta.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_2kcyxlRNn1pnlcdxqvRveg_nk9oyPyo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
