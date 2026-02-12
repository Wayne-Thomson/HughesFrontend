import React from 'react'
import StandardNavBar from '../components/StandardNavBar'
import RateLimitedUI from '../components/RateLimitedUI'

const VehicleListPage = () => {
    const [ loading, setLoading ] = React.useState(false);
    const [ rateLimited, setRateLimited ] = React.useState(false);
    const [ vehicles, setVehicles ] = React.useState([]);


  return (
    <div className='min-h-screen'>
      <StandardNavBar />
      <button onClick={() => handleCreateNewItem()} >Create New Item</button>
        
        <div className="max-w-7xl mx-auto p-4 mt-6">
          {
          loading && 
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          }
          {(vehicles.length > 0) && (!rateLimited) && (!loading) && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* {vehicles.map(vehicle => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))} */}
            </div>
          )}
        </div>

      {rateLimited && <RateLimitedUI />}
      
    </div>
  )
}

export default VehicleListPage
