import { PlusIcon, Menu, X, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useState } from 'react'

const StandardNavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isOnVehicles = location.pathname === '/vehicles'
  const isOnUsers = location.pathname === '/users'
  const isOnDeleted = location.pathname === '/deleted'

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className='bg-gray-200 border-b border-gray-300 shadow-md'>
      <div className='mx-auto max-w-7xl px-4 py-4'>
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/vehicles" className='flex items-center gap-2 group'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900 font-sans tracking-tight'>
              Hughes <span className='text-gray-600'>Available Vehicles</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-4'>
            {!isOnVehicles && (
              <Link to="/vehicles" className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors">
                Vehicles
              </Link>
            )}
            {!isOnDeleted && (
              <Link to="/deleted" className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors">
                Deleted Vehicles
              </Link>
            )}
            {!isOnUsers && (
              <Link to="/users" className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors">
                Users
              </Link>
            )}
          </nav>

          {/* Right Side - Add Vehicle Button (desktop) and Mobile Menu */}
          <div className='flex items-center gap-2'>
            {isOnVehicles && (
              <button className='hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors'>
                <PlusIcon className='size-5'/>
                <span>Add Vehicle</span>
              </button>
            )}

            {/* Logout Button */}
            <button className='hidden md:flex items-center gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors'>
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
                {!isOnVehicles && (
                  <Link 
                    to="/vehicles" 
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors text-center"
                  >
                    Vehicles
                  </Link>
                )}
                {!isOnDeleted && (
                  <Link 
                    to="/deleted" 
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors text-center"
                  >
                    Deleted Vehicles
                  </Link>
                )}
                {!isOnUsers && (
                  <Link 
                    to="/users" 
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors text-center"
                  >
                    Users
                  </Link>
                )}

                {/* Add Vehicle Button in Mobile Menu */}
                {isOnVehicles && (
                  <button 
                    onClick={closeMenu}
                    className='flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors mt-4'
                  >
                    <PlusIcon className='size-5'/>
                    <span>Add Vehicle</span>
                  </button>
                )}

                {/* Logout Button in Mobile Menu */}
                <button 
                  onClick={closeMenu}
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
