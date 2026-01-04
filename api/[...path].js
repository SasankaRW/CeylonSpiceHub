// Vercel serverless function handler for Express API
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

// Import routes
import productRoutes from '../server/routes/products.js';
import orderRoutes from '../server/routes/orders.js';
import sliderRoutes from '../server/routes/sliders.js';
import categoryRoutes from '../server/routes/categories.js';
import userRoutes from '../server/routes/users.js';

// Configure environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API routes
}));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting - adjusted for serverless
// Note: In-memory store resets on each cold start
// For production with high traffic, consider using Redis
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

// Add Vercel deployment URL to allowed origins
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}
if (process.env.VERCEL) {
  // Add any custom domain
  const customDomain = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (customDomain) {
    allowedOrigins.push(customDomain);
  }
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      // In production, log but allow for now (adjust as needed)
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow for now, adjust based on your security needs
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug logging middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
    console.log(`[API] ${req.method} ${req.url}`);
  }
  next();
});

// Debug endpoint to check routing - MOVED TO TOP
app.all('/api/debug-routing', (req, res) => {
  res.json({
    message: 'Debug Routing Info',
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path,
    headers: req.headers
  });
});

// Explicitly mount routes on both /api path and root path to cover all bases
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

app.use('/api/sliders', sliderRoutes);
app.use('/sliders', sliderRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/categories', categoryRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

// MongoDB connection - optimized for serverless
let cachedDb = null;
let isConnecting = false;

async function connectToDatabase() {
  // Return cached connection if available and connected
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    // Wait for the ongoing connection
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (cachedDb && mongoose.connection.readyState === 1) {
      return cachedDb;
    }
  }

  isConnecting = true;

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    isConnecting = false;
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 10,
    minPoolSize: 2,
    dbName: 'ceylon-spice-hub' // Explicitly set database name to fix invalid namespace error
  };

  try {
    // If we're already connecting, wait; if connected, return
    if (mongoose.connection.readyState === 1) {
      cachedDb = mongoose.connection;
      isConnecting = false;
      return cachedDb;
    }

    if (mongoose.connection.readyState === 2) {
      // Wait for it to connect
      while (mongoose.connection.readyState === 2) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return mongoose.connection;
    }

    await mongoose.connect(MONGODB_URI, mongooseOptions);
    cachedDb = mongoose.connection;
    console.log('Connected to MongoDB');
    isConnecting = false;
    return cachedDb;
  } catch (error) {
    isConnecting = false;
    console.error('MongoDB connection error:', error);
    throw error;
  }
}



// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: dbStatus,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});



// 404 handler for API routes
app.use((req, res) => {
  console.error(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    message: 'API endpoint not found',
    path: req.path,
    url: req.url,
    method: req.method
  });
});

// Vercel serverless function handler
export default async function handler(req, res) {
  // Connect to database before handling request
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection failed:', error);
    // Still try to handle the request, but return error for non-health endpoints
    if (req.url !== '/health' && !req.url.startsWith('/health')) {
      return res.status(503).json({
        message: 'Database connection failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Handle the request with Express
  // Vercel automatically provides req and res in the correct format
  return app(req, res);
}

