'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/hooks/useAuth';
import { hasRoutePermission, getUnauthorizedRedirect } from '@/utils/routePermissions';
import Cookies from 'js-cookie';

const MainLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Load sidebar state from cookies
    try {
      const savedState = Cookies.get('sidebarCollapsed');
      if (savedState !== null) {
        setIsSidebarCollapsed(JSON.parse(savedState));
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error);
    }
  }, []);

  // Check if the current route is a public route (home, login, register, etc.)
  const isPublicRoute = pathname === '/' || pathname === '/auth/login' || pathname === '/auth/register';

  // Check route permissions
  useEffect(() => {
    if (!loading && user && !isPublicRoute) {
      // Check if the user has permission to access the current route
      const hasPermission = hasRoutePermission(pathname, user);

      if (!hasPermission) {
        // Redirect to the appropriate page based on user role
        const redirectPath = getUnauthorizedRedirect(user);
        router.replace(redirectPath);
      }
    }
  }, [pathname, user, loading, router, isPublicRoute]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is not authenticated and route is not public, redirect to login
  if (!user && !isPublicRoute) {
    // This will be handled by the useAuth hook's redirect
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If it's a public route, render without layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 ease-in-out">
      <Sidebar onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)} />
      <div
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarCollapsed ? '64px' : '224px' }}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
