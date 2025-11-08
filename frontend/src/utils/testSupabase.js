// Test Supabase connection
import { supabase } from '../lib/supabase'

export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('📊 Database accessible')
    
    // Test auth
    const { data: { session } } = await supabase.auth.getSession()
    console.log('🔐 Auth session:', session ? 'Active' : 'No session')
    
    return true
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

// Test Google OAuth availability
export const testGoogleOAuth = async () => {
  try {
    console.log('🔍 Testing Google OAuth...')
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })
    
    if (error) {
      console.error('❌ Google OAuth not configured:', error.message)
      return false
    }
    
    console.log('✅ Google OAuth is configured!')
    return true
  } catch (error) {
    console.error('❌ Google OAuth test failed:', error.message)
    return false
  }
}
