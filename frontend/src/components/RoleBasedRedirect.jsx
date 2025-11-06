import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const RoleBasedRedirect = () => {
  const { user, userProfile, loading } = useAuth()
  const [maxWaitReached, setMaxWaitReached] = useState(false)

  // Wait for profile to load if user exists but profile is null
  // This handles race conditions where user is set but profile fetch is still in progress
  useEffect(() => {
    if (user && !userProfile && !loading) {
      // Give it time for the profile to load (max 2 seconds)
      const timeout = setTimeout(() => {
        setMaxWaitReached(true)
      }, 2000)

      return () => clearTimeout(timeout)
    } else if (userProfile) {
      // Reset when profile is loaded
      setMaxWaitReached(false)
    }
  }, [user, userProfile, loading])

  // Show loading while checking authentication or if user exists but profile is still loading
  if (loading || (user && !userProfile && !maxWaitReached)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-600">
            {loading ? 'Loading...' : 'Loading profile...'}
          </p>
        </div>
      </div>
    )
  }

  // Only redirect when we have a profile
  if (userProfile) {
    if (userProfile.role === 'admin') {
      return <Navigate to="/stats" replace />
    } else if (userProfile.role === 'user') {
      return <Navigate to="/home" replace />
    }
  }

  // Default fallback (should not reach here if properly authenticated)
  // If we've waited and still no profile, redirect to home
  return <Navigate to="/home" replace />
}

export default RoleBasedRedirect
