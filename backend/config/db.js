// We will use mongoose for connecting it to MongoDB

const mongoose = require('mongoose');

// Now we will create a function named as connectDB which will work async that is the function will wait till we connect to DB

const connectDB = async () => {
  try {
    // We will take the credentials from the .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } 
  // suppose somethings goes wrong
  catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;