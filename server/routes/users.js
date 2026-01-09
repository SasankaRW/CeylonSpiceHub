import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'spicehub-secret-key';

// Authentication middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin role middleware
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is disabled' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign({
      id: user._id,
      username: user.username,
      role: user.role
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register new admin (protected route)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, password, email, role = 'staff' } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already in use'
      });
    }

    // Create new user
    const user = new User({
      username,
      password,
      email,
      role
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed initial admin user if none exists
router.get('/seed-admin', async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });

    if (adminCount === 0) {
      const adminUser = new User({
        username: 'admin',
        password: 'SpiceHub@123',
        email: 'admin@ceylonspicehub.com',
        role: 'admin'
      });

      await adminUser.save();
      res.status(201).json({ message: 'Admin user created successfully' });
    } else {
      res.json({ message: 'Admin user already exists' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Temporary debug route to check users (remove this in production)
router.get('/debug-users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 