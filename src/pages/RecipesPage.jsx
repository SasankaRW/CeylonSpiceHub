import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight, ChefHat } from 'lucide-react';
import { recipes } from '@/data/recipes';

const RecipesPage = () => {
  useEffect(() => {
    // Preload images for instant detail view
    recipes.forEach((recipe) => {
      if (recipe.secondaryImage) {
        const img = new Image();
        img.src = recipe.secondaryImage;
      }
      // Also ensure main image is cached if not already
      const mainImg = new Image();
      mainImg.src = recipe.image;
    });
  }, []);

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <ChefHat className="h-16 w-16 mx-auto text-primary mb-4" />
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Culinary Creations</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience the magic of Ceylon spices and Katagasma sauces with these curated recipes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border-primary/10">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{recipe.title}</h3>
                    <p className="text-white/80 text-sm font-medium">{recipe.subtitle}</p>
                  </div>
                </div>
              </div>

              <CardContent className="flex-grow p-6 flex flex-col">
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {recipe.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center text-muted-foreground bg-secondary/30 p-2 rounded">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    {recipe.prepTime}
                  </div>
                  <div className="flex items-center text-muted-foreground bg-secondary/30 p-2 rounded">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    {recipe.servings} servings
                  </div>
                </div>

                <div className="mt-auto">
                  <Link to={`/recipes/${recipe.id}`}>
                    <Button className="w-full group">
                      View Full Recipe
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
