import React, { createContext, useState, useContext, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

/**
 * NotificationContext - Context for displaying application notifications
 * 
 * Provides a system for showing toast notifications that adapts to different
 * screen sizes and device types. Includes accessibility features and
 * touch-friendly interactions for mobile devices.
 */
const NotificationContext = createContext();

// Custom hook for using notifications
export const useNotification = () => useContext(NotificationContext);

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size on mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    
    // Add notification to state
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    
    // Auto-remove after duration (if not set to permanent)
    if (duration !== Infinity) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    // Return ID so caller can manually remove if needed
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Helper methods for different notification types
  const success = (message, duration) => addNotification(message, 'success', duration);
  const error = (message, duration) => addNotification(message, 'error', duration);
  const info = (message, duration) => addNotification(message, 'info', duration);
  const warning = (message, duration) => addNotification(message, 'warning', duration);

  // Get appropriate icon for notification type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-amber-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        info,
        warning
      }}
    >
      {children}
      
      {/* Notification Container - Responsive positioning and width */}
      <div 
        className={`
          fixed z-50 space-y-2 
          ${isMobile 
            ? 'bottom-0 left-0 right-0 px-2 pb-2 pt-0 max-w-full' 
            : 'bottom-4 right-4 max-w-md'
          }
        `}
        aria-live="polite"
        role="status"
      >
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`
              flex items-start p-3 sm:p-4 rounded-lg shadow-lg 
              animate-fade-in bg-white border-l-4
              ${isMobile ? 'w-full' : ''}
              ${notification.type === 'success' ? 'border-green-500' :
                notification.type === 'error' ? 'border-red-500' :
                notification.type === 'warning' ? 'border-amber-500' :
                'border-blue-500'
              }
            `}
          >
            {/* Icon - Kept same size on mobile for visibility */}
            <div className="mr-3 mt-0.5 flex-shrink-0">
              {getTypeIcon(notification.type)}
            </div>
            
            {/* Content - Improved text wrapping */}
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-neutral-800 break-words">
                {notification.message}
              </p>
            </div>
            
            {/* Close Button - Enlarged touch target for mobile */}
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 sm:ml-4 text-neutral-400 hover:text-neutral-600 p-1 sm:p-0"
              aria-label="Close notification"
            >
              <FaTimes className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Only export the context once as the default export
export default NotificationContext;