import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Save, X, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from '@/api';
import { useNavigate } from 'react-router-dom';

import { recipes as DATA_RECIPES } from '../../data/recipes';

const AdminRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        prepTime: '',
        servings: '',
        difficulty: 'Easy',
        image: '',
        secondaryImage: '',
        ingredients: [''],
        method: [''],
        garnish: ['']
    });

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const data = await getRecipes();
            const fetchedRecipes = Array.isArray(data) ? data : [];
            setRecipes(fetchedRecipes);

            // Auto-Seeding Logic
            if (fetchedRecipes.length === 0) {
                await seedLegacyRecipes();
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load recipes.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const seedLegacyRecipes = async () => {
        try {
            // Check one more time to be safe (client-side race avoidance)
            const currentData = await getRecipes();
            if (Array.isArray(currentData) && currentData.length > 0) return;

            let count = 0;
            for (const recipe of DATA_RECIPES) {
                // Ensure we don't accidentally send an 'id' that might conflict with DB _id if not handled by backend
                const { id, ...recipeData } = recipe;
                await createRecipe(recipeData);
                count++;
            }
            if (count > 0) {
                toast({
                    title: "System Update",
                    description: `Automatically imported ${count} default recipes.`,
                });
                // Refresh list
                const newData = await getRecipes();
                setRecipes(Array.isArray(newData) ? newData : []);
            }
        } catch (error) {
            console.error("Auto-seed error:", error);
        }
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index, value, field) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (index, field) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            prepTime: '',
            servings: '',
            difficulty: 'Easy',
            image: '',
            secondaryImage: '',
            ingredients: [''],
            method: [''],
            garnish: ['']
        });
        setIsEditing(false);
        setCurrentRecipe(null);
    };

    const handleEdit = (recipe) => {
        setCurrentRecipe(recipe);
        setFormData({
            title: recipe.title || '',
            subtitle: recipe.subtitle || '',
            description: recipe.description || '',
            prepTime: recipe.prepTime || '',
            servings: recipe.servings || '',
            difficulty: recipe.difficulty || 'Easy',
            image: recipe.image || '',
            secondaryImage: recipe.secondaryImage || '',
            ingredients: recipe.ingredients || [''],
            method: recipe.method || [''],
            garnish: recipe.garnish || ['']
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        try {
            await deleteRecipe(id);
            toast({ title: "Success", description: "Recipe deleted successfully." });
            fetchRecipes();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete recipe.", variant: "destructive" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Filter out empty lines
            const cleanedData = {
                ...formData,
                ingredients: formData.ingredients.filter(i => i.trim() !== ''),
                method: formData.method.filter(m => m.trim() !== ''),
                garnish: formData.garnish.filter(g => g.trim() !== '')
            };

            if (currentRecipe) {
                await updateRecipe(currentRecipe._id || currentRecipe.id, cleanedData);
                toast({ title: "Success", description: "Recipe updated successfully." });
            } else {
                await createRecipe(cleanedData);
                toast({ title: "Success", description: "Recipe created successfully." });
            }
            resetForm();
            fetchRecipes();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save recipe.", variant: "destructive" });
        }
    };

    if (loading && !isEditing) {
        return <div className="p-8 text-center text-muted-foreground">Loading recipes...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold text-primary">Manage Recipes</h1>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Recipe
                    </Button>
                )}
            </div>

            {/* List View */}
            {!isEditing ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recipes.map((recipe) => (
                        <Card key={recipe._id || recipe.id} className="relative group overflow-hidden">
                            <div className="aspect-video bg-muted relative">
                                {recipe.image ? (
                                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <ImageIcon className="h-8 w-8" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button variant="secondary" size="sm" onClick={() => handleEdit(recipe)}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(recipe._id || recipe.id)}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
                                <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
                            </CardHeader>
                        </Card>
                    ))}
                    {recipes.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No recipes found. Adding default recipes...
                        </div>
                    )}
                </div>
            ) : (
                /* Edit/Create Form */
                <Card>
                    <CardHeader>
                        <CardTitle>{currentRecipe ? "Edit Recipe" : "New Recipe"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input name="title" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Input name="subtitle" value={formData.subtitle} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} required />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Prep Time</Label>
                                    <Input name="prepTime" value={formData.prepTime} onChange={handleInputChange} placeholder="e.g. 15 mins" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Servings</Label>
                                    <Input name="servings" value={formData.servings} onChange={handleInputChange} placeholder="e.g. 4" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleInputChange}
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
                                <h3 className="font-semibold text-sm uppercase text-primary">Images (URLs)</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Main Image URL</Label>
                                        <Input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Secondary/Ingredients Image URL</Label>
                                        <Input name="secondaryImage" value={formData.secondaryImage} onChange={handleInputChange} placeholder="https://..." />
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Array Fields: Ingredients, Method, Garnish */}
                            {['ingredients', 'method', 'garnish'].map((field) => (
                                <div key={field} className="space-y-2">
                                    <Label className="capitalize">{field}</Label>
                                    {formData[field].map((item, index) => (
                                        <div key={index} className="flex gap-2">
                                            {field === 'method' ? (
                                                <Textarea value={item} onChange={(e) => handleArrayChange(index, e.target.value, field)} className="flex-1" rows={2} />
                                            ) : (
                                                <Input value={item} onChange={(e) => handleArrayChange(index, e.target.value, field)} className="flex-1" />
                                            )}
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(index, field)}>
                                                <X className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(field)} className="mt-2">
                                        <Plus className="h-3 w-3 mr-2" /> Add {field.slice(0, -1)}
                                    </Button>
                                </div>
                            ))}

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" /> Save Recipe
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminRecipes;
