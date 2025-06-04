import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import sliderRoutes from './routes/sliders.js';

dotenv.config();

const app = express();

// Basic CORS for development
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sliders', sliderRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://theceylonspicehubdev:sKMIepxIdLJWDiHp@ceylonspicehubcluster.sdbzbkq.mongodb.net/ceylon-spice-hub?retryWrites=true&w=majority';

if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined');
  process.exit(1);
}

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4
  retryWrites: true,
  w: 'majority',
  dbName: 'ceylon-spice-hub' // Explicitly set the database name
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Start the server only after successful database connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    if (err.name === 'MongoServerError' && err.code === 8000) {
      console.log('\nAuthentication failed. Please check:');
      console.log('1. Your MongoDB Atlas username and password are correct');
      console.log('2. Your IP address is whitelisted in MongoDB Atlas');
      console.log('3. The database user has the correct permissions\n');
    }
    process.exit(1);
  });
