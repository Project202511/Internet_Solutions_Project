import React from 'react';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

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
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            {typeClasses[type].icon}
            <h3 className="text-lg font-bold text-neutral-800 ml-3">{title}</h3>
          </div>
          
          <p className="text-neutral-600 mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 flex items-center"
            >
              <FaTimes className="mr-2" /> {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 rounded-md flex items-center ${typeClasses[type].button}`}
            >
              <FaCheck className="mr-2" /> {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;