import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, ChefHat, Utensils, Zap, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getRecipeById } from '@/api';
import { useToast } from '@/components/ui/use-toast';

const RecipeDetailsPage = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                const data = await getRecipeById(id);
                if (!data) {
                    toast({
                        title: "Recipe Not Found",
                        description: "The recipe could not be found.",
                        variant: "destructive"
                    });
                    navigate('/recipes');
                }
                setRecipe(data);
            } catch (error) {
                console.error("Error fetching recipe:", error);
                navigate('/recipes');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id, navigate, toast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Loading recipe...</p>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return <Navigate to="/recipes" replace />;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Header */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 pb-18 container mx-auto">
                    <Link to="/recipes">
                        <Button variant="outline" className="mb-6 bg-black/20 backdrop-blur border-white/20 text-white hover:bg-black/40">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
                        </Button>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{recipe.title}</h1>
                        <p className="text-xl text-white/90 font-medium">{recipe.subtitle}</p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Left Column: Info & Ingredients */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="shadow-xl border-primary/10">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                        <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                                        <span className="block text-sm text-muted-foreground font-medium">Prep Time</span>
                                        <span className="font-bold">{recipe.prepTime}</span>
                                    </div>
                                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                        <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                                        <span className="block text-sm text-muted-foreground font-medium">Servings</span>
                                        <span className="font-bold">{recipe.servings}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-border">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Zap className="w-4 h-4 text-yellow-500" />
                                        <span>Difficulty: <strong className="text-foreground">{recipe.difficulty}</strong></span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
                            <h3 className="text-xl font-bold mb-6 flex items-center text-primary">
                                <Utensils className="mr-2 w-5 h-5" /> Ingredients
                            </h3>
                            <ul className="space-y-3">
                                {recipe.ingredients.map((ing, i) => (
                                    <li key={i} className="flex items-start text-muted-foreground text-sm leading-relaxed">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                                        {ing}
                                    </li>
                                ))}
                            </ul>

                            {recipe.glazeIngredients && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">For the Glaze</h4>
                                    <ul className="space-y-3">
                                        {recipe.glazeIngredients.map((ing, i) => (
                                            <li key={i} className="flex items-start text-muted-foreground text-sm leading-relaxed">
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 mr-3 flex-shrink-0" />
                                                {ing}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {recipe.garnish && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                                        <Leaf className="w-4 h-4 text-green-500" /> Garnish
                                    </h4>
                                    <ul className="space-y-2">
                                        {recipe.garnish.map((ing, i) => (
                                            <li key={i} className="flex items-start text-muted-foreground text-sm">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0" />
                                                {ing}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {recipe.secondaryImage && (
                            <div className="overflow-hidden rounded-xl shadow-lg">
                                <img
                                    src={recipe.secondaryImage}
                                    alt="Ingredients"
                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column: Method */}
                    <div className="md:col-span-2">
                        <Card className="shadow-xl border-none overflow-hidden h-full">
                            <div className="h-2 bg-gradient-to-r from-primary to-orange-400" />
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold mb-8 flex items-center text-foreground">
                                    <ChefHat className="mr-3 w-8 h-8 text-primary" /> Preparation Method
                                </h2>

                                <div className="space-y-8">
                                    {recipe.method.map((step, i) => (
                                        <div key={i} className="flex gap-4 group">
                                            <div className="flex-shrink-0">
                                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                    {i + 1}
                                                </span>
                                            </div>
                                            <p className="text-lg text-muted-foreground leading-relaxed pt-1 group-hover:text-foreground transition-colors duration-300">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/10 text-center">
                                    <p className="text-xl font-serif italic text-primary">
                                        "Enjoy your homemade {recipe.title}!"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RecipeDetailsPage;
