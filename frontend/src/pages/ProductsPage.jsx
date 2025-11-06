import React, { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { productsApi } from '../api/products'
import { cn } from '../utils/cn'
import CustomDropdown from '../components/CustomDropdown'

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
          className={cn(
            "px-4 py-3 rounded-lg shadow-lg text-white max-w-sm",
            toast.type === 'success' && "bg-green-500",
            toast.type === 'error' && "bg-red-500",
            toast.type === 'warning' && "bg-yellow-500",
            toast.type === 'info' && "bg-blue-500"
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )

  return { showToast, ToastContainer }
}

const ProductsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, productId: null, productName: '' })

  const queryClient = useQueryClient()
  const { showToast, ToastContainer } = useToast()

  // Dropdown options
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'watches', label: 'Watches' },
    { value: 'shoes', label: 'Shoes' }
  ]

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'out_of_stock', label: 'Out of Stock' }
  ]

  // Read URL parameters and set initial filter state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    if (category) {
      setCategoryFilter(category)
    }
    if (status) {
      setStatusFilter(status)
    }
  }, [location.search])

  // Fetch products with filters
  const {
    data: productsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['products', currentPage, searchTerm, categoryFilter, statusFilter],
    queryFn: () => productsApi.getProducts({
      page: currentPage,
      limit: 10,
      search: searchTerm,
      category: categoryFilter,
      status: statusFilter,
    }),
  })


  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      showToast('Product deleted successfully!', 'success')
    },
    onError: (error) => {
      showToast(`Failed to delete product: ${error.message}`, 'error')
    },
  })

  const handleDelete = (productId, productName) => {
    setDeleteConfirm({ show: true, productId, productName })
  }

  const confirmDelete = async () => {
    await deleteMutation.mutateAsync(deleteConfirm.productId)
    setDeleteConfirm({ show: false, productId: null, productName: '' })
  }

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, productId: null, productName: '' })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    if (searchTerm.trim()) {
      showToast(`Searching for "${searchTerm}"`, 'info')
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setStatusFilter('')
    setCurrentPage(1)
    showToast('Filters cleared', 'info')
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-600" />
      case 'out_of_stock':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full"

    switch (status) {
      case 'active':
        return cn(baseClasses, 'bg-success-100 text-success-800')
      case 'inactive':
        return cn(baseClasses, 'bg-gray-100 text-gray-800')
      case 'out_of_stock':
        return cn(baseClasses, 'bg-danger-100 text-danger-800')
      default:
        return cn(baseClasses, 'bg-gray-100 text-gray-800')
    }
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading products</h3>
        <p className="mt-1 text-sm text-gray-500">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Professional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Product Management</h1>
          <p className="text-gray-600">Manage your watches and shoes inventory efficiently</p>
        </div>
        <Link
          to="/products/create"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, brand, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>
            <div className="flex items-center space-x-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary"
              >
                <Filter className="h-1 w-2 mr-2" />
                Filters
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Search
              </button>
            </div>
          </form>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="form-grid">
                <div>
                  <div className="form-group">
                    <label className="form-label">
                      Category
                    </label>
                    <CustomDropdown
                      options={categoryOptions}
                      value={categoryFilter}
                      onChange={(option) => setCategoryFilter(option.value)}
                      placeholder="Select category"
                      variant="admin"
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="form-group">
                    <label className="form-label">
                      Status
                    </label>
                    <CustomDropdown
                      options={statusOptions}
                      value={statusFilter}
                      onChange={(option) => setStatusFilter(option.value)}
                      placeholder="Select status"
                      variant="admin"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn-secondary w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="loading-spinner mr-4" />
            <span className="text-gray-600 text-lg">Loading products...</span>
          </div>
        ) : productsData?.products?.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm || categoryFilter || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first product'
              }
            </p>
            {searchTerm || categoryFilter || statusFilter ? (
              <button
                onClick={clearFilters}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/products/create"

              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Price
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                    Stock
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productsData?.products?.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={product.images[0]}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {product.category} • ${Number(product.price).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 hidden sm:block">
                            {product.brand} {product.model && `- ${product.model}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap hidden sm:table-cell">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        product.category === 'watches'
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      )}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      ${Number(product.price).toFixed(2)}
                      {product.discount && (
                        <span className="ml-2 text-xs text-green-600">
                          -{product.discount}%
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                      {product.stock}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex items-center">
                        {getStatusIcon(product.status)}
                        <span className={cn("ml-2", getStatusBadge(product.status))}>
                          {product.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          to={`/admin/products/${product.id}`}
                          className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-2 rounded-lg transition-colors"
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 p-2 rounded-lg transition-colors"
                          disabled={deleteMutation.isPending}
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


        {/* Pagination */}
        {productsData && productsData.totalPages > 1 && (
          <div className="bg-gray-50 px-4 sm:px-6 py-3 flex items-center justify-between border-t border-gray-200 rounded-b-xl">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, productsData.totalPages))}
                disabled={currentPage === productsData.totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-semibold text-gray-900">
                    {((currentPage - 1) * 10) + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-gray-900">
                    {Math.min(currentPage * 10, productsData.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900">{productsData.total}</span> results
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, productsData.totalPages))}
                  disabled={currentPage === productsData.totalPages}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete <strong>{deleteConfirm.productName}</strong>?
                  This will permanently remove the product from your inventory.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {deleteMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <div className="loading-spinner mr-2 h-4 w-4" />
                      Deleting...
                    </span>
                  ) : (
                    'Delete Product'
                  )}
                </button>
                <button
                  onClick={cancelDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default ProductsPage
