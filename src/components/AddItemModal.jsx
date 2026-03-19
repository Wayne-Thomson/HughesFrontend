import { useState } from 'react'
import { X } from 'lucide-react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'

const AddItemModal = ({ isOpen, onClose, onItemAdded }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [weight, setWeight] = useState('')
  const [estimatedValue, setEstimatedValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAddItem = async () => {
    if (!name.trim()) {
      toast.error('Please enter an item name')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/api/item/add', {
        name: name.trim(),
        description: description.trim(),
        weight: weight.trim(),
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null
      })

      if (response.status === 201 || response.status === 200) {
        toast.success('Item added successfully!')
        onItemAdded()
        resetModal()
      }
    } catch (err) {
      console.error('Error adding item:', err)
      const errorMessage = err.response?.data?.message || 'Failed to add item'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setName('')
    setDescription('')
    setWeight('')
    setEstimatedValue('')
    setError(null)
    onClose()
  }

  const handleCancel = () => {
    if (isLoading) return
    resetModal()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={!isLoading ? handleCancel : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={!isLoading ? handleCancel : undefined}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Add New Item</h2>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              <X className="size-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Item Name */}
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                id="itemName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter item name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter item description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <input
                id="weight"
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 50 kg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                disabled={isLoading}
              />
            </div>

            {/* Estimated Value */}
            <div>
              <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Value (£)
              </label>
              <input
                id="estimatedValue"
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                placeholder="e.g., 1000"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              disabled={isLoading || !name.trim()}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
            >
              {isLoading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddItemModal
