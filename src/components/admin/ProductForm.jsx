import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, X, Image as ImageIcon, Package, DollarSign } from 'lucide-react';

const CATEGORY_STRUCTURE = {
  'Sauces': ['Hot Sauces', 'Classic Sauces'],
  'Chutney': ['Chutney'],
  'Jam': ['Fruit Jam'],
  'Wines': ['Fruit Wine'],
  'Spices': ['Whole Spices', 'Spice Mixtures', 'Spice Blends']
};

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const { toast } = useToast();

  const [formData, setFormData] = React.useState(initialData || {
    name: '',
    category: '',
    subCategory: '',
    description: '',
    featured: false,
    imageUrl: '',
    alt: '',
    // Legacy single product fields
    price: '',
    weight: '',
    stock_available: true,
    // Variants
    variants: []
  });

  // Simplified mode toggle: Does this product have multiple options?
  const [hasVariants, setHasVariants] = React.useState(
    initialData ? (initialData.variants && initialData.variants.length > 0) : false
  );

  // Initialize form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value,
      subCategory: '' // Reset subcategory
    }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), {
        type: 'glass-bottle', // Default to common type
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
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data submission
      const submitData = {
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        featured: formData.featured,
        imageUrl: formData.imageUrl,
        alt: formData.alt,
      };

      if (hasVariants) {
        // Validate variants
        if (!formData.variants || formData.variants.length === 0) {
          throw new Error("Please add at least one product option (variant).");
        }

        submitData.variants = formData.variants.map((v, i) => {
          if (!v.weight || !v.price) throw new Error(`Option ${i + 1} is missing size or price.`);
          return {
            type: v.type,
            weight: v.weight,
            price: parseFloat(v.price),
            stock_available: v.stock_available !== false
          };
        });
      } else {
        // Single product mode
        if (!formData.price) throw new Error("Price is required.");
        submitData.price = parseFloat(formData.price);
        submitData.weight = formData.weight;
        submitData.stock_available = formData.stock_available;
        submitData.variants = []; // Ensure no variants sent
      }

      await onSubmit(submitData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSubmit}>

        {/* SECTION 1: BASIC INFO */}
        <Card className="mb-6 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>1. Basic Information</CardTitle>
            <CardDescription>What is this product properly called and categorized?</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label>Product Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Grandma's Hot Chili Sauce"
                className="text-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CATEGORY_STRUCTURE).map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sub-Category</Label>
                {formData.category && CATEGORY_STRUCTURE[formData.category] ? (
                  <Select value={formData.subCategory} onValueChange={(v) => setFormData(prev => ({ ...prev, subCategory: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sub-Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_STRUCTURE[formData.category].map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    placeholder={formData.category ? "Enter Sub-Category" : "Select Category first"}
                    disabled={!formData.category}
                  />
                )}
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the taste, ingredients, and story..."
                className="h-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: PRICING & VARIANTS */}
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle>2. Pricing & Sizes</CardTitle>
            <CardDescription>Does this product come in different sizes (e.g. 100g vs 500g)?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6 p-4 bg-muted rounded-lg">
              <Switch
                checked={hasVariants}
                onCheckedChange={(checked) => {
                  setHasVariants(checked);
                  // Setup one empty variant if switching on
                  if (checked && (!formData.variants || formData.variants.length === 0)) {
                    handleAddVariant();
                  }
                }}
              />
              <Label className="font-medium">Yes, this product has multiple options (sizes/types)</Label>
            </div>

            {hasVariants ? (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
                    <div className="col-span-3">Type (Container)</div>
                    <div className="col-span-3">Size/Weight</div>
                    <div className="col-span-3">Price (LKR)</div>
                    <div className="col-span-2 text-center">In Stock?</div>
                    <div className="col-span-1"></div>
                  </div>
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-4 border-t items-center">
                      <div className="col-span-3">
                        <Select value={variant.type} onValueChange={(v) => handleVariantChange(index, 'type', v)}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="glass-bottle">Glass Bottle</SelectItem>
                            <SelectItem value="pouch">Pouch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <Input
                          placeholder="e.g. 350g"
                          value={variant.weight}
                          onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-3 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">LKR</span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className="pl-12 h-9 font-mono"
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Switch
                          checked={variant.stock_available !== false}
                          onCheckedChange={(c) => handleVariantChange(index, 'stock_available', c)}
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveVariant(index)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={handleAddVariant} className="w-full border-dashed border-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Another Option
                </Button>
              </div>
            ) : (
              // SIMPLE MODE
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <Label>Price (LKR)</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="pl-9 text-lg"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label>Size / Weight</Label>
                  <div className="relative mt-1">
                    <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="pl-9"
                      placeholder="e.g. 250g"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center space-x-2 border p-3 rounded bg-background">
                  <Switch
                    checked={formData.stock_available}
                    onCheckedChange={(c) => setFormData(prev => ({ ...prev, stock_available: c }))}
                  />
                  <Label>Is this product currently in stock?</Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 3: MEDIA */}
        <Card className="mb-6 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle>3. Product Image</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Image URL (Direct Link)</Label>
                <div className="flex gap-2">
                  <Input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Paste a link from your image host.</p>
              </div>
              <div>
                <Label>Alt Text (for SEO)</Label>
                <Input name="alt" value={formData.alt} onChange={handleChange} placeholder="Describe image" />
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(c) => setFormData(prev => ({ ...prev, featured: c }))}
                />
                <Label>Feature this product on homepage?</Label>
              </div>
            </div>

            <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg p-4 min-h-[200px]">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="max-h-48 object-contain rounded shadow-sm"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <span>Image Preview</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 border-t">
          <Button type="button" variant="secondary" onClick={onCancel} className="px-6">
            Cancel
          </Button>
          <Button type="submit" size="lg" className="px-8 font-semibold">
            {initialData ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
