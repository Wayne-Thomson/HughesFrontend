import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'

const ViewImagesModal = ({ isOpen, onClose, vehicle }) => {
  const [imageUrl, setImageUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasNoImage, setHasNoImage] = useState(false)

  useEffect(() => {
    if (isOpen && vehicle) {
      setImageUrl(null)
      setHasNoImage(false)
      fetchImage()
    }
  }, [isOpen, vehicle])

  const fetchImage = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get(`/api/vehicle/image/${vehicle._id}`)
      
      if (response.status === 200 && response.data.imageUrl) {
        setImageUrl(response.data.imageUrl)
        setHasNoImage(false)
      }
    } catch (error) {
      console.error('Error fetching image:', error)
      if (error.response?.status === 404) {
        setHasNoImage(true)
        setImageUrl(null)
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to load image'
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !vehicle) return null

  return (
    <>
      {/* Overlay - click outside to close */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={!isLoading ? onClose : undefined}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vehicle Images</h2>
              <p className="text-sm text-gray-600 mt-1">
                {vehicle.registration} - {vehicle.make} {vehicle.model}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              <X className="size-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600"></div>
              </div>
            ) : imageUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`${vehicle.registration}`}
                    className="max-w-full max-h-96 object-contain"
                  />
                </div>
                <button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Replace
                </button>
              </div>
            ) : hasNoImage ? (
              <div className="flex flex-col items-center justify-center py-12">
                <button
                  className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Plus className="size-8 text-gray-600 hover:text-indigo-600" />
                  <span className="text-gray-700 font-medium">Add Image</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading image information...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full screen loading overlay when fetching */}
      {isLoading && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-none"></div>
          <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600"></div>
          </div>
        </>
      )}
    </>
  )
}

export default ViewImagesModal
