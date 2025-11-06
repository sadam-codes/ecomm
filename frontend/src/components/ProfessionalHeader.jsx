import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showSuccess, showError } from '../utils/toast'
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Palette
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useTheme } from '../contexts/ThemeContext'

const ProfessionalHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { userProfile, signOut } = useAuth()
  const { getCartCount, getWishlistCount } = useCart()
  const { theme, updateTheme } = useTheme()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase (this will clear localStorage and state)
      await signOut()
      
      // Show success toast

      
      // Navigate to login page immediately
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      showError('Error signing out. Please try again.')
      // Force navigation even if signOut fails
      navigate('/login')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navigationItems = [
    { name: 'Home', href: '/home', icon: '🏠' },
    { name: 'Products', href: '/products', icon: '🛍️' },
    { name: 'Watches', href: '/products?category=watches', icon: '⌚' },
    { name: 'Shoes', href: '/products?category=shoes', icon: '👟' },
  ]

  return (
    <header className="bg-theme-primary shadow-theme-md border-b border-theme-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-theme-primary">ShopHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 text-theme-secondary hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden xl:block">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="block w-full pl-9 pr-3 py-2 border border-theme-primary rounded-lg leading-5 bg-theme-primary placeholder-theme-tertiary focus:outline-none focus:placeholder-theme-tertiary focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-theme-primary"
                />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="p-2 text-theme-secondary hover:text-primary-600 hover:bg-theme-secondary rounded-lg transition-colors duration-200"
                title={`Current theme: ${theme}`}
              >
                {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-theme-primary rounded-lg shadow-theme-lg border border-theme-primary py-2 z-50">
                  <button
                    onClick={() => {
                      console.log('Switching to light mode')
                      updateTheme('light')
                      setIsThemeOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-theme-secondary hover:bg-theme-secondary"
                  >
                    <Sun className="h-4 w-4 mr-3" />
                    Light Mode
                  </button>
                  <button
                    onClick={() => {
                      console.log('Switching to dark mode')
                      updateTheme('dark')
                      setIsThemeOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-theme-secondary hover:bg-theme-secondary"
                  >
                    <Moon className="h-4 w-4 mr-3" />
                    Dark Mode
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-theme-secondary hover:text-red-600 hover:bg-theme-secondary rounded-lg transition-colors duration-200"
            >
              <Heart className="h-5 w-5" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-theme-secondary hover:text-primary-600 hover:bg-theme-secondary rounded-lg transition-colors duration-200"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 text-theme-secondary hover:text-primary-600 hover:bg-theme-secondary rounded-lg transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden lg:block text-sm font-medium">
                  {userProfile?.full_name || 'User'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-theme-primary rounded-lg shadow-theme-lg border border-theme-primary py-2 z-50">
                  <div className="px-4 py-3 border-b border-theme-primary">
                    <p className="text-sm font-medium text-theme-primary">
                      {userProfile?.full_name || 'User'}
                    </p>
                    <p className="text-sm text-theme-tertiary">
                      {userProfile?.email || 'user@example.com'}
                    </p>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-theme-secondary hover:bg-theme-secondary"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-theme-secondary hover:bg-theme-secondary"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-theme-secondary hover:text-primary-600 hover:bg-theme-secondary rounded-lg transition-colors duration-200"
              title="Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-theme-primary border-t border-theme-primary">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="block w-full pl-10 pr-3 py-2 border border-theme-primary rounded-lg leading-5 bg-theme-primary placeholder-theme-tertiary focus:outline-none focus:placeholder-theme-tertiary focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-theme-primary"
                    />
                  </div>
                </form>
              </div>

              {/* Mobile Navigation Links */}
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 text-theme-secondary hover:text-primary-600 hover:bg-theme-secondary px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default ProfessionalHeader
