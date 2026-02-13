import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import StandardNavBar from '../components/StandardNavBar'
import toast from 'react-hot-toast'

const VehicleDetailsPage = () => {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const res = await axios.get(`${apiUrl}/vehicle/${id}`)
        setVehicle(res.data.vehicle)
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        toast.error('Error loading vehicle details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVehicle()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen">
        <StandardNavBar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen">
        <StandardNavBar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Vehicle not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <StandardNavBar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {vehicle.make} {vehicle.model}
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Registration</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{vehicle.registration}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">VIN</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{vehicle.vin || 'Unknown'}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Year</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{vehicle.manufactureDateDate?.split('-')[0] || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Fuel Type</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{vehicle.fuelType}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Engine Power (CC)</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{vehicle.enginePower?.cc || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Power (BHP)</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{vehicle.enginePower?.bhp || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetailsPage
