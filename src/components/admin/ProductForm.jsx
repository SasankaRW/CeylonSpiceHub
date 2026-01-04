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

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState(initialData || {
    name: '',
    category: '',
    subCategory: '',
    price: '',
    weight: '',
    description: '',
    stock: '',
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

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), {
        type: 'pouch',
        weight: '',
        price: '',
        stock: ''
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
            stock: ''
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
        if (variant.stock === '' || variant.stock === undefined || isNaN(parseInt(variant.stock))) {
          toast({
            title: "Validation Error",
            description: `Please enter a valid stock quantity for variant ${i + 1} (${variant.type} - ${variant.weight}).`,
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
          const stock = parseInt(v.stock);
          
          if (isNaN(price) || price < 0) {
            throw new Error(`Invalid price for variant ${index + 1}. Please enter a valid number.`);
          }
          if (isNaN(stock) || stock < 0) {
            throw new Error(`Invalid stock for variant ${index + 1}. Please enter a valid number.`);
          }
          
          return {
            type: v.type,
            weight: v.weight.trim(),
            price: price,
            stock: stock
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
        
        // Extract detailed error message
        let errorMessage = "Failed to save product";
        if (error.response?.data) {
          if (error.response.data.details) {
            // Mongoose validation errors
            const errorDetails = Object.values(error.response.data.details).map(err => err.message).join(', ');
            errorMessage = errorDetails || error.response.data.error || error.response.data.message;
          } else {
            errorMessage = error.response.data.error || error.response.data.message || errorMessage;
          }
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
      try {
        await onSubmit(formData);
        toast({
          title: initialData ? "Product Updated" : "Product Created",
          description: `Product has been successfully ${initialData ? 'updated' : 'created'}.`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
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
                onValueChange={(value) => handleChange({ target: { name: 'category', value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ceylon-spices">Ceylon Spices</SelectItem>
                  <SelectItem value="katugasma">Katugasma</SelectItem>
                  <SelectItem value="fruitopia">Fruitopia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subCategory">Sub Category</Label>
              <Input
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                required
              />
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
              This product has multiple variants (different types like Pouch/Bottle and weights like 50g/100g)
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
                  {selectedTypes.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Select at least one package type (you can select both)
                    </p>
                  )}
                </div>

                {/* Weight Input - Enhanced */}
                <div className="mb-6">
                  <Label className="mb-3 block text-base font-medium">
                    Step 2: Add All Available Weights
                  </Label>
                  
                  {/* Single weight input */}
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

                  {/* Bulk weight input */}
                  <div className="mb-3">
                    <Label className="text-sm mb-2 block">Or add multiple weights at once (comma or line separated):</Label>
                    <Textarea
                      placeholder="50g, 100g, 250g, 500g&#10;or one per line:&#10;50g&#10;100g&#10;250g"
                      rows={3}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Parse comma or line separated weights
                        const parsedWeights = value
                          .split(/[,\n]/)
                          .map(w => w.trim())
                          .filter(w => w.length > 0);
                        
                        if (parsedWeights.length > 0) {
                          // Add all unique weights
                          parsedWeights.forEach(weight => {
                            if (weight && !weights.includes(weight)) {
                              setWeights(prev => [...prev, weight]);
                            }
                          });
                          e.target.value = ''; // Clear after adding
                        }
                      }}
                      className="text-sm"
                    />
                  </div>
                  
                  {/* Display added weights */}
                  {weights.length > 0 && (
                    <div>
                      <Label className="text-sm mb-2 block">
                        Added Weights ({weights.length}):
                      </Label>
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
                    </div>
                  )}
                </div>

                {/* Preview and Generate */}
                {selectedTypes.length > 0 && weights.length > 0 && (
                  <div className="mb-4 p-4 bg-muted/50 rounded-md">
                    <p className="text-sm font-medium mb-2">
                      Preview: {selectedTypes.length} type(s) × {weights.length} weight(s) = <span className="text-primary font-bold">{selectedTypes.length * weights.length} variants</span> will be created
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {selectedTypes.map(type => 
                        weights.map(weight => 
                          `${type === 'pouch' ? 'Pouch' : 'Glass Bottle'} - ${weight}`
                        ).join(', ')
                      ).join(', ')}
                    </div>
                  </div>
                )}

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
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Label className="text-base font-semibold">
                      Step 3: Set Price & Stock for Each Variant ({formData.variants?.length || 0})
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      After generating variants above, set the price and stock for each combination below.
                    </p>
                  </div>
                  <Button type="button" onClick={handleAddVariant} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Single Variant
                  </Button>
                </div>
              
                {formData.variants && formData.variants.length > 0 ? (
                  <div className="space-y-4">
                    {formData.variants.map((variant, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold">
                              {variant.type === 'pouch' ? 'Pouch' : 'Glass Bottle'} - {variant.weight}
                            </h4>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariant(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={variant.type}
                              onValueChange={(value) => handleVariantChange(index, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
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
                              placeholder="e.g., 50g, 100g"
                              required
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
                          <div>
                            <Label>Stock</Label>
                            <Input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Use the Quick Variant Builder above to generate all combinations, or click "Add Single Variant" to add one manually.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (LKR)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required={!useVariants}
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight/Volume</Label>
                <Input
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required={!useVariants}
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {!useVariants && (
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required={!useVariants}
              />
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
