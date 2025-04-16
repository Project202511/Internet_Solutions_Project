import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

// lets define the ProtectedRoute component

const ProtectedRoute = ({ children }) => {
  // now, this will tell us about the status(of authentication) and loading status
  const { isAuthenticated, loading } = useContext(AuthContext);
// If the app is still checking auth status, show a loading gif
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
