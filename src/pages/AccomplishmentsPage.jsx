
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, Star, TrendingUp, ShieldCheck } from 'lucide-react';

const accomplishments = [
  {
    icon: <Award className="h-12 w-12 text-accent" />,
    title: "Best Spice Exporter Award 2024",
    description: "Recognized for outstanding quality and export volume by the National Chamber of Exporters.",
    year: "2024",
    imageDescription: "Golden award trophy for best exporter",
    alt: "Exporter Award Trophy"
  },
  {
    icon: <ShieldCheck className="h-12 w-12 text-green-500" />,
    title: "ISO 22000 Certification",
    description: "Achieved ISO 22000 certification for food safety management systems, ensuring highest product safety.",
    year: "2023",
    imageDescription: "ISO 22000 certification logo",
    alt: "ISO 22000 Certified"
  },
  {
    icon: <Star className="h-12 w-12 text-yellow-400" />,
    title: "5-Star Rating for Cinnamon",
    description: "Our True Ceylon Cinnamon received a 5-star rating at the International Spice Convention.",
    year: "2023",
    imageDescription: "Five golden stars rating symbol",
    alt: "5 Star Rating"
  },
  {
    icon: <TrendingUp className="h-12 w-12 text-blue-500" />,
    title: "Expanded to 10 New Markets",
    description: "Successfully expanded our distribution network to 10 new international markets.",
    year: "2022",
    imageDescription: "World map with highlighted new market regions",
    alt: "Global Market Expansion"
  },
];

const AccomplishmentsPage = () => {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Milestones & Achievements</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Celebrating our journey of excellence, quality, and commitment to bringing the best of Ceylon to the world.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {accomplishments.map((accomplishment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <Card className="h-full overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
              <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center space-x-4">
                {accomplishment.icon}
                <CardTitle className="text-2xl text-primary">{accomplishment.title}</CardTitle>
              </div>
              <CardContent className="p-6">
                <CardDescription className="text-base mb-4">{accomplishment.description}</CardDescription>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-secondary">{accomplishment.year}</span>
                  <img  className="h-24 w-36 object-contain rounded" alt={accomplishment.alt} src="https://images.unsplash.com/photo-1512820790803-83ca734da794" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: accomplishments.length * 0.15 }}
        className="text-center mt-12"
      >
        <p className="text-xl text-primary font-semibold">
          ...and we're just getting started. Stay tuned for more!
        </p>
      </motion.div>
    </div>
  );
};

export default AccomplishmentsPage;
  
