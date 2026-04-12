// db.js - Connects our app to MongoDB using Mongoose

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try to connect using the URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and stop the app
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;