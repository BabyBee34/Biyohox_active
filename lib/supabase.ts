import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
// For a production app, use environment variables
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);