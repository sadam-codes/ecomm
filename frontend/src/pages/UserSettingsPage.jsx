import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import ProfessionalHeader from '../components/ProfessionalHeader'
import ShortFooter from '../components/ShortFooter'
import {
  User,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  Smartphone,
  MapPin,
  Calendar
} from 'lucide-react'
import { cn } from '../utils/cn'

const UserSettingsPage = () => {
  const { userProfile, user, updateUserProfile } = useAuth()
  const { 
    theme, 
    primaryColor, 
    accentColor, 
    fontSize, 
    compactMode,
    updateTheme, 
    updatePrimaryColor, 
    updateAccentColor, 
    updateFontSize, 
    updateCompactMode,
    resetTheme 
  } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    full_name: userProfile?.full_name || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    bio: userProfile?.bio || ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    priceAlerts: false
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    primaryColor: primaryColor,
    accentColor: accentColor,
    fontSize: fontSize,
    compactMode: compactMode
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      await updateUserProfile(profileData)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAppearanceChange = (key, value) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: value }))
    
    // Apply changes immediately
    switch (key) {
      case 'theme':
        updateTheme(value)
        break
      case 'primaryColor':
        updatePrimaryColor(value)
        break
      case 'accentColor':
        updateAccentColor(value)
        break
      case 'fontSize':
        updateFontSize(value)
        break
      case 'compactMode':
        updateCompactMode(value)
        break
      default:
        break
    }
  }

  const handleResetAppearance = () => {
    resetTheme()
    setAppearanceSettings({
      theme: 'light',
      primaryColor: 'blue',
      accentColor: 'purple',
      fontSize: 'medium',
      compactMode: false
    })
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      // Simulate saving notification settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating notifications:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePrivacy = async () => {
    setIsSaving(true)
    try {
      // Simulate saving privacy settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating privacy:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'billing', name: 'Billing', icon: CreditCard }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      activeTab === tab.id
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? (
                        <>
                          <div className="loading-spinner mr-2 h-4 w-4" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>

                  {showSuccess && (
                    <div className="mb-6 flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800">Profile updated successfully!</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.full_name}
                          onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userProfile?.email || user?.email || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member Since
                        </label>
                        <input
                          type="text"
                          value={new Date(userProfile?.created_at).toLocaleDateString()}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                    <button
                      onClick={handleSaveNotifications}
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? (
                        <>
                          <div className="loading-spinner mr-2 h-4 w-4" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Order Updates</div>
                            <div className="text-sm text-gray-500">Get notified about order status changes</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.orderUpdates}
                            onChange={(e) => setNotificationSettings({...notificationSettings, orderUpdates: e.target.checked})}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Marketing Emails</div>
                            <div className="text-sm text-gray-500">Receive promotional offers and new product updates</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.marketingEmails}
                            onChange={(e) => setNotificationSettings({...notificationSettings, marketingEmails: e.target.checked})}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Price Alerts</div>
                            <div className="text-sm text-gray-500">Get notified when items on your wishlist go on sale</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.priceAlerts}
                            onChange={(e) => setNotificationSettings({...notificationSettings, priceAlerts: e.target.checked})}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">SMS Updates</div>
                            <div className="text-sm text-gray-500">Receive text messages for important updates</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.smsNotifications}
                            onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
                    <button
                      onClick={handleSavePrivacy}
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? (
                        <>
                          <div className="loading-spinner mr-2 h-4 w-4" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Profile Visibility</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Public Profile</div>
                            <div className="text-sm text-gray-500">Make your profile visible to other users</div>
                          </div>
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="public"
                            checked={privacySettings.profileVisibility === 'public'}
                            onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Private Profile</div>
                            <div className="text-sm text-gray-500">Keep your profile private</div>
                          </div>
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="private"
                            checked={privacySettings.profileVisibility === 'private'}
                            onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Show Email</div>
                            <div className="text-sm text-gray-500">Display your email on your profile</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showEmail}
                            onChange={(e) => setPrivacySettings({...privacySettings, showEmail: e.target.checked})}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Show Phone</div>
                            <div className="text-sm text-gray-500">Display your phone number on your profile</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showPhone}
                            onChange={(e) => setPrivacySettings({...privacySettings, showPhone: e.target.checked})}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Allow Messages</div>
                            <div className="text-sm text-gray-500">Let other users send you messages</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.allowMessages}
                            onChange={(e) => setPrivacySettings({...privacySettings, allowMessages: e.target.checked})}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Appearance Settings</h2>
                    <button
                      onClick={handleResetAppearance}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      Reset to Default
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Theme Selection */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button 
                          onClick={() => handleAppearanceChange('theme', 'light')}
                          className={cn(
                            "p-4 border-2 rounded-lg transition-all",
                            appearanceSettings.theme === 'light' 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="w-full h-8 bg-white rounded mb-2 border"></div>
                          <div className="text-sm font-medium text-gray-900">Light</div>
                          <div className="text-xs text-gray-500">Clean and bright</div>
                        </button>
                        <button 
                          onClick={() => handleAppearanceChange('theme', 'dark')}
                          className={cn(
                            "p-4 border-2 rounded-lg transition-all",
                            appearanceSettings.theme === 'dark' 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="w-full h-8 bg-gray-800 rounded mb-2"></div>
                          <div className="text-sm font-medium text-gray-900">Dark</div>
                          <div className="text-xs text-gray-500">Easy on the eyes</div>
                        </button>
                        <button 
                          onClick={() => handleAppearanceChange('theme', 'auto')}
                          className={cn(
                            "p-4 border-2 rounded-lg transition-all",
                            appearanceSettings.theme === 'auto' 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="w-full h-8 bg-gradient-to-r from-white to-gray-800 rounded mb-2"></div>
                          <div className="text-sm font-medium text-gray-900">Auto</div>
                          <div className="text-xs text-gray-500">System preference</div>
                        </button>
                      </div>
                    </div>

                    {/* Primary Color */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Color</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
                          { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
                          { name: 'Green', value: 'green', color: 'bg-green-500' },
                          { name: 'Red', value: 'red', color: 'bg-red-500' },
                          { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
                          { name: 'Pink', value: 'pink', color: 'bg-pink-500' },
                          { name: 'Indigo', value: 'indigo', color: 'bg-indigo-500' },
                          { name: 'Teal', value: 'teal', color: 'bg-teal-500' }
                        ].map((color) => (
                          <button
                            key={color.value}
                            onClick={() => handleAppearanceChange('primaryColor', color.value)}
                            className={cn(
                              "flex items-center space-x-3 p-3 border-2 rounded-lg transition-all",
                              appearanceSettings.primaryColor === color.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div className={cn("w-6 h-6 rounded-full", color.color)}></div>
                            <span className="text-sm font-medium text-gray-900">{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Accent Color</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
                          { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
                          { name: 'Green', value: 'green', color: 'bg-green-500' },
                          { name: 'Pink', value: 'pink', color: 'bg-pink-500' },
                          { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
                          { name: 'Red', value: 'red', color: 'bg-red-500' },
                          { name: 'Indigo', value: 'indigo', color: 'bg-indigo-500' },
                          { name: 'Teal', value: 'teal', color: 'bg-teal-500' }
                        ].map((color) => (
                          <button
                            key={color.value}
                            onClick={() => handleAppearanceChange('accentColor', color.value)}
                            className={cn(
                              "flex items-center space-x-3 p-3 border-2 rounded-lg transition-all",
                              appearanceSettings.accentColor === color.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div className={cn("w-6 h-6 rounded-full", color.color)}></div>
                            <span className="text-sm font-medium text-gray-900">{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Font Size</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { name: 'Small', value: 'small', size: 'text-sm' },
                          { name: 'Medium', value: 'medium', size: 'text-base' },
                          { name: 'Large', value: 'large', size: 'text-lg' }
                        ].map((size) => (
                          <button
                            key={size.value}
                            onClick={() => handleAppearanceChange('fontSize', size.value)}
                            className={cn(
                              "p-4 border-2 rounded-lg transition-all text-center",
                              appearanceSettings.fontSize === size.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div className={cn("font-medium text-gray-900 mb-1", size.size)}>
                              Sample Text
                            </div>
                            <div className="text-xs text-gray-500">{size.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Compact Mode */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Layout</h3>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Compact Mode</div>
                          <div className="text-sm text-gray-500">Reduce spacing for a more compact layout</div>
                        </div>
                        <button
                          onClick={() => handleAppearanceChange('compactMode', !appearanceSettings.compactMode)}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            appearanceSettings.compactMode ? "bg-blue-600" : "bg-gray-200"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                              appearanceSettings.compactMode ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Payment</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-blue-800 font-medium">Payment Methods</span>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">Manage your payment methods and billing information</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">Order History</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">View your past orders and receipts</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        <ShortFooter />
    </div>
  )
}

export default UserSettingsPage
