import apiClient from './client.js'

export const productsApi = {
  // Get all products with pagination and filters
  getProducts: async (params = {}) => {
    const { page = 1, limit = 10, category, status, search } = params
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (category) queryParams.append('category', category)
    if (status) queryParams.append('status', status)
    if (search) queryParams.append('search', search)

    return apiClient.get(`/products?${queryParams.toString()}`)
  },

  // Get product statistics
  getStats: async () => {
    return apiClient.get('/products/stats')
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    return apiClient.get(`/products/category/${category}`)
  },

  // Get single product
  getProduct: async (id) => {
    return apiClient.get(`/products/${id}`)
  },

  // Create new product
  createProduct: async (productData, files = []) => {
    const formData = new FormData();

    // Add all product data fields to FormData
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        if (Array.isArray(productData[key])) {
          // For arrays, send as JSON string
          formData.append(key, JSON.stringify(productData[key]));
        } else if (typeof productData[key] === 'object' && productData[key] !== null) {
          // For objects (like specifications), send as JSON string
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });

    // Add files to FormData
    files.forEach((file, index) => {
      formData.append('images', file);
    });

    return apiClient.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update product
  updateProduct: async (id, productData, files = []) => {
    const formData = new FormData();

    // Add all product data fields to FormData
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        if (Array.isArray(productData[key])) {
          // For arrays, send as JSON string
          formData.append(key, JSON.stringify(productData[key]));
        } else if (typeof productData[key] === 'object' && productData[key] !== null) {
          // For objects (like specifications), send as JSON string
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });

    // Add files to FormData
    files.forEach((file, index) => {
      formData.append('images', file);
    });

    return apiClient.patch(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update product stock
  updateStock: async (id, quantity) => {
    return apiClient.patch(`/products/${id}/stock`, { quantity })
  },

  // Delete product
  deleteProduct: async (id) => {
    return apiClient.delete(`/products/${id}`)
  },
}
