import React, { useState } from 'react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'

const ItemListItem = ({ item, setLoading, items, setItems, onShowNotes, onShowImages }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  
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
    const dayNum = d.getDate()
    const month = d.toLocaleDateString('en-US', { month: 'short' })
    const year = d.getFullYear()
    return `${dayNum} ${month} ${year}`
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
    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200">
      {/* Name */}
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-600 mt-1">{description || 'No description'}</p>
        </div>
      </td>

      {/* Weight */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-900">{weight || 'N/A'}</p>
      </td>

      {/* Estimated Value */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-900">
          {estimatedValue ? `£${estimatedValue.toLocaleString()}` : 'N/A'}
        </p>
      </td>

      {/* Date Added */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-900">{formatDate(dateAdded)}</p>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded">
          Active
        </span>
      </td>

      {/* Action Buttons */}
      <td className="px-6 py-4">
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={() => onShowNotes(item)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200"
          >
            Notes
          </button>
          <button
            onClick={() => onShowImages(item)}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded transition-colors duration-200"
          >
            Images
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </td>

      {/* Delete Confirmation Modal */}
      {showConfirmation && (
        <td colSpan="6" className="p-0">
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
        </td>
      )}
    </tr>
  )
}

export default ItemListItem
