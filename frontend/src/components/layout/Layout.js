import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { 
  FaTasks, FaUsers, FaUserCircle, FaSignOutAlt, 
  FaChevronLeft, FaChevronRight, FaTachometerAlt,
  FaBars, FaTimes
} from 'react-icons/fa';

// Import the logo
import logoIcon from '../../images/logo.icon.png';

/**
 * Layout - Main layout component with responsive sidebar
 * 
 * Includes:
 * - Mobile responsive navigation
 * - Collapsible sidebar for desktop
 * - Persistent navigation state
 * - User profile section
 * 
 * @param {React.ReactNode} children - Content to render in the main area
 */
const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Use state for isMobile to ensure it updates on resize
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Set collapsed state based on screen size on initial load and resize
  useEffect(() => {
    // Function to handle resize events
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-collapse on mobile
      if (mobile) {
        setCollapsed(true);
        // Close mobile menu when resizing to mobile
        setMobileOpen(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Function to toggle sidebar on mobile
  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-neutral-50">
      {/* Mobile Header - Only visible on mobile */}
      <div className="md:hidden bg-white shadow-md flex justify-between items-center h-16 px-4 border-b border-neutral-200 z-30 sticky top-0">
        <div className="flex items-center">
          <img 
            src={logoIcon} 
            alt="SyncUp Logo" 
            className="h-8 w-8 mr-2" 
          />
          <h1 className="text-lg font-bold text-neutral-800">SyncUp</h1>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar - Fixed layout with 50% width on mobile and slide-in/out transition */}
      <div 
        className={`
          bg-white shadow-md z-40 transition-transform duration-300
          ${collapsed ? 'md:w-16' : 'md:w-64'} 
          w-1/2
          fixed top-0 left-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          md:relative 
          h-full
        `}
        style={{ minHeight: '100vh' }} // Ensures full height
      >
        {/* Sidebar Header - Only visible on desktop */}
        <div className="hidden md:flex items-center justify-between h-16 px-4 border-b border-neutral-200">
          {!collapsed ? (
            <div className="flex items-center">
              <img 
                src={logoIcon} 
                alt="SyncUp Logo" 
                className="h-10 w-10 mr-2" 
              />
              <h1 className="text-xl font-bold text-neutral-800">SyncUp</h1>
            </div>
          ) : (
            <img 
              src={logoIcon} 
              alt="SyncUp Logo" 
              className="h-8 w-8 mx-auto" 
            />
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <div className="py-4 mt-0 md:mt-0">
          <nav>
            <ul className="space-y-1 px-2">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive 
                        ? "bg-primary-50 text-primary-700 font-medium" 
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <FaTachometerAlt className="w-5 h-5 flex-shrink-0" />
                    {/* Show text on mobile regardless of collapsed state */}
                    {(mobileOpen || !collapsed) && (
                      <span>Dashboard</span>
                    )}
                  </div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/tasks"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive || location.pathname.includes("/tasks/")
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <FaTasks className="w-5 h-5 flex-shrink-0" />
                    {/* Show text on mobile regardless of collapsed state */}
                    {(mobileOpen || !collapsed) && (
                      <span>Tasks</span>
                    )}
                  </div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/groups"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive || location.pathname.includes("/groups/")
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <FaUsers className="w-5 h-5 flex-shrink-0" />
                    {/* Show text on mobile regardless of collapsed state */}
                    {(mobileOpen || !collapsed) && (
                      <span>Groups</span>
                    )}
                  </div>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer Section with user info and logout */}
        <div 
          className={`
            absolute bottom-0 left-0 right-0 p-3 border-t border-neutral-200 
            bg-white shadow-sm ${collapsed && !mobileOpen ? 'text-center' : ''}
          `}
        >
          {/* Show expanded footer on mobile regardless of collapsed state */}
          {(mobileOpen || !collapsed) ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUserCircle className="text-neutral-500 text-lg mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-800 truncate max-w-[120px]">{user?.name}</p>
                  <p className="text-xs text-neutral-500 truncate max-w-[120px]">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-neutral-500 hover:text-red-500 p-2 flex-shrink-0"
                title="Logout"
                aria-label="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <FaUserCircle className="text-neutral-500 text-lg" />
              <button
                onClick={handleLogout}
                className="text-neutral-500 hover:text-red-500 p-2"
                title="Logout"
                aria-label="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay - only appears when sidebar is open on mobile */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content - added pb-16 to ensure content doesn't go under fixed footer */}
      <div className="flex-1 overflow-auto pb-16">
        <main className="p-4 md:p-6">
          {children}
        </main>

        {/* Fixed Footer - ensures it's always visible at bottom */}
        <div className="fixed bottom-0 left-0 md:left-16 right-0 bg-white border-t border-neutral-200 h-12 z-20">
          <div className="flex justify-center items-center h-full text-xs text-neutral-500">
            <p>© 2025 SyncUp. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
