
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';
import Product from '../models/Product.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://theceylonspicehubdev:sKMIepxIdLJWDiHp@ceylonspicehubcluster.sdbzbkq.mongodb.net/ceylon-spice-hub?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'ceylon-spice-hub' });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

const formatPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        const cleaned = price.replace(/[^0-9.]/g, '');
        return cleaned ? parseFloat(cleaned) : 0;
    }
    return 0;
};

const importData = async () => {
    await connectDB();

    try {
        // 1. Clear existing products
        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('All existing products deleted.');

        // 2. Read Excel file
        const filePath = path.join(__dirname, '../../product_list_final.xlsx');
        console.log(`Reading file: ${filePath}`);
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        let currentCategory = '';
        let currentSubCategory = '';
        let variantsMap = [];

        // Explicit Category Logic
        // Category 01: Sauces -> katugasma / Sauces
        // Category 02: Chutney -> katugasma / Chutney
        // Category 03: Jam -> katugasma / Jam
        // Category 04: Wines -> fruitopia / Wines
        // Category 05: Spices -> ceylon-spices / (Sub category from sheet)

        const CATEGORY_MAP = {
            'HOT SAUCES': { cat: 'Sauces', sub: 'Hot Sauces' },
            'SAUCES': { cat: 'Sauces', sub: 'Classic Sauces' },
            'CHUTNEY': { cat: 'Chutney', sub: 'Chutney' },
            'JAM': { cat: 'Jam', sub: 'Fruit Jam' },
            'WINES': { cat: 'Wines', sub: 'Fruit Wine' },
            'SPICES': { cat: 'Spices', sub: 'Whole Spices' },
            'Whole Spices': { cat: 'Spices', sub: 'Whole Spices' },
            'Spice mixtures': { cat: 'Spices', sub: 'Spice Mixtures' },
            'Spice Blends': { cat: 'Spices', sub: 'Spice Blends' }
        };

        let productsToInsert = [];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (row.length === 0) continue;

            const firstCell = row[1] || row[0];
            let potentialHeader = String(firstCell).trim();
            let headerKey = potentialHeader.split('(')[0].trim();

            // Check for Category Header
            if (CATEGORY_MAP[headerKey] || CATEGORY_MAP[potentialHeader]) {
                const mapping = CATEGORY_MAP[headerKey] || CATEGORY_MAP[potentialHeader];
                currentCategory = mapping.cat;
                currentSubCategory = mapping.sub;
                console.log(`\nSwitched Category to: ${currentCategory} / ${currentSubCategory} (${potentialHeader})`);

                variantsMap = [];

                // Scan ahead for variant headers
                for (let j = 0; j < 5 && (i + j) < data.length; j++) {
                    const checkRow = data[i + j];
                    let hasWeights = checkRow.some(cell =>
                        typeof cell === 'string' && (cell.toUpperCase().includes('ML') || cell.toLowerCase().includes('g'))
                    );

                    if (hasWeights) {
                        checkRow.forEach((cell, idx) => {
                            if (idx < 2) return;
                            if (!cell) return;

                            const cellStr = String(cell).trim();
                            if (cellStr.toUpperCase().includes('SOLD OUT')) return;

                            // Determine type based on category or keyword
                            let type = 'glass-bottle';
                            if (currentCategory === 'Spices') type = 'pouch';

                            if (cellStr.toLowerCase().includes('bottle')) type = 'glass-bottle';
                            // Spices can have bottle too if explicitly stated e.g. "glass bottle 50g"

                            if (cellStr.toLowerCase().includes('pouch')) type = 'pouch';

                            let weight = cellStr.replace(/Pouch|Bottle/gi, '').trim();
                            if (!weight) weight = 'Standard';

                            variantsMap.push({ colIndex: idx, weight, type });
                        });
                        console.log(`Found variants header at row ${i + j}:`, variantsMap);
                        break;
                    }
                }
                continue;
            }

            const nameCol = row[1];
            // Valid product row check
            if (nameCol && typeof nameCol === 'string' && nameCol.length > 2 && currentCategory) {

                // Check if this is a subcategory header in Spices
                if (currentCategory === 'Spices' && CATEGORY_MAP[nameCol]) {
                    // It's actually a subcategory header line
                    // But wait, the loop logic above handles headers.
                    // Double check if "Spice mixtures" appears in col 0 or 1?
                    // In previous dump, "Spice mixtures" was in col 0. "HOT SAUCES" in col 1.
                    // The check `row[1] || row[0]` covers both.
                    // So we likely handled it.
                }


                const product = {
                    category: currentCategory,
                    subCategory: currentSubCategory,
                    name: nameCol.trim(),
                    description: row[row.length - 1] || 'Delicious authentic product.',
                    variants: [],
                    stock_available: true, // Default true
                    price: 0,
                    weight: '0g'
                };

                let hasVariants = false;

                if (variantsMap.length > 0) {
                    variantsMap.forEach(v => {
                        const priceVal = row[v.colIndex];
                        if (priceVal && priceVal !== 'N/A') {

                            const isSoldOut = String(priceVal).toUpperCase().includes('SOLD OUT');
                            const price = isSoldOut ? 0 : formatPrice(priceVal); // keep 0 price if sold out? or extract number?
                            // If sold out, user said "stock_available" should be false.
                            // Per variant? Schema has global stock_available.
                            // But we have variants. 
                            // If ALL variants are sold out, then product is sold out?
                            // Or we track stock_available per variant? 
                            // Schema has `stock_available` in variantSchema too? 
                            // Let's check Product.js update... I added stock_available to variantSchema too.

                            // Wait, in my previous edit I DID NOT add stock_available to variantSchema?
                            // Let's re-verify the previous edit content.
                            // I see I added `stock_available` to `variantSchema` in the `replace_file_content` call.
                            // Yes: `stock_available: { type: Boolean, default: true }` inside variantSchema.

                            if (price > 0 || isSoldOut) {
                                product.variants.push({
                                    type: v.type,
                                    weight: v.weight,
                                    price: price > 0 ? price : 0,
                                    stock_available: !isSoldOut
                                });
                                hasVariants = true;
                            }
                        }
                    });
                } else {
                    // Fallback for rows without header mapping (e.g. initial rows or robust fallback)
                    // Try cols 2,3,4
                    [2, 3, 4].forEach((idx, vIdx) => {
                        const priceVal = row[idx];
                        if (priceVal && (typeof priceVal === 'number' || (typeof priceVal === 'string' && priceVal.match(/[0-9]/)))) {
                            const price = formatPrice(priceVal);
                            if (price > 0) {
                                product.variants.push({
                                    type: currentCategory === 'Spices' ? 'pouch' : 'glass-bottle',
                                    weight: `Size ${vIdx + 1}`,
                                    price: price,
                                    stock_available: true
                                });
                                hasVariants = true;
                            }
                        }
                        // Check for SOLD OUT text in these cols too?
                        if (priceVal && String(priceVal).includes('SOLD OUT')) {
                            product.variants.push({
                                type: currentCategory === 'Spices' ? 'pouch' : 'glass-bottle',
                                weight: `Size ${vIdx + 1}`,
                                price: 0,
                                stock_available: false
                            });
                            hasVariants = true;
                        }
                    });
                }

                if (hasVariants) {
                    product.price = product.variants[0].price;
                    product.weight = product.variants[0].weight;
                    // Set global stock_available if AT LEAST ONE variant is available
                    product.stock_available = product.variants.some(v => v.stock_available);

                    productsToInsert.push(product);
                }
            }
        }

        console.log(`Prepared ${productsToInsert.length} products for insertion.`);

        if (productsToInsert.length > 0) {
            await Product.insertMany(productsToInsert);
            console.log('Import successful!');
        } else {
            console.warn('No products parsed. Check Logic.');
        }

    } catch (error) {
        console.error('Import completed with error:', error);
    } finally {
        mongoose.connection.close();
    }
};

importData();
