import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Minus, Plus, Package, Check } from 'lucide-react';
import { getProductById } from '@/api/index';
import { addToCart } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';

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

  const getCurrentStock = () => {
    // Check boolean availability first
    const isAvailable = selectedVariant
      ? (selectedVariant.stock_available !== false)
      : (product?.stock_available !== false);

    if (!isAvailable) return 0;

    // If available, check count
    const stockCount = selectedVariant
      ? selectedVariant.stock
      : product?.stock;

    // If stock count is undefined/null but stock_available is true (new product), assume in stock (e.g. 100)
    // If stock count exists (legacy), return it
    return (stockCount !== undefined && stockCount !== null) ? stockCount : 100;
  };

  const isProductOutOfStock = () => {
    return getCurrentStock() === 0;
  };

  const getVariantStockStatus = (type, weight) => {
    if (!product?.variants) return true;
    const v = product.variants.find(v => v.type === type && v.weight === weight);
    return v ? (v.stock_available !== false) : false;
  };

  const getCurrentWeight = () => {
    if (selectedVariant) return selectedVariant.weight;
    return product?.weight || '';
  };

  const handleQuantityChange = (value) => {
    const maxStock = getCurrentStock();
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



  const getTypeLabel = (type) => {
    if (type === 'pouch') return 'Pouch';
    if (type === 'glass-bottle') return 'Glass Bottle';
    return type;
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) return null;

  const availableTypes = getAvailableTypes();
  const availableWeights = getAvailableWeights();

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        {/* Image Section */}
        <div className="space-y-4">
          <Card className="overflow-hidden shadow-glow border-border/50">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square bg-muted/30"
            >
              <img
                src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1694388001616-1176f534d72f"}
                alt={product.alt || product.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {isProductOutOfStock() && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="bg-destructive text-destructive-foreground px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </motion.div>
          </Card>

          {/* Product Info Card */}
          <Card className="p-6 bg-gradient-to-br from-muted/30 to-background shadow-soft border-border/50">
            <h3 className="font-semibold text-xl mb-4 text-foreground">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Category</p>
                <p className="font-medium text-foreground">{product.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Sub-category</p>
                <p className="font-medium text-foreground">{product.subCategory}</p>
              </div>
              {selectedVariant && (
                <>
                  <div>
                    <p className="text-muted-foreground mb-1">Package Type</p>
                    <p className="font-medium text-foreground">{getTypeLabel(selectedVariant.type)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Weight</p>
                    <p className="font-medium text-foreground">{selectedVariant.weight}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-muted-foreground mb-1">Availability</p>
                <p className={`font-medium ${getCurrentStock() > 0 ? 'text-green-600' : 'text-destructive'}`}>
                  {getCurrentStock() > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          {/* Title & Description */}
          <div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {product.name}
            </motion.h1>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-5xl font-bold text-primary">
              LKR {getCurrentPrice().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </motion.div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <motion.div
              className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-card via-background to-card border border-border/50 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Package Type Selection */}
              <div>
                <Label className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Package Type
                </Label>
                <div className="flex flex-wrap gap-3">
                  {availableTypes.map((type) => (
                    <motion.button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-200 ${selectedType === type
                        ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2'
                        : 'bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-primary/50'
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {selectedType === type && (
                        <motion.div
                          layoutId="selected-type"
                          className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check className="h-3 w-3" />
                        </motion.div>
                      )}
                      {getTypeLabel(type)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Weight Selection */}
              <AnimatePresence mode="wait">
                {selectedType && availableWeights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label className="text-base font-semibold text-foreground mb-3 block">
                      Select Weight
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {availableWeights.map((weight) => (
                        <motion.button
                          key={weight}
                          onClick={() => setSelectedWeight(weight)}
                          className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-200 ${selectedWeight === weight
                            ? 'bg-secondary text-secondary-foreground shadow-md ring-2 ring-secondary ring-offset-2'
                            : 'bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-secondary/50'
                            }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {selectedWeight === weight && (
                            <motion.div
                              layoutId="selected-weight"
                              className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full p-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="h-3 w-3" />
                            </motion.div>
                          )}
                          {weight}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Quantity Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">Quantity</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-12 w-12 rounded-lg border-2 hover:border-primary hover:text-primary"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <Input
                type="number"
                min="1"
                max={getCurrentStock()}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-24 h-12 text-center text-xl font-semibold border-2"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= getCurrentStock()}
                className="h-12 w-12 rounded-lg border-2 hover:border-primary hover:text-primary"
              >
                <Plus className="h-5 w-5" />
              </Button>
              {/* Low stock warning removed to hide exact count */}
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleAddToCart}
              className="w-full h-14 text-lg shadow-md hover:shadow-lg transition-all duration-300 group"
              size="lg"
              disabled={isProductOutOfStock() || (product.variants && product.variants.length > 0 && !selectedVariant)}
            >
              <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {isProductOutOfStock() ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetailsPage;
