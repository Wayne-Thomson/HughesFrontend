import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';

const VehicleCard = ({ vehicle, deleteButtonText = 'Delete', deleteButtonColor = 'red', isDeleted = false, setLoading, vehicles, setVehicles }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hardDeleteChecked, setHardDeleteChecked] = useState(false)
  const [showPermanentDeleteConfirmation, setShowPermanentDeleteConfirmation] = useState(false)
  const {
    createdAt: dateAdded,
    registration,
    make,
    model,
    manufactureDate,
    enginePower,
    fuelType,
    dateDeleted,
    vin,
    _id,
  } = vehicle

  const year = manufactureDate?.split('-')[0]

  const formatDate = (date) => {
    const d = new Date(date)
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' })
    const dayNum = d.getDate()
    const month = d.toLocaleDateString('en-US', { month: 'short' })
    const year = d.getFullYear()
    
    // Get ordinal suffix (st, nd, rd, th)
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
            const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/vehicle/delete/${_id}`, { data: { hardDelete: hardDeleteChecked } });
            toast.success(hardDeleteChecked ? 'Vehicle permanently deleted successfully' : 'Vehicle deleted successfully');
            setVehicles(vehicles.filter(v => v._id !== _id));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            toast.error('Error loading vehicle details');
        } finally {
            setLoading(false)
        }
    } else {
        try {
            // const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/vehicle/delete/${_id}`, { data: { hardDelete: true } });
            toast.success('Vehicle permanently deleted successfully')
            setVehicles(vehicles.filter(v => v._id !== _id));
        } catch (error) {
            console.error('Error deleting vehicle:', error)
            toast.error('Error loading vehicle details')
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
        const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/vehicle/delete/${_id}`, { data: { hardDelete: true } });
        toast.success('Vehicle permanently deleted successfully')
        setVehicles(vehicles.filter(v => v._id !== _id));
    } catch (error) {
        console.error('Error deleting vehicle:', error)
        toast.error('Error loading vehicle details')
    } finally {
        setLoading(false)
    };
  }

  const handleCancelPermanentDelete = () => {
    setShowPermanentDeleteConfirmation(false)
  }

  return (
    <li className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
      {/* Header with Registration and Date Stock */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <div className="bg-yellow-300 border-2 border-yellow-400 px-3 py-1 rounded inline-block mb-2">
            <h3 className="text-lg font-bold text-gray-700 font-mono tracking-wider">{registration}</h3>
            <p className="text-sm text-gray-700 font-mono">{vin}</p>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {make} {model}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
            Date Added: {formatDate(dateAdded)}
          </span>
          {dateDeleted && (
            <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded">
              Date Removed: {formatDate(dateDeleted)}
            </span>
          )}
        </div>
      </div>

      {/* Vehicle Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-t border-gray-200 pt-4">
        {/* Year */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Year</p>
          <p className="text-base font-medium text-gray-900 mt-1">{year}</p>
        </div>

        {/* Fuel Type */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fuel Type</p>
          <p className="text-base font-medium text-gray-900 mt-1">{fuelType}</p>
        </div>

        {/* Engine Power - CC */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Engine Power</p>
          <p className="text-base font-medium text-gray-900 mt-1">{enginePower?.cc || 'N/A'} cc</p>
        </div>

        {/* Engine Power - BHP */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Power</p>
          <p className="text-base font-medium text-gray-900 mt-1">{enginePower?.bhp || 'N/A'} bhp</p>
        </div>
      </div>

      {/* Action Buttons */}
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 mb-2 px-4 rounded-lg transition-colors duration-200">
        View Details
      </button>
      {isDeleted && (
        <button
          onClick={handlePermanentDeleteClick}
          className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 mb-2 px-4 rounded-lg transition-colors duration-200"
        >
          Hard Delete
        </button>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleDeleteClick}
          className={`flex-1 ${colorClasses[deleteButtonColor]} font-medium py-2 px-4 rounded-lg transition-colors duration-200`}
        >
          {deleteButtonText}
        </button>
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          View/Update Note
        </button>
      </div>

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
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
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
    </li>
  )
}

export default VehicleCard
