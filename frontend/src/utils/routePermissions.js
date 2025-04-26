/**
 * Route permissions configuration
 * 
 * This file defines which user roles can access which routes
 * - 'admin': Only admin users can access
 * - 'tutor': Only tutor and admin users can access
 * - 'student': Only student, tutor, and admin users can access
 * - 'public': All users can access, including unauthenticated users
 * - 'authenticated': Any authenticated user can access
 */

// Define route patterns and their required roles
const routePermissions = [
  // Admin routes - only accessible by admins
  { pattern: /^\/admin($|\/)/, role: 'admin' },
  
  // Tutor routes - only accessible by tutors and admins
  { pattern: /^\/tutor($|\/)/, role: 'tutor' },
  
  // Student routes - only accessible by students, tutors, and admins
  { pattern: /^\/student($|\/)/, role: 'student' },
  
  // Public routes - accessible by anyone
  { pattern: /^\/$/, role: 'public' },
  { pattern: /^\/main($|\/)/, role: 'public' },
  { pattern: /^\/auth($|\/)/, role: 'public' },
];

/**
 * Check if a user has permission to access a route
 * @param {string} pathname - The current route path
 * @param {Object|null} user - The user object containing role information
 * @returns {boolean} Whether the user has permission
 */
export const hasRoutePermission = (pathname, user) => {
  // Find the matching route pattern
  const route = routePermissions.find(r => r.pattern.test(pathname));
  
  // If no matching pattern is found, default to requiring authentication
  if (!route) {
    return !!user; // User must be authenticated
  }
  
  // Check permission based on role
  switch (route.role) {
    case 'public':
      return true; // Anyone can access
    case 'authenticated':
      return !!user; // Any authenticated user
    case 'student':
      return !!user && ['student', 'tutor', 'admin'].includes(user.role);
    case 'tutor':
      return !!user && ['tutor', 'admin'].includes(user.role);
    case 'admin':
      return !!user && user.role === 'admin';
    default:
      return false;
  }
};

/**
 * Get the appropriate redirect path for unauthorized access
 * @param {Object|null} user - The user object containing role information
 * @returns {string} The path to redirect to
 */
export const getUnauthorizedRedirect = (user) => {
  if (!user) {
    return '/auth/login';
  }
  
  // Redirect to the appropriate dashboard based on role
  switch (user.role) {
    case 'admin':
      return '/admin/dashboard';
    case 'tutor':
      return '/tutor/dashboard';
    case 'student':
      return '/student';
    default:
      return '/auth/login';
  }
};
