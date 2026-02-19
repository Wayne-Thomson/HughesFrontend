import { useState } from 'react'
import { X } from 'lucide-react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'

const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded }) => {
  const [vehicleIdentifier, setVehicleIdentifier] = useState('')
  const [identifierType, setIdentifierType] = useState('registration') // 'registration' or 'vin'
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    setVehicleIdentifier(e.target.value)
  }

  const handleInitialConfirm = () => {
    if (!vehicleIdentifier.trim()) {
      toast.error('Please enter a vehicle identifier')
      return
    }
    setShowConfirmation(true)
  }

  const handleFinalConfirm = async () => {
    setIsLoading(true)
    try {
      const payload = {
        [identifierType]: vehicleIdentifier,
      }

      const response = await apiClient.post(
        `/api/vehicle/add`,
        payload
      )

      if (response.status === 200) {
        toast.success('Vehicle added successfully!')
        onVehicleAdded()
        resetModal()
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      const errorMessage = error.response?.data?.message || 'Failed to add vehicle'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setVehicleIdentifier('')
    setIdentifierType('registration')
    setShowConfirmation(false)
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
              {showConfirmation ? 'Confirm Addition' : 'Add Vehicle'}
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
                {/* Identifier Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Search by:
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="identifierType"
                        value="registration"
                        checked={identifierType === 'registration'}
                        onChange={(e) => setIdentifierType(e.target.value)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="ml-2 text-gray-700">Registration Number</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="identifierType"
                        value="vin"
                        checked={identifierType === 'vin'}
                        onChange={(e) => setIdentifierType(e.target.value)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="ml-2 text-gray-700">VIN Number</span>
                    </label>
                  </div>
                </div>

                {/* Input Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {identifierType === 'registration' ? 'Registration Number' : 'VIN Number'}
                  </label>
                  <input
                    type="text"
                    value={vehicleIdentifier}
                    onChange={handleInputChange}
                    placeholder={
                      identifierType === 'registration'
                        ? 'e.g., AB21 XYZ'
                        : 'e.g., WVWZZZ3CZ9E123456'
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to add this vehicle?
                </p>
                <p className="text-indigo-600 font-semibold text-lg">
                  {vehicleIdentifier}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              {showConfirmation ? 'Cancel' : 'Close'}
            </button>
            <button
              onClick={
                showConfirmation ? handleFinalConfirm : handleInitialConfirm
              }
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition font-medium"
            >
              {isLoading ? 'Adding...' : showConfirmation ? 'Confirm' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddVehicleModal
