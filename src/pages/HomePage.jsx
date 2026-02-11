import React, { useEffect, useState } from 'react'
import Navbar from '../components/NavBar'
import NoteCard from '../components/NoteCard';
import RateLimitedUI from '../components/RateLimitedUI';
import axios from 'axios';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [rateLimited, setRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Get list of notes from backend
  //   const fetchNotes = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:3000/api/notes');
  //       console.log("Notes fetched:", res.data);
  //       setNotes(res.data || []);
  //       setRateLimited(false);
  //     } catch (error) {
  //       console.log("Error fetching notes:", error);
  //       if (error.response && error.response.status === 429) {
  //         setRateLimited(true);
  //       }
  //       toast.error('Error fetching notes');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchNotes();
  // }, []);
  
  return (
    <div className='min-h-screen'>
      <Navbar />

        
        <div className="max-w-7xl mx-auto p-4 mt-6">
          {
          loading && 
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          }
          {(notes.length > 0) && (!rateLimited) && (!loading) && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {notes.map(note => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          )}
        </div>

      {rateLimited && <RateLimitedUI />}
      
    </div>
  )
}

export default HomePage
