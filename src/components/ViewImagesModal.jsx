import { useState, useEffect, useRef } from 'react'
import { X, Plus, Camera } from 'lucide-react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'

const ViewImagesModal = ({ isOpen, onClose, vehicle }) => {
  const [imageUrl, setImageUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasNoImage, setHasNoImage] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  useEffect(() => {
    if (isOpen && vehicle) {
      setImageUrl(null)
      setHasNoImage(false)
      fetchImage()
    }
  }, [isOpen, vehicle])

  useEffect(() => {
    // Detect if device is mobile based on user agent
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      setIsMobile(isMobileDevice)
    }
    checkIfMobile()
  }, [])

  const fetchImage = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get(`/api/vehicle/image/${vehicle._id}`)
      
      console.log('Image response:', response.status, response.data)
      
      if (response.status === 200 && response.data.imageUrl) {
        const url = response.data.imageUrl
        console.log('Raw imageUrl length:', url.length)
        console.log('URL starts with:', url.substring(0, 80) + '...')
        console.log('URL contains base64:', url.includes('base64'))
        console.log('Setting image URL...')
        setImageUrl(url)
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

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const MAX_WIDTH = 1450
          const MAX_HEIGHT = 1450
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob((blob) => {
            resolve(blob)
          }, 'image/jpeg', 0.85)
        }
        img.onerror = (error) => reject(error)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/jpg')) {
      toast.error('Please select a JPEG image')
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Source image must be less than 5MB. Try lowering camera resolution or choosing a smaller image.')
      return
    }

    setIsUploading(true)
    try {
      // Compress the image
      toast.loading('Compressing image...', { id: 'compress' })
      const compressedBlob = await compressImage(file)
      toast.dismiss('compress')
      
      const compressedSizeInKB = (compressedBlob.size / 1024).toFixed(2)
      toast.success(`Image compressed to ${compressedSizeInKB} KB`)

      // Create FormData for multipart upload
      const formData = new FormData()
      formData.append('image', compressedBlob, 'vehicle-image.jpg')

      // Send to backend
      toast.loading('Uploading image...', { id: 'upload' })
      const response = await apiClient.post(
        `/api/vehicle/image/${vehicle._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.status === 200 || response.status === 201) {
        toast.dismiss('upload')
        toast.success('Image uploaded successfully!')
        // Refresh the image
        await fetchImage()
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.dismiss('upload')
      const errorMessage = error.response?.data?.message || 'Failed to upload image'
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleAddOrReplaceClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleDeleteImage = () => {
    setIsConfirmingDelete(true)
  }

  const confirmDeleteImage = async () => {
    setIsConfirmingDelete(false)
    setIsUploading(true)
    try {
      toast.loading('Deleting image...', { id: 'delete' })
      const response = await apiClient.delete(`/api/vehicle/image/${vehicle._id}`)
      
      if (response.status === 200) {
        toast.dismiss('delete')
        toast.success('Image deleted successfully!')
        setImageUrl(null)
        setHasNoImage(true)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.dismiss('delete')
      const errorMessage = error.response?.data?.message || 'Failed to delete image'
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const cancelDeleteImage = () => {
    setIsConfirmingDelete(false)
  }

  if (!isOpen || !vehicle) return null

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpeg,.jpg"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
      />

      {/* Hidden camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/jpg"
        capture="environment"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
      />

      {/* Overlay - click outside to close */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={!isLoading && !isUploading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={!isLoading && !isUploading ? onClose : undefined}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-auto max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
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
              disabled={isLoading || isUploading}
              className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              <X className="size-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading image...</p>
              </div>
            ) : imageUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`${vehicle.registration}`}
                    className="max-w-full max-h-[60vh] object-contain"
                    onError={(e) => {
                      console.error('Image failed to load event:', e.type);
                      console.error('Image element error:', e.target.error);
                      console.log('Full attempted URL length:', imageUrl.length);
                      console.log('URL prefix (0-100):', imageUrl.substring(0, 100));
                      console.log('URL middle (50% mark):', imageUrl.substring(Math.floor(imageUrl.length * 0.5), Math.floor(imageUrl.length * 0.5) + 50));
                    }}
                  />
                </div>
                <button
                  onClick={handleDeleteImage}
                  disabled={isUploading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Delete Image
                </button>
              </div>
            ) : hasNoImage ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <button
                  onClick={handleAddOrReplaceClick}
                  className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors w-full"
                >
                  <Plus className="size-8 text-gray-600 hover:text-indigo-600" />
                  <span className="text-gray-700 font-medium">Choose from Gallery</span>
                </button>
                {isMobile && (
                  <button
                    onClick={handleCameraClick}
                    className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors w-full"
                  >
                    <Camera className="size-8 text-gray-600 hover:text-blue-600" />
                    <span className="text-gray-700 font-medium">Take Photo</span>
                  </button>
                )}
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
      {(isLoading || isUploading) && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 pointer-events-auto"></div>
          <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600"></div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={cancelDeleteImage}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Image?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this image? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelDeleteImage}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteImage}
                    disabled={isUploading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ViewImagesModal
