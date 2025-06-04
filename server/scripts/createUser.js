import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// MongoDB connection string from .env
const MONGODB_URI = process.env.MONGODB_URI;

// Function to create a user
async function createUser(userData) {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create new user
    const user = new User({
      username: userData.username,
      password: userData.password,
      email: userData.email,
      role: userData.role || 'staff',
      isActive: true
    });

    // Save the user
    await user.save();
    console.log('User created successfully:', {
      username: user.username,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('Error creating user:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Example usage
const adminUser = {
  username: 'admin',
  password: 'SpiceHub@123',
  email: 'admin@ceylonspicehub.com',
  role: 'admin'
};

// Create the user
createUser(adminUser); 