import { useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'

const VehicleDetailsModal = ({ isOpen, onClose, vehicle }) => {
  const [expandedSections, setExpandedSections] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen || !vehicle) return null

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }))
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return value.toString()
  }

  const renderDataGrid = (data, cols = 2) => {
    if (!data) return null
    return (
      <div className={`grid grid-cols-${cols} gap-4`}>
        {Object.entries(data).map(([key, value]) => {
          if (value === null || value === undefined) return null
          if (typeof value === 'object') return null
          return (
            <div key={key}>
              <p className="text-xs font-semibold text-gray-500 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-sm text-gray-900 mt-1">{formatValue(value)}</p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={!isLoading ? onClose : undefined}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="size-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Top Section - Root Level Data */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Registration</p>
                  <p className="text-sm text-gray-900 mt-1 font-mono font-bold">{vehicle.registration || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">VIN</p>
                  <p className="text-sm text-gray-900 mt-1 font-mono uppercase">{vehicle.vin || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Make</p>
                  <p className="text-sm text-gray-900 mt-1">{vehicle.make || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Model</p>
                  <p className="text-sm text-gray-900 mt-1">{vehicle.model || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Generation</p>
                  <p className="text-sm text-gray-900 mt-1">{vehicle.generation || 'N/A'} ({vehicle.engineCode || 'UNKNOWN'})</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Manufacture Date</p>
                  <p className="text-sm text-gray-900 mt-1">{vehicle.manufactureDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Fuel Type</p>
                  <p className="text-sm text-gray-900 mt-1">{vehicle.fuelType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Colour</p>
                  <p className="text-sm text-gray-900 mt-1">{vehicle.primaryColour || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">First Registration</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(vehicle.firstUsedDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Engine Size</p>
                  <p className="text-sm text-gray-900 mt-1">{vehicle.engineSize ? `${vehicle.engineSize} cc` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Country</p>
                  <p className="text-sm text-gray-900 mt-1">{vehicle.country || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Date Added</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(vehicle.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Registration Details Section */}
            {vehicle.VehicleRegistration && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('VehicleRegistration')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Vehicle Registration Details</h3>
                  {expandedSections.VehicleRegistration ? (
                    <ChevronUp className="size-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="size-5 text-gray-600" />
                  )}
                </button>
                {expandedSections.VehicleRegistration && (
                  <div className="p-4 bg-white">
                    {renderDataGrid(vehicle.VehicleRegistration)}
                  </div>
                )}
              </div>
            )}

            {/* Dimensions Section */}
            {vehicle.Dimensions && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('Dimensions')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Dimensions</h3>
                  {expandedSections.Dimensions ? (
                    <ChevronUp className="size-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="size-5 text-gray-600" />
                  )}
                </button>
                {expandedSections.Dimensions && (
                  <div className="p-4 bg-white">
                    {renderDataGrid(vehicle.Dimensions)}
                  </div>
                )}
              </div>
            )}

            {/* Engine Section */}
            {vehicle.Engine && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('Engine')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Engine</h3>
                  {expandedSections.Engine ? (
                    <ChevronUp className="size-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="size-5 text-gray-600" />
                  )}
                </button>
                {expandedSections.Engine && (
                  <div className="p-4 bg-white">
                    {renderDataGrid(vehicle.Engine)}
                  </div>
                )}
              </div>
            )}

            {/* Performance Section */}
            {vehicle.Performance && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('Performance')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                  {expandedSections.Performance ? (
                    <ChevronUp className="size-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="size-5 text-gray-600" />
                  )}
                </button>
                {expandedSections.Performance && (
                  <div className="p-4 bg-white space-y-4">
                    {vehicle.Performance.Torque && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Torque</p>
                        {renderDataGrid(vehicle.Performance.Torque, 3)}
                      </div>
                    )}
                    {vehicle.Performance.Power && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Power</p>
                        {renderDataGrid(vehicle.Performance.Power, 3)}
                      </div>
                    )}
                    {vehicle.Performance.MaxSpeed && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Max Speed</p>
                        {renderDataGrid(vehicle.Performance.MaxSpeed, 2)}
                      </div>
                    )}
                    {vehicle.Performance.Acceleration && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Acceleration</p>
                        {renderDataGrid(vehicle.Performance.Acceleration, 2)}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">CO2</p>
                        <p className="text-sm text-gray-900 mt-1">{vehicle.Performance.Co2 ? `${vehicle.Performance.Co2} g/km` : 'N/A'}</p>
                      </div>
                      {vehicle.Performance.NoiseLevel && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Noise Level</p>
                          <p className="text-sm text-gray-900 mt-1">{vehicle.Performance.NoiseLevel}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Consumption Section */}
            {vehicle.Consumption && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('Consumption')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Consumption</h3>
                  {expandedSections.Consumption ? (
                    <ChevronUp className="size-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="size-5 text-gray-600" />
                  )}
                </button>
                {expandedSections.Consumption && (
                  <div className="p-4 bg-white space-y-4">
                    {vehicle.Consumption.ExtraUrban && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Extra Urban</p>
                        {renderDataGrid(vehicle.Consumption.ExtraUrban, 2)}
                      </div>
                    )}
                    {vehicle.Consumption.UrbanCold && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Urban Cold</p>
                        {renderDataGrid(vehicle.Consumption.UrbanCold, 2)}
                      </div>
                    )}
                    {vehicle.Consumption.Combined && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Combined</p>
                        {renderDataGrid(vehicle.Consumption.Combined, 2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SMMT Details Section */}
            {vehicle.SmmtDetails && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('SmmtDetails')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">SMMT Details</h3>
                  {expandedSections.SmmtDetails ? (
                    <ChevronUp className="size-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="size-5 text-gray-600" />
                  )}
                </button>
                {expandedSections.SmmtDetails && (
                  <div className="p-4 bg-white">
                    {renderDataGrid(vehicle.SmmtDetails)}
                  </div>
                )}
              </div>
            )}

            {/* VED Rate Section */}
            {vehicle.vedRate && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('vedRate')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">VED Rate</h3>
                  {expandedSections.vedRate ? (
                    <ChevronUp className="size-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="size-5 text-gray-600" />
                  )}
                </button>
                {expandedSections.vedRate && (
                  <div className="p-4 bg-white space-y-4">
                    {vehicle.vedRate.Standard && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Standard</p>
                        {renderDataGrid(vehicle.vedRate.Standard, 2)}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">VED CO2 Emissions</p>
                        <p className="text-sm text-gray-900 mt-1">{vehicle.vedRate.VedCo2Emissions || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">VED Band</p>
                        <p className="text-sm text-gray-900 mt-1">{vehicle.vedRate.vedBand || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">VED CO2 Band</p>
                        <p className="text-sm text-gray-900 mt-1">{vehicle.vedRate.VedCo2Band || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* General Section */}
            {vehicle.General && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('General')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">General</h3>
                  {expandedSections.General ? (
                    <ChevronUp className="size-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="size-5 text-gray-600" />
                  )}
                </button>
                {expandedSections.General && (
                  <div className="p-4 bg-white">
                    {renderDataGrid(vehicle.General)}
                  </div>
                )}
              </div>
            )}

            {/* MOT Tests Section */}
            {vehicle.motTests && vehicle.motTests.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('motTests')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">MOT Tests ({vehicle.motTests.length})</h3>
                  {expandedSections.motTests ? (
                    <ChevronUp className="size-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="size-5 text-gray-600" />
                  )}
                </button>
                {expandedSections.motTests && (
                  <div className="p-4 bg-white space-y-3">
                    {vehicle.motTests.map((mot, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Test Date</p>
                            <p className="text-gray-900 mt-1">{formatDate(mot.testDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Result</p>
                            <p className={`text-sm font-semibold mt-1 ${mot.result === 'PASSED' ? 'text-green-600' : 'text-red-600'}`}>
                              {mot.result}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Mileage</p>
                            <p className="text-gray-900 mt-1">{mot.mileage ? mot.mileage.toLocaleString() + ' km' : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default VehicleDetailsModal
