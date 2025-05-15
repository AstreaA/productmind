'use client';

// Helper functions for auth management

// Check if user is logged in
export function isUserLoggedIn() {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
}

// Get user data from localStorage
export function getUserData() {
  if (typeof window === 'undefined') return null;
  
  try {
    const userJSON = localStorage.getItem('user');
    return userJSON ? JSON.parse(userJSON) : null;
  } catch (error) {
    console.error('Error parsing user data', error);
    return null;
  }
}

// Set user session (login)
export function setUserSession(userData, token) {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', token);
  
  // Dispatch custom event for auth state change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-state-changed'));
  }
}

// Clear user session (logout)
export function clearUserSession() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Dispatch custom event for auth state change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-state-changed'));
  }
} 