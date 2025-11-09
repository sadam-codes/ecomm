import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { usersApi } from '../api/users'

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

    const userMetadata = authUser?.user_metadata || {}

    const resolvedFullName =
      profile.full_name ||
      profile.fullName ||
      userMetadata.full_name ||
      userMetadata.fullName ||
      userMetadata.name ||
      profile.email?.split('@')?.[0] ||
      null

    const resolvedAvatar =
      profile.avatar_url ||
      profile.avatarUrl ||
      userMetadata.avatar_url ||
      userMetadata.avatarUrl ||
      userMetadata.picture ||
      null

    const resolvedRoleRaw =
      profile.role ||
      profile.Role ||
      userMetadata.role ||
      'user'

    const resolvedRole =
      typeof resolvedRoleRaw === 'string'
        ? resolvedRoleRaw.toLowerCase()
        : 'user'

    const resolvedStatus =
      profile.status || 
      profile.Status ||
      'active'

    const resolvedCreatedAt = profile.created_at || profile.createdAt || null
    const resolvedUpdatedAt = profile.updated_at || profile.updatedAt || null

    return {
      ...profile,
      full_name: resolvedFullName,
      fullName: resolvedFullName,
      avatar_url: resolvedAvatar,
      avatarUrl: resolvedAvatar,
      role: resolvedRole,
      status: resolvedStatus,
      created_at: resolvedCreatedAt,
      updated_at: resolvedUpdatedAt
    }
  }

  const persistUserToStorage = (authUser) => {
    try {
      if (authUser) {
        localStorage.setItem('user', JSON.stringify(authUser))
      } else {
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.error('Error persisting user to localStorage:', error)
    }
  }

  const persistRoleToStorage = (role) => {
    try {
      if (role) {
        localStorage.setItem('role', role)
      } else {
        localStorage.removeItem('role')
      }
    } catch (error) {
      console.error('Error persisting role to localStorage:', error)
    }
  }

  const persistAuthToken = (token) => {
    try {
      if (token) {
        localStorage.setItem('authToken', token)
      } else {
        localStorage.removeItem('authToken')
      }
    } catch (error) {
      console.error('Error persisting auth token to localStorage:', error)
    }
  }

  const clearClientStorage = () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }

    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('Error clearing sessionStorage:', error)
    }

    try {
      if (window?.caches?.keys) {
        window.caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            window.caches.delete(cacheName)
          })
        })
      }
    } catch (error) {
      console.error('Error clearing caches:', error)
    }
  }

  useEffect(() => {
    // Get initial session and load from localStorage
    const initializeAuth = async () => {
      try {
        // Load from localStorage first
        try {
          const savedUser = localStorage.getItem('user')
          const savedProfile = localStorage.getItem('userProfile')
          const savedRole = localStorage.getItem('role')
          
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
            persistUserToStorage(parsedUser)
          }
          if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile))
            if (!savedRole) {
              try {
                const parsedProfile = JSON.parse(savedProfile)
                if (parsedProfile?.role) {
                  persistRoleToStorage(parsedProfile.role)
                }
              } catch (error) {
                console.error('Error parsing saved userProfile for role:', error)
              }
            }
          }
        } catch (error) {
          console.error('Error loading from localStorage:', error)
        }

        // Get current session with timeout
        try {
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            setUser(session.user)
            persistUserToStorage(session.user)
            persistAuthToken(session?.access_token)
            await fetchUserProfile(session.user.id, session.user)
          } else {
            // Clear localStorage if no session
            try {
              persistUserToStorage(null)
              localStorage.removeItem('userProfile')
              persistRoleToStorage(null)
              persistAuthToken(null)
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
        persistUserToStorage(session?.user ?? null)
        persistAuthToken(session?.access_token ?? null)
        
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
    if (!userId) return

    const authUser = sessionUser
      ? { user_metadata: sessionUser.user_metadata, email: sessionUser.email }
      : (await supabase.auth.getUser()).data?.user

    let profileData = null

    try {
      profileData = await usersApi.getUserProfile(userId, { timeout: 4500 })
    } catch (error) {
      console.warn('Backend profile lookup timed out or failed, using fallback profile.', error)
    }

    if (!profileData) {
      const fallbackProfileString = localStorage.getItem('userProfile')

      if (fallbackProfileString) {
        try {
          const cachedProfile = JSON.parse(fallbackProfileString)
          const normalizedCached = normalizeProfile(cachedProfile, authUser)
          setUserProfile(normalizedCached)
          persistRoleToStorage(normalizedCached?.role)
          return
        } catch (parseError) {
          console.error('Error parsing cached profile from localStorage:', parseError)
        }
      }

      const fallbackRole = localStorage.getItem('role') || 'user'
      const minimalProfile = normalizeProfile(
        {
          id: userId,
          email: authUser?.email ?? null,
          role: fallbackRole
        },
        authUser
      )

      setUserProfile(minimalProfile)
      persistRoleToStorage(minimalProfile?.role)
      try {
        localStorage.setItem('userProfile', JSON.stringify(minimalProfile))
      } catch (storageError) {
        console.error('Error saving fallback userProfile to localStorage:', storageError)
      }

      return
    }

    const normalizedData = normalizeProfile(profileData, authUser)

    setUserProfile(normalizedData)
    try {
      localStorage.setItem('userProfile', JSON.stringify(normalizedData))
      persistRoleToStorage(normalizedData?.role)
    } catch (error) {
      console.error('Error saving userProfile to localStorage:', error)
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

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        // Don't throw error, continue with cleanup
      }

      clearClientStorage()
      persistAuthToken(null)

      console.log('SignOut process completed')
    } catch (error) {
      console.error('Error in signOut:', error)
      // Even if there's an error, clear everything and set state
      setUser(null)
      setUserProfile(null)
      setLoading(false)
      clearClientStorage()
      persistAuthToken(null)
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
        if (data?.role) {
          localStorage.setItem('role', data.role)
        } else {
          localStorage.removeItem('role')
        }
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
