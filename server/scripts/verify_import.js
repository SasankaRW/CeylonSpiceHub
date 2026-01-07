
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Product from '../models/Product.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGODB_URI = process.env.MONGODB_URI;

const checkData = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'ceylon-spice-hub' });
        console.log('MongoDB Connected');

        const count = await Product.countDocuments();
        console.log(`Total Products: ${count}`);

        if (count === 0) {
            console.log('No products found!');
            return;
        }

        // Sample 1 product in full JSON
        const products = await Product.find({}).limit(1);

        if (products.length > 0) {
            const dumpPath = path.join(__dirname, 'product_dump.json');
            console.log('Writing product to', dumpPath);
            fs.writeFileSync(dumpPath, JSON.stringify(products[0], null, 2));
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

checkData();
