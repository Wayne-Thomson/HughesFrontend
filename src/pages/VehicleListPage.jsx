import React from 'react'
import StandardNavBar from '../components/StandardNavBar.jsx';
import RateLimitedUI from '../components/RateLimitedUI.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';

console.log(import.meta.env.VITE_ACCESS_KEY);

const VehicleListPage = () => {
    const [ loading, setLoading ] = React.useState(false);
    const [ rateLimited, setRateLimited ] = React.useState(false);
    const [ vehicles, setVehicles ] = React.useState([]);

    React.useEffect(() => {
        // Get list of vehicles from backend
        const fetchVehicles = async () => {
            try {
                const res = await axios.get('https://hughes-backend.vercel.app/api/vehicles/listall');
                console.log("Vehicles fetched:", res.data);
                setVehicles(res.data || []);
                setRateLimited(false);
            } catch (error) {
                console.log("Error fetching vehicles:", error);
                if (error.response && error.response.status === 429) {
                    setRateLimited(true);
                }
                toast.error('Error fetching vehicles');
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const handleCreateVehicleTest = async () => {
        try {
            // Create a new vehicle using the createVehicleREG controller function with a test registration number
            const res= await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vehicle/createvehiclereg/EK11YTH`);
            // const res = await axios.post('http://localhost:3000/api/vehicle/createvehiclereg/EK11YTH');
            // Spread the new note into the existing notes array to update state and trigger re-render
            // setVehicles(prevVehicles => [res.data, ...prevVehicles]);
            toast.success('Vehicle created successfully');
        } catch (error) {
            console.log("Error creating vehicle:", error);
        }
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
