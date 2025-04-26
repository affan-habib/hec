import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 errors for non-auth endpoints
    // This prevents redirect loops and allows the auth hooks to handle authentication errors properly
    if (error.response?.status === 401 &&
        !error.config.url.includes('/auth/login') &&
        !error.config.url.includes('/auth/profile')) {

      console.log('Token expired or invalid, clearing token');

      // Token expired or invalid - clear token but don't redirect
      // Let the useAuth hook handle the redirection
      Cookies.remove('token');

      // Don't automatically redirect here, let the component handle it
      // This prevents issues with React state updates during rendering
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    // First check if we have user data in cookies
    const storedUser = Cookies.get('user');

    // If we have a stored user and this is a page reload, use the stored data
    // to avoid unnecessary API calls
    if (storedUser) {
      try {
        // Check if this is a programmatic API call or a page reload
        const isReload = typeof window !== 'undefined' &&
                         document.readyState === 'complete';

        // If it's a reload and we have stored user data, use it without API call
        if (isReload) {
          console.log('Using cached user data from cookies');
          return JSON.parse(storedUser);
        }
      } catch (parseError) {
        console.error('Error parsing stored user data:', parseError);
        // Continue to API call if we can't parse the stored data
      }
    }

    // If we don't have stored data or this is not a reload, make the API call
    try {
      // Add timeout to the request to prevent hanging
      const response = await api.get('/auth/profile', {
        timeout: 5000, // 5 second timeout
        retry: 1,      // Retry once if it fails
      });

      // Store the user data in cookies as a fallback
      if (response.data && response.data.data) {
        Cookies.set('user', JSON.stringify(response.data.data), { expires: 7 }); // Expires in 7 days
      }

      return response.data.data;
    } catch (error) {
      // If we have a stored user and this is a network error (not an auth error)
      if (error.code === 'ECONNABORTED' || !error.response || error.response.status !== 401) {
        // Try to get user from cookies as fallback
        if (storedUser) {
          console.log('Using cached user data due to API error');
          return JSON.parse(storedUser);
        }
      }
      throw error;
    }
  },

  // Logout user (client-side only, server doesn't need to be notified)
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },
};

export default authService;
