'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import authService from '@/services/authService';
import { getRedirectPathByRole } from '@/utils/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Track if this is the first render (initial load) or a reload
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = Cookies.get('token');
        const storedUserData = Cookies.get('user');

        // Track if we need to redirect
        let shouldRedirect = false;
        let userData = null;

        if (token) {
          // First try to use stored user data from cookies to avoid unnecessary API calls
          if (storedUserData) {
            try {
              userData = JSON.parse(storedUserData);
              setUser(userData);
              console.log('Using user data from cookies');

              // Only set shouldRedirect flag, but don't redirect yet
              const pathname = window.location.pathname;
              const isPublicRoute = pathname === '/' || pathname === '/main' || pathname.startsWith('/auth/');
              shouldRedirect = isPublicRoute && userData;
            } catch (parseError) {
              console.error('Error parsing stored user data:', parseError);
              // If we can't parse the stored data, we'll try the API call
            }
          }

          // Only make API call if we don't have valid user data from cookies
          // or if this is the initial page load (not a reload)
          if (!userData) {
            try {
              // Verify token and get user data from API
              userData = await authService.getCurrentUser();
              setUser(userData);

              // Store the fresh user data in cookies
              Cookies.set('user', JSON.stringify(userData), { expires: 7 });

              // Only set shouldRedirect flag, but don't redirect yet
              const pathname = window.location.pathname;
              const isPublicRoute = pathname === '/' || pathname === '/main' || pathname.startsWith('/auth/');
              shouldRedirect = isPublicRoute && userData;
            } catch (apiError) {
              console.error('API error during authentication check:', apiError);

              // Only log out if it's an authentication error (401)
              if (apiError.response && apiError.response.status === 401) {
                console.log('Token invalid or expired, logging out');
                Cookies.remove('token');
                Cookies.remove('user');
                setUser(null);
              }
            }
          }

          // Handle redirection separately, only for initial page load (not reload)
          if (shouldRedirect && isInitialRender) {
            const redirectPath = getRedirectPathByRole(userData);
            router.push(redirectPath);
          }
        } else {
          // No token found
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        Cookies.remove('token');
        Cookies.remove('user');
        setUser(null);
      } finally {
        setLoading(false);
        // Mark that initial render is complete
        setIsInitialRender(false);
      }
    };

    checkAuth();
  }, [router, isInitialRender]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { token, user } = await authService.login(email, password);

      // Log the login response for debugging
      console.log('Login response:', { token, user });

      // Save token to cookies
      Cookies.set('token', token, { expires: 7 }); // Expires in 7 days

      // Save user data to cookies as a fallback
      Cookies.set('user', JSON.stringify(user), { expires: 7 }); // Expires in 7 days

      // Set user data in state
      setUser(user);

      // Reset isInitialRender to ensure proper redirection
      setIsInitialRender(true);

      // Redirect based on user role
      const redirectPath = getRedirectPathByRole(user);
      router.push(redirectPath);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from cookies
    Cookies.remove('token');

    // Remove user data from cookies
    Cookies.remove('user');

    // Clear user data from state
    setUser(null);

    // Redirect to main landing page
    router.push('/auth/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
