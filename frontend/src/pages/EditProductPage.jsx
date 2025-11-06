import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '../api/products'
import ProductFormWithStepper from '../components/ProductFormWithStepper'
import { Package, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Simple Toast Hook
const useToast = () => {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const toast = { id, message, type, duration }

    setToasts(prev => [...prev, toast])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)

    return id
  }

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white max-w-sm ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )

  return { showToast, ToastContainer }
}

const EditProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast, ToastContainer } = useToast()
  const { isAdmin } = useAuth()

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data, files }) => productsApi.updateProduct(id, data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-stats'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      showToast('Product updated successfully!', 'success')
      // Redirect based on user role
      navigate(isAdmin ? `/admin/products/${id}` : `/products/${id}`)
    },
    onError: (error) => {
      showToast(`Failed to update product: ${error.message}`, 'error')
    },
  })

  const handleSubmit = async (productData, imageFiles) => {
    await updateMutation.mutateAsync({ id, data: productData, files: imageFiles })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="loading-spinner mr-4" />
        <span className="text-gray-600 text-lg">Loading product...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <Package className="mx-auto h-16 w-16 text-danger-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading product</h3>
        <p className="mt-2 text-sm text-gray-500">{error.message}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <Package className="mx-auto h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Product not found</h3>
        <p className="mt-2 text-sm text-gray-500">The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to={`/products/${id}`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Product
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update the details for {product.name}
        </p>
      </div>

      <ProductFormWithStepper
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitButtonText="Update Product"
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default EditProductPage
