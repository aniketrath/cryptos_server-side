const mongoose = require('mongoose');

// MongoDB URI from environment variables
const dbURI = process.env.MONGO_APP_URI;

const connectDB = async () => {
  try {
    // Establish MongoDB connection using Mongoose
    await mongoose.connect(dbURI, {
      socketTimeoutMS: 30000, // Set socket timeout to 30 seconds
      connectTimeoutMS: 30000, // Set connection timeout to 30 seconds
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure
  }
};
// Export the connection function to be used elsewhere
module.exports = connectDB;
