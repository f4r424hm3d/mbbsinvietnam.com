/**
 * Authentication utility functions
 */

/**
 * Check if user is authenticated by verifying token exists in localStorage
 * @returns boolean - true if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('studentToken') || localStorage.getItem('authToken');
  return !!token;
};

/**
 * Clear all authentication-related data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('studentToken');
  localStorage.removeItem('authToken');
  localStorage.removeItem('studentId');
  localStorage.removeItem('studentEmail');
  localStorage.removeItem('studentName');
  localStorage.removeItem('isVerified');
  // Clear sessionStorage as well
  sessionStorage.clear();
};

/**
 * Redirect to auth page and prevent back button access
 * Uses window.location.replace to prevent back navigation
 */
export const redirectToAuth = (): void => {
  // Clear all auth data first
  clearAuthData();
  
  // Use replace instead of navigate to prevent back button access
  // This removes the current page from history
  window.location.replace('/auth');
};

