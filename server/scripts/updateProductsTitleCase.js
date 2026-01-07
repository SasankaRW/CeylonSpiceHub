
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from the server directory .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const toTitleCase = (str) => {
    return str.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
};

const updateProducts = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in the environment variables');
        }

        const mongooseOptions = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4
            retryWrites: true,
            w: 'majority',
            dbName: 'ceylon-spice-hub'
        };

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        let updatedCount = 0;
        for (const product of products) {
            const originalName = product.name;
            const newName = toTitleCase(originalName);

            if (originalName !== newName) {
                product.name = newName;
                await product.save();
                console.log(`Updated: "${originalName}" -> "${newName}"`);
                updatedCount++;
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} products.`);
        process.exit(0);
    } catch (error) {
        console.error('Error updating products:', error);
        process.exit(1);
    }
};

updateProducts();
