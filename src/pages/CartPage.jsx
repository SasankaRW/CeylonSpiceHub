import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { getCart, updateQuantity, removeFromCart, getCartTotal } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = React.useState(getCart());
  const total = getCartTotal();

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

  const handleProceedToCheckout = React.useCallback(() => {
    navigate('/checkout');
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-primary mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <Card key={`cart-item-${item.id}`} className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={item.image || "https://images.unsplash.com/photo-1694388001616-1176f534d72f"}
                alt={item.name}
                loading="lazy"
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-muted-foreground">{item.weight}</p>
                <p className="text-primary font-bold">LKR {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <Card className="p-6">
          <div className="flex justify-between items-center text-lg font-semibold mb-4">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </Button>
        </Card>
      </div>
    </motion.div>
  );
};

export default CartPage;
