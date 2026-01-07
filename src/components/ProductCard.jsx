import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="group h-full flex flex-col overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 bg-card border-border/50 hover:border-primary/30">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <img
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            alt={product.alt || product.name}
            loading="lazy"
            src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1694388001616-1176f534d72f"}
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick view button */}
          <Link
            to={`/product/${product._id || product.id}`}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </Link>

          {/* Out of stock badge */}
          {!product.stock_available && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              Out of Stock
            </div>
          )}
        </div>

        {/* Content */}
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 h-[3.5rem]">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {product.weight || product.category}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow pb-3">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">
              LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className="pt-0 pb-4 px-4 gap-2">
          <Button
            onClick={handleAddToCart}
            className="flex-1 shadow-sm hover:shadow-md transition-all duration-200 group/button"
            disabled={!product.stock_available}
          >
            <ShoppingCart className="w-4 h-4 mr-2 group-hover/button:scale-110 transition-transform" />
            {!product.stock_available ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
