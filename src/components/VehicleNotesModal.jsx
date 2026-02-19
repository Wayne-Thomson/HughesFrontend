import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'

const VehicleNotesModal = ({ isOpen, onClose, vehicle, onVehicleUpdate }) => {
  const [customNotes, setCustomNotes] = useState('')
  const [originalNotes, setOriginalNotes] = useState('')
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && vehicle) {
      const vehicleNotes = vehicle.customNotes || ''
      setCustomNotes(vehicleNotes)
      setOriginalNotes(vehicleNotes)
    }
  }, [isOpen, vehicle])

  if (!isOpen || !vehicle) return null

  const hasChanges = customNotes !== originalNotes

  const handleSaveNotes = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.put(
        `/api/vehicle/updateNote/${vehicle._id}`,
        { customNotes }
      )

      if (response.status === 200) {
        toast.success('Notes updated successfully!')
        setOriginalNotes(customNotes)
        setShowSaveConfirmation(false)
        
        // Update the vehicle in the parent's vehicles array
        if (onVehicleUpdate) {
          onVehicleUpdate({ ...vehicle, customNotes })
        }
      }
    } catch (error) {
      console.error('Error updating notes:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update notes'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetNotes = () => {
    setCustomNotes(originalNotes)
    setShowResetConfirmation(false)
    toast.success('Notes reset to saved version')
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vehicle Notes</h2>
              <p className="text-sm text-gray-600 mt-1">
                {vehicle.registration} - {vehicle.make} {vehicle.model}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="size-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!showSaveConfirmation && !showResetConfirmation ? (
              <>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Enter vehicle notes here..."
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {customNotes.length} characters
                </p>
              </>
            ) : showSaveConfirmation ? (
              <div className="text-center">
                <p className="text-gray-900 font-semibold mb-4">Confirm saving notes?</p>
                <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto mb-4">
                  <p className="text-gray-700 text-left whitespace-pre-wrap">{customNotes}</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-900 font-semibold mb-4">
                  Reset notes to the saved version?
                </p>
                <p className="text-sm text-gray-600">This will discard any unsaved changes.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200">
            {!showSaveConfirmation && !showResetConfirmation ? (
              <>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowResetConfirmation(true)}
                  disabled={!hasChanges || isLoading}
                  className="flex-1 px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowSaveConfirmation(true)}
                  disabled={!hasChanges || isLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
                >
                  Save
                </button>
              </>
            ) : showSaveConfirmation ? (
              <>
                <button
                  onClick={() => setShowSaveConfirmation(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition font-medium"
                >
                  {isLoading ? 'Saving...' : 'Confirm'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowResetConfirmation(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetNotes}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition font-medium"
                >
                  {isLoading ? 'Resetting...' : 'Confirm'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default VehicleNotesModal
