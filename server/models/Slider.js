
import mongoose from 'mongoose';

const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageDescription: String,
  alt: String,
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Slider', sliderSchema);
