
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Utensils as SpicesIcon, Utensils, GlassWater, Leaf, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const productCategories = [
  {
    id: 'Spices',
    name: 'Ceylon Spices',
    icon: <SpicesIcon className="h-8 w-8 text-primary" />,
    description: 'Authentic, aromatic spices sourced directly from the heart of Sri Lanka.',
    imageDescription: "Vibrant array of whole and ground Ceylon spices",
    alt: "Ceylon Spices",
    subCategories: [
      { name: 'Whole Spices', items: ['Cinnamon (True Ceylon)', 'Black Pepper', 'White Pepper', 'Cloves', 'Cardamom', 'Nutmeg & Mace'] },
      { name: 'Spice Blends', items: ['Roasted Curry Powder', 'Unroasted Curry Powder', 'Garam Masala', 'Generic Curry Blends'] },
      { name: 'Spice Mixtures', items: ['Chilli Flakes', 'Chilli Powder', 'Turmeric Powder', 'Ginger Powder'] },
    ],
  },
  {
    id: 'Sauces',
    name: 'Sauces',
    icon: <Utensils className="h-8 w-8 text-primary" />,
    description: 'Traditional Sri Lankan sauces bursting with flavour.',
    imageDescription: "Colorful display of sauces",
    alt: "Sauces",
    subCategories: [
      { name: 'Hot Sauces', items: ['Nai Miris Hot Sauce', 'Kochchi Hot Sauce', 'Cobra Chilli Sauce'] },
      { name: 'Classic Sauces', items: ['Sweet Chilli Sauce', 'Tomato Sauce', 'BBQ Sauce'] }
    ],
  },
  {
    id: 'Chutney',
    name: 'Chutney',
    icon: <Leaf className="h-8 w-8 text-primary" />,
    description: 'Delightful chutneys made from fresh tropical fruits.',
    imageDescription: "Jars of chutneys",
    alt: "Chutney",
    subCategories: [
      { name: 'Fruit Chutney', items: ['Mango Chutney', 'Date & Lime Chutney', 'Pineapple Chutney', 'Amberella Chutney'] }
    ],
  },
  {
    id: 'Jam',
    name: 'Jam',
    icon: <Droplets className="h-8 w-8 text-primary" />,
    description: 'Natural fruit jams perfect for your breakfast table.',
    imageDescription: "Fresh fruit jams",
    alt: "Jam",
    subCategories: [
      { name: 'Fruit Jam', items: ['Woodapple Jam', 'Guava Jam', 'Passion Fruit Jam', 'Mixed Fruit Jam', 'Strawberry Jam'] }
    ],
  },
  {
    id: 'Wines',
    name: 'Wines',
    icon: <GlassWater className="h-8 w-8 text-primary" />,
    description: 'Exquisite wines crafted from tropical Ceylonese fruits.',
    imageDescription: "Elegant bottles of fruit wines",
    alt: "Wines",
    subCategories: [
      { name: 'Fruit Wine', items: ['King Coconut Wine', 'Passion Fruit Wine', 'Pineapple Wine', 'Mango Wine', 'Ginger Wine'] }
    ],
  },
];

const ProductCard = ({ name, icon, items }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="h-full hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        {icon}
        <CardTitle className="text-xl text-primary">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          {items.map(item => <li key={item}>{item}</li>)}
        </ul>
      </CardContent>
    </Card>
  </motion.div>
);

const OurProductsPage = () => {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <img
          src="https://storage.googleapis.com/hostinger-horizons-assets-prod/909949a5-1a33-4bbc-9ce6-0f65e0d7ca06/cde322e75cd351356564d87ae629c91d.png"
          alt="Ceylon Spice Hub Logo"
          className="h-24 w-24 mx-auto mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Exquisite Collection</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the authentic tastes of Ceylon, from world-renowned spices to unique artisanal creations.
        </p>
      </motion.div>

      {productCategories.map((category, index) => (
        <motion.section
          key={category.id}
          id={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="scroll-mt-20"
        >
          <Card className="overflow-hidden shadow-xl bg-card/80 backdrop-blur-sm border-primary/10">
            <div className="relative h-56 md:h-72">
              <img
                className="w-full h-full object-cover"
                alt={category.alt}
                src="https://images.unsplash.com/photo-1694388001616-1176f534d72f" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center space-x-3 mb-2">
                  {category.icon}
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{category.name}</h2>
                </div>
                <p className="text-gray-100 text-md md:text-lg max-w-xl">{category.description}</p>
                <Button
                  asChild
                  className="mt-4 w-fit bg-white text-primary hover:bg-white/90"
                >
                  <Link to={`/products?category=${category.id}`}>
                    Browse Products
                  </Link>
                </Button>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.subCategories.map(subCategory => {
                let icon;
                if (category.id === 'ceylon-spices') {
                  if (subCategory.name.includes('Whole')) icon = <SpicesIcon className="h-6 w-6 text-accent" />;
                  else if (subCategory.name.includes('Blend')) icon = <Leaf className="h-6 w-6 text-accent" />;
                  else icon = <Droplets className="h-6 w-6 text-accent" />;
                } else if (category.id === 'katugasma') {
                  icon = <Utensils className="h-6 w-6 text-accent" />;
                } else {
                  icon = <GlassWater className="h-6 w-6 text-accent" />;
                }
                return (
                  <ProductCard key={subCategory.name} name={subCategory.name} icon={icon} items={subCategory.items} />
                );
              })}
            </div>
          </Card>
        </motion.section>
      ))}
    </div>
  );
};

export default OurProductsPage;
