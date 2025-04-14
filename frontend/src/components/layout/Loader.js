import React from 'react';

/**
 * Loader - A responsive loading spinner component
 * 
 * Displays a customizable loading spinner that works well across all device sizes.
 * Can be used inline or as a fullscreen overlay.
 * 
 * @param {string} size - Size of spinner: 'small', 'medium', or 'large'
 * @param {boolean} fullScreen - Whether to display as fullscreen overlay
 * @param {string} color - Color scheme: 'primary', 'secondary', 'accent', or 'white'
 * @param {string} className - Optional additional classes
 */
const Loader = ({ 
  size = 'medium', 
  fullScreen = false, 
  color = 'primary',
  className = '' 
}) => {
  // Responsive size classes - slightly smaller on mobile
  const sizeClasses = {
    small: 'h-5 w-5 sm:h-6 sm:w-6 border-2',
    medium: 'h-10 w-10 sm:h-12 sm:w-12 border-2 sm:border-3',
    large: 'h-14 w-14 sm:h-16 sm:w-16 border-3 sm:border-4'
  };
  
  // Color classes for the spinner
  const colorClasses = {
    primary: 'border-t-primary-600 border-r-transparent border-b-primary-600 border-l-transparent',
    secondary: 'border-t-secondary-600 border-r-transparent border-b-secondary-600 border-l-transparent',
    accent: 'border-t-accent-600 border-r-transparent border-b-accent-600 border-l-transparent',
    white: 'border-t-white border-r-transparent border-b-white border-l-transparent'
  };
  
  // The spinner element with appropriate size and color
  const spinner = (
    <div 
      className={`
        animate-spin rounded-full 
        ${sizeClasses[size]} 
        ${colorClasses[color]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      {/* Hidden text for screen readers */}
      <span className="sr-only">Loading...</span>
    </div>
  );
  
  // Fullscreen overlay version
  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 p-4"
        role="alert"
        aria-busy="true"
      >
        {spinner}
      </div>
    );
  }
  
  // Regular inline version
  return (
    <div className="flex justify-center items-center p-2 sm:p-4">
      {spinner}
    </div>
  );
};

export default Loader;