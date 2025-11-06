import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Package,
  PlusCircle,
  BarChart3,
  Menu,
  X,
  ShoppingBag,
  Watch,
  Shirt,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Loader2,
  Shield,
  Crown
} from 'lucide-react'
import { productsApi } from '../api/products'
import { useAuth } from '../contexts/AuthContext'
import { showSuccess, showError } from '../utils/toast'
import useScrollToTop from '../hooks/useScrollToTop'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const profileDropdownRef = useRef(null)
  const searchRef = useRef(null)
  const { user, userProfile, signOut, isAdmin } = useAuth()

  // Scroll to top on route change
  useScrollToTop()

  // Search functionality
  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await productsApi.getProducts({ search: query, limit: 5 })
      setSearchResults(response.products || [])
      setShowSearchResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      setShowSearchResults(true)
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProducts(searchQuery)
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    if (profileDropdownOpen || showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileDropdownOpen, showSearchResults])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
    }
  }

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`)
    setShowSearchResults(false)
    setSearchQuery('')
  }

  const navigation = isAdmin ? [
    { name: 'Dashboard', href: '/stats', icon: BarChart3 },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Add Product', href: '/products/create', icon: PlusCircle },
    { name: 'User Management', href: '/admin/users', icon: User },
  ] : [
    { name: 'Home', href: '/home', icon: BarChart3 },
    { name: 'Products', href: '/products', icon: Package },
  ]

  const categories = isAdmin ? [
    { name: 'Watches', href: '/admin/products?category=watches', icon: Watch },
    { name: 'Shoes', href: '/admin/products?category=shoes', icon: Shirt },
  ] : [
    { name: 'Watches', href: '/products?category=watches', icon: Watch },
    { name: 'Shoes', href: '/products?category=shoes', icon: Shirt },
  ]

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Clean Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white shadow-xl border-r-2 border-primary-500 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header Section */}
        <div className="flex items-center justify-between h-16 px-6 bg-primary-600 border-b border-primary-700">
          <div className="flex items-center">
            <div className="bg-white rounded-lg p-2 mr-3">
              <ShoppingBag className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">ShopAdmin</span>
              <span className="text-xs text-primary-100 block">Management Portal</span>
            </div>
          </div>
          <button
            className="lg:hidden text-white hover:text-primary-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                      isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                    }`} />
                    <span className="flex-1">{item.name}</span>
                  </Link>
              )
            })}
          </div>

          {/* Categories Section */}
          <div className="mt-8">
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Product Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                    <Link
                      key={category.name}
                      to={category.href}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive(category.href)
                          ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                        isActive(category.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                      }`} />
                      <span className="flex-1">{category.name}</span>
                    </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen lg:ml-64 xl:ml-72">
        {/* Professional Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Left Section - Mobile Menu & Page Title */}
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {location.pathname === '/home' ? 'Home' :
                   location.pathname === '/stats' ? 'Dashboard' :
                   location.pathname.startsWith('/products') ? 'Products' : 'Overview'}
                </h1>
              </div>
            </div>

            {/* Center Section - Search (Desktop Only) */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                  )}
                </form>

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                          >
                            <div className="flex-shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-10 w-10 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.category} • ${product.price}
                              </div>
                            </div>
                          </button>
                        ))}
                        {searchResults.length === 5 && (
                          <div className="px-4 py-2 border-t border-gray-100">
                            <button
                              onClick={() => {
                                navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
                                setShowSearchResults(false)
                              }}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              View all results for "{searchQuery}"
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-500">No products found</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Try searching with different keywords
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Profile & Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    {userProfile?.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt={userProfile.full_name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-white">
                        {userProfile?.full_name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {userProfile?.full_name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isAdmin ? 'Administrator' : 'User'}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          {userProfile?.avatar_url ? (
                            <img
                              src={userProfile.avatar_url}
                              alt={userProfile.full_name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-white">
                              {userProfile?.full_name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {userProfile?.full_name || 'User'}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {userProfile?.email || user?.email}
                          </div>
                          <div className="flex items-center mt-1">
                            {isAdmin ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <Crown className="h-3 w-3 mr-1" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <User className="h-3 w-3 mr-1" />
                                User
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={isAdmin ? "/admin-profile" : "/profile"}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    <div className="border-t border-gray-100">
                      <button 
                        onClick={async () => {
                          try {
                            // Sign out from Supabase (this will clear localStorage and state)
                            await signOut()
                            
                            // Show success toast
                           
                            setProfileDropdownOpen(false)
                            navigate('/login')
                          } catch (error) {
                            console.error('Error signing out:', error)
                            showError('Error signing out. Please try again.')
                            // Force navigation even if signOut fails
                            navigate('/login')
                          }
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
