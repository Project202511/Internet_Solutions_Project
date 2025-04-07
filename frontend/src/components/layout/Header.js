import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            TaskCollab
          </Link>
          
          <nav>
            <ul className="flex space-x-4">
              {isAuthenticated ? (
                <>
                  <li>
                    <span className="text-gray-600">Welcome, {user?.name}</span>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-primary-600 hover:text-primary-800">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-primary-600 hover:text-primary-800">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;