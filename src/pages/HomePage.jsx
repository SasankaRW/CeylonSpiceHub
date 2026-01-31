
import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import CustomSlideshow from '@/components/CustomSlideshow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { getLatestProducts } from '@/api/index';

const slideshowData = [
  {
    title: "The Spirit of Ceylon",
    tagline: "Grown with Love, Preserving Mother Nature's Best",
    imageDescription: "Every product tells a story—from the hands of rural Ceylon farmers to your kitchen.",
    alt: "Ethical spice farming",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1769839104/slide1_ja8pwy.png"
  },
  {
    title: "Farm to You, Pure and True",
    tagline: "From Our Family Farm to Your Table 100% Natural & Preservative-Free",
    imageDescription: "Handcrafted with care, grown with love—experience the untouched purity of Pasgoda's finest.",
    alt: "Farm to table spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1769841177/slide2_ax47am.png"
  },
  {
    title: "Quality You Can Taste",
    tagline: "Taste So Tantalizing, Quality So Unmatched",
    imageDescription: "Hygienically packed and carefully processed—crafted with your satisfaction in mind.",
    alt: "Quality spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1769839485/slide_2_u14yty.png"
  },
  {
    title: "Pure & Natural",
    tagline: "100% Natural, 0% Compromise",
    imageDescription: "Free from preservatives, full of nature's goodness—just the way it's meant to be.",
    alt: "Pure spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1769839105/slide4_af4px8.png"
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
    title: "Katagasma Range",
    description: "Traditional chutneys, sauces, and jams made from family recipes.",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/v1769839922/Sinhala_Achcharu_1_tyby4m.jpg",
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
    const fetchNewArrivals = async () => {
      try {
        const products = await getLatestProducts();
        setNewArrivals(products);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      }
    };

    fetchNewArrivals();
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
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Ayu-Bo-Wewa! May You Live Long.</h2>
            <div className="text-lg text-muted-foreground max-w-4xl mx-auto mb-8 space-y-4 leading-relaxed">
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
            <div className="pt-4">
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

      {/* NEW ARRIVALS SECTION */}
      <section className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">New Arrivals</h2>
            <p className="text-muted-foreground text-lg">Fresh from the farm, straight to your table.</p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-[400px] bg-muted/20 animate-pulse rounded-xl"></div>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-12 py-6 shadow-xl hover:scale-105 transition-transform">
            <Link to="/products">Shop All Products</Link>
          </Button>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Curated Collections</h2>
            <p className="text-muted-foreground text-lg">Explore our range of premium handcrafted products</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={category.link} className="block h-full">
                  <div className="group relative h-96 rounded-2xl overflow-hidden shadow-md cursor-pointer">
                    {/* Background Image */}
                    <img
                      src={category.image}
                      alt={category.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90"></div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                      <h3 className="text-2xl font-bold mb-2 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">{category.title}</h3>
                      <p className="text-gray-200 text-sm opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-primary-foreground font-semibold flex items-center gap-2">
                        Explore <span className="translate-x-0 transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Ceylon Spice Hub?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Uncompromising Quality",
              desc: "Sourced from the best, ensuring authentic taste and aroma in every pinch.",
              img: "https://images.unsplash.com/photo-1610635366300-29658a5313f5"
            },
            {
              title: "Ethically Sourced",
              desc: "Supporting local farmers and sustainable practices for a better tomorrow.",
              img: "https://images.unsplash.com/photo-1532666661413-871a4227e256"
            },
            {
              title: "Freshness Guaranteed",
              desc: "Packed with care to lock in freshness, from our home to yours.",
              img: "https://images.unsplash.com/photo-1647462906359-a22489637a21"
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
