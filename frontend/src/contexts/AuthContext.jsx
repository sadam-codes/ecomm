import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  const normalizeProfile = (profile, authUser) => {
    if (!profile) return profile
    const avatar =
      profile.avatar_url ||
      authUser?.user_metadata?.avatar_url ||
      authUser?.user_metadata?.picture ||
      null

    if (avatar && profile.avatar_url !== avatar) {
      return {
        ...profile,
        avatar_url: avatar
      }
    }

    return profile
  }

  useEffect(() => {
    // Get initial session and load from localStorage
    const initializeAuth = async () => {
      try {
        // Load from localStorage first
        try {
          const savedUser = localStorage.getItem('user')
          const savedProfile = localStorage.getItem('userProfile')
          
          if (savedUser) {
            setUser(JSON.parse(savedUser))
          }
          if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile))
          }
        } catch (error) {
          console.error('Error loading from localStorage:', error)
        }

        // Get current session with timeout
        try {
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            setUser(session.user)
            await fetchUserProfile(session.user.id, session.user)
          } else {
            // Clear localStorage if no session
            try {
              localStorage.removeItem('user')
              localStorage.removeItem('userProfile')
            } catch (error) {
              console.error('Error clearing localStorage:', error)
            }
            setUser(null)
            setUserProfile(null)
          }
        } catch (error) {
          console.error('Error getting session:', error)
          // Continue without session - user will be redirected to login
          setUser(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Set loading to false even on error to prevent infinite loading
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Set a maximum loading time to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - forcing loading to false')
        setLoadingTimeout(true)
        setLoading(false)
      }
    }, 5000) // 5 seconds timeout

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          setLoading(true) // Ensure loading is true while fetching profile
          await fetchUserProfile(session.user.id, session.user)
          // Use a small delay to ensure React state updates are processed
          // This prevents race conditions where profile might not be set yet
          await new Promise(resolve => setTimeout(resolve, 50))
          setLoading(false)
        } else {
          setUserProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [])

  const fetchUserProfile = async (userId, sessionUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user profile:', error)
        return
      }

      if (data) {
        // Check if user should be admin but isn't marked as such
        const authUser = sessionUser
          ? { user_metadata: sessionUser.user_metadata, email: sessionUser.email }
          : (await supabase.auth.getUser()).data?.user
        if (authUser) {
          const isAdminEmail = authUser.email === 'admin@example.com' || 
                               authUser.email === 'muhammadbinnasir@gmail.com' ||
                               authUser.email?.includes('admin') ||
                               authUser.email?.includes('administrator')
          
          if (isAdminEmail && data.role !== 'admin') {
            // Update user role to admin
            const { data: updatedData, error: updateError } = await supabase
              .from('users')
              .update({ role: 'admin', updated_at: new Date().toISOString() })
              .eq('id', userId)
              .select()
              .single()
            
            if (!updateError && updatedData) {
              const normalizedUpdatedData = normalizeProfile(updatedData, authUser)
              setUserProfile(normalizedUpdatedData)
              try {
                localStorage.setItem('userProfile', JSON.stringify(normalizedUpdatedData))
              } catch (error) {
                console.error('Error saving updated userProfile to localStorage:', error)
              }
              return
            }
          }
        }
        
        const normalizedData = normalizeProfile(data, authUser)
        setUserProfile(normalizedData)
        try {
          localStorage.setItem('userProfile', JSON.stringify(normalizedData))
        } catch (error) {
          console.error('Error saving userProfile to localStorage:', error)
        }
      } else {
        // Create user profile if it doesn't exist
        await createUserProfile(userId)
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }

  const createUserProfile = async (userId) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) return

      // Check if user should be admin based on email
      const isAdminEmail = authUser.email === 'admin@example.com' || 
                           authUser.email === 'muhammadbinnasir@gmail.com' ||
                           authUser.email?.includes('admin') ||
                           authUser.email?.includes('administrator')

      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User',
          avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
          role: isAdminEmail ? 'admin' : 'user', // Set role based on email
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        return
      }

      const normalizedData = normalizeProfile(data, authUser)
      setUserProfile(normalizedData)
      try {
        localStorage.setItem('userProfile', JSON.stringify(normalizedData))
      } catch (error) {
        console.error('Error saving userProfile to localStorage:', error)
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      })

      if (error) {
        console.error('Error signing in with Google:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in signInWithGoogle:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      console.log('Starting signOut process...')
      
      // Clear state first to trigger immediate re-render
      setUser(null)
      setUserProfile(null)
      setLoading(false)

      // Clear Google session to force account selection
      try {
        if (window.gapi && window.gapi.auth2) {
          const auth2 = window.gapi.auth2.getAuthInstance()
          if (auth2) {
            await auth2.signOut()
          }
        }
      } catch (error) {
        console.log('Google session clear failed:', error)
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        // Don't throw error, continue with cleanup
      }

      // Clear ALL localStorage and sessionStorage
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear any Google-related cookies/localStorage
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.includes('google') || key.includes('gapi') || key.includes('oauth')) {
            localStorage.removeItem(key)
          }
        })
      } catch (error) {
        console.log('Error clearing Google-related storage:', error)
      }

      console.log('SignOut process completed')
    } catch (error) {
      console.error('Error in signOut:', error)
      // Even if there's an error, clear everything and set state
      setUser(null)
      setUserProfile(null)
      setLoading(false)
      localStorage.clear()
      sessionStorage.clear()
    }
  }

  const updateUserProfile = async (updates) => {
    console.log('Updating user profile with:', updates)
    if (!user) {
      console.error('No user found for profile update')
      return
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating user profile:', error)
        throw error
      }

      console.log('Profile update successful:', data)
      setUserProfile(data)
      try {
        localStorage.setItem('userProfile', JSON.stringify(data))
        console.log('Saved to localStorage')
      } catch (error) {
        console.error('Error saving userProfile to localStorage:', error)
      }
      return data
    } catch (error) {
      console.error('Error in updateUserProfile:', error)
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    loadingTimeout,
    signInWithGoogle,
    signOut,
    updateUserProfile,
    isAdmin: userProfile?.role === 'admin',
    isUser: userProfile?.role === 'user'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
