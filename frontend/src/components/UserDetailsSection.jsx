import React from 'react'
import { 
  User, 
  Mail, 
  Clock,
  Crown
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const UserDetailsSection = () => {
  const { user, userProfile, isAdmin } = useAuth()

  if (!user) return null

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not available'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <div className="flex items-center space-x-2">
          <Crown className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
            Administrator
          </span>
        </div>
      )
    }
    return (
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          User
        </span>
      </div>
    )
  }

  return (
    <div >
    
    </div>
  )
}

export default UserDetailsSection
