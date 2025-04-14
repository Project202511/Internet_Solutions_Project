import React, { useState } from 'react';
import { FaBell, FaSearch, FaTimes } from 'react-icons/fa';

/**
 * Header - A responsive header with search and notification functionality
 */
const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        {/* Mobile: Search Icon, Desktop: Search Input */}
        <div className={`relative ${showSearch ? 'w-full' : 'w-auto sm:w-48 md:w-64'}`}>
          {/* On mobile: Show search icon or full-width search */}
          {showSearch ? (
            <div className="flex items-center w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                <FaSearch className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                autoFocus
              />
              <button 
                className="absolute right-2 text-gray-400 p-1"
                onClick={() => setShowSearch(false)}
                aria-label="Close search"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <>
              {/* Search icon for mobile */}
              <button 
                className="sm:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setShowSearch(true)}
                aria-label="Open search"
              >
                <FaSearch />
              </button>
              
              {/* Search input for desktop */}
              <div className="hidden sm:block w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch className="text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </>
          )}
        </div>
        
        {/* Notifications - Hidden when search is active on mobile */}
        <div className={`flex items-center ${showSearch ? 'hidden sm:flex' : ''}`}>
          <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label="Notifications">
            <FaBell />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;