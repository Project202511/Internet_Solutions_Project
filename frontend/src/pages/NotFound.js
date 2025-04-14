import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

/**
 * NotFound - A responsive 404 error page
 * 
 * Displays a user-friendly error message when a page is not found.
 * Optimized for all screen sizes from mobile to desktop.
 */
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-8">
      <div className="text-center">
        {/* Warning icon - smaller on mobile */}
        <div className="mb-3 sm:mb-4 text-amber-500">
          <FaExclamationTriangle size={48} className="mx-auto sm:hidden" />
          <FaExclamationTriangle size={64} className="mx-auto hidden sm:block" />
        </div>
        
        {/* Error code - responsive text size */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-800 mb-2 sm:mb-4">404</h1>
        
        {/* Error message - responsive text size */}
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-600 mb-4 sm:mb-6">Page Not Found</h2>
        
        {/* Description - responsive width and spacing */}
        <p className="text-sm sm:text-base text-neutral-500 mb-6 sm:mb-8 max-w-xs sm:max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        {/* Back button - responsive padding */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md px-4 sm:px-6 py-2 sm:py-3 transition-colors"
        >
          <FaHome className="mr-2" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;