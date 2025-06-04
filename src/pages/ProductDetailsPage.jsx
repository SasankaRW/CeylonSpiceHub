import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { getProductById } from '@/api/index';
import { addToCart } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.stock, value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart.`,
    });
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
            src={product.image || "https://images.unsplash.com/photo-1694388001616-1176f534d72f"}
            alt={product.alt || product.name}
            loading="lazy"
            className="w-full h-[400px] object-cover"
          />
        </Card>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.weight}</p>
          </div>

          <p className="text-lg">{product.description}</p>

          <div className="space-y-4">
            <p className="text-3xl font-bold text-primary">LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            
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
                max={product.stock}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="lg"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {product.stock < 10 && product.stock > 0 && (
              <p className="text-red-500 text-sm">
                Only {product.stock} items left in stock!
              </p>
            )}
          </div>

          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="font-medium">Category:</span> {product.category}</li>
              <li><span className="font-medium">Sub-category:</span> {product.subCategory}</li>
              <li><span className="font-medium">Weight:</span> {product.weight}</li>
              <li><span className="font-medium">Stock Status:</span> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</li>
            </ul>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetailsPage;
