import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { getCart, updateQuantity, removeFromCart, getCartTotal, subscribeToCart } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = React.useState(getCart());
  const [total, setTotal] = React.useState(getCartTotal());

  // Subscribe to cart changes
  React.useEffect(() => {
    const unsubscribe = subscribeToCart(() => {
      setCart(getCart());
      setTotal(getCartTotal());
    });
    return unsubscribe;
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
    setCart(getCart());
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    setCart(getCart());
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };

  const handleBrowseProducts = React.useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleProceedToCheckout = React.useCallback(() => {
    navigate('/checkout');
  }, [navigate]);

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Start shopping to add items to your cart.</p>
        <Button onClick={handleBrowseProducts}>Browse Products</Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-0"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8 font-serif">Shopping Cart</h1>

      <AnimatePresence mode="popLayout">
        {cart.map((item) => {
          const itemId = item.cartItemId || item._id || item.id;
          const itemImage = item.imageUrl || item.image || "/images/milestones/Image_not_available.png";
          const variantInfo = item.variantType && item.variantWeight
            ? `${item.variantType === 'pouch' ? 'Pouch' : 'Glass Bottle'} - ${item.variantWeight}`
            : '';
          return (
            <motion.div
              key={`cart-item-${itemId}`}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <img
                    src={itemImage}
                    alt={item.name}
                    loading="lazy"
                    className="w-24 h-24 sm:w-24 sm:h-24 object-cover rounded self-start"
                  />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg break-words">{item.name}</h3>
                    <p className="text-muted-foreground">{item.weight || item.variantWeight}</p>
                    {variantInfo && (
                      <p className="text-sm text-muted-foreground">{variantInfo}</p>
                    )}
                    <p className="text-primary font-bold">LKR {(item.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(itemId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(itemId, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 999)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={() => handleRemoveItem(itemId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="mt-8 space-y-4">
        <Card className="p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-lg font-semibold mb-4">
            <span>Subtotal:</span>
            <span className="break-words">LKR {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full"
              size="lg"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
          </motion.div>
        </Card>
      </div>
    </motion.div>
  );
};

export default CartPage;
