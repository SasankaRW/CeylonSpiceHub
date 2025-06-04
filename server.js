import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

// Import routes
import productRoutes from './server/routes/products.js';
import orderRoutes from './server/routes/orders.js';
import sliderRoutes from './server/routes/sliders.js';
import categoryRoutes from './server/routes/categories.js';
import userRoutes from './server/routes/users.js';
import { seedDatabase } from './server/seed/initialData.js';

// Configure environment variables
dotenv.config();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sliders', sliderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Define MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb://localhost:27017/spicehub';

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  w: 'majority'
};

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('Connected to MongoDB successfully');
    
    // Seed the database with initial data if needed
    if (process.env.SEED_DATABASE === 'true') {
      await seedDatabase();
      console.log('Database seeded successfully');
    }
    
    // Create default admin user if needed
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? `http://localhost:${process.env.PORT || 5000}` 
        : 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/users/seed-admin`);
      const data = await response.json();
      console.log('Admin user check:', data.message);
    } catch (error) {
      console.error('Error checking admin user:', error.message);
    }
    
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Check for DNS resolution issues with SRV records
    if (error.code === 'ENOTFOUND' && MONGODB_URI.includes('mongodb+srv')) {
      console.log('\nDNS resolution error detected with SRV record.');
      console.log('This is a common issue with some hosting providers.');
      console.log('Please consider using a direct connection string instead of SRV format.');
      console.log('See MONGODB_GUIDE.md for alternative connection options.\n');
    } else {
      console.log('\nPlease check your MongoDB connection string in the .env file');
      console.log('If using MongoDB Atlas, ensure your IP address is whitelisted in the Atlas dashboard');
      console.log('For help, refer to the MONGODB_GUIDE.md file\n');
    }
    
    // For development, you can use a local MongoDB instance
    if (process.env.NODE_ENV !== 'production') {
      console.log('Attempting to connect to local MongoDB instance...');
      try {
        await mongoose.connect('mongodb://localhost:27017/spicehub', mongooseOptions);
        console.log('Connected to local MongoDB successfully');
        return true;
      } catch (localError) {
        console.error('Failed to connect to local MongoDB:', localError);
      }
    }
    
    return false;
  }
};

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle any requests that don't match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the server
connectToMongoDB().then(connected => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!connected) {
      console.log('\nWARNING: Server started without MongoDB connection.');
      console.log('The application may not function correctly.');
      console.log('Please check your MongoDB connection settings in .env file.');
      console.log('For help, refer to the MONGODB_GUIDE.md file.\n');
    }
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  // Start server anyway to allow static files to be served
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in limited mode (no database connection)`);
    console.log('Please check your MongoDB connection settings and restart the server.');
  });
});