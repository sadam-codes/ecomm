import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Users,
  Search,
  Mail,
  Calendar,
  Crown,
  User as UserIcon,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  ShieldCheck,
  Loader2
} from 'lucide-react'
import { usersApi } from '../api/users'
import { cn } from '../utils/cn'
import { showSuccess, showError } from '../utils/toast'

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [menuOpenUserId, setMenuOpenUserId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const dropdownRef = useRef(null)
  const queryClient = useQueryClient()

  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['users', searchTerm, statusFilter, roleFilter],
    queryFn: () =>
      usersApi.getUsers({
        search: searchTerm,
        status: statusFilter,
        role: roleFilter,
      }),
    refetchInterval: 30000,
    keepPreviousData: true,
  })

  const users = usersData?.users || []
  const totalUsers = usersData?.total || users.length

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpenUserId(null)
      }
    }

    if (menuOpenUserId) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpenUserId])

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => usersApi.updateUserStatus(id, status),
    onSuccess: (_, variables) => {
      showSuccess(`User status updated to ${variables.status}`)
      invalidateUsers()
    },
    onError: (mutationError) => {
      showError(mutationError.message || 'Failed to update user status')
    },
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => usersApi.updateUserRole(id, role),
    onSuccess: (_, variables) => {
      showSuccess(`User role updated to ${variables.role}`)
      invalidateUsers()
    },
    onError: (mutationError) => {
      showError(mutationError.message || 'Failed to update user role')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => usersApi.deleteUser(id),
    onSuccess: () => {
      showSuccess('User removed successfully')
      invalidateUsers()
    },
    onError: (mutationError) => {
      showError(mutationError.message || 'Failed to delete user')
    },
  })

  const isMutating = statusMutation.isLoading || roleMutation.isLoading || deleteMutation.isLoading

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (user) => {
    const isActive = user.status === 'active'
    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
        )}
      >
        {isActive ? (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </>
        )}
      </span>
    )
  }

  const getRoleBadge = (user) => {
    const isAdmin = user.role === 'admin'
    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
          isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800',
        )}
      >
        {isAdmin ? (
          <>
            <Crown className="h-3 w-3 mr-1" />
            Admin
          </>
        ) : (
          <>
            <UserIcon className="h-3 w-3 mr-1" />
            User
          </>
        )}
      </span>
    )
  }

  const getInitials = (user) => {
    if (user.avatarUrl) return ''
    if (user.fullName) {
      return user.fullName
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    }
    return user.email?.charAt(0)?.toUpperCase() || 'U'
  }

  const handleToggleStatus = (user) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active'
    const message =
      nextStatus === 'inactive'
        ? 'This user will be marked as inactive and prevented from signing in. Continue?'
        : 'This user will be reactivated. Continue?'

    if (!window.confirm(message)) return

    statusMutation.mutate({ id: user.id, status: nextStatus })
  }

  const handleToggleRole = (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin'
    const message =
      nextRole === 'admin'
        ? 'Granting admin access gives full control over the platform. Continue?'
        : 'This user will lose admin privileges. Continue?'

    if (!window.confirm(message)) return

    roleMutation.mutate({ id: user.id, role: nextRole })
    setMenuOpenUserId(null)
  }

  const handleDeleteUser = (user) => {
    if (!window.confirm('This user will be permanently removed. This action cannot be undone. Proceed?')) return
    deleteMutation.mutate({ id: user.id })
    setMenuOpenUserId(null)
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setIsDetailOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="loading-spinner mr-4" />
        <span className="text-gray-600 text-lg">Loading users...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <Users className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading users</h3>
        <p className="text-gray-600">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all users in your system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetch()}
            className="flex items-center px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
            disabled={isLoading}
          >
            <ShieldCheck className="h-4 w-4 mr-1" />
            Refresh
          </button>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{totalUsers} Users</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="lg:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sign In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName || user.email}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-100"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {getInitials(user)}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName || 'No name'}</div>
                        <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 break-all">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{formatDateTime(user.lastSignInAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{formatDateTime(user.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        disabled={isMutating}
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      <div className="relative" ref={menuOpenUserId === user.id ? dropdownRef : null}>
                        <button
                          onClick={() => setMenuOpenUserId((prev) => (prev === user.id ? null : user.id))}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          disabled={isMutating}
                        >
                          {isMutating && menuOpenUserId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </button>
                        {menuOpenUserId === user.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                            <button
                              onClick={() => handleToggleRole(user)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              disabled={roleMutation.isLoading}
                            >
                              {user.role === 'admin' ? 'Remove admin' : 'Make admin'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                              disabled={deleteMutation.isLoading}
                            >
                              <div className="flex items-center space-x-2">
                                <Trash2 className="h-4 w-4" />
                                <span>Delete user</span>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter || roleFilter ? 'Try adjusting your search or filters' : 'No users in the system yet'}
            </p>
          </div>
        )}
      </div>

      {isDetailOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                {selectedUser.avatarUrl ? (
                  <img
                    src={selectedUser.avatarUrl}
                    alt={selectedUser.fullName || selectedUser.email}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-primary-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {getInitials(selectedUser)}
                  </div>
                )}
                <div>
                  <p className="text-xl font-semibold text-gray-900">{selectedUser.fullName || 'No name'}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Status</p>
                  {getStatusBadge(selectedUser)}
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Role</p>
                  {getRoleBadge(selectedUser)}
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Last Sign In</p>
                  <p className="text-sm text-gray-900">{formatDateTime(selectedUser.lastSignInAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Joined</p>
                  <p className="text-sm text-gray-900">{formatDateTime(selectedUser.createdAt)}</p>
                </div>
              </div>

              {(selectedUser.bio || selectedUser.address || selectedUser.phone) && (
                <div className="space-y-4">
                  {selectedUser.bio && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Bio</p>
                      <p className="text-sm text-gray-900">{selectedUser.bio}</p>
                    </div>
                  )}
                  {selectedUser.address && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Address</p>
                      <p className="text-sm text-gray-900">{selectedUser.address}</p>
                    </div>
                  )}
                  {selectedUser.phone && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Phone</p>
                      <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagementPage
