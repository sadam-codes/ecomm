import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '../api/products'
import ProductFormWithStepper from '../components/ProductFormWithStepper'
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

const CreateProductPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast, ToastContainer } = useToast()
  const { isAdmin } = useAuth()

  const createMutation = useMutation({
    mutationFn: ({ productData, imageFiles }) => productsApi.createProduct(productData, imageFiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-stats'] })
      showToast('Product created successfully!', 'success')
      // Redirect based on user role
      navigate(isAdmin ? '/admin/products' : '/products')
    },
    onError: (error) => {
      showToast(`Failed to create product: ${error.message}`, 'error')
    },
  })

  const handleSubmit = async (productData, imageFiles) => {
    await createMutation.mutateAsync({ productData, imageFiles })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create a new product for your e-commerce store
        </p>
      </div>

      <ProductFormWithStepper
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitButtonText="Create Product"
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default CreateProductPage
