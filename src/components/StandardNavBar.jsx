import { PlusIcon, Menu, X, LogOut } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast';

const StandardNavBar = ({ onOpenAddVehicleModal, onOpenAddUserModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const hasShownToastRef = useRef(false)

  const isOnVehicles = location.pathname === '/vehicles'
  const isOnUsers = location.pathname === '/users'
  const isOnDeleted = location.pathname === '/deleted'

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

  const closeMenu = () => setMobileMenuOpen(false)

  const handleLogout = () => {
    localStorage.clear()
    toast.success('Logged out successfully!')
    navigate('/')
    closeMenu()
  }

  useEffect(() => {
    if (hasShownToastRef.current) return

    const userData = localStorage.getItem('userData')
    
    if (!userData) {
      localStorage.clear()
      toast.error('You must be logged in to access this page.');
      hasShownToastRef.current = true
      navigate('/')
      return
    }

    try {
      const parsedData = JSON.parse(userData)
      if (parsedData.message !== 'Login successful') {
        localStorage.clear()
        toast.error('You must be logged in to access this page.');
        hasShownToastRef.current = true
        navigate('/')
      }
    } catch (error) {
      console.error('Error parsing userData:', error)
      localStorage.clear()
      toast.error('You must be logged in to access this page.');
      hasShownToastRef.current = true
      navigate('/')
    }
  }, [])

  return (
    <header className='sticky top-0 z-30 bg-gray-200 border-b border-gray-300 shadow-md'>
      <div className='mx-auto max-w-7xl px-4 py-4'>
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='flex items-start md:items-center gap-1 md:gap-4 group hover:opacity-80 transition-opacity flex-col md:flex-row'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900 font-sans tracking-tight cursor-pointer'>
                Hughes <span className='text-gray-600'>Available Vehicles</span>
              </h1>
            </div>
            <span className='text-xs md:text-sm font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded whitespace-nowrap'>
              {isOnVehicles ? 'Active Vehicles' : isOnDeleted ? 'Deleted Vehicles' : isOnUsers ? 'Users' : 'Home'}
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-4'>
            <Link to="/vehicles" className={`px-4 py-2 rounded-lg border transition-colors ${
              isOnVehicles 
                ? 'bg-gray-400 text-gray-900 border-gray-400' 
                : 'text-gray-700 border-gray-300 hover:bg-gray-300'
            }`}>
              Active Vehicles
            </Link>
            <Link to="/deleted" className={`px-4 py-2 rounded-lg border transition-colors ${
              isOnDeleted 
                ? 'bg-gray-400 text-gray-900 border-gray-400' 
                : 'text-gray-700 border-gray-300 hover:bg-gray-300'
            }`}>
              Deleted Vehicles
            </Link>
            {isAdmin() && (
              <Link to="/users" className={`px-4 py-2 rounded-lg border transition-colors ${
                isOnUsers 
                  ? 'bg-gray-400 text-gray-900 border-gray-400' 
                  : 'text-gray-700 border-gray-300 hover:bg-gray-300'
              }`}>
                Users
              </Link>
            )}
          </nav>

          {/* Right Side - Add Vehicle/User Button (desktop) and Mobile Menu */}
          <div className='flex items-center gap-2'>
            {isOnVehicles && (
              <button onClick={onOpenAddVehicleModal} className='hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors'>
                <PlusIcon className='size-5'/>
                <span>Add Vehicle</span>
              </button>
            )}

            {isOnUsers && isAdmin() && (
              <button onClick={onOpenAddUserModal} className='hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors'>
                <PlusIcon className='size-5'/>
                <span>Add User</span>
              </button>
            )}

            {/* Logout Button */}
            <button onClick={handleLogout} className='hidden md:flex items-center gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors'>
              <LogOut className='size-5'/>
              <span>Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='md:hidden p-2 hover:bg-gray-300 rounded-lg transition-colors'
            >
              {mobileMenuOpen ? (
                <X className='size-6 text-gray-900'/>
              ) : (
                <Menu className='size-6 text-gray-900'/>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
              onClick={closeMenu}
            />

            {/* Menu Content */}
            <div className='fixed top-0 right-0 h-screen w-64 bg-gray-100 border-l border-gray-300 z-50 md:hidden flex flex-col'>
              {/* Close Button */}
              <div className='flex justify-end p-4 border-b border-gray-300'>
                <button
                  onClick={closeMenu}
                  className='p-2 hover:bg-gray-200 rounded-lg transition-colors'
                >
                  <X className='size-6 text-gray-900'/>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className='flex flex-col p-4 gap-3'>
                <Link 
                  to="/vehicles" 
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-lg border transition-colors text-center ${
                    isOnVehicles 
                      ? 'bg-gray-400 text-gray-900 border-gray-400' 
                      : 'text-gray-700 border-gray-300 hover:bg-gray-300'
                  }`}
                >
                  Vehicles
                </Link>
                <Link 
                  to="/deleted" 
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-lg border transition-colors text-center ${
                    isOnDeleted 
                      ? 'bg-gray-400 text-gray-900 border-gray-400' 
                      : 'text-gray-700 border-gray-300 hover:bg-gray-300'
                  }`}
                >
                  Deleted Vehicles
                </Link>
                <Link 
                  to="/users" 
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-lg border transition-colors text-center ${
                    isOnUsers 
                      ? 'bg-gray-400 text-gray-900 border-gray-400' 
                      : 'text-gray-700 border-gray-300 hover:bg-gray-300'
                  }`}
                >
                  Users
                </Link>

                {/* Add Vehicle Button in Mobile Menu */}
                {isOnVehicles && (
                  <button 
                    onClick={() => {
                      onOpenAddVehicleModal()
                      closeMenu()
                    }}
                    className='flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors mt-4'
                  >
                    <PlusIcon className='size-5'/>
                    <span>Add Vehicle</span>
                  </button>
                )}

                {/* Add User Button in Mobile Menu */}
                {isOnUsers && isAdmin() && (
                  <button 
                    onClick={() => {
                      onOpenAddUserModal()
                      closeMenu()
                    }}
                    className='flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors mt-4'
                  >
                    <PlusIcon className='size-5'/>
                    <span>Add User</span>
                  </button>
                )}

                {/* Logout Button in Mobile Menu */}
                <button 
                  onClick={handleLogout}
                  className='flex items-center justify-center gap-2 text-gray-700 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors mt-4'
                >
                  <LogOut className='size-5'/>
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default StandardNavBar
