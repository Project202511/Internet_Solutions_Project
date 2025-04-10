// Import core modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Import custom DB connection function
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config(); // ✅ Better to use dotenv.config() directly instead of require().config()

// Connect to MongoDB Atlas using Mongoose
connectDB(); // ✅ Make sure this function reads MONGO_URI from process.env

// Initialize the Express app
const app = express();

// Middleware configuration

// CORS setup to allow frontend requests (adjust origin in .env if needed)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allows frontend to connect
  credentials: true // Allows sending cookies from client
}));

// Body parser middleware (JSON & URL-encoded form support)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Route handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));

// Health check or root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Set the port (from .env or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
