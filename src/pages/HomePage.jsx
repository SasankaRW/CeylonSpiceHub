
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
    link: "/our-products#ceylon-spices"
  },
  {
    title: "Katugasma Range",
    description: "A delightful selection of sauces, jams, chutneys, and relishes made with traditional recipes.",
    icon: <UtensilsCrossed className="h-12 w-12 text-primary mb-4" />,
    link: "/our-products#katugasma"
  },
  {
    title: "Fruitopia Range",
    description: "Experience unique wellness and fruit wines, fermented to perfection using tropical Ceylonese fruits.",
    icon: <Wine className="h-12 w-12 text-primary mb-4" />,
    link: "/our-products#fruitopia"
  }
];

const HomePage = () => {
  return (
    <div className="space-y-16">
      <CustomSlideshow slides={slideshowData} />

      <motion.section 
        className="text-center py-12 bg-card rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Ayu-Bo-Wewa! May You Live Long.</h2>
        <div className="text-lg text-muted-foreground max-w-4xl mx-auto mb-6 space-y-4">
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
        <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground">
          <Link to="/we-are">Discover Our Story</Link>
        </Button>
      </motion.section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">Our Featured Products</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
            >
              <Card className="h-full flex flex-col text-center hover:border-primary transition-all duration-300 ease-in-out transform hover:scale-105">
                <CardHeader>
                  <div className="mx-auto">{category.icon}</div>
                  <CardTitle className="text-2xl text-primary">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{category.description}</CardDescription>
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
        className="py-12 bg-gradient-to-br from-accent/20 via-background to-secondary/20 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Why Choose Ceylon Spice Hub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <img  alt="Quality Spices Icon" className="h-16 w-16 mx-auto mb-4" src="https://images.unsplash.com/photo-1610635366300-29658a5313f5" />
              <h3 className="text-xl font-semibold text-secondary mb-2">Uncompromising Quality</h3>
              <p className="text-muted-foreground">Sourced from the best, ensuring authentic taste and aroma in every pinch.</p>
            </div>
            <div className="p-6">
              <img  alt="Ethical Sourcing Icon" className="h-16 w-16 mx-auto mb-4" src="https://images.unsplash.com/photo-1532666661413-871a4227e256" />
              <h3 className="text-xl font-semibold text-secondary mb-2">Ethically Sourced</h3>
              <p className="text-muted-foreground">Supporting local farmers and sustainable practices for a better tomorrow.</p>
            </div>
            <div className="p-6">
              <img  alt="Freshness Guaranteed Icon" className="h-16 w-16 mx-auto mb-4" src="https://images.unsplash.com/photo-1647462906359-a22489637a21" />
              <h3 className="text-xl font-semibold text-secondary mb-2">Freshness Guaranteed</h3>
              <p className="text-muted-foreground">Packed with care to lock in freshness, from our home to yours.</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
