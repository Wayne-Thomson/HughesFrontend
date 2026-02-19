import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import StandardNavBar from '../components/StandardNavBar'
import AddUserModal from '../components/AddUserModal'
import UserCard from '../components/UserCard'
import apiClient from '../services/apiClient.js'
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

  const handleUserAdded = (newUser) => {
    if (newUser) {
      // Add the new user to the users list
      setUsers(prevUsers => [...prevUsers, newUser])
      toast.success('User added to the list!')
    }
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    toast.loading('Loading users...', { id: 'fetchUsers' });
    try {
        const res = await apiClient.get('/api/user/listall');
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

  React.useEffect(() => {
      fetchUsers();
  }, [fetchUsers]);

  return (
    <div className='min-h-screen'>
      <StandardNavBar onOpenAddUserModal={() => setShowAddUserModal(true)} />
      
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-gray-300 mt-2">Manage application users</p>
        </div>

        {(users.length > 0) && (!rateLimited) && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {users.map(user => (
              <UserCard key={user._id} user={user} setLoading={setLoading} users={users} setUsers={setUsers} />
            ))}
          </div>
        )}
        {(users.length === 0) && (!rateLimited) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        )}
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
