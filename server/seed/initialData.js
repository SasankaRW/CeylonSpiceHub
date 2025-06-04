
// import mongoose from 'mongoose';
// import Product from '../models/Product.js';
// import Category from '../models/Category.js';
// import Slider from '../models/Slider.js';

// export const sliderData = [
//   {
//     title: "Ethically Sourced",
//     tagline: "Grown with Love, Preserving Mother Nature's Best",
//     imageDescription: "Farmers harvesting spices in Sri Lanka",
//     alt: "Ethical spice farming",
//     order: 1
//   },
//   {
//     title: "Farm to You, Pure and True",
//     tagline: "From Our Family Farm to Your Table—100% Natural & Preservative-Free",
//     imageDescription: "Fresh spices being processed",
//     alt: "Farm to table spices",
//     order: 2
//   },
//   {
//     title: "Quality You Can Taste",
//     tagline: "Taste So Tantalizing, Quality So Unmatched",
//     imageDescription: "Various colorful spices",
//     alt: "Quality spices display",
//     order: 3
//   },
//   {
//     title: "Pure & Natural",
//     tagline: "100% Natural, 0% Compromise",
//     imageDescription: "Natural spice ingredients",
//     alt: "Pure spices",
//     order: 4
//   },
//   {
//     title: "Nature's Goodness, Bottled",
//     tagline: "No Preservatives. No Additives. Just Pure Ceylon Flavor.",
//     imageDescription: "Bottled spice products",
//     alt: "Bottled spices",
//     order: 5
//   },
//   {
//     title: "Clean Ingredients",
//     tagline: "Nothing Added, Everything Real",
//     imageDescription: "Raw spice ingredients",
//     alt: "Clean ingredients",
//     order: 6
//   }
// ];

// export const categoryData = [
//   {
//     name: "Ceylon Spices",
//     slug: "ceylon-spices",
//     description: "Authentic Ceylon spices, carefully sourced and processed",
//     subCategories: [
//       {
//         name: "Whole Spices",
//         slug: "whole-spices",
//         description: "Pure, unprocessed spices in their natural form"
//       },
//       {
//         name: "Spice Blends",
//         slug: "spice-blends",
//         description: "Expertly crafted spice combinations"
//       },
//       {
//         name: "Spice Mixtures",
//         slug: "spice-mixtures",
//         description: "Traditional Sri Lankan spice mixtures"
//       }
//     ],
//     order: 1
//   },
//   {
//     name: "Katugasma",
//     slug: "katugasma",
//     description: "Traditional Sri Lankan condiments and preserves",
//     subCategories: [
//       {
//         name: "Sauces",
//         slug: "sauces",
//         description: "Authentic Sri Lankan sauces"
//       },
//       {
//         name: "Chutneys",
//         slug: "chutneys",
//         description: "Traditional chutneys"
//       },
//       {
//         name: "Jams",
//         slug: "jams",
//         description: "Natural fruit preserves"
//       }
//     ],
//     order: 2
//   },
//   {
//     name: "Fruitopia",
//     slug: "fruitopia",
//     description: "Artisanal fruit wines and beverages",
//     subCategories: [
//       {
//         name: "Wellness Wines",
//         slug: "wellness-wines",
//         description: "Health-focused fruit wines"
//       },
//       {
//         name: "Fruit Wines",
//         slug: "fruit-wines",
//         description: "Traditional fruit wines"
//       }
//     ],
//     order: 3
//   }
// ];

// export const productData = [
//   {
//     category: "ceylon-spices",
//     subCategory: "Whole Spices",
//     name: "Ceylon True Cinnamon",
//     price: 12.99,
//     weight: "100g",
//     description: "Premium grade Ceylon cinnamon quills, hand-rolled by expert craftsmen.",
//     stock: 100,
//     imageDescription: "Ceylon cinnamon quills",
//     alt: "Ceylon Cinnamon",
//     featured: true
//   },
//   {
//     category: "katugasma",
//     subCategory: "Sauces",
//     name: "Spicy Mango Chutney",
//     price: 8.99,
//     weight: "250g",
//     description: "A perfect blend of sweet mangoes and spicy chilies.",
//     stock: 50,
//     imageDescription: "Jar of mango chutney",
//     alt: "Mango Chutney",
//     featured: true
//   },
//   {
//     category: "fruitopia",
//     subCategory: "Wellness Wines",
//     name: "Passion Fruit Wine",
//     price: 29.99,
//     weight: "750ml",
//     description: "Naturally fermented passion fruit wine with antioxidant properties.",
//     stock: 30,
//     imageDescription: "Bottle of passion fruit wine",
//     alt: "Passion Fruit Wine",
//     featured: true
//   }
// ];

// export const seedDatabase = async () => {
//   try {
//     // Clear existing data
//     await Promise.all([
//       Product.deleteMany({}),
//       Category.deleteMany({}),
//       Slider.deleteMany({})
//     ]);

//     // Insert new data
//     await Promise.all([
//       Product.insertMany(productData),
//       Category.insertMany(categoryData),
//       Slider.insertMany(sliderData)
//     ]);

//     console.log('Database seeded successfully');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//   }
// };
