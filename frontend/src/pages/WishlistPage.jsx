import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ProfessionalHeader from '../components/ProfessionalHeader'
import ShortFooter from '../components/ShortFooter'
import { useCart } from '../contexts/CartContext'
import { productsApi } from '../api/products'
import {
  Heart,
  ShoppingCart,
  Trash2,
  Package,
  ArrowLeft
} from 'lucide-react'
import { cn } from '../utils/cn'

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart, isLoading: cartLoading } = useCart()

  // Fetch all products to get details for wishlist items
  const { data: allProducts, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts(),
  })

  // Filter products that are in wishlist
  const wishlistProducts = React.useMemo(() => {
    if (!Array.isArray(allProducts) || !Array.isArray(wishlist)) {
      return []
    }
    return allProducts.filter(product => wishlist.includes(product.id))
  }, [allProducts, wishlist])

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId)
  }

  const handleAddToCart = async (product) => {
    await addToCart(product, 1)
  }

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ShortFooter />
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Package className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading products</h3>
            <p className="text-gray-600">{productsError.message}</p>
          </div>
        </div>
        <ShortFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/home"
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Package className="h-5 w-5 mr-2" />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link
                    to={`/products/${product.id}`}
                    className="block group"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {product.stock > 0 ? (
                      <span className="text-sm text-green-600 font-medium">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={cartLoading || product.stock === 0}
                      className={cn(
                        "flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        product.stock === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-primary-600 text-white hover:bg-primary-700"
                      )}
                    >
                      {cartLoading ? (
                        <div className="loading-spinner h-4 w-4" />
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 rounded-lg transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ShortFooter />
    </div>
  )
}

export default WishlistPage
