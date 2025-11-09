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
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { usersApi } from '../api/users'
import { cn } from '../utils/cn'
import { showSuccess, showError } from '../utils/toast'

const PAGE_SIZE = 10

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [menuOpenUserId, setMenuOpenUserId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const createConfirmState = () => ({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    destructive: false,
    onConfirm: null
  })
  const [confirmDialog, setConfirmDialog] = useState(createConfirmState)
  const dropdownRef = useRef(null)
  const queryClient = useQueryClient()

  const { data: usersData, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['users', searchTerm, statusFilter, roleFilter, page],
    queryFn: () =>
      usersApi.getUsers({
        search: searchTerm,
        status: statusFilter,
        role: roleFilter,
        page,
        limit: PAGE_SIZE,
      }),
    refetchInterval: 30000,
    keepPreviousData: true,
  })

  const users = usersData?.users || []
  const totalUsers = usersData?.total || users.length
  const computedTotalPages =
    totalUsers === 0 ? 1 : Math.max(usersData?.totalPages ?? Math.ceil(totalUsers / PAGE_SIZE), 1)
  const showPagination = totalUsers > 0 || page > 1
  const fromRecord = totalUsers === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const toRecord = totalUsers === 0 ? 0 : Math.min(page * PAGE_SIZE, totalUsers)

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

  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter, roleFilter])

  useEffect(() => {
    if (!isLoading && usersData) {
      if (totalUsers === 0 && page !== 1) {
        setPage(1)
        return
      }

      if (page > computedTotalPages) {
        setPage(computedTotalPages)
      }
    }
  }, [usersData, isLoading, totalUsers, page, computedTotalPages])

  const closeConfirmDialog = () => setConfirmDialog(createConfirmState)
  const showConfirmDialog = (config) =>
    setConfirmDialog({
      ...createConfirmState(),
      ...config,
      open: true
    })

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

    showConfirmDialog({
      title: nextStatus === 'inactive' ? 'Deactivate User' : 'Activate User',
      message,
      confirmLabel: nextStatus === 'inactive' ? 'Deactivate' : 'Activate',
      destructive: nextStatus === 'inactive',
      onConfirm: () => {
        statusMutation.mutate({ id: user.id, status: nextStatus })
        closeConfirmDialog()
      }
    })
  }

  const handleToggleRole = (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin'
    const message =
      nextRole === 'admin'
        ? 'Granting admin access gives full control over the platform. Continue?'
        : 'This user will lose admin privileges. Continue?'

    setMenuOpenUserId(null)
    showConfirmDialog({
      title: nextRole === 'admin' ? 'Grant Admin Rights' : 'Remove Admin Rights',
      message,
      confirmLabel: nextRole === 'admin' ? 'Grant access' : 'Remove access',
      destructive: nextRole !== 'admin',
      onConfirm: () => {
        roleMutation.mutate({ id: user.id, role: nextRole })
        closeConfirmDialog()
      }
    })
  }

  const handleDeleteUser = (user) => {
    setMenuOpenUserId(null)
    showConfirmDialog({
      title: 'Delete User',
      message: 'This user will be permanently removed. This action cannot be undone. Proceed?',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => {
        deleteMutation.mutate({ id: user.id })
        closeConfirmDialog()
      }
    })
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
          <table className="min-w-[1100px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>

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
                       
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 break-all">{user.email}</span>
                    </div>
                  </td>
                
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user)}</td>
                 
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                     
                      <div className="relative" ref={menuOpenUserId === user.id ? dropdownRef : null}>
                        <button
                          onClick={() => setMenuOpenUserId((prev) => (prev === user.id ? null : user.id))}
                          className="rounded-lg border border-transparent bg-white p-2 text-gray-500 shadow-sm transition hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                          disabled={isMutating}
                        >
                          {isMutating && menuOpenUserId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </button>
                        {menuOpenUserId === user.id && (
                          <div
                            className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5"
                            role="menu"
                          >
                            <div className="px-4 py-2 border-b border-gray-100">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Actions
                              </p>
                            </div>
                            <button
                              onClick={() => handleToggleRole(user)}
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                              disabled={roleMutation.isLoading}
                              role="menuitem"
                            >
                              <Crown className="mr-2 h-4 w-4 text-purple-500" />
                              <span>{user.role === 'admin' ? 'Remove admin rights' : 'Make admin'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="flex w-full items-center px-4 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50"
                              disabled={deleteMutation.isLoading}
                              role="menuitem"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete user</span>
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
          <div className="py-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No users found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter || roleFilter ? 'Try adjusting your search or filters' : 'No users in the system yet'}
            </p>
          </div>
        )}
      </div>

      {showPagination && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-gray-600">
            {totalUsers === 0
              ? 'No users to display'
              : `Showing ${fromRecord}-${toRecord} of ${totalUsers} users`}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || isFetching || totalUsers === 0}
              className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <div className="text-sm font-medium text-gray-700">
              Page {Math.min(page, computedTotalPages)} of {computedTotalPages}
            </div>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= computedTotalPages || isFetching || totalUsers === 0}
              className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}

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

      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-6 py-5">
              <h3 className="text-lg font-semibold text-gray-900">{confirmDialog.title}</h3>
              {confirmDialog.message && (
                <p className="mt-2 text-sm text-gray-600">{confirmDialog.message}</p>
              )}
            </div>
            <div className="flex justify-end space-x-3 px-6 py-4">
              <button
                onClick={closeConfirmDialog}
                className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDialog.onConfirm?.()}
                disabled={isMutating}
                className={cn(
                  'inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2',
                  confirmDialog.destructive
                    ? 'bg-rose-600 hover:bg-rose-500 focus:ring-rose-500'
                    : 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500',
                  isMutating && 'cursor-not-allowed opacity-75'
                )}
              >
                {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {confirmDialog.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagementPage
