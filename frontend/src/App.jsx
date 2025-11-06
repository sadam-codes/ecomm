import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ThemeProvider } from './contexts/ThemeContext'
import DashboardLayout from './components/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleBasedRedirect from './components/RoleBasedRedirect'
import LoginRedirect from './components/LoginRedirect'
import ScrollToTop from './components/ScrollToTop'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CreateProductPage from './pages/CreateProductPage'
import EditProductPage from './pages/EditProductPage'
import StatsPage from './pages/StatsPage'
import UserProfilePage from './pages/UserProfilePage'
import AdminProfilePage from './pages/AdminProfilePage'
import UserProductDetailPage from './pages/UserProductDetailPage'
import UserProductsPage from './pages/UserProductsPage'
import UserSettingsPage from './pages/UserSettingsPage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import UserManagementPage from './pages/UserManagementPage'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <LoginRedirect>
              <LoginPage />
            </LoginRedirect>
          } />
          
          {/* Role-based redirect */}
          <Route path="/" element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          } />
          
          {/* Home page for users */}
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          
          {/* User Products Page */}
          <Route path="/products" element={
            <ProtectedRoute>
              <UserProductsPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Products Page */}
          <Route path="/admin/products" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout>
                <ProductsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/products/create" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout>
                <CreateProductPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Admin Product Detail (with edit features) */}
          <Route path="/admin/products/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout>
                <ProductDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* User Product Detail (no admin features) */}
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <UserProductDetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/products/:id/edit" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout>
                <EditProductPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/stats" element={
            <ProtectedRoute>
              <DashboardLayout>
                <StatsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Profile Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin-profile" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProfilePage />
            </ProtectedRoute>
          } />
          
          {/* User Settings */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <UserSettingsPage />
            </ProtectedRoute>
          } />

          {/* Wishlist */}
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          } />

          {/* Cart */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />

          {/* User Management (Admin Only) */}
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout>
                <UserManagementPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
