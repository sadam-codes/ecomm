import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  ChevronDown,
  Grid3X3,
  List,
  Package,
  TrendingUp,
  Award,
  Shield,
  Truck
} from 'lucide-react'
import { productsApi } from '../api/products'
import { cn } from '../utils/cn'
import ProfessionalHeader from '../components/ProfessionalHeader'
import ShortFooter from '../components/ShortFooter'
import CustomDropdown from '../components/CustomDropdown'
import { useCart } from '../contexts/CartContext'

// Custom Category Dropdown Component
const CategoryDropdown = ({ selectedCategory, onCategoryChange, categories }) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          {selectedCategoryData?.icon && (
            <selectedCategoryData.icon className="h-5 w-5 text-primary-600" />
          )}
          <span className="text-sm font-medium text-gray-900">
            {selectedCategoryData?.label || 'All Categories'}
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-gray-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="py-2">
              <button
                onClick={() => {
                  onCategoryChange('')
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3",
                  !selectedCategory && "bg-primary-50 text-primary-700"
                )}
              >
                <Package className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">All Categories</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    onCategoryChange(category.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3",
                    selectedCategory === category.value && "bg-primary-50 text-primary-700"
                  )}
                >
                  <category.icon className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addToCart, toggleWishlist, isInWishlist, isLoading } = useCart()

  const handleLike = () => {
    toggleWishlist(product.id)
  }

  const handleAddToCart = async () => {
    const success = await addToCart(product, 1)
    if (success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="flex">
          <div className="w-48 h-32 flex-shrink-0">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={cn(
                    "px-2 py-1 text-xs font-semibold rounded-full",
                    product.category === 'watches' 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                  )}>
                    {product.category}
                  </span>
                  {product.discount && (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  ${Number(product.price).toFixed(2)}
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                  <button 
                    onClick={handleLike}
                    className={cn(
                      "p-2 transition-colors",
                      isInWishlist(product.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-current")} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover transition-transform duration-300",
                isHovered && "scale-105"
              )}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Overlay Actions */}
        <div className={cn(
          "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center",
          isHovered && "bg-opacity-20"
        )}>
          <div className={cn(
            "opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex space-x-2",
            isHovered && "opacity-100 translate-y-0"
          )}>
            <Link
              to={`/products/${product.id}`}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-primary-50 transition-colors"
            >
              <Eye className="h-5 w-5 text-gray-700" />
            </Link>
            <button 
              onClick={handleLike}
              className={cn(
                "p-3 bg-white rounded-full shadow-lg transition-colors",
                isInWishlist(product.id) ? "text-red-500" : "text-gray-700 hover:text-red-500 hover:bg-red-50"
              )}
            >
              <Heart className={cn("h-5 w-5", isInWishlist(product.id) && "fill-current")} />
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={isLoading}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="loading-spinner h-5 w-5" />
              ) : (
                <ShoppingCart className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
              -{product.discount}%
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            "px-2 py-1 text-xs font-semibold rounded-full",
            product.category === 'watches' 
              ? "bg-blue-100 text-blue-800" 
              : "bg-purple-100 text-purple-800"
          )}>
            {product.category}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.5</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            Stock: {product.stock}
          </div>
        </div>
      </div>
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          Added to cart!
        </div>
      )}
    </div>
  )
}

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')

  const categories = [
    { value: 'watches', label: 'Watches', icon: Package },
    { value: 'shoes', label: 'Shoes', icon: Package }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' }
  ]

  // Fetch products
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory],
    queryFn: () => productsApi.getProducts({
      page: 1,
      limit: 20,
      search: searchTerm,
      category: selectedCategory,
    }),
  })

  const products = productsData?.products || []

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case 'price-high':
        filtered.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order (newest)
        break
    }

    return filtered
  }, [products, sortBy])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Premium
              <span className="block text-yellow-300">Watches & Shoes</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Explore our curated collection of luxury watches and premium footwear. 
              Quality, style, and craftsmanship in every piece.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for watches, shoes, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-yellow-300 focus:outline-none text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentic Products</h3>
              <p className="text-gray-600">100% genuine products with authenticity guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $100</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handpicked items from top brands</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with regular discounts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Controls */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-64">
                <CategoryDropdown
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  categories={categories}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <CustomDropdown
                  options={sortOptions}
                  value={sortBy}
                  onChange={(option) => setSortBy(option.value)}
                  placeholder="Sort by"
                  className="min-w-[180px]"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'grid' 
                    ? "bg-primary-100 text-primary-600" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'list' 
                    ? "bg-primary-100 text-primary-600" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="loading-spinner mr-4" />
            <span className="text-gray-600 text-lg">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search or filters'
                : 'No products available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-6"
          )}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              Load More Products
            </button>
          </div>
        )}
      </div>
      
        <ShortFooter />
    </div>
  )
}

export default HomePage
