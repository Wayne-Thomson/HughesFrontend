import React from 'react'
import StandardNavBar from '../components/StandardNavBar.jsx';
import RateLimitedUI from '../components/RateLimitedUI.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import VehicleCard from '../components/VehicleCard.jsx';

console.log(import.meta.env.VITE_ACCESS_KEY);

const VehicleListPage = () => {
    const [ loading, setLoading ] = React.useState(false);
    const [ rateLimited, setRateLimited ] = React.useState(false);
    const [ vehicles, setVehicles ] = React.useState([]);

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
        };
    };

  return (
    <div className='min-h-screen'>
      <StandardNavBar />
      <button onClick={() => handleCreateVehicleTest()} >Create New Item</button>
        
        <div className="max-w-7xl mx-auto p-4 mt-6">
          {
          loading && 
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          }
          {(vehicles.length > 0) && (!rateLimited) && (!loading) && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {vehicles.map(vehicle => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>

      {rateLimited && <RateLimitedUI />}
      
    </div>
  )
}

export default VehicleListPage
