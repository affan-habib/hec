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

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = Cookies.get('token');

        if (token) {
          // Verify token and get user data
          const userData = await authService.getCurrentUser();
          setUser(userData);

          // Check if we're on a public route and redirect if needed
          const pathname = window.location.pathname;
          const isPublicRoute = pathname === '/' || pathname === '/main' || pathname.startsWith('/auth/');

          if (isPublicRoute && userData) {
            // If user is authenticated and on a public route, redirect to appropriate dashboard
            const redirectPath = getRedirectPathByRole(userData);
            router.push(redirectPath);
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        Cookies.remove('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { token, user } = await authService.login(email, password);

      // Save token to cookies
      Cookies.set('token', token, { expires: 7 }); // Expires in 7 days

      // Set user data
      setUser(user);

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

    // Clear user data
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
