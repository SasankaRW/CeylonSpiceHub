import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// MongoDB connection string from .env
const MONGODB_URI = process.env.MONGODB_URI;

// Function to create a user
async function createUser(userData) {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, { dbName: 'ceylon-spice-hub' });
    console.log('Connected to MongoDB');

    // Check if user exists to log it
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      console.log(`User ${userData.username} found. Overwriting...`);
    } else {
      console.log(`Creating new user ${userData.username}...`);
    }

    // Hash the password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Use raw collection access to bypass Mongoose hooks (pre-save)
    // This prevents double-hashing or hook failures
    await User.collection.updateOne(
      { username: userData.username },
      {
        $set: {
          username: userData.username,
          password: hashedPassword,
          email: userData.email,
          role: userData.role || 'staff',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log(`User ${userData.username} successfully saved/updated directly in collection.`);

    // Verify by listing all users using the Mongoose model
    const allUsers = await User.find({});
    console.log('Current Users in DB according to script:', JSON.stringify(allUsers, null, 2));

  } catch (error) {
    console.error('Error creating user:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// User details
const adminUser = {
  username: 'spicehubadmin',
  password: 'Spiceadmin@2025',
  email: 'spicehubadmin@ceylonspicehub.com',
  role: 'admin'
};

// Create the user
createUser(adminUser); 