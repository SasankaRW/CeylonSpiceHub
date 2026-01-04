import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all products...');
    const products = await Product.find();
    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    console.log('Fetching featured products...');
    const products = await Product.find({ featured: true });
    console.log(`Found ${products.length} featured products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ 
      message: 'Failed to fetch featured products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching products for category: ${category}`);
    const products = await Product.find({ category });
    console.log(`Found ${products.length} products in category ${category}`);
    res.json(products);
  } catch (error) {
    console.error(`Error fetching products for category ${req.params.category}:`, error);
    res.status(500).json({ 
      message: 'Failed to fetch products by category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching product with ID: ${id}`);
    const product = await Product.findById(id);
    if (!product) {
      console.log(`Product not found with ID: ${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log(`Found product: ${product.name}`);
    res.json(product);
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({ 
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    console.log('Creating new product:', JSON.stringify(req.body, null, 2));
    
    // Clean up the data - remove undefined/null legacy fields when variants exist
    const productData = { ...req.body };
    if (productData.variants && productData.variants.length > 0) {
      // Remove legacy fields if variants are present
      delete productData.price;
      delete productData.weight;
      delete productData.stock;
    }
    
    const product = new Product(productData);
    const newProduct = await product.save();
    console.log(`Created product: ${newProduct.name}`);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Extract validation errors
    let errorDetails = {};
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        errorDetails[key] = error.errors[key].message;
      });
    }
    
    console.error('Validation errors:', errorDetails);
    
    // Create user-friendly error message
    let errorMessage = 'Failed to create product';
    if (error.name === 'ValidationError') {
      const validationMessages = Object.values(errorDetails).join(', ');
      errorMessage = validationMessages || error.message;
    } else {
      errorMessage = error.message;
    }
    
    res.status(400).json({ 
      message: 'Failed to create product',
      error: errorMessage,
      details: Object.keys(errorDetails).length > 0 ? errorDetails : undefined
    });
  }
});

// Update product
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating product ${id}:`, req.body);
    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      console.log(`Product not found with ID: ${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log(`Updated product: ${product.name}`);
    res.json(product);
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    res.status(400).json({ 
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting product with ID: ${id}`);
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      console.log(`Product not found with ID: ${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log(`Deleted product: ${product.name}`);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`Error deleting product ${req.params.id}:`, error);
    res.status(500).json({ 
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
