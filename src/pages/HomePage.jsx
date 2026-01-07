
import React from 'react';
import CustomSlideshow from '@/components/CustomSlideshow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils as SpicesIcon, UtensilsCrossed, Wine } from 'lucide-react';

const slideshowData = [
  {
    title: "Ethically Sourced",
    tagline: "Grown with Love, Preserving Mother Nature's Best",
    imageDescription: "Every product tells a story—from the hands of rural Ceylon farmers to your kitchen.",
    alt: "Ethical spice farming"
  },
  {
    title: "Farm to You, Pure and True",
    tagline: "From Our Family Farm to Your Table—100% Natural & Preservative-Free",
    imageDescription: "Handcrafted with care, grown with love—experience the untouched purity of Pasgoda's finest.",
    alt: "Farm to table spices"
  },
  {
    title: "Quality You Can Taste",
    tagline: "Taste So Tantalizing, Quality So Unmatched",
    imageDescription: "Hygienically packed and carefully processed—crafted with your satisfaction in mind.",
    alt: "Quality spices"
  },
  {
    title: "Pure & Natural",
    tagline: "100% Natural, 0% Compromise",
    imageDescription: "Free from preservatives, full of nature's goodness—just the way it's meant to be.",
    alt: "Pure spices"
  },
  {
    title: "Nature's Goodness, Bottled",
    tagline: "No Preservatives. No Additives. Just Pure Ceylon Flavor.",
    imageDescription: "Rooted in tradition, crafted sustainably—taste the wellness in every bite.",
    alt: "Natural products"
  },
  {
    title: "Clean Ingredients",
    tagline: "Nothing Added, Everything Real",
    imageDescription: "No preservatives. No additives. Just pure, natural ingredients you can trust.",
    alt: "Clean ingredients"
  }
];

const featuredCategories = [
  {
    title: "Ceylon Spices",
    description: "Discover the purest form of Ceylon's legendary spices, from fragrant cinnamon to fiery peppercorns.",
    icon: <SpicesIcon className="h-12 w-12 text-primary mb-4" />,
    link: "/products?category=Spices"
  },
  {
    title: "Katugasma Range",
    description: "A delightful selection of sauces, jams, and chutneys made with traditional recipes.",
    icon: <UtensilsCrossed className="h-12 w-12 text-primary mb-4" />,
    link: "/products?category=Sauces"
  },
  {
    title: "Fruitopia Range",
    description: "Experience unique wellness and fruit wines, fermented to perfection using tropical Ceylonese fruits.",
    icon: <Wine className="h-12 w-12 text-primary mb-4" />,
    link: "/products?category=Wines"
  }
];

const HomePage = () => {
  return (
    <div className="space-y-16">
      <CustomSlideshow slides={slideshowData} />

      <motion.section
        className="text-center py-16 px-6 bg-gradient-to-br from-card via-background to-card rounded-2xl shadow-soft border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Ayu-Bo-Wewa! May You Live Long.</h2>
        <div className="text-lg text-muted-foreground max-w-4xl mx-auto mb-8 space-y-4 leading-relaxed">
          <p>
            We're delighted to welcome you to The Ceylon Spice Hub—where every product is a reflection of tradition,
            sustainability, and the vibrant essence of rural Sri Lanka.
          </p>
          <p>
            Rooted in the heart of Pasgoda, our family-run farm has flourished for generations, nurturing over 90%
            of the ingredients we use in our handcrafted offerings. From aromatic spices and sun-ripened fruits to
            tangy pickles, flavorful chutneys, refreshing jams, and sparkling fruit wines—each creation carries
            the soul of our land and the care of our people.
          </p>
          <p>
            Our promise is simple: pure, preservative-free, and ethically sourced products that not only tantalize
            your taste buds but also promote a healthier lifestyle and a greener planet.
          </p>
        </div>
        <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 group">
          <Link to="/we-are" className="flex items-center">
            Discover Our Story
            <motion.span
              className="ml-2 inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </Link>
        </Button>
      </motion.section>

      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Our Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Explore our carefully curated selection of premium Ceylon products</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 + 0.3, ease: "easeOut" }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full flex flex-col text-center shadow-soft hover:shadow-glow transition-all duration-300 border-border/50 hover:border-primary/30 group">
                <CardHeader className="pb-4">
                  <motion.div
                    className="mx-auto mb-2"
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {category.icon}
                  </motion.div>
                  <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base leading-relaxed">{category.description}</CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Link to={category.link}>Explore More</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        className="py-16 px-6 bg-gradient-to-br from-muted/30 via-background to-accent/5 rounded-2xl border border-border/40"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Why Choose Ceylon Spice Hub?</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">Committed to quality, ethics, and the authentic taste of Ceylon</p>
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              className="p-8 rounded-xl bg-card/50 backdrop-blur-sm shadow-soft hover:shadow-glow transition-all duration-300 border border-border/30"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-6 relative h-20 w-20 mx-auto rounded-full overflow-hidden shadow-md">
                <img alt="Quality Spices Icon" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1610635366300-29658a5313f5" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Uncompromising Quality</h3>
              <p className="text-muted-foreground leading-relaxed">Sourced from the best, ensuring authentic taste and aroma in every pinch.</p>
            </motion.div>
            <motion.div
              className="p-8 rounded-xl bg-card/50 backdrop-blur-sm shadow-soft hover:shadow-glow transition-all duration-300 border border-border/30"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-6 relative h-20 w-20 mx-auto rounded-full overflow-hidden shadow-md">
                <img alt="Ethical Sourcing Icon" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1532666661413-871a4227e256" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Ethically Sourced</h3>
              <p className="text-muted-foreground leading-relaxed">Supporting local farmers and sustainable practices for a better tomorrow.</p>
            </motion.div>
            <motion.div
              className="p-8 rounded-xl bg-card/50 backdrop-blur-sm shadow-soft hover:shadow-glow transition-all duration-300 border border-border/30"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-6 relative h-20 w-20 mx-auto rounded-full overflow-hidden shadow-md">
                <img alt="Freshness Guaranteed Icon" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1647462906359-a22489637a21" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Freshness Guaranteed</h3>
              <p className="text-muted-foreground leading-relaxed">Packed with care to lock in freshness, from our home to yours.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
