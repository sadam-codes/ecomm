import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
// Fallback to hardcoded values if env vars are not set (for backwards compatibility)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qfsgfjyjcxgavsrqbgeu.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmc2dmanlqY3hnYXZzcnFiZ2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NTcwMTAsImV4cCI6MjA3NTEzMzAxMH0.Qhx0MeRLEtAl-A7g6p9S8ZLaL_IaKpub4ebtsa3iBD0"

// Validate that we have valid credentials
if (!supabaseUrl || supabaseUrl === 'https://qfsgfjyjcxgavsrqbgeu.supabase.co') {
  console.warn('⚠️ Warning: Using potentially invalid Supabase URL. Please set VITE_SUPABASE_URL in your .env file.')
}

if (!supabaseAnonKey) {
  console.error('❌ Error: VITE_SUPABASE_ANON_KEY is missing. Please set it in your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
