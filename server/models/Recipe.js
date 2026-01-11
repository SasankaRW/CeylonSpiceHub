import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    secondaryImage: {
        type: String
    },
    prepTime: {
        type: String
    },
    servings: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },
    ingredients: [{
        type: String,
        required: true
    }],
    method: [{
        type: String,
        required: true
    }],
    garnish: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
