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

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState(initialData || {
    name: '',
    category: '',
    subCategory: '',
    price: '',
    weight: '',
    description: '',
    stock: '',
    featured: false
  });

  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
                required
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight/Volume</Label>
              <Input
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

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
