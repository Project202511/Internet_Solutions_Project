import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo from '../images/logo.icon.png';

/**
 * Register - A responsive registration form component
 * 
 * Features:
 * - Mobile-first design with responsive sizing
 * - Password visibility toggle
 * - Accessible form controls
 * - Real-time validation feedback
 * - Responsive layout adjustments
 */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();
  // Reference to focus the first input on mount
  const nameInputRef = React.useRef(null);

  const { name, email, password, confirmPassword } = formData;

  // Focus first input on component mount
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Clear form error when user types
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) {
      setFormError('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError('');
    
    // Form validation
    if (!name || !email || !password) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    const success = await register({ name, email, password });
    setIsSubmitting(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-6 sm:py-10">
      <div className="w-full max-w-md">
        {/* Logo and title - responsive sizing */}
        <div className="text-center mb-6 sm:mb-10">
          <img 
            src={Logo} 
            alt="SyncUp Logo" 
            className="mx-auto h-16 w-16 sm:h-20 sm:w-20 mb-3 sm:mb-4" 
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">SyncUp</h1>
          <p className="text-sm sm:text-base text-neutral-600">Create your account to get started</p>
        </div>
        
        {/* Registration form card - responsive padding */}
        <div className="bg-white rounded-lg shadow-lg p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6">Register</h2>
          
          {/* Error display - responsive padding */}
          {(error || formError) && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded text-sm">
              <p className="font-medium">Error</p>
              <p>{formError || error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className="mb-3 sm:mb-4">
              <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-neutral-500" />
                </div>
                <input
                  ref={nameInputRef}
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>
            
            {/* Email Field */}
            <div className="mb-3 sm:mb-4">
              <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-neutral-500" />
                </div>
                <input
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
            
            {/* Password Field - with visibility toggle */}
            <div className="mb-3 sm:mb-4">
              <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-neutral-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-700"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Must be at least 6 characters</p>
            </div>
            
            {/* Confirm Password Field - with visibility toggle */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-neutral-500" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-700"
                  onClick={toggleConfirmPasswordVisibility}
                  tabIndex="-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'} 
              {!isSubmitting && <FaArrowRight className="ml-2" />}
            </button>
          </form>
          
          {/* Login Link */}
          <p className="mt-4 sm:mt-6 text-center text-sm sm:text-base text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;