//Importing the mongoose library to interact with MongoDB---
const mongoose = require('mongoose');

// Defining  an asynchronous function that connect to the MongoDB
const connectDB = async () => {
  try {
    // try to connect to MongoDB using the URI stored in the environment variable MONGO-URI
    const conn = await mongoose.connect(process.env.MONGO_URI);
   
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
     
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    process.exit(1);
  }
};

// Exports connectDB function to make it available for use in other files
module.exports = connectDB;