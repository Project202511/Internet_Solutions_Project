import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Protects routes from unauthorized access by checking authentication status.
 * Shows a responsive loading spinner while auth state is being determined.
 * Redirects to login page if user is not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      // This container is already responsive with flex and h-screen
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-primary-600">
          {/* Adding accessible text for screen readers */}
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect behavior doesn't need responsive changes
    return <Navigate to="/login" replace />;
  }

  // Return children as is - their responsiveness handled in their own components
  return children;
};

export default ProtectedRoute;