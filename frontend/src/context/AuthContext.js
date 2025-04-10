import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000/api';
    axios.defaults.withCredentials = true; // For cookies
  }, []);

  // Check if user is logged in on page load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          console.log('Fetching user profile with token:', storedToken.substring(0, 10) + '...');
          const res = await axios.get('/auth/profile');
          setUser(res.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        console.error('Response:', err.response);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    setError(null);
    try {
      console.log('Attempting to register user:', { ...userData, password: '****' });
      const res = await axios.post('/auth/register', userData);
      console.log('Registration successful:', res.data);
      setUser(res.data);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Registration error response:', err.response);
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (userData) => {
    setError(null);
    try {
      console.log('Attempting to login user:', { ...userData, password: '****' });
      const res = await axios.post('/auth/login', userData);
      console.log('Login successful:', res.data);
      setUser(res.data);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return true;
    } catch (err) {
      console.error('Login error:', err);
      console.error('Login error response:', err.response);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;