import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { productsApi } from '../api/products'
import { Package, CheckCircle, AlertCircle, Plus, BarChart3 } from 'lucide-react'
import UserDetailsSection from '../components/UserDetailsSection'
import { useAuth } from '../contexts/AuthContext'

const StatsPage = () => {
  const { isAdmin } = useAuth()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['product-stats'],
    queryFn: productsApi.getStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const { data: recentProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['recent-products-dashboard'],
    queryFn: () => productsApi.getProducts({ limit: 5, page: 1 }),
    refetchInterval: 60000,
  })

  if (statsLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="loading-spinner mr-4" />
        <span className="text-gray-600 text-lg">Loading dashboard...</span>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <BarChart3 className="mx-auto h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No data available</h3>
        <p className="mt-2 text-sm text-gray-500">Start by adding some products to see your statistics.</p>
        <div className="mt-6">
          <Link
            to="/products/create"
            className="btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Product
          </Link>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total',
      value: stats?.total || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active',
      value: stats?.active || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Out of Stock',
      value: stats?.outOfStock || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  const quickActions = [
    {
      name: 'Add Product',
      icon: Plus,
      href: '/products/create',
      color: 'bg-primary-500'
    },
    {
      name: 'View Products',
      icon: Package,
      href: isAdmin ? '/admin/products' : '/products',
      color: 'bg-blue-500'
    },
    {
      name: 'Low Stock',
      icon: AlertCircle,
      href: isAdmin ? '/admin/products?status=out_of_stock' : '/products?status=out_of_stock',
      color: 'bg-orange-500'
    },
  ]


  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="text-center pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your store overview and quick actions.</p>
      </div>

      {/* User Details Section */}
      <UserDetailsSection />

      {/* Key Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl ${stat.bgColor} mr-4`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name} Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.name}
                  to={action.href}
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{action.name}</p>
                    <p className="text-sm text-gray-600">Quick access</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Link
              to={isAdmin ? "/admin/products" : "/products"}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {recentProducts?.products?.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-600 mb-4">No recent activity</p>
              <Link
                to="/products/create"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts?.products?.slice(0, 4).map((product) => (
                <div key={product.id} className="flex items-center p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                  <div className="h-10 w-10 flex-shrink-0 mr-3">
                    {product.images?.[0] ? (
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={product.images[0]}
                        alt={product.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      ${Number(product.price).toFixed(2)} • {product.category}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'inactive'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                </div>
                </div>
              ))}
            </div>
          )}
        </div>
            </div>

      {/* Inventory Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Active Products</span>
              <span className="text-sm font-semibold text-green-600">
                {stats?.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                  </span>
                </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats?.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Low Stock Alert</span>
              <span className="text-sm font-semibold text-red-600">
                {stats?.total > 0 ? Math.round((stats.outOfStock / stats.total) * 100) : 0}%
                  </span>
                </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats?.total > 0 ? (stats.outOfStock / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage
