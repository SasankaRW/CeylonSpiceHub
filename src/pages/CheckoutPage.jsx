
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCart, getCartTotal, clearCart } from '@/lib/cartStore';
import { createOrder as createLocalOrder } from '@/lib/orderStore';
import { createOrder as createApiOrder } from '@/api/index';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const cart = getCart();
  const total = getCartTotal();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);

  // Use useEffect to handle navigation when cart is empty
  React.useEffect(() => {
    if (cart.length === 0 && !showSuccessModal) {
      navigate('/cart');
    }
  }, [cart.length, navigate, showSuccessModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Format cart items to match API expectations
      const formattedItems = cart.map(item => ({
        productId: item.id,
        id: item.id, // Ensure id is included for the backend
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      // Prepare order data with proper format
      const orderData = {
        items: formattedItems,
        customerInfo: formData,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Create order in the database via API
      const createdOrder = await createApiOrder(orderData);

      // Also create in local storage for backup
      createLocalOrder(cart, formData);

      // Clear cart
      clearCart();

      setLastOrderId(createdOrder?.id || createdOrder?._id || 'New');
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error creating order:', error);
      let errorMessage = "There was a problem placing your order. Please try again.";

      // More specific error messages based on the error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      }

      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-primary mb-8 font-serif">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/50">
            <h2 className="text-xl font-semibold mb-4 font-serif">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>



              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full" size="lg">
                  Place Order
                </Button>
              </motion.div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/50">
            <h2 className="text-xl font-semibold mb-4 font-serif">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={`checkout-item-${item.id}-${index}`} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>LKR {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">Order Placed Successfully!</DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Thank you for ordering from us. You will receive your order quickly and someone from our side will contact you.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Order Reference: <span className="font-mono font-medium text-foreground">#{lastOrderId ? lastOrderId.slice(-6).toUpperCase() : ''}</span>
            </p>
            <Button onClick={handleCloseModal} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CheckoutPage;
