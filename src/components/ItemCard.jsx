import React, { useState } from 'react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'
import ItemNotesModal from './ItemNotesModal'
import ItemImagesModal from './ItemImagesModal'

const ItemCard = ({ item, setLoading, items, setItems }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showImagesModal, setShowImagesModal] = useState(false)
  
  const {
    createdAt: dateAdded,
    name,
    description,
    weight,
    estimatedValue,
    _id,
  } = item

  const formatDate = (date) => {
    const d = new Date(date)
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' })
    const dayNum = d.getDate()
    const month = d.toLocaleDateString('en-US', { month: 'short' })
    const year = d.getFullYear()
    
    const ordinal = (n) => {
      if (n > 3 && n < 21) return 'th'
      switch (n % 10) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
      }
    }
    
    return `${dayName}, ${dayNum}${ordinal(dayNum)} ${month} ${year}`
  }

  const handleDeleteClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmDelete = async () => {
    setLoading(true)
    setShowConfirmation(false)
    try {
      console.log(`Deleting item with name: ${name}`)
      const res = await apiClient.delete(`/api/item/delete/${_id}`, { data: { hardDelete: true } })
      toast.success('Item deleted successfully')
      setItems(items.filter(i => i._id !== _id))
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Error deleting item')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmation(false)
  }

  return (
    <li className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Header with Name and Date Stock */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
          <p className="text-sm text-gray-600 mb-2">{description || 'No description'}</p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
            Date Added: {formatDate(dateAdded)}
          </span>
        </div>
      </div>

      {/* Item Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-t border-gray-200 pt-4">
        {/* Weight */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weight</p>
          <p className="text-base font-medium text-gray-900 mt-1">{weight || 'N/A'}</p>
        </div>

        {/* Estimated Value */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Est. Value</p>
          <p className="text-base font-medium text-gray-900 mt-1">
            {estimatedValue ? `£${estimatedValue.toLocaleString()}` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-2">
        <button 
          onClick={() => setShowNotesModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          View/Update Notes
        </button>
        <button
          onClick={() => setShowImagesModal(true)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Images
        </button>
        <button
          onClick={handleDeleteClick}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Delete
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancelDelete}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Delete Item?
            </h3>
            <p className="text-gray-600 mb-4">
              This will permanently delete this item. This action cannot be undone.
            </p>
            <p className="text-sm font-semibold text-gray-700 mb-2">{name}</p>
            <p className="text-sm text-gray-600 mb-6">
              {description || 'No description'}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      <ItemNotesModal 
        isOpen={showNotesModal}
        item={item}
        onClose={() => setShowNotesModal(false)}
      />

      {/* Images Modal */}
      <ItemImagesModal 
        isOpen={showImagesModal}
        item={item}
        onClose={() => setShowImagesModal(false)}
      />
    </li>
  )
}

export default ItemCard