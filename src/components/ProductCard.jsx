import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { addToCart } from '@/lib/cartStore';

const ProductCard = ({ product }) => {
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Add the product to cart with quantity 1
    addToCart(product, 1);
    
    // Show a toast notification
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <img 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            alt={product.alt || product.name}
            loading="lazy"
            src={product.image || "https://images.unsplash.com/photo-1694388001616-1176f534d72f"} />
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              Only {product.stock} left!
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-xl text-primary">{product.name}</CardTitle>
          <CardDescription>{product.weight}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-2">{product.description}</p>
          <p className="text-2xl font-bold text-primary mt-4">LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </CardContent>
        <CardFooter className="space-x-2">
          <Button
            onClick={handleAddToCart}
            className="flex-1"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <Link to={`/product/${product._id || product.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
