import React, { useState } from 'react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast';
import VehicleDetailsModal from './VehicleDetailsModal'
import VehicleNotesModal from './VehicleNotesModal'

const VehicleListItem = ({ vehicle, deleteButtonText = 'Delete', deleteButtonColor = 'red', isDeleted = false, setLoading, vehicles, setVehicles }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hardDeleteChecked, setHardDeleteChecked] = useState(false)
  const [showPermanentDeleteConfirmation, setShowPermanentDeleteConfirmation] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const {
    createdAt: dateAdded,
    registration,
    make,
    model,
    manufactureDate,
    engineSize,
    fuelType,
    dateDeleted,
    vin,
    _id,
    enginePower,
    primaryColour
  } = vehicle

  const year = manufactureDate?.split('-')[0]

  const formatDate = (date) => {
    const d = new Date(date)
    const dayNum = d.getDate()
    const month = d.toLocaleDateString('en-US', { month: 'short' })
    const year = d.getFullYear()
    return `${dayNum} ${month} ${year}`
  }

  const colorClasses = {
    red: 'bg-red-100 hover:bg-red-200 text-red-700',
    green: 'bg-green-100 hover:bg-green-200 text-green-700',
    yellow: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
    blue: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
  }

  const handleDeleteClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmDelete = async () => {
    setLoading(true);
    setShowConfirmation(false)
    setHardDeleteChecked(false)
    if (deleteButtonText === 'Delete') {
        try {
            console.log(`Deleting vehicle with registration: ${registration}, hardDelete: ${hardDeleteChecked}`);
            const res = await apiClient.delete(`/api/vehicle/delete/${_id}`, { data: { hardDelete: hardDeleteChecked } });
            toast.success(hardDeleteChecked ? 'Vehicle permanently deleted successfully' : 'Vehicle deleted successfully');
            setVehicles(vehicles.filter(v => v._id !== _id));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            toast.error('Error deleting vehicle details');
        } finally {
            setLoading(false)
        }
    } else {
        try {
            const res = await apiClient.put(`/api/vehicle/restore/${_id}`);
            toast.success('Vehicle restored successfully')
            setVehicles(vehicles.filter(v => v._id !== _id));
        } catch (error) {
            console.error('Error restoring vehicle:', error)
            toast.error('Error restoring vehicle details')
        } finally {
            setLoading(false)
        }
    };
  }

  const handleCancelDelete = () => {
    setShowConfirmation(false)
    setHardDeleteChecked(false)
  }

  const handlePermanentDeleteClick = () => {
    setShowPermanentDeleteConfirmation(true)
  }

  const handleConfirmPermanentDelete = async () => {
    setLoading(true);
    setShowPermanentDeleteConfirmation(false)
    try {
        const res = await apiClient.delete(`/api/vehicle/delete/${_id}`, { data: { hardDelete: true } });
        toast.success('Vehicle permanently deleted successfully')
        setVehicles(vehicles.filter(v => v._id !== _id));
    } catch (error) {
        console.error('Error deleting vehicle:', error)
        toast.error('Error deleting vehicle details')
    } finally {
        setLoading(false)
    };
  }

  const handleCancelPermanentDelete = () => {
    setShowPermanentDeleteConfirmation(false)
  }

  return (
    <>
      <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
        {/* Registration & VIN */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="bg-yellow-300 border-2 border-yellow-400 px-2 py-1 rounded inline-block">
            <p className="text-sm font-bold text-gray-700 font-mono tracking-wider">{registration}</p>
            <p className="text-xs text-gray-700 font-mono uppercase">{vin}</p>
          </div>
        </td>

        {/* Make & Model */}
        <td className="px-6 py-4 whitespace-nowrap">
          <p className="text-sm font-medium text-gray-900">{make}</p>
          <p className="text-sm text-gray-600">{model}</p>
        </td>

        {/* Year */}
        <td className="px-6 py-4 whitespace-nowrap">
          <p className="text-sm font-medium text-gray-900">{year}</p>
        </td>

        {/* Engine Size */}
        <td className="px-6 py-4 whitespace-nowrap">
          <p className="text-sm font-medium text-gray-900">{engineSize || 'N/A'} cc</p>
          {engineSize && (
            <p className="text-xs text-gray-600">≈ {Math.round(engineSize / 15)} bhp</p>
          )}
        </td>

        {/* Fuel Type */}
        <td className="px-6 py-4 whitespace-nowrap">
          <p className="text-sm font-medium text-gray-900">{fuelType}</p>
        </td>

        {/* Colour */}
        <td className="px-6 py-4 whitespace-nowrap">
          <p className="text-sm font-medium text-gray-900">{primaryColour || 'N/A'}</p>
        </td>

        {/* Date Added */}
        <td className="px-6 py-4 whitespace-nowrap">
          <p className="text-sm font-medium text-gray-900">{formatDate(dateAdded)}</p>
        </td>

        {/* Action Buttons */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex gap-2">
            <button 
              onClick={() => setShowDetailsModal(true)}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition-colors"
              title="View Details"
            >
              Details
            </button>
            <button 
              onClick={() => setShowNotesModal(true)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
              title="View/Update Notes"
            >
              Notes
            </button>
            {isDeleted && (
              <button
                onClick={handlePermanentDeleteClick}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded transition-colors"
                title="Hard Delete"
              >
                Hard Del
              </button>
            )}
            <button
              onClick={handleDeleteClick}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${colorClasses[deleteButtonColor]}`}
              title={deleteButtonText}
            >
              {deleteButtonText === 'Delete' ? 'Delete' : 'Restore'}
            </button>
          </div>
        </td>
      </tr>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancelDelete}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirm {deleteButtonText}
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to {deleteButtonText.toLowerCase()} this vehicle?
            </p>
            <p className="text-sm font-semibold text-gray-700 mb-2">{registration}</p>
            <p className="text-sm text-gray-600 mb-6">
              {make} {model}
            </p>

            {deleteButtonText === 'Delete' && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hardDeleteChecked}
                    onChange={(e) => setHardDeleteChecked(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Hard Delete</span>
                </label>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${
                  deleteButtonText === 'Restore'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {showPermanentDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancelPermanentDelete}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirm Hard Delete
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to permanently delete this vehicle? This action cannot be undone.
            </p>
            <p className="text-sm font-semibold text-gray-700 mb-2">{registration}</p>
            <p className="text-sm text-gray-600 mb-6">
              {make} {model}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelPermanentDelete}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPermanentDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Hard Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <VehicleDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        vehicle={vehicle}
      />

      <VehicleNotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        vehicle={vehicle}
        onVehicleUpdate={(updatedVehicle) => {
          setVehicles(vehicles.map(v => v._id === updatedVehicle._id ? updatedVehicle : v))
        }}
      />
    </>
  )
};

export default React.memo(VehicleListItem);
