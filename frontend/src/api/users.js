import apiClient from './client.js'

export const usersApi = {
  // Get all users with optional filters
  getUsers: async (filters = {}) => {
    return apiClient.get('/users', { params: filters })
  },

  getUser: async (id) => {
    return apiClient.get(`/users/${id}`)
  },

  updateUser: async (id, payload) => {
    return apiClient.patch(`/users/${id}`, payload)
  },

  updateUserRole: async (id, role) => {
    return apiClient.patch(`/users/${id}/role`, { role })
  },

  updateUserStatus: async (id, status) => {
    return apiClient.patch(`/users/${id}/status`, { status })
  },

  deleteUser: async (id) => {
    return apiClient.delete(`/users/${id}`)
  },
}
