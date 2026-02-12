import React from 'react'

const VehicleCard = ({ vehicle }) => {
  const {
    dateAdded,
    registration,
    make,
    model,
    year,
    enginePower,
    fuelType
  } = vehicle

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <li className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
      {/* Header with Registration and Date Stock */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="bg-yellow-300 border-2 border-yellow-400 px-3 py-1 rounded inline-block mb-2">
            <h3 className="text-lg font-bold text-gray-700 font-mono tracking-wider">{registration}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {make} {model}
          </p>
        </div>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
          {formatDate(dateAdded)}
        </span>
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
      <div className="flex gap-3">
        <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          Delete
        </button>
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          View/Update Note
        </button>
      </div>
    </li>
  )
}

export default VehicleCard
