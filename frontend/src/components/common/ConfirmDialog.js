import React from 'react';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

/**
 * ConfirmDialog - A responsive modal dialog for confirming user actions
 * 
 * @param {boolean} isOpen - Controls visibility of the dialog
 * @param {function} onClose - Function to call when dialog should close
 * @param {function} onConfirm - Function to call when action is confirmed
 * @param {string} title - Dialog title text
 * @param {string} message - Dialog message body
 * @param {string} confirmText - Text for confirmation button
 * @param {string} cancelText - Text for cancel button
 * @param {string} type - Dialog type (warning, danger, info)
 */
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // warning, danger, info
}) => {
  if (!isOpen) return null;
  
  // Handle keyboard escape key to close dialog
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  const typeClasses = {
    warning: {
      icon: <FaExclamationTriangle className="text-amber-500" size={24} />,
      button: 'bg-amber-500 hover:bg-amber-600 text-white'
    },
    danger: {
      icon: <FaExclamationTriangle className="text-red-500" size={24} />,
      button: 'bg-red-500 hover:bg-red-600 text-white'
    },
    info: {
      icon: <FaExclamationTriangle className="text-blue-500" size={24} />,
      button: 'bg-blue-500 hover:bg-blue-600 text-white'
    }
  };
  
  // Close dialog when clicking on the backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    // Backdrop - added onClick handler for closing when clicking outside
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Dialog container - increased padding for mobile, adjusted max-width */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-4 sm:p-6">
          {/* Header - improved responsiveness for smaller screens */}
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="flex-shrink-0">
              {typeClasses[type].icon}
            </div>
            <h3 
              id="dialog-title"
              className="text-base sm:text-lg font-bold text-neutral-800 ml-2 sm:ml-3 break-words"
            >
              {title}
            </h3>
          </div>
          
          {/* Message - improved text size on mobile */}
          <p className="text-sm sm:text-base text-neutral-600 mb-5 sm:mb-6">{message}</p>
          
          {/* Buttons - stack vertically on very small screens */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0">
            <button
              onClick={onClose}
              className="mt-2 sm:mt-0 w-full sm:w-auto px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 flex items-center justify-center"
              aria-label={cancelText}
            >
              <FaTimes className="mr-2" size={16} /> {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`w-full sm:w-auto px-4 py-2 rounded-md flex items-center justify-center ${typeClasses[type].button}`}
              aria-label={confirmText}
            >
              <FaCheck className="mr-2" size={16} /> {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;