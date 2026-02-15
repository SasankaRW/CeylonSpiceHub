
import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import CustomSlideshow from '@/components/CustomSlideshow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { getProducts } from '@/api/index';

const slideshowData = [
  {
    title: "Ethically Sourced",
    tagline: "Grown with Love, Preserving Mother Nature’s Best",
    imageDescription: "Every product tells a story from the hands of rural Ceylon farmers to your kitchen.",
    alt: "Ethically Sourced Spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/w_1920,q_auto,f_auto/v1770492351/wslide_1_jgehwm.png"
  },
  {
    title: "Farm to You, Pure and True",
    tagline: "From Our Family Farm to Your Table",
    imageDescription: "Handcrafted with care, grown with love, experience the untouched purity of Pasgoda's finest.",
    alt: "Farm to table spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/w_1920,q_auto,f_auto/v1770493804/e6689702-61f6-42e7-bd36-f371fc99bdd3_c5co8b.png"
  },
  {
    title: "Quality You Can Taste",
    tagline: "Taste So Tantalizing, Quality So Unmatched",
    imageDescription: "Hygienically packed and carefully processed",
    alt: "Quality spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/w_1920,q_auto,f_auto/v1770581096/wslide_5_n1pdfe.png"
  },
  {
    title: "Pure & Natural",
    tagline: "100% Natural, 0% Compromise",
    imageDescription: "Free from preservatives, full of nature's goodness, just the way it's meant to be.",
    alt: "Pure spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/w_1920,q_auto,f_auto/v1770493967/231b5bbd-5fb8-46bc-9f6c-fe294692597d.png"
  },
  {
    title: "Clean Ingredients",
    tagline: "Nothing Added, Everything Real",
    imageDescription: "Pure ingredients you can trust, free from artificial additives and preservatives.",
    alt: "Clean ingredients",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/w_1920,q_auto,f_auto/v1770581089/wslide_4_oaqjwu.png"
  }
];

const featuredCategories = [
  {
    title: "Ceylon Spices",
    description: "The purest form of Ceylon's legendary spices, from fragrant cinnamon to fiery peppercorns.",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1769839858/SPICES_1_seeh3o.jpg",
    link: "/products?category=Spices"
  },
  {
    title: "Sauce Range",
    description: "Traditional sauces made from family recipes.",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1769841368/sauces1_gd7rug.jpg",
    link: "/products?category=Sauces"
  },
  {
    title: "Fruitopia Range",
    description: "Unique fruit wines and beverages, fermented to perfection.",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1769839983/WINE_5_vgjktj.jpg",
    link: "/products?category=Wines"
  }
];

const HomePage = () => {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const allProducts = await getProducts();

        // Define the categories we want to feature
        const targetCategories = ['Spices', 'Sauces', 'Chutney', 'Jam', 'Wines'];

        // Select one product from each category
        const featured = [];

        targetCategories.forEach(category => {
          // Find the first product in this category
          const product = allProducts.find(p => p.category === category);
          if (product) {
            featured.push(product);
          }
        });

        // Use slice(0, 5) just to be safe, though logic guarantees at most 5 unique if products exist
        setNewArrivals(featured.slice(0, 5));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="space-y-24 pb-12">
      <CustomSlideshow slides={slideshowData} />

      {/* INTRODUCTION SECTION - Split Layout */}
      <section className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center md:text-left"
          >
            <h2 className="text-4xl md:text-8xl font-extrabold text-foreground mb-2 text-balance leading-tight">ආයුබෝවේවා!</h2>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-10 text-balance">May You Live Long.</h2>
            <div className="text-lg text-muted-foreground max-w-4xl mx-auto mb-8 space-y-4 leading-relaxed md:text-justify text-center md:text-left">
              <p>
                We're delighted to welcome you to The Ceylon Spice Hub, where every product is a reflection of tradition,
                sustainability, and the vibrant essence of rural Sri Lanka.
              </p>
              <p>
                Rooted in the heart of Pasgoda, our family-run farm has flourished for generations, nurturing over 90%
                of the ingredients we use in our handcrafted offerings. From aromatic spices and sun-ripened fruits to
                tangy pickles, flavorful chutneys, refreshing jams, and sparkling fruit wines, each creation carries
                the soul of our land and the care of our people.
              </p>
              <p>
                We create not just taste, we craft experiences, empower farmers, and protect our planet.
              </p>
            </div>
            <div className="pt-4 flex justify-center md:justify-start">
              <Button asChild size="lg" className="px-8 shadow-lg hover:shadow-xl transition-all">
                <Link to="/we-are">Discover Our Story →</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 group">
              <img
                src="https://res.cloudinary.com/dwuxumj4x/image/upload/v1769840185/RANGE_a5xpht.png"
                alt="Ceylon Spice Hub Product Range"
                className="w-full h-auto object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2 group-hover:drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)]"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Handpicked essentials from every category.</p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-[400px] bg-muted/20 animate-pulse rounded-xl"></div>
            ))
          )}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-12 py-6 shadow-xl hover:scale-105 transition-transform">
            <Link to="/products">Shop All Products</Link>
          </Button>
        </div>
      </section>


      {/* BENEFITS SECTION */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose The Ceylon Spice Hub?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Uncompromising Quality",
              desc: "Sourced from the best, ensuring authentic taste and aroma in every pinch.",
              img: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1769841368/sauces1_gd7rug.jpg"
            },
            {
              title: "Ethically Sourced",
              desc: "Supporting local farmers and sustainable practices for a better tomorrow.",
              img: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1770149702/Pineapple_jam_4_ttxaje.jpg"
            },
            {
              title: "Freshness Guaranteed",
              desc: "Packed with care to lock in freshness, from our home to yours.",
              img: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1770149677/Pepper_c44hmg.jpg"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all text-center"
            >
              <div className="mx-auto w-24 h-24 mb-6 rounded-full overflow-hidden border-4 border-background shadow-md">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>


    </div>
  );
};

export default HomePage;
