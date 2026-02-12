import React from 'react'
import StandardNavBar from '../components/StandardNavBar'
import RateLimitedUI from '../components/RateLimitedUI'

const VehicleListPage = () => {
    const [ loading, setLoading ] = React.useState(false);
    const [ rateLimited, setRateLimited ] = React.useState(false);
    const [ vehicles, setVehicles ] = React.useState([]);

    useEffect(() => {
        // Get list of notes from backend
        const fetchNotes = async () => {
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
            fetchNotes();
    }, []);

    const handleCreateVehicleTest = async () => {
        try {
            const newNote = { title: 'New Note', content: 'This is a new note.' };
            // const res = await axios.post('https://hughes-backend.vercel.app/api/notes', newNote);
            const res = await axios.post('http://localhost:3000/api/notes', newNote);
            // setNotes(prevNotes => [res.data, ...prevNotes]);
            toast.success('Note created successfully');
        } catch (error) {
            console.log("Error creating note:", error);
            toast.error('Error creating note');
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
