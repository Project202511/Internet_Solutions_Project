import React from 'react';

const Loader = ({ size = 'medium', fullScreen = false, color = 'primary' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-3',
    large: 'h-16 w-16 border-4'
  };
  
  const colorClasses = {
    primary: 'border-t-primary-600 border-r-transparent border-b-primary-600 border-l-transparent',
    secondary: 'border-t-secondary-600 border-r-transparent border-b-secondary-600 border-l-transparent',
    accent: 'border-t-accent-600 border-r-transparent border-b-accent-600 border-l-transparent',
    white: 'border-t-white border-r-transparent border-b-white border-l-transparent'
  };
  
  const spinner = (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center p-4">
      {spinner}
    </div>
  );
};

export default Loader;