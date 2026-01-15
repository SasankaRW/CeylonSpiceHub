
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://theceylonspicehubdev:sKMIepxIdLJWDiHp@ceylonspicehubcluster.sdbzbkq.mongodb.net/ceylon-spice-hub?retryWrites=true&w=majority';

const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    retryWrites: true,
    w: 'majority',
    dbName: 'ceylon-spice-hub'
};

const migrateProducts = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        console.log('Connected.');

        const products = await Product.find({});
        console.log(`Found ${products.length} products. Checking for migration...`);

        let migratedCount = 0;

        for (const product of products) {
            // Case 1: Product has variants but still has top-level weight/price
            if (product.variants && product.variants.length > 0) {
                if (product.weight || product.price !== undefined) {
                    console.log(`Product "${product.name}" has variants but also top-level data. Cleaning up...`);

                    await Product.updateOne(
                        { _id: product._id },
                        { $unset: { weight: 1, price: 1 } }
                    );
                    migratedCount++;
                }
            }
            // Case 2: Product has NO variants but has top-level data (Legacy)
            else if (product.weight || product.price) {
                console.log(`Product "${product.name}" has legacy data. Migrating to variants...`);

                const newVariant = {
                    type: 'glass-bottle',
                    weight: product.weight || 'Standard',
                    price: product.price || 0,
                    stock_available: product.stock_available,
                };

                // Update with Push and Unset in one go using updateOne for atomicity/safety or just save
                // Ideally should update object then save, but let's use direct update for precision

                await Product.updateOne(
                    { _id: product._id },
                    {
                        $push: { variants: newVariant },
                        $unset: { weight: 1, price: 1 }
                    }
                );
                migratedCount++;
            }
        }

        console.log(`Migration complete. Updated ${migratedCount} products.`);
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateProducts();
