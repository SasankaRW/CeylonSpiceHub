
import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['pouch', 'glass-bottle']
  },
  weight: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['ceylon-spices', 'katugasma', 'fruitopia']
  },
  subCategory: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  // Legacy fields for backward compatibility
  price: {
    type: Number,
    required: function() {
      return !this.variants || this.variants.length === 0;
    }
  },
  weight: {
    type: String,
    required: function() {
      return !this.variants || this.variants.length === 0;
    }
  },
  stock: {
    type: Number,
    min: 0,
    required: function() {
      return !this.variants || this.variants.length === 0;
    }
  },
  // New variants array
  variants: {
    type: [variantSchema],
    default: []
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: String,
  imageDescription: String,
  alt: String,
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
