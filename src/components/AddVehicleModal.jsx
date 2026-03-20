import { useState } from 'react'
import { X } from 'lucide-react'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'

const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded }) => {
  const [vehicleIdentifier, setVehicleIdentifier] = useState('')
  const [identifierType, setIdentifierType] = useState('registration') // 'registration', 'vin', or 'custom'
  const [step, setStep] = useState('input') // 'input', 'custom', 'details', 'finalizing'
  const [vehicleDetails, setVehicleDetails] = useState(null)
  const [customVehicle, setCustomVehicle] = useState({
    registration: '',
    vin: '',
    year: '',
    make: '',
    model: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    setVehicleIdentifier(e.target.value)
  }

  const handleSearchVehicle = async () => {
    if (identifierType === 'custom') {
      // For custom vehicle, just proceed to custom step
      setStep('custom')
      return
    }

    if (!vehicleIdentifier.trim()) {
      toast.error('Please enter a vehicle identifier')
      return
    }
    
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get(
        `/api/vehicle/lookup`,
        {
          params: {
            [identifierType]: vehicleIdentifier
          }
        }
      )

      if (response.status === 200) {
        setVehicleDetails(response.data.data)
        setStep('details')
      }
    } catch (err) {
      console.error('Error fetching vehicle details:', err)
      const errorMessage = err.response?.data?.message || 'Failed to fetch vehicle details'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomVehicleConfirmation = async () => {
    // Check that at least one field is filled
    const hasAtLeastOne = Object.values(customVehicle).some(value => value.trim() !== '')
    if (!hasAtLeastOne) {
      toast.error('Please fill in at least one field')
      return
    }

    setIsLoading(true)
    setError(null)
    setStep('finalizing')
    try {
      const payload = {
        isCustom: true,
        customVehicle: {
          registration: customVehicle.registration || null,
          vin: customVehicle.vin || null,
          year: customVehicle.year || null,
          make: customVehicle.make || null,
          model: customVehicle.model || null
        }
      }

      const response = await apiClient.post(
        `/api/vehicle/add`,
        payload
      )

      if (response.status === 200) {
        toast.success('Vehicle added successfully!')
        onVehicleAdded()
        resetModal()
      }
    } catch (err) {
      console.error('Error adding vehicle:', err)
      const errorMessage = err.response?.data?.message || 'Failed to add vehicle'
      setError(errorMessage)
      toast.error(errorMessage)
      setStep('custom') // Go back to custom view on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleDetailsConfirmation = async () => {
    setIsLoading(true)
    setError(null)
    setStep('finalizing')
    try {
      const payload = {
        [identifierType]: vehicleIdentifier,
        vehicleDetails: vehicleDetails
      }

      const response = await apiClient.post(
        `/api/vehicle/add`,
        payload
      )

      if (response.status === 200) {
        toast.success('Vehicle added successfully!')
        onVehicleAdded()
        resetModal()
      }
    } catch (err) {
      console.error('Error adding vehicle:', err)
      const errorMessage = err.response?.data?.message || 'Failed to add vehicle'
      setError(errorMessage)
      toast.error(errorMessage)
      setStep('details') // Go back to details view on error
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setVehicleIdentifier('')
    setIdentifierType('registration')
    setStep('input')
    setVehicleDetails(null)
    setCustomVehicle({
      registration: '',
      vin: '',
      year: '',
      make: '',
      model: ''
    })
    setError(null)
    onClose()
  }

  const handleCancel = () => {
    if (isLoading) return // Don't allow closing during requests
    if (step === 'custom' || step === 'details') {
      setStep('input')
      setVehicleDetails(null)
      setVehicleIdentifier('')
      setCustomVehicle({
        registration: '',
        vin: '',
        year: '',
        make: '',
        model: ''
      })
      setError(null)
    } else {
      resetModal()
    }
  }

  const handleOverlayClick = () => {
    if (!isLoading) {
      handleCancel()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'input' && 'Add Vehicle'}
              {step === 'custom' && 'Add Custom Vehicle'}
              {step === 'details' && 'Confirm Vehicle Details'}
              {step === 'finalizing' && 'Adding Vehicle...'}
            </h2>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              <X className="size-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'input' && (
              <>
                {/* Identifier Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Search by:
                  </label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="identifierType"
                        value="registration"
                        checked={identifierType === 'registration'}
                        onChange={(e) => setIdentifierType(e.target.value)}
                        disabled={isLoading}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="ml-2 text-gray-700">Registration Number</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="identifierType"
                        value="vin"
                        checked={identifierType === 'vin'}
                        onChange={(e) => setIdentifierType(e.target.value)}
                        disabled={isLoading}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="ml-2 text-gray-700">VIN Number</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="identifierType"
                        value="custom"
                        checked={identifierType === 'custom'}
                        onChange={(e) => setIdentifierType(e.target.value)}
                        disabled={isLoading}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="ml-2 text-gray-700">Custom Vehicle</span>
                    </label>
                  </div>
                </div>

                {/* Input Field */}
                {identifierType !== 'custom' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {identifierType === 'registration' ? 'Registration Number' : 'VIN Number'}
                    </label>
                    <input
                      type="text"
                      value={vehicleIdentifier}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder={
                        identifierType === 'registration'
                          ? 'e.g., AB21 XYZ'
                          : 'e.g., WVWZZZ3CZ9E123456'
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                    />
                  </div>
                )}
              </>
            )}

            {step === 'custom' && (
              <>
                <div className="mb-6 space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Fill in at least one field. Empty fields will be set to unknown.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={customVehicle.registration}
                      onChange={(e) => setCustomVehicle({ ...customVehicle, registration: e.target.value })}
                      disabled={isLoading}
                      placeholder="e.g., AB21 XYZ"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VIN Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={customVehicle.vin}
                      onChange={(e) => setCustomVehicle({ ...customVehicle, vin: e.target.value })}
                      disabled={isLoading}
                      placeholder="e.g., WVWZZZ3CZ9E123456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year (Optional)
                    </label>
                    <input
                      type="text"
                      value={customVehicle.year}
                      onChange={(e) => setCustomVehicle({ ...customVehicle, year: e.target.value })}
                      disabled={isLoading}
                      placeholder="e.g., 2021"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make (Optional)
                    </label>
                    <input
                      type="text"
                      value={customVehicle.make}
                      onChange={(e) => setCustomVehicle({ ...customVehicle, make: e.target.value })}
                      disabled={isLoading}
                      placeholder="e.g., Honda"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model (Optional)
                    </label>
                    <input
                      type="text"
                      value={customVehicle.model}
                      onChange={(e) => setCustomVehicle({ ...customVehicle, model: e.target.value })}
                      disabled={isLoading}
                      placeholder="e.g., Civic"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 'details' && vehicleDetails && (
              <>
                <div className="mb-6 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Vehicle Details</h3>
                    <div className="space-y-2 text-sm">
                      {vehicleDetails.make && (
                        <p><span className="font-medium text-gray-700">Make:</span> {vehicleDetails.make}</p>
                      )}
                      {vehicleDetails.model && (
                        <p><span className="font-medium text-gray-700">Model:</span> {vehicleDetails.model}</p>
                      )}
                      {vehicleDetails.manufactureDate && (
                        <p><span className="font-medium text-gray-700">Year:</span> {vehicleDetails.manufactureDate.split('-')[0]}</p>
                      )}
                      {vehicleDetails.fuelType && (
                        <p><span className="font-medium text-gray-700">Fuel Type:</span> {vehicleDetails.fuelType}</p>
                      )}
                      {vehicleDetails.primaryColour && (
                        <p><span className="font-medium text-gray-700">Colour:</span> {vehicleDetails.primaryColour}</p>
                      )}
                      {vehicleDetails.registration && (
                        <p><span className="font-medium text-gray-700">Registration:</span> {vehicleDetails.registration}</p>
                      )}
                      {vehicleDetails.engineSize && (
                        <p><span className="font-medium text-gray-700">Engine Size:</span> {vehicleDetails.engineSize} cc</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Is this the correct vehicle? Click confirm to add it to the system.
                  </p>
                </div>
              </>
            )}

            {step === 'finalizing' && (
              <div className="text-center py-8">
                <p className="text-gray-700">Adding vehicle to database...</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              {step === 'input' ? 'Close' : 'Back'}
            </button>
            <button
              onClick={
                step === 'input' ? handleSearchVehicle : 
                step === 'custom' ? handleCustomVehicleConfirmation :
                step === 'details' ? handleDetailsConfirmation : 
                undefined
              }
              disabled={isLoading || step === 'finalizing'}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition font-medium"
            >
              {isLoading ? 'Loading...' : (
                step === 'input' ? (identifierType === 'custom' ? 'Continue' : 'Search') : 
                step === 'custom' ? 'Add' :
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddVehicleModal
