import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';

const Loader = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const Navi = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const loadingToastId = toast('Logging in...', {
        icon: <Loader />,
      });
      // Clear local storage before making the call
      localStorage.clear()

      // Make API call to login endpoint
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/login`, {
        email: email,
        password: password,
        test: 'test' // Temporary field to test request body parsing
      });

      // If response is 200, save the response data to local storage
      const data = response.data
      localStorage.setItem('userData', JSON.stringify(data))
      console.log('Login successful:', data)
      toast.dismiss(loadingToastId) // Dismiss loading toast
      toast.success('Login successful!') // Show success toast
      Navi('/vehicles')
    } catch (error) {
      console.error('Error during login:', error)
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      toast.dismiss() // Dismiss all toasts
      toast.error(errorMessage) // Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          {/* <p className="text-sm">
            <a href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot password - WIP?
            </a>
          </p> */}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
