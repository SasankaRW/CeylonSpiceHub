
import express from 'express';
import Slider from '../models/Slider.js';

const router = express.Router();

// Get all sliders
router.get('/', async (req, res) => {
  try {
    const sliders = await Slider.find().sort('order');
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create slider
router.post('/', async (req, res) => {
  const slider = new Slider(req.body);
  try {
    const newSlider = await slider.save();
    res.status(201).json(newSlider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update slider
router.patch('/:id', async (req, res) => {
  try {
    const slider = await Slider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(slider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete slider
router.delete('/:id', async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slider deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
