const API_BASE_URL = 'http://localhost:3000/api'

export const usersApi = {
  // Get all users with optional filters
  getUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams()
    
    if (filters.search) queryParams.append('search', filters.search)
    if (filters.status) queryParams.append('status', filters.status)
    if (filters.role) queryParams.append('role', filters.role)
    
    const url = `${API_BASE_URL}/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch users')
    }
    
    return response.json()
  }
}
