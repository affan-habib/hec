/**
 * Utility functions for navigation based on user roles
 */

/**
 * Get the appropriate redirect path based on user role
 * @param {Object} user - The user object containing role information
 * @returns {string} The path to redirect to
 */
export const getRedirectPathByRole = (user) => {
  if (!user) return '/auth/login';

  switch (user.role) {
    case 'admin':
      return '/admin/dashboard';
    case 'tutor':
      return '/tutor/dashboard';
    case 'student':
      return '/student';
    default:
      return '/';
  }
};
