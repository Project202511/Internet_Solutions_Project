import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaLock, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import Logo from '../images/logo.icon.png';

/**
 * Login - A responsive authentication screen
 * 
 * Features:
 * - Mobile-first design with responsive sizing
 * - Accessible form inputs with icon indicators
 * - Keyboard-friendly focus management
 * - Error handling with clear visual feedback
 */
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();
  // Ref for the email input to focus on mount
  const emailInputRef = React.useRef(null);

  const { email, password } = formData;

  // Focus the email input on component mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Clear form error when user starts typing
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) {
      setFormError('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const success = await login({ email, password });
    setIsSubmitting(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and app title - responsive sizing */}
        <div className="text-center mb-6 sm:mb-10">
          <img 
            src={Logo} 
            alt="SyncUp Logo" 
            className="mx-auto h-16 w-16 sm:h-20 sm:w-20 mb-3 sm:mb-4" 
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">SyncUp</h1>
          <p className="text-sm sm:text-base text-neutral-600">Sign in to manage your tasks</p>
        </div>
        
        {/* Login form card - responsive padding */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6">Login</h2>
          
          {/* Error display - same on mobile and desktop */}
          {(error || formError) && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded text-sm sm:text-base">
              <p className="font-medium">Error</p>
              <p>{formError || error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            {/* Email field - responsive sizing */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-neutral-500" />
                </div>
                <input
                  ref={emailInputRef}
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>
            
            {/* Password field - responsive sizing */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-neutral-700 text-sm font-bold" htmlFor="password">
                  Password
                </label>
                {/* Optional: Add a "Forgot Password?" link */}
                <Link to="/forgot-password" className="text-xs sm:text-sm text-primary-600 hover:text-primary-800">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-neutral-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
            
            {/* Login button - same on mobile and desktop */}
            <button
              type="submit"
              className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'} 
              {!isSubmitting && <FaArrowRight className="ml-2" />}
            </button>
          </form>
          
          {/* Register link - responsive text size */}
          <p className="mt-5 sm:mt-6 text-center text-sm sm:text-base text-neutral-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;