import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { getProductById } from '@/api/index';
import { addToCart } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const foundProduct = await getProductById(id);
        if (!foundProduct) {
          toast({
            title: "Product Not Found",
            description: "The requested product could not be found.",
            variant: "destructive"
          });
          navigate('/products');
          return;
        }
        setProduct(foundProduct);
        
        // If product has variants, set default selections
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          const firstVariant = foundProduct.variants[0];
          setSelectedType(firstVariant.type);
          setSelectedWeight(firstVariant.weight);
          setSelectedVariant(firstVariant);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again later.",
          variant: "destructive"
        });
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, navigate, toast]);

  // Update selected variant when type or weight changes
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0 && selectedType && selectedWeight) {
      const variant = product.variants.find(
        v => v.type === selectedType && v.weight === selectedWeight
      );
      setSelectedVariant(variant || null);
    }
  }, [product, selectedType, selectedWeight]);

  // Get available types and weights from variants
  const getAvailableTypes = () => {
    if (!product?.variants || product.variants.length === 0) return [];
    return [...new Set(product.variants.map(v => v.type))];
  };

  const getAvailableWeights = () => {
    if (!product?.variants || product.variants.length === 0) return [];
    if (!selectedType) return [];
    return [...new Set(product.variants.filter(v => v.type === selectedType).map(v => v.weight))];
  };

  const handleQuantityChange = (value) => {
    const maxStock = selectedVariant?.stock || product?.stock || 0;
    const newQuantity = Math.max(1, Math.min(maxStock, value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // If product has variants, ensure one is selected
    if (product.variants && product.variants.length > 0) {
      if (!selectedVariant) {
        toast({
          title: "Selection Required",
          description: "Please select a type and weight before adding to cart.",
          variant: "destructive"
        });
        return;
      }
      
      // Create a product object with variant info
      const productWithVariant = {
        ...product,
        price: selectedVariant.price,
        stock: selectedVariant.stock,
        weight: selectedVariant.weight,
        variantType: selectedVariant.type,
        variantWeight: selectedVariant.weight,
        variantId: `${selectedVariant.type}-${selectedVariant.weight}`
      };
      
      addToCart(productWithVariant, quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} ${quantity === 1 ? 'item' : 'items'} (${selectedVariant.type} - ${selectedVariant.weight}) added to your cart.`,
      });
    } else {
      // Legacy product without variants
      addToCart(product, quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart.`,
      });
    }
  };

  // Get current price and stock
  const getCurrentPrice = () => {
    if (selectedVariant) return selectedVariant.price;
    return product?.price || 0;
  };

  const getCurrentStock = () => {
    if (selectedVariant) return selectedVariant.stock;
    return product?.stock || 0;
  };

  const getCurrentWeight = () => {
    if (selectedVariant) return selectedVariant.weight;
    return product?.weight || '';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    );
  }
  
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <Card className="overflow-hidden">
          <img
            src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1694388001616-1176f534d72f"}
            alt={product.alt || product.name}
            loading="lazy"
            className="w-full h-[400px] object-cover"
          />
        </Card>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{getCurrentWeight()}</p>
          </div>

          <p className="text-lg">{product.description}</p>

          <div className="space-y-4">
            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Package Type</Label>
                  <Select value={selectedType || ''} onValueChange={setSelectedType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTypes().map(type => (
                        <SelectItem key={type} value={type}>
                          {type === 'pouch' ? 'Pouch' : type === 'glass-bottle' ? 'Glass Bottle' : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedType && (
                  <div>
                    <Label htmlFor="weight">Weight</Label>
                    <Select value={selectedWeight || ''} onValueChange={setSelectedWeight}>
                      <SelectTrigger id="weight">
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableWeights().map(weight => (
                          <SelectItem key={weight} value={weight}>
                            {weight}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            <p className="text-3xl font-bold text-primary">
              LKR {getCurrentPrice().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                max={getCurrentStock()}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= getCurrentStock()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="lg"
              disabled={getCurrentStock() === 0 || (product.variants && product.variants.length > 0 && !selectedVariant)}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {getCurrentStock() === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {getCurrentStock() < 10 && getCurrentStock() > 0 && (
              <p className="text-red-500 text-sm">
                Only {getCurrentStock()} items left in stock!
              </p>
            )}
          </div>

          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="font-medium">Category:</span> {product.category}</li>
              <li><span className="font-medium">Sub-category:</span> {product.subCategory}</li>
              <li><span className="font-medium">Weight:</span> {getCurrentWeight()}</li>
              {selectedVariant && (
                <li><span className="font-medium">Package Type:</span> {selectedVariant.type === 'pouch' ? 'Pouch' : 'Glass Bottle'}</li>
              )}
              <li><span className="font-medium">Stock Status:</span> {getCurrentStock() > 0 ? 'In Stock' : 'Out of Stock'}</li>
            </ul>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetailsPage;
