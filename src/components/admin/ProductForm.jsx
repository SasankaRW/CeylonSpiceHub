import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, X } from 'lucide-react';

const CATEGORY_STRUCTURE = {
  'Sauces': ['Hot Sauces', 'Classic Sauces'],
  'Chutney': ['Chutney'],
  'Jam': ['Fruit Jam'],
  'Wines': ['Fruit Wine'],
  'Spices': ['Whole Spices', 'Spice Mixtures', 'Spice Blends']
};

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState(initialData || {
    name: '',
    category: '',
    subCategory: '',
    price: '',
    weight: '',
    description: '',
    stock_available: true,
    featured: false,
    variants: []
  });

  // Default to showing variants for new products (no initialData)
  const [useVariants, setUseVariants] = React.useState(
    initialData ? (initialData?.variants && initialData.variants.length > 0) : true
  );

  // Variant builder state
  const [selectedTypes, setSelectedTypes] = React.useState([]);
  const [weightInput, setWeightInput] = React.useState('');
  const [weights, setWeights] = React.useState([]);

  const { toast } = useToast();

  // Initialize from existing variants if editing
  React.useEffect(() => {
    if (initialData?.variants && initialData.variants.length > 0) {
      const existingTypes = [...new Set(initialData.variants.map(v => v.type))];
      const existingWeights = [...new Set(initialData.variants.map(v => v.weight))];
      setSelectedTypes(existingTypes);
      setWeights(existingWeights);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value,
      subCategory: '' // Reset subcategory when category changes
    }));
  };

  const handleSubCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      subCategory: value
    }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), {
        type: 'pouch',
        weight: '',
        price: '',
        stock_available: true
      }]
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  // Variant builder functions
  const handleTypeToggle = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleAddWeight = () => {
    const trimmedWeight = weightInput.trim();
    if (trimmedWeight && !weights.includes(trimmedWeight)) {
      setWeights(prev => [...prev, trimmedWeight]);
      setWeightInput('');
    }
  };

  const handleRemoveWeight = (weight) => {
    setWeights(prev => prev.filter(w => w !== weight));
  };

  const handleGenerateVariants = () => {
    if (selectedTypes.length === 0 || weights.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one type and add at least one weight.",
        variant: "destructive"
      });
      return;
    }

    // Generate all combinations
    const newVariants = [];
    selectedTypes.forEach(type => {
      weights.forEach(weight => {
        // Check if this combination already exists
        const exists = formData.variants?.some(
          v => v.type === type && v.weight === weight
        );

        if (!exists) {
          newVariants.push({
            type,
            weight,
            price: '',
            stock_available: true
          });
        }
      });
    });

    if (newVariants.length === 0) {
      toast({
        title: "No New Variants",
        description: "All combinations already exist.",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), ...newVariants]
    }));

    toast({
      title: "Variants Generated",
      description: `Generated ${newVariants.length} new variant(s).`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate variants if using them
    if (useVariants) {
      if (!formData.variants || formData.variants.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please generate variants using the 'Generate All Variants' button before submitting.",
          variant: "destructive"
        });
        return;
      }

      // Validate each variant
      for (let i = 0; i < formData.variants.length; i++) {
        const variant = formData.variants[i];
        if (!variant.type || !variant.weight) {
          toast({
            title: "Validation Error",
            description: `Variant ${i + 1} is missing type or weight. Please regenerate variants.`,
            variant: "destructive"
          });
          return;
        }
        if (!variant.price || variant.price === '' || isNaN(parseFloat(variant.price))) {
          toast({
            title: "Validation Error",
            description: `Please enter a valid price for variant ${i + 1} (${variant.type} - ${variant.weight}).`,
            variant: "destructive"
          });
          return;
        }
      }

      // Convert string numbers to actual numbers and validate
      let processedVariants;
      try {
        processedVariants = formData.variants.map((v, index) => {
          const price = parseFloat(v.price);

          if (isNaN(price) || price < 0) {
            throw new Error(`Invalid price for variant ${index + 1}. Please enter a valid number.`);
          }

          return {
            type: v.type,
            weight: v.weight.trim(),
            price: price,
            stock_available: v.stock_available !== false // Default to true if undefined
          };
        });
      } catch (validationError) {
        toast({
          title: "Validation Error",
          description: validationError.message,
          variant: "destructive"
        });
        return;
      }

      // Create submit data without legacy fields when using variants
      const submitData = {
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        featured: formData.featured || false,
        variants: processedVariants
        // Top-level stock_available will be inferred by backend or logic from variants
      };

      // Only include imageUrl if provided
      if (formData.imageUrl) {
        submitData.imageUrl = formData.imageUrl;
      }
      if (formData.alt) {
        submitData.alt = formData.alt;
      }
      if (formData.imageDescription) {
        submitData.imageDescription = formData.imageDescription;
      }

      try {
        console.log('Submitting product data:', JSON.stringify(submitData, null, 2));
        await onSubmit(submitData);
        toast({
          title: initialData ? "Product Updated" : "Product Created",
          description: `Product has been successfully ${initialData ? 'updated' : 'created'}.`
        });
      } catch (error) {
        console.error('Error submitting product:', error);
        console.error('Error response:', error.response?.data);

        let errorMessage = "Failed to save product";
        if (error.response?.data) {
          errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } else {
      // Legacy product without variants
      const submitData = {
        ...formData,
        stock_available: formData.stock_available
      };
      // Check price
      if (!submitData.price || isNaN(parseFloat(submitData.price))) {
        toast({ title: "Error", description: "Price is required", variant: "destructive" });
        return;
      }


      try {
        await onSubmit(submitData);
        toast({
          title: initialData ? "Product Updated" : "Product Created",
          description: `Product has been successfully ${initialData ? 'updated' : 'created'}.`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sauces">Sauces</SelectItem>
                  <SelectItem value="Chutney">Chutney</SelectItem>
                  <SelectItem value="Jam">Jam</SelectItem>
                  <SelectItem value="Wines">Wines</SelectItem>
                  <SelectItem value="Spices">Spices</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subCategory">Sub Category</Label>
              {formData.category && CATEGORY_STRUCTURE[formData.category] ? (
                <Select
                  name="subCategory"
                  value={formData.subCategory}
                  onValueChange={handleSubCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_STRUCTURE[formData.category].map(sub => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="subCategory"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  placeholder="Enter sub-category"
                  required
                />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="useVariants"
              checked={useVariants}
              onCheckedChange={(checked) => {
                setUseVariants(checked);
                if (!checked) {
                  setFormData(prev => ({ ...prev, variants: [] }));
                  setSelectedTypes([]);
                  setWeights([]);
                }
              }}
            />
            <Label htmlFor="useVariants" className="cursor-pointer">
              This product has multiple variants (different types like Pouch/Bottle and weights)
            </Label>
          </div>

          {useVariants ? (
            <div className="space-y-6">
              {/* Variant Builder Section */}
              <Card className="p-6 bg-primary/5 border-2 border-primary/20">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-1">Add Product Variants</h3>
                  <p className="text-sm text-muted-foreground">
                    Select all package types and add all available weights. The system will automatically create all combinations.
                  </p>
                </div>

                {/* Type Selection */}
                <div className="mb-6">
                  <Label className="mb-3 block text-base font-medium">
                    Step 1: Select All Package Types Available
                  </Label>
                  <div className="flex gap-3">
                    {['pouch', 'glass-bottle'].map(type => (
                      <Button
                        key={type}
                        type="button"
                        variant={selectedTypes.includes(type) ? "default" : "outline"}
                        onClick={() => handleTypeToggle(type)}
                        className="capitalize h-12 px-6 text-base"
                        size="lg"
                      >
                        {type === 'pouch' ? '📦 Pouch' : '🍾 Glass Bottle'}
                        {selectedTypes.includes(type) && (
                          <X className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Weight Input */}
                <div className="mb-6">
                  <Label className="mb-3 block text-base font-medium">
                    Step 2: Add All Available Weights
                  </Label>

                  <div className="flex gap-2 mb-3">
                    <Input
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddWeight();
                        }
                      }}
                      placeholder="Enter weight (e.g., 50g, 100g, 250g)"
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddWeight} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Weight
                    </Button>
                  </div>

                  {/* Display added weights */}
                  {weights.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-background border rounded-md">
                      {weights.map(weight => (
                        <div
                          key={weight}
                          className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-md px-3 py-1.5 text-sm font-medium"
                        >
                          <span>{weight}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveWeight(weight)}
                            className="text-muted-foreground hover:text-destructive ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <Button
                  type="button"
                  onClick={handleGenerateVariants}
                  className="w-full"
                  size="lg"
                  disabled={selectedTypes.length === 0 || weights.length === 0}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Generate All {selectedTypes.length * weights.length} Variants
                </Button>
              </Card>

              {/* Variants List */}
              <div>
                <Label className="text-base font-semibold mb-4 block">
                  Step 3: Set Price & Availability ({formData.variants?.length || 0})
                </Label>

                {formData.variants && formData.variants.length > 0 ? (
                  <div className="space-y-4">
                    {formData.variants.map((variant, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">
                            {variant.type === 'pouch' ? 'Pouch' : 'Glass Bottle'} - {variant.weight}
                          </h4>
                          <Button
                            type="button" variant="ghost" size="sm"
                            onClick={() => handleRemoveVariant(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={variant.type}
                              onValueChange={(value) => handleVariantChange(index, 'type', value)}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pouch">Pouch</SelectItem>
                                <SelectItem value="glass-bottle">Glass Bottle</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Weight</Label>
                            <Input
                              value={variant.weight}
                              onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Price (LKR)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={variant.price}
                              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                              required
                            />
                          </div>
                          <div className="flex items-center h-10 space-x-2">
                            <Switch
                              checked={variant.stock_available !== false}
                              onCheckedChange={(checked) => handleVariantChange(index, 'stock_available', checked)}
                            />
                            <Label>In Stock</Label>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No variants. use the builder above.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Legacy input fields */}
              <div>
                <Label>Price</Label>
                <Input type="number" name="price" value={formData.price} onChange={handleChange} />
              </div>
              <div>
                <Label>Weight</Label>
                <Input name="weight" value={formData.weight} onChange={handleChange} />
              </div>
            </div>
          )}

          <div>
            <Label>Description</Label>
            <Textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>

          {!useVariants && (
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.stock_available}
                onCheckedChange={(c) => handleChange({ target: { name: 'stock_available', value: c } })}
              />
              <Label>Available in Stock</Label>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              name="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                handleChange({ target: { name: 'featured', value: checked } })
              }
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="imageUrl">Product Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a direct link to the product image.
            </p>
          </div>
          <div>
            <Label htmlFor="alt">Image Alt Text</Label>
            <Input
              id="alt"
              name="alt"
              value={formData.alt || ''}
              onChange={handleChange}
              placeholder="e.g., Red Hot Chili Sauce Bottle"
            />
          </div>
        </div>

        {formData.imageUrl && (
          <div className="mt-2">
            <Label>Image Preview</Label>
            <div className="mt-2 border rounded-md p-2 w-fit">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md"
                onError={(e) => { e.target.src = "https://placehold.co/100?text=Invalid+URL"; }}
              />
            </div>
          </div>
        )}


        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProductForm;
