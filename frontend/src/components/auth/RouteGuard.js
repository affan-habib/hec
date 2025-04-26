'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { hasRoutePermission, getUnauthorizedRedirect } from '@/utils/routePermissions';

/**
 * A component that protects routes based on user roles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} [props.requiredRoles] - Role(s) required to access this route
 * @returns {React.ReactNode} The children if authorized, or redirects if not
 */
const RouteGuard = ({ children, requiredRoles }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Check if the user has permission to access the current route
      const hasPermission = hasRoutePermission(pathname, user);
      
      if (!hasPermission) {
        // If specific roles were provided, check those as well
        const hasRequiredRole = !requiredRoles || 
          (user && (Array.isArray(requiredRoles) 
            ? requiredRoles.includes(user.role) 
            : user.role === requiredRoles));
            
        if (!hasRequiredRole) {
          // Redirect to the appropriate page based on user role
          const redirectPath = getUnauthorizedRedirect(user);
          router.replace(redirectPath); // Use replace to avoid adding to history
        }
      }
    }
  }, [pathname, user, loading, router, requiredRoles]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
};

export default RouteGuard;
