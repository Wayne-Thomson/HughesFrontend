import React, { useState } from 'react'
import StandardNavBar from '../components/StandardNavBar'
import AddUserModal from '../components/AddUserModal'

const UsersPage = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false)

  const handleUserAdded = () => {
    // Refresh users list or perform any necessary actions
    // This callback can be expanded to fetch and display users
  }

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
