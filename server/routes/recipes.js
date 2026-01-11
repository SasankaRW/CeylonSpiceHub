import express from 'express';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// @route   GET /api/recipes
// @desc    Get all recipes
// @access  Public
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Server error fetching recipes' });
    }
});

// @route   GET /api/recipes/:id
// @desc    Get recipe by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        console.error(`Error fetching recipe ${req.params.id}:`, error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(500).json({ message: 'Server error fetching recipe' });
    }
});

// @route   POST /api/recipes
// @desc    Create a new recipe
// @access  Private (TODO: Add auth middleware)
router.post('/', async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ message: 'Server error creating recipe' });
    }
});

// @route   PUT /api/recipes/:id
// @desc    Update a recipe
// @access  Private (TODO: Add auth middleware)
router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        console.error(`Error updating recipe ${req.params.id}:`, error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(500).json({ message: 'Server error updating recipe' });
    }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete a recipe
// @access  Private (TODO: Add auth middleware)
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json({ message: 'Recipe removed' });
    } catch (error) {
        console.error(`Error deleting recipe ${req.params.id}:`, error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(500).json({ message: 'Server error deleting recipe' });
    }
});

export default router;
