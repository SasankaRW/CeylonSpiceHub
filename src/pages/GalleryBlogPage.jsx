
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Camera, BookOpen, ArrowRight } from 'lucide-react';

const galleryImages = [
  { srcPlaceholder: "Lush green tea plantation in Sri Lanka hills", alt: "Tea plantation", caption: "Ceylon's Verdant Hills" },
  { srcPlaceholder: "Close up of various colorful spices in bowls", alt: "Colorful spices", caption: "A Symphony of Spices" },
  { srcPlaceholder: "Traditional Sri Lankan drummers performing", alt: "Traditional drummers", caption: "Cultural Rhythms" },
  { srcPlaceholder: "Farmers harvesting cinnamon sticks", alt: "Cinnamon harvest", caption: "The Art of Harvest" },
  { srcPlaceholder: "Beautiful sunset over a Sri Lankan beach", alt: "Sri Lankan beach sunset", caption: "Island Paradise" },
  { srcPlaceholder: "Display of Katugasma jams and chutneys", alt: "Katugasma products", caption: "Handcrafted Delights" },
];

const blogPosts = [
  {
    title: "The Story of True Ceylon Cinnamon",
    date: "October 26, 2024",
    excerpt: "Delve into the history and unique qualities of True Ceylon Cinnamon, a spice prized for centuries...",
    imagePlaceholder: "Cinnamon sticks bundled together",
    alt: "Ceylon Cinnamon",
    link: "#" 
  },
  {
    title: "A Culinary Journey: Exploring Sri Lankan Curry Powders",
    date: "November 05, 2024",
    excerpt: "Discover the secrets behind Sri Lanka's diverse curry powders and how to use them to create authentic dishes...",
    imagePlaceholder: "Bowls of different curry powders",
    alt: "Sri Lankan Curry Powders",
    link: "#"
  },
  {
    title: "Health Benefits of Turmeric: The Golden Spice",
    date: "November 18, 2024",
    excerpt: "Learn about the incredible health benefits of turmeric, a staple in Ayurvedic traditions and Ceylonese cuisine...",
    imagePlaceholder: "Fresh turmeric roots and powder",
    alt: "Turmeric",
    link: "#"
  },
];

const GalleryBlogPage = () => {
  return (
    <div className="space-y-16">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <Camera className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Visual Stories from Ceylon</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the vibrant culture, breathtaking landscapes, and the journey of our spices.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
            >
              <div className="relative aspect-square">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt={image.alt}
                 src="https://images.unsplash.com/photo-1693994168929-31fac163b77f" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-lg font-semibold">{image.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-center mb-12">
          <BookOpen className="h-16 w-16 mx-auto text-secondary mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">From Our Spice Journal</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, recipes, and stories from the world of Ceylon spices and culinary traditions.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
            >
              <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="aspect-video relative">
                  <img 
                    className="w-full h-full object-cover" 
                    alt={post.alt}
                   src="https://images.unsplash.com/photo-1694388001616-1176f534d72f" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary hover:text-secondary transition-colors">
                    <Link to={post.link}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-sm">{post.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm">{post.excerpt}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild variant="link" className="text-primary p-0 h-auto hover:text-secondary">
                    <Link to={post.link} className="flex items-center">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default GalleryBlogPage;
  