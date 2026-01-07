import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // If no order data, redirect to home
  React.useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  // Generate order reference number
  const generateOrderNumber = () => {
    const date = new Date(order.createdAt || Date.now());
    const formattedDate = format(date, 'yyyyMMdd');
    const lastName = order.customerInfo?.lastName || '';
    const lastNameInitial = lastName[0]?.toUpperCase() || 'X';
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    return `CSH-${formattedDate}-${lastNameInitial}${randomSuffix}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12"
    >
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600">
          Thank you for ordering from us. You will receive your order quickly and someone from our side will contact you.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-2xl font-semibold">Order #{generateOrderNumber()}</h2>
          <p className="text-gray-500">
            {order.createdAt ? format(new Date(order.createdAt), 'MMMM dd, yyyy') : format(new Date(), 'MMMM dd, yyyy')}
          </p>
        </div>

        <h3 className="font-semibold mb-3">Items</h3>
        <div className="space-y-4 mb-8">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">LKR {(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          ))}
          <div className="border-t pt-4 flex justify-between font-bold">
            <p>Total</p>
            <p>LKR {order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3">Shipping Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
            <p><span className="text-gray-500">Name:</span> {order.customerInfo.firstName} {order.customerInfo.lastName}</p>
            <p><span className="text-gray-500">Email:</span> {order.customerInfo.email}</p>
            <p><span className="text-gray-500">Phone:</span> {order.customerInfo.phone}</p>
            <p><span className="text-gray-500">Address:</span> {order.customerInfo.address}</p>
            <p><span className="text-gray-500">City:</span> {order.customerInfo.city}</p>
            <p><span className="text-gray-500">Country:</span> {order.customerInfo.country}</p>
            <p><span className="text-gray-500">Postal Code:</span> {order.customerInfo.postalCode}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={() => navigate('/')} variant="default" size="lg">
          Continue Shopping
        </Button>
        <Button onClick={() => window.print()} variant="outline" size="lg">
          Print Receipt
        </Button>
      </div>
    </motion.div>
  );
};

export default OrderConfirmation; 
