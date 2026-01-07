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
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, { dbName: 'ceylon-spice-hub' });
    console.log('Connected to MongoDB');

    // Check if user exists
    let user = await User.findOne({ username: userData.username });

    if (user) {
      console.log(`User ${userData.username} already exists. Updating...`);
      user.password = userData.password;
      user.email = userData.email;
      user.role = userData.role || 'staff';
      user.isActive = true;
    } else {
      console.log(`Creating new user ${userData.username}...`);
      user = new User({
        username: userData.username,
        password: userData.password,
        email: userData.email,
        role: userData.role || 'staff',
        isActive: true
      });
    }

    // Save the user (triggers pre-save hook for hashing)
    await user.save();
    console.log('User saved successfully:', {
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