import { useState } from 'react'
import { X } from 'lucide-react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
    isAdmin: false,
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleInitialSubmit = () => {
    if (!formData.displayName.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    setShowConfirmation(true)
  }

  const handleFinalConfirm = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.post(
        `/api/user/create`,
        {
          displayName: formData.displayName.trim().toLowerCase(),
          username: formData.username.trim().toLowerCase(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password.trim(),
          isAdmin: formData.isAdmin,
        }
      )

      if (response.status === 200 || response.status === 201) {
        toast.success('User added successfully!')
        // Pass the new user data to parent component
        onUserAdded(response.data.user)
        resetModal()
      }
    } catch (error) {
      console.error('Error adding user:', error)
      const errorMessage = error.response?.data?.message || 'Failed to add user'
      toast.error(errorMessage)
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setFormData({
      displayName: '',
      username: '',
      email: '',
      password: '',
      isAdmin: false,
    })
    setShowConfirmation(false)
    setIsLoading(false)
    onClose()
  }

  const handleCancel = () => {
    if (isLoading) return // Don't allow closing during requests
    if (showConfirmation) {
      setShowConfirmation(false)
    } else {
      resetModal()
    }
  }

  const handleOverlayClick = () => {
    if (!isLoading) {
      handleCancel()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {showConfirmation ? 'Confirm Addition' : 'Add User'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="size-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!showConfirmation ? (
              <>
                {/* Name Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>

                {/* Username Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>

                {/* Password Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>

                {/* Is Admin Checkbox */}
                <div className="mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={formData.isAdmin}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Administrator</span>
                  </label>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-900 font-semibold mb-4">
                  Are you sure you want to add this user?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-left">
                  <p className="text-sm text-gray-900"><span className="font-semibold">Name:</span> {formData.displayName}</p>
                  <p className="text-sm text-gray-900"><span className="font-semibold">Username:</span> {formData.username}</p>
                  <p className="text-sm text-gray-900"><span className="font-semibold">Email:</span> {formData.email}</p>
                  <p className="text-sm text-gray-900"><span className="font-semibold">Admin:</span> {formData.isAdmin ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {showConfirmation ? 'Cancel' : 'Close'}
            </button>
            <button
              onClick={
                showConfirmation ? handleFinalConfirm : handleInitialSubmit
              }
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
            >
              {isLoading ? 'Adding...' : showConfirmation ? 'Confirm' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddUserModal
