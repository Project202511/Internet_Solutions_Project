import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
 
/**
 * AuthContext - Authentication context provider
 *
 * Manages authentication state, user data, and provides authentication methods.
 * Includes mobile-friendly error handling and token management.
 */
const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // Helper function to handle API errors consistently
  const handleApiError = (err, action) => {
    console.error(`${action} error:`, err);
    if (err.response) {
      console.error(`${action} error response:`, err.response);
      // Extract error message with fallback
      return err.response.data?.message || `${action} failed`;
    }
    // Handle network errors (important for mobile connections)
    if (err.request) {
      return 'Network error. Please check your connection.';
    }
    return `${action} failed`;
  };
 
  // Configure axios with baseURL that works for both development and production
  useEffect(() => {
    // Use environment variable if available, otherwise default to localhost
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    axios.defaults.baseURL = apiUrl;
    axios.defaults.withCredentials = true; // For cookies
   
    // Add request timeout for better mobile experience
    axios.defaults.timeout = 10000; // 10 seconds
  }, []);
 
  // Memoized loadUser function to prevent unnecessary re-renders
  const loadUser = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
     
      // Set Authorization header with token
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
     
      // Add a timeout for better mobile experience
      const res = await axios.get('/auth/profile');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error loading user:', err);
      // Clear auth state on error
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);
 
  // Check if user is logged in on page load
  useEffect(() => {
    loadUser();
  }, [loadUser]);
 
  // Register user
  const register = async (userData) => {
    setError(null);
    try {
      // Mask sensitive data in logs
      const sanitizedData = { ...userData, password: '****' };
      console.log('Attempting to register user:', sanitizedData);
     
      const res = await axios.post('/auth/register', userData);
     
      // Setup authenticated state
      setUser(res.data);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return true;
    } catch (err) {
      const errorMessage = handleApiError(err, 'Registration');
      setError(errorMessage);
      return false;
    }
  };
 
  // Login user
  const login = async (userData) => {
    setError(null);
    try {
      // Mask sensitive data in logs
      const sanitizedData = { ...userData, password: '****' };
      console.log('Attempting to login user:', sanitizedData);
     
      const res = await axios.post('/auth/login', userData);
     
      // Setup authenticated state
      setUser(res.data);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return true;
    } catch (err) {
      const errorMessage = handleApiError(err, 'Login');
      setError(errorMessage);
      return false;
    }
  };
 
  // Logout user
  const logout = async () => {
    try {
      // Only attempt to call logout endpoint if we're authenticated
      if (isAuthenticated) {
        await axios.post('/auth/logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
      // Continue with logout even if the API call fails
    } finally {
      // Clear auth state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };
 
  // Check if token is expiring and refresh if needed
  // This is especially important for mobile where sessions may be longer
  useEffect(() => {
    if (!isAuthenticated) return;
   
    // Check token every 5 minutes
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        clearInterval(tokenCheckInterval);
        return;
      }
     
      // If token exists but user is not loaded, try to load user
      if (!user) {
        loadUser();
      }
    }, 5 * 60 * 1000);
   
    return () => clearInterval(tokenCheckInterval);
  }, [isAuthenticated, user, loadUser]);
 
  // Clear error state after 5 seconds - better UX especially on mobile
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
     
      return () => clearTimeout(timer);
    }
  }, [error]);
 
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError: () => setError(null) // Add ability to manually clear errors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
 
export default AuthContext;