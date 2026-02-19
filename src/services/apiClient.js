import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Request interceptor to attach token to all requests except login
apiClient.interceptors.request.use(
  (config) => {
    // Skip adding token for login endpoint
    if (config.url !== '/api/user/login') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          const token = parsedData.user?.token;
          console.log('Retrieved token from localStorage:', token);
          if (token) {
            console.log('Attaching token to request:', token);
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error parsing userData from localStorage:', error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token-related errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, token might be expired
    if (error.response?.status === 401) {
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
