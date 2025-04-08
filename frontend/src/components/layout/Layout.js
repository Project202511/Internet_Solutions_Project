import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { 
  FaTasks, FaUsers, FaUserCircle, FaSignOutAlt, 
  FaChevronLeft, FaChevronRight, FaTachometerAlt
} from 'react-icons/fa';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-md z-10 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
          {!collapsed && (
            <h1 className="text-xl font-bold text-primary-600">SyncUp</h1>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
        
        <div className="py-4">
          <nav>
            <ul className="space-y-1 px-2">
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
                  }
                >
                  <FaTachometerAlt className="mr-3" />
                  {!collapsed && <span>Dashboard</span>}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/tasks" 
                  className={({ isActive }) => 
                    `sidebar-item ${isActive || location.pathname.includes('/tasks/') ? 'sidebar-item-active' : ''}`
                  }
                >
                  <FaTasks className="mr-3" />
                  {!collapsed && <span>Tasks</span>}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/groups" 
                  className={({ isActive }) => 
                    `sidebar-item ${isActive || location.pathname.includes('/groups/') ? 'sidebar-item-active' : ''}`
                  }
                >
                  <FaUsers className="mr-3" />
                  {!collapsed && <span>Groups</span>}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 ${collapsed ? 'text-center' : ''}`}>
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUserCircle className="text-neutral-500 text-xl mr-2" />
                <div>
                  <p className="text-sm font-medium text-neutral-800">{user?.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-neutral-500 hover:text-red-500"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <FaUserCircle className="text-neutral-500 text-xl" />
              <button
                onClick={handleLogout}
                className="text-neutral-500 hover:text-red-500"
              >
                <FaSignOutAlt />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;