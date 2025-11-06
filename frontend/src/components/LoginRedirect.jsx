import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginRedirect = ({ children }) => {
  const { userProfile, loading } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is already logged in, redirect based on role
  if (userProfile) {
    if (userProfile.role === 'admin') {
      return <Navigate to="/stats" replace />
    } else {
      return <Navigate to="/home" replace />
    }
  }

  // If not logged in, show the login page
  return children
}

export default LoginRedirect
