import { useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'

const VehicleDetailsModal = ({ isOpen, onClose, vehicle }) => {
  const [expandedMot, setExpandedMot] = useState(null)
  const [expandedDefects, setExpandedDefects] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen || !vehicle) return null

  const toggleMotExpanded = (index) => {
    setExpandedMot(expandedMot === index ? null : index)
  }

  const toggleDefectExpanded = (motIndex, defectIndex) => {
    const key = `${motIndex}-${defectIndex}`
    setExpandedDefects(prev => ({
      ...prev,
      [key]: !prev[key]
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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
          <div className="p-6 space-y-6">
            {/* Basic Vehicle Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Registration</p>
                <p className="text-gray-900 mt-1">{vehicle.registration || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">VIN</p>
                <p className="text-gray-900 mt-1 uppercase">{vehicle.vin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Make</p>
                <p className="text-gray-900 mt-1">{vehicle.make || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Model</p>
                <p className="text-gray-900 mt-1">{vehicle.model || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Year</p>
                <p className="text-gray-900 mt-1">{vehicle.manufactureDate?.split('-')[0] || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Fuel Type</p>
                <p className="text-gray-900 mt-1">{vehicle.fuelType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Color</p>
                <p className="text-gray-900 mt-1">{vehicle.color || 'N/A'}</p>
              </div>
            </div>

            {/* MOT Tests */}
            {vehicle.motTests && vehicle.motTests.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">MOT History</h3>
                <div className="space-y-2">
                  {vehicle.motTests.map((mot, index) => (
                    <div key={index}>
                      {/* MOT Header */}
                      <button
                        onClick={() => toggleMotExpanded(index)}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div>
                            <p className="font-semibold text-gray-900">
                              MOT Test - {formatDate(mot.completedDate)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {mot.testResult && (
                                <span className={mot.testResult === 'PASSED' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                  {mot.testResult}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        {expandedMot === index ? (
                          <ChevronUp className="size-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="size-5 text-gray-600" />
                        )}
                      </button>

                      {/* MOT Details */}
                      {expandedMot === index && (
                        <div className="border border-t-0 border-gray-200 rounded-b-lg p-4 bg-gray-50 space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="font-semibold text-gray-700">Test Number</p>
                              <p className="text-gray-600">{mot.motTestNumber || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700">Expiry Date</p>
                              <p className="text-gray-600">{formatDate(mot.expiryDate)}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700">Odometer</p>
                              <p className="text-gray-600">
                                {mot.odometerValue || 'N/A'} {mot.odometerUnit || ''}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700">Data Source</p>
                              <p className="text-gray-600">{mot.dataSource || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Defects */}
                          {mot.defects && mot.defects.length > 0 && (
                            <div className="mt-4">
                              <p className="font-semibold text-gray-700 mb-2">Defects</p>
                              <div className="space-y-2">
                                {mot.defects.map((defect, defectIndex) => {
                                  const defectKey = `${index}-${defectIndex}`
                                  const isExpanded = expandedDefects[defectKey]
                                  return (
                                    <button
                                      key={defectIndex}
                                      onClick={() => toggleDefectExpanded(index, defectIndex)}
                                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-white transition text-left bg-white"
                                    >
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                          {defect.type}
                                          {defect.dangerous && (
                                            <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded font-semibold">
                                              DANGEROUS
                                            </span>
                                          )}
                                        </p>
                                        {isExpanded && (
                                          <p className="text-sm text-gray-600 mt-2">{defect.text}</p>
                                        )}
                                      </div>
                                      {isExpanded ? (
                                        <ChevronUp className="size-4 text-gray-600 ml-2 flex-shrink-0" />
                                      ) : (
                                        <ChevronDown className="size-4 text-gray-600 ml-2 flex-shrink-0" />
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </>
  )
}

export default VehicleDetailsModal
