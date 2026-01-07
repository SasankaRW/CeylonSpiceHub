import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Utensils, Clock, Users, ArrowRight, ChefHat } from 'lucide-react';

const recipes = [
  {
    title: "Classic Chicken Curry",
    description: "A rich and aromatic Sri Lankan chicken curry made with our Roasted Curry Powder.",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800&auto=format&fit=crop",
    prepTime: "20 mins",
    cookTime: "45 mins",
    servings: "4",
    ingredients: ["1kg Chicken", "3 tbsp Roasted Curry Powder", "1 cup Coconut Milk", "Curry Leaves"],
    difficulty: "Medium"
  },
  {
    title: "Spicy Pol Sambol",
    description: "The quintessential Sri Lankan coconut relish, perfect with rice, bread, or string hoppers.",
    image: "https://images.unsplash.com/photo-1626508044702-8edc4c23ba3f?q=80&w=800&auto=format&fit=crop",
    prepTime: "15 mins",
    cookTime: "0 mins",
    servings: "6",
    ingredients: ["Fresh Grated Coconut", "Chilli Flakes", "Lime Juice", "Red Onions"],
    difficulty: "Easy"
  },
  {
    title: "Dhal Curry (Parippu)",
    description: "Creamy, comforting lentil curry tempered with mustard seeds and curry leaves.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
    prepTime: "10 mins",
    cookTime: "20 mins",
    servings: "4",
    ingredients: ["Red Lentils", "Turmeric Powder", "Coconut Milk", "Green Chillies"],
    difficulty: "Easy"
  },
  {
    title: "Black Pork Curry",
    description: "A dark, flavorful pork curry using Goraka and roasted spices for a signature taste.",
    image: "https://images.unsplash.com/photo-1606735584930-168d29759c65?q=80&w=800&auto=format&fit=crop",
    prepTime: "30 mins",
    cookTime: "1 hr",
    servings: "5",
    ingredients: ["Pork Cubes", "Black Pepper", "Goraka", "Curry Powder"],
    difficulty: "Hard"
  },
  {
    title: "Coconut Roti",
    description: "Thick, rustic flatbreads made with flour and fresh grated coconut.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
    prepTime: "15 mins",
    cookTime: "15 mins",
    servings: "8",
    ingredients: ["Wheat Flour", "Grated Coconut", "Green Chillies", "Onion"],
    difficulty: "Medium"
  },
  {
    title: "Wambatu Moju",
    description: "A sweet, sour, and spicy eggplant pickle that is a favorite at celebrations.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop",
    prepTime: "40 mins",
    cookTime: "20 mins",
    servings: "10",
    ingredients: ["Eggplant", "Vinegar", "Sugar", "Mustard Seeds"],
    difficulty: "Medium"
  }
];

const RecipesPage = () => {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <ChefHat className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Authentic Ceylon Recipes</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Bring the taste of Sri Lanka to your kitchen with these traditional recipes using our premium spices.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                  {recipe.difficulty}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-primary">{recipe.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {recipe.prepTime}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {recipe.servings} pp
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{recipe.description}</p>
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-foreground/80">Key Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.slice(0, 3).map((ing, i) => (
                      <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {ing}
                      </span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <span className="text-xs text-muted-foreground self-center">+{recipe.ingredients.length - 3} more</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button className="w-full group">
                  View Recipe <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
