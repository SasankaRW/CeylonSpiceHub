
import mongoose from 'mongoose';

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
  price: {
    type: Number,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
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
