import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import sliderRoutes from './routes/sliders.js';
import userRoutes from './routes/users.js';
import recipeRoutes from './routes/recipes.js';

// Configure environment variables
dotenv.config();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://ceylonspicehub.lk', 'https://www.ceylonspicehub.lk']
    : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sliders', sliderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Handle any requests that don't match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://theceylonspicehubdev:sKMIepxIdLJWDiHp@ceylonspicehubcluster.sdbzbkq.mongodb.net/ceylon-spice-hub?retryWrites=true&w=majority';

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4
  retryWrites: true,
  w: 'majority',
  dbName: 'ceylon-spice-hub'
};

// Connect to MongoDB
// Connect to MongoDB with retry logic
const connectDB = async (retries = 5) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, mongooseOptions);
      console.log('Connected to MongoDB Atlas');
    }
  } catch (err) {
    console.error(`MongoDB connection error (Attempt ${6 - retries}/5):`, err.message);

    if (err.name === 'MongoServerError' && err.code === 8000) {
      console.log('\nAuthentication failed. Please check:');
      console.log('1. Your MongoDB Atlas username and password are correct');
      console.log('2. Your IP address is whitelisted in MongoDB Atlas');
      console.log('3. The database user has the correct permissions\n');
    }

    if (retries > 0) {
      console.log(`Retrying in 5 seconds... (${retries} retries left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts.');
      // Keep server running but log error, don't exit in dev mode so we can see logs
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
};

// Initial connection
connectDB();

// Only listen if running directly (not imported)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server reloaded at ${new Date().toISOString()}`);
  });
}

export default app;
