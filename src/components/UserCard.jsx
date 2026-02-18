import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Lock, Trash2 } from 'lucide-react'

const UserCard = ({ user, setLoading, users, setUsers }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDisableConfirm, setShowDisableConfirm] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const { _id, email, username, displayName, isAdmin, isActive } = user

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    setLoading(true)
    setShowDeleteConfirm(false)
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/user/${_id}`)
      toast.success('User deleted successfully')
      setUsers(users.filter(u => u._id !== _id))
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error deleting user')
    } finally {
      setLoading(false)
    }
  }

  const handleDisableClick = () => {
    setShowDisableConfirm(true)
  }

  const handleConfirmDisable = async () => {
    setLoading(true)
    setShowDisableConfirm(false)
    try {
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/${_id}/toggle-disable`)
      toast.success(`User ${user.isActive === 'disabled' ? 'enabled' : 'disabled'} successfully`)
      setUsers(users.map(u => u._id === _id ? { ...u, isActive: u.isActive === 'disabled' ? 'enabled' : 'disabled' } : u))
    } catch (error) {
      console.error('Error disabling user:', error)
      toast.error('Error disabling user')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePasswordClick = () => {
    setShowPasswordConfirm(true)
  }

  const handleConfirmPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setShowPasswordConfirm(false)
    try {
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/${_id}/password`, { password: newPassword })
      toast.success('Password changed successfully')
      setNewPassword('')
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Error changing password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <li className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Header with Full Name */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">{capitalizeWords(displayName)}</h3>
        <p className="text-xs text-gray-500 mt-1">User ID: {_id}</p>
      </div>

      {/* User Details */}
      <div className="space-y-3 mb-4">
        {/* Username */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Username</p>
          <p className="text-base font-medium text-gray-900 mt-1">{username}</p>
        </div>

        {/* Email */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
          <p className="text-base font-medium text-gray-900 mt-1">{email}</p>
        </div>

        {/* Admin Status */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Admin Status</p>
          <div className="mt-1">
            <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
              isAdmin 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {isAdmin ? 'Administrator' : 'Regular User'}
            </span>
          </div>
        </div>

        {/* Disabled Status */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</p>
          <div className="mt-1">
            <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
              isActive === 'disabled'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {isActive === 'disabled' ? 'Disabled' : 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-2">
        <button
          onClick={handleChangePasswordClick}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <Lock size={18} />
          Change Password
        </button>
        <button
          onClick={handleDisableClick}
          className={`w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
            isActive === 'disabled'
              ? 'bg-green-100 hover:bg-green-200 text-green-700'
              : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
          }`}
        >
          {isActive === 'disabled' ? 'Enable User' : 'Disable User'}
        </button>
        <button
          onClick={handleDeleteClick}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <Trash2 size={18} />
          Delete User
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete User</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to permanently delete this user?
            </p>
            <p className="text-sm font-semibold text-gray-700 mb-2">{capitalizeWords(displayName)}</p>
            <p className="text-sm text-gray-600 mb-6">{email}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable Confirmation Modal */}
      {showDisableConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDisableConfirm(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {isActive === 'disabled' ? 'Enable User' : 'Disable User'}
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to {isActive === 'disabled' ? 'enable' : 'disable'} this user?
            </p>
            <p className="text-sm font-semibold text-gray-700 mb-2">{capitalizeWords(displayName)}</p>
            <p className="text-sm text-gray-600 mb-6">{email}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDisableConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDisable}
                className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-white ${
                  isActive === 'disabled'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {isActive === 'disabled' ? 'Enable' : 'Disable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPasswordConfirm(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
            <p className="text-gray-600 mb-4">
              Enter a new password for {capitalizeWords(displayName)}
            </p>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 6 characters)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordConfirm(false)
                  setNewPassword('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPassword}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

export default UserCard
