import React from 'react';
import StandardNavBar from '../components/StandardNavBar';
import VehicleCard from '../components/VehicleCard';
import RateLimitedUI from '../components/RateLimitedUI'; 
import axios from 'axios'; 
import toast from 'react-hot-toast';

const RemovedVehicleList = () => {
    const [rateLimited, setRateLimited] = React.useState(false);
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedMake, setSelectedMake] = React.useState('');
    const [orderBy, setOrderBy] = React.useState('dateAdded');
    const [ isScrolled, setIsScrolled ] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    React.useEffect(() => {
        // Get list of vehicles from backend
        const fetchVehicles = async () => {
            try {
                // Request the list of vehicles from the backend API endpoint and update state with the response data
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vehicle/listall`);
                // Log the fetched vehicles to the console for debugging and set the vehicles state variable with the response data, or an empty array if no data is returned
                setVehicles(res?.data?.vehicles || []);
                // If the request is successful, reset the rateLimited state to false in case it was previously set to true due to a 429 error
                setRateLimited(false);
            } catch (error) {
                // Log any errors that occur during the fetch to the console for debugging
                console.log("Error fetching vehicles:", error);
                // If the error response status is 429, it means the user has hit the rate limit, so we set the rateLimited state to true to show the appropriate UI
                if (error.response && error.response.status === 429) {
                    setRateLimited(true);
                }
                // Show an error toast notification to the user indicating that there was an error fetching the vehicles
                toast.error('Error fetching vehicles');
            } finally {
                // In the finally block, we set loading to false to indicate that the fetch operation has completed, regardless of whether it was successful or resulted in an error
                setLoading(false);
            }
        };
        // Call the fetchVehicles function to initiate the API request when the component mounts
        fetchVehicles();

        console.log(vehicles)
    }, []);

    const handleCreateVehicleTest = async () => {
        setLoading(true);
        try {
            // Create a new vehicle using the createVehicleREG controller function with a test registration number
            const res= await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vehicle/createvehiclereg/EK11YTH`);
            // Spread the new note into the existing notes array to update state and trigger re-render
            setVehicles(prevVehicles => [res?.data?.newVehicle, ...prevVehicles]);

            console.log("Vehicles:", vehicles);
            // Show success toast notification to user
            toast.success('Vehicle created successfully');
        } catch (error) {
            // Log the error to the console for debugging
            console.log("Error creating vehicle:", error);
            toast.error('Error creating vehicle');
        };
        setLoading(false);
    };

  return (
    <div className='min-h-screen'>
      <StandardNavBar />
        
      {/* Filter Bar */}
      <div className={`md:sticky md:top-16 md:z-20 py-4 transition-all ${isScrolled ? 'md:bg-black md:border-b md:border-gray-200 md:shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Search */}
          <div>
            <label htmlFor="search" className={`block text-sm font-medium text-gray-400 mb-1 transition-all ${isScrolled ? 'hidden md:block' : ''}`}>
              Search
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vehicles..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Vehicle Make */}
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-400 mb-1">
              Vehicle Make
            </label>
            <select
              id="make"
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white cursor-pointer text-gray-900"
            >
              <option value="">All Makes</option>
            </select>
          </div>

          {/* Order By */}
          <div>
            <label htmlFor="orderby" className="block text-sm font-medium text-gray-400 mb-1">
              Order By:
            </label>
            <select
              id="orderby"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white cursor-pointer text-gray-900"
            >
              <option value="dateAdded">Date Added</option>
              <option value="year">Year</option>
              <option value="make">Make</option>
              <option value="registration">Registration</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Semi-transparent overlay when loading */}
      {loading && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-none"></div>
          <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600"></div>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {(vehicles.length > 0) && (!rateLimited) && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {vehicles.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} deleteButtonText="Restore" deleteButtonColor="green" />
            ))}
          </div>
        )}
      </div>

      {rateLimited && <RateLimitedUI />}
      
    </div>
  )
}

export default RemovedVehicleList
