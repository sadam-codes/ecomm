import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProfessionalHeader from '../components/ProfessionalHeader'
import ShortFooter from '../components/ShortFooter'
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Shield,
  Crown,
  Edit,
  Save,
  X,
  Camera,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { cn } from '../utils/cn'

const UserProfilePage = () => {
  const { userProfile, user, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    full_name: userProfile?.full_name || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    bio: userProfile?.bio || ''
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    console.log('Saving profile data:', editData)
    setIsSaving(true)
    try {
      const result = await updateUserProfile(editData)
      console.log('Profile update result:', result)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      full_name: userProfile?.full_name || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || '',
      bio: userProfile?.bio || ''
    })
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    {userProfile?.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt={userProfile.full_name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-primary-600" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {userProfile?.full_name || 'User'}
                  </h1>
                  <p className="text-primary-100">{userProfile?.email || user?.email}</p>
                  <div className="flex items-center mt-2">
                    {userProfile?.role === 'admin' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Crown className="h-4 w-4 mr-1" />
                        Administrator
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <User className="h-4 w-4 mr-1" />
                        Customer
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="loading-spinner mr-2 h-4 w-4" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{userProfile?.email || user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.full_name}
                          onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile?.full_name || 'Not set'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile?.phone || 'Not set'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      {isEditing ? (
                        <textarea
                          value={editData.address}
                          onChange={(e) => setEditData({...editData, address: e.target.value})}
                          rows={3}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile?.address || 'Not set'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Account Status</label>
                      <div className="flex items-center mt-1">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-green-700 font-medium">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Member Since</label>
                      <p className="text-gray-900">{formatDate(userProfile?.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-gray-900">{formatDate(userProfile?.updated_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Login Method</label>
                      <p className="text-gray-900">Google OAuth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-700">
                  {userProfile?.bio || 'No bio available. Click "Edit Profile" to add one.'}
                </p>
              )}
            </div>

            {/* Google Account Information */}
            {user && (
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  Google Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Google ID</label>
                    <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Verified</label>
                    <div className="flex items-center">
                      {user.email_confirmed_at ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-700">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                          <span className="text-yellow-700">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Sign In</label>
                    <p className="text-gray-900">{formatDate(user.last_sign_in_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Provider</label>
                    <p className="text-gray-900">Google</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

        <ShortFooter />
    </div>
  )
}

export default UserProfilePage
