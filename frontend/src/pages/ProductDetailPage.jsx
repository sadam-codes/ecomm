import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api/products'
import { Package, Edit, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { isAdmin } = useAuth()

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
  })

  const nextImage = () => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  const selectImage = (index) => {
    setCurrentImageIndex(index)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner mr-3" />
        <span className="text-gray-500">Loading product...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading product</h3>
        <p className="mt-1 text-sm text-gray-500">{error.message}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
        <p className="mt-1 text-sm text-gray-500">The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to={isAdmin ? "/admin/products" : "/products"} className="hover:text-gray-700 transition-colors">
              Products
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Product Images - Left Column */}
          <div className="xl:col-span-1">
            <div className="product-card p-6">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="product-image-container">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img
                        src={product.images[currentImageIndex]}
                        alt={`${product.name} - Image ${currentImageIndex + 1}`}
                        className="product-image"
                      />

                      {/* Navigation Arrows */}
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-5 w-5 text-gray-700" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-5 w-5 text-gray-700" />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        {currentImageIndex + 1} / {product.images.length}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => selectImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${index === currentImageIndex
                            ? 'border-primary-500 ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-primary-300'
                          }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details - Right Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Main Product Info */}
            <div className="product-card p-6 sm:p-8">
              <div className="space-y-6">
                {/* Product Title & Brand */}
                <div>
                  <h1 className="product-title">{product.name}</h1>
                  {product.brand && product.model && (
                    <p className="text-lg text-gray-600 mt-2">
                      {product.brand} - {product.model}
                    </p>
                  )}
                </div>

                {/* Price Section */}
                <div className="py-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-baseline space-x-3">
                      <span className="product-price text-primary-600">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      {product.discount && product.discount > 0 && (
                        <span className="text-lg sm:text-xl text-gray-400 line-through">
                          ${(Number(product.price) * (1 + product.discount / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.discount && product.discount > 0 && (
                      <span className="product-badge bg-green-100 text-green-800 text-xs sm:text-sm w-fit">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                    <p className="product-description">{product.description}</p>
                  </div>
                )}

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="product-info-item">
                    <span className="product-info-label">Category</span>
                    <span className="product-info-value">{product.category}</span>
                  </div>
                  <div className="product-info-item">
                    <span className="product-info-label">Status</span>
                    <span className={`product-info-value ${product.status === 'active' ? 'text-green-600' :
                        product.status === 'inactive' ? 'text-gray-600' : 'text-red-600'
                      }`}>
                      {product.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="product-info-item">
                    <span className="product-info-label">Stock</span>
                    <span className={`product-info-value ${product.stock > 10 ? 'text-green-600' :
                        product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                      {product.stock} units
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="product-card p-6 sm:p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-6">Specifications</h3>
                <div className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-100 last:border-b-0 gap-2">
                      <span className="product-spec-label">{key}</span>
                      <span className="product-spec-value text-right sm:text-left">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="product-card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="btn-primary flex items-center justify-center flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Link>
                <Link
                  to={isAdmin ? "/admin/products" : "/products"}
                  className="btn-secondary flex items-center justify-center flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
