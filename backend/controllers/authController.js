const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
// function generates  JSON Web Token for a given user id and returns it
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;/*Extract user details (name, email, password) from the request body*/

    // Check if user exists
    const userExists = await User.findOne({ email }); /* Check if the user already exists by searching for the email in the database*/

    if (userExists) {
      res.status(400); // If user exists, send a 400 response code "through an error "
      throw new Error('User already exists');
    }

   // Create a new user in the database if they do not already exist
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      // Set JWT as HTTP-Only cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(400); /*If user creation fails, send a 400 response code- "through an error"*/
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* Finding user by email and include the password field in the query result */
    const user = await User.findOne({ email }).select('+password');

    
    /*Check if the user exists and if the provided password matches the stored password*/
    if (user && (await user.matchPassword(password))) {
      // Generate token
      const token = generateToken(user._id);

      // Set JWT as HTTP-Only cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
     // Finding the user by their ID, which is available in req.user
    const user = await User.findById(req.user._id);

    if (user) {   //profile details
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        groups: user.groups,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
};