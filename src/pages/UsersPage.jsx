import React from 'react'
import StandardNavBar from '../components/StandardNavBar'

const UsersPage = () => {
  return (
    <div className='min-h-screen'>
      <StandardNavBar />
       <div className="max-w-7xl mx-auto p-4 mt-6">
         <h1 className="text-3xl font-bold mb-4">Users</h1>
         {/* User list or content goes here */}
       </div>
    </div>
  )
}

export default UsersPage
