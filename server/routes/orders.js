import express from 'express';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    // 1. Fetch all orders sorted by date (newest first)
    const orders = await Order.find()
      .populate('items.productId')
      .sort({ createdAt: -1 });

    // 2. Sort in memory to move 'pending' orders to the top
    // Since they are already sorted by date, this will keep pending orders sorted by date at the top,
    // and other orders sorted by date below them.
    const sortedOrders = orders.sort((a, b) => {
      const isAPending = a.status === 'pending';
      const isBPending = b.status === 'pending';

      if (isAPending && !isBPending) return -1;
      if (!isAPending && isBPending) return 1;
      return 0;
    });

    res.json(sortedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  // Start a MongoDB transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderData = { ...req.body };

    // Validate the items and handle string product IDs
    if (orderData.items && Array.isArray(orderData.items)) {
      for (let i = 0; i < orderData.items.length; i++) {
        let item = orderData.items[i];

        // Find the product by ID - we'll search by both MongoDB ID and string ID
        let product;

        if (mongoose.isValidObjectId(item.productId)) {
          product = await Product.findById(item.productId).session(session);
        }

        // If product not found or invalid ObjectId, try to find by string ID
        if (!product) {
          product = await Product.findOne({
            $or: [
              { id: item.productId }, // Check custom ID field
              { name: item.name } // Fallback to product name if present
            ]
          }).session(session);
        }

        // If we found a product, use its MongoDB ID and update inventory
        if (product) {
          // Check if there's enough stock
          if (product.stock < item.quantity) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
              message: `Not enough stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
            });
          }

          // Update product ID in order item
          orderData.items[i].productId = product._id;

          // Store product details in order for easy reference
          orderData.items[i].productDetails = {
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl
          };

          // Reduce product stock
          product.stock -= item.quantity;
          await product.save({ session });
        } else {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Product not found for item at index ${i}. Please check product IDs.`
          });
        }
      }
    }

    const order = new Order(orderData);
    const newOrder = await order.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Populate product details for the response
    const populatedOrder = await Order.findById(newOrder._id).populate('items.productId');

    res.status(201).json(populatedOrder);
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'pending' });
    const completed = await Order.countDocuments({ status: 'completed' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      total,
      pending,
      completed,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
