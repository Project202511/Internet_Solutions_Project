import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center">
        <div className="mb-4 text-amber-500">
          <FaExclamationTriangle size={64} className="mx-auto" />
        </div>
        <h1 className="text-6xl font-bold text-neutral-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-600 mb-6">Page Not Found</h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link 
          to="/dashboard" 
          className="btn btn-primary inline-flex items-center px-6 py-3"
        >
          <FaHome className="mr-2" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;