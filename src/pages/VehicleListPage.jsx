import React from 'react'
import StandardNavBar from '../components/StandardNavBar.jsx';
import RateLimitedUI from '../components/RateLimitedUI.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import VehicleCard from '../components/VehicleCard.jsx';
import { ArrowUp, ArrowDown } from 'lucide-react';

console.log(import.meta.env.VITE_ACCESS_KEY);

const VehicleListPage = () => {
    const [ loading, setLoading ] = React.useState(true);
    const [ rateLimited, setRateLimited ] = React.useState(false);
    const [ vehicles, setVehicles ] = React.useState([]);
    const [ searchTerm, setSearchTerm ] = React.useState('');
    const [ selectedMake, setSelectedMake ] = React.useState('');
    const [ orderBy, setOrderBy ] = React.useState('dateAdded');
    const [ sortDirection, setSortDirection ] = React.useState('desc');
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
    }, []);

    // Get unique makes and sort alphabetically
    const uniqueMakes = Array.from(new Set(vehicles.map(v => v.make)))
        .filter(make => make) // Remove any empty values
        .sort();

    // Get count of vehicles for each make
    const getCountForMake = (make) => {
        return vehicles.filter(v => v.make === make).length;
    };

    // Filter vehicles based on selected make and search term
    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesMake = selectedMake === '' || (vehicle.make && vehicle.make === selectedMake);
        const matchesSearch = !searchTerm || 
                            (vehicle.registration && vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (vehicle.vin && vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (vehicle.make && vehicle.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (vehicle.createdAt && vehicle.createdAt.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesMake && matchesSearch;
    }).sort((a, b) => {
        let aValue, bValue;
        const isAsc = sortDirection === 'asc';
        
        switch(orderBy) {
            case 'dateAdded':
                aValue = new Date(a.createdAt).getTime();
                bValue = new Date(b.createdAt).getTime();
                return isAsc ? aValue - bValue : bValue - aValue;
            case 'year':
                aValue = a.manufactureDate ? parseInt(a.manufactureDate.split('-')[0]) : 0;
                bValue = b.manufactureDate ? parseInt(b.manufactureDate.split('-')[0]) : 0;
                return isAsc ? aValue - bValue : bValue - aValue;
            case 'make':
                aValue = a.make || '';
                bValue = b.make || '';
                return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            case 'registration':
                aValue = a.registration || '';
                bValue = b.registration || '';
                return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            default:
                return 0;
        }
    });

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
              {uniqueMakes.map(make => (
                <option key={make} value={make}>{make} ({getCountForMake(make)})</option>
              ))}
            </select>
          </div>

          {/* Order By */}
          <div>
            <label htmlFor="orderby" className="block text-sm font-medium text-gray-400 mb-1">
              Order By:
            </label>
            <div className="flex gap-2">
              <select
                id="orderby"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white cursor-pointer text-gray-900"
              >
                <option value="dateAdded">Date Added</option>
                <option value="year">Year</option>
                <option value="make">Make</option>
                <option value="registration">Registration</option>
              </select>
              <button
                onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition bg-white cursor-pointer text-gray-900 flex items-center justify-center"
                title={`Sort ${sortDirection === 'desc' ? 'Ascending' : 'Descending'}`}
              >
                {sortDirection === 'desc' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
              </button>
            </div>
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
        {(filteredVehicles.length > 0) && (!rateLimited) && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} setLoading={setLoading} vehicles={vehicles} setVehicles={setVehicles} />
            ))}
          </div>
        )}
        {(filteredVehicles.length === 0) && (vehicles.length > 0) && (!rateLimited) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No vehicles match your filters</p>
          </div>
        )}
      </div>

      {rateLimited && <RateLimitedUI />}
      
    </div>
  )
}

export default VehicleListPage
