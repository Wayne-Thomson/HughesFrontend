import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import StandardNavBar from '../components/StandardNavBar'
import AddUserModal from '../components/AddUserModal'
import axios from 'axios'
import toast from 'react-hot-toast'

const UsersPage = () => {
  const navigate = useNavigate()
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  // Check if user is admin
  const isAdmin = () => {
    try {
      const userData = localStorage.getItem('userData')
      if (!userData) return false
      const parsedData = JSON.parse(userData)
      return parsedData.user?.isAdmin === true
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin()) {
      toast.error('You do not have permission to access this page.')
      navigate('/vehicles')
    }
  }, [navigate])

  const handleUserAdded = () => {
    // Refresh users list or perform any necessary actions
    // This callback can be expanded to fetch and display users
  }

  const fetchUsers = useCallback(async () => {
    toast.loading('Loading users...', { id: 'fetchUsers' });
    try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/listall`);
        setUsers(res?.data?.users || []);
        setRateLimited(false);
        toast.dismiss('fetchUsers');
        toast.success('Users loaded successfully!', { id: 'fetchUsers' });
    } catch (error) {
        console.log("Error fetching users:", error);
        if (error.response && error.response.status === 429) {
            setRateLimited(true);
        }
        toast.dismiss('fetchUsers');
        toast.error('Error fetching users', { id: 'fetchUsers' });
    } finally {
        setLoading(false);
    }
  }, []);

  return (
    <div className='min-h-screen'>
      <StandardNavBar onOpenAddUserModal={() => setShowAddUserModal(true)} />
       <div className="max-w-7xl mx-auto p-4 mt-6">
         <h1 className="text-3xl font-bold mb-4">Users</h1>
         {/* User list or content goes here */}
       </div>

      <AddUserModal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  )
}

export default UsersPage
