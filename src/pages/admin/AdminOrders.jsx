import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingBag, Clock, Check, AlertTriangle } from 'lucide-react';
import api from '@/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('pending');
  const { toast } = useToast();

  const filteredOrders = orders.filter(order => order.status === filterStatus).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      console.log('Orders data:', response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // Reload orders to get latest data
      toast({
        title: "Order Status Updated",
        description: `Order status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const generateOrderName = (order) => {
    const date = order.createdAt ? new Date(order.createdAt) : new Date();
    const formattedDate = format(date, 'yyyyMMdd');
    const customerInfo = order.customerInfo || {};
    const firstName = customerInfo.firstName || 'X';
    const lastName = customerInfo.lastName || 'X';
    const customerInitials = `${firstName[0]}${lastName[0]}`.toUpperCase();
    // Get the main product name (first item)
    const mainProduct = order.items && order.items.length > 0 ? order.items[0].name : '';
    return `CSH-${formattedDate}-${customerInitials}${mainProduct ? ' - ' + mainProduct : ''}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'completed': return <Check className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-primary">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchOrders} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/20 rounded-lg w-fit">
        {['pending', 'processing', 'completed'].map((status) => {
          const count = orders.filter(o => o.status === status).length;
          const isActive = filterStatus === status;
          return (
            <Button
              key={status}
              variant={isActive ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className={`capitalize ${isActive ? 'shadow-sm' : 'hover:bg-muted/50'}`}
            >
              <span className="mr-2">{status}</span>
              <Badge variant={isActive ? "secondary" : "outline"} className="ml-auto text-xs py-0 h-5">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {
        filteredOrders.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <div className="mx-auto bg-muted/50 rounded-full h-12 w-12 flex items-center justify-center mb-4">
              {filterStatus === 'pending' && <Clock className="h-6 w-6 text-muted-foreground" />}
              {filterStatus === 'processing' && <Package className="h-6 w-6 text-muted-foreground" />}
              {filterStatus === 'completed' && <Check className="h-6 w-6 text-muted-foreground" />}
            </div>
            <h3 className="text-lg font-medium text-foreground">No {filterStatus} orders</h3>
            <p className="text-muted-foreground mt-1">
              There are no orders currently in the {filterStatus} state.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order._id || order.id} className="overflow-hidden">
                <div
                  className="p-6 cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors"
                  onClick={() => toggleOrderDetails(order._id || order.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary rounded-full p-2 text-primary-foreground">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{generateOrderName(order)}</h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {format(new Date(order.createdAt), 'PPP')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`flex items-center gap-1 px-3 py-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <span className="text-lg font-bold">LKR {order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order summary - preview */}
                  <div className="flex items-center mt-3">
                    <span className="text-sm font-medium">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} ordered
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-muted-foreground truncate max-w-md">
                      {order.items.map(item => item.name).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Extended order details */}
                {expandedOrder === (order._id || order.id) && (
                  <div className="border-t border-border p-6 bg-muted/10">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Customer Information */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          Customer Information
                        </h4>
                        <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Full Name</p>
                              <p className="font-medium">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="font-medium">{order.customerInfo?.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="font-medium">{order.customerInfo?.phone}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Country</p>
                              <p className="font-medium">{order.customerInfo?.country}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">Shipping Address</p>
                            <p className="font-medium">
                              {order.customerInfo?.address}, {order.customerInfo?.city}, {order.customerInfo?.postalCode}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Status Management */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          Order Management
                        </h4>
                        <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                          <p className="text-sm mb-3">Change order status:</p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant={order.status === 'pending' ? 'default' : 'outline'}
                              onClick={() => handleStatusUpdate(order._id || order.id, 'pending')}
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Clock className="h-4 w-4" />
                              Pending
                            </Button>
                            <Button
                              variant={order.status === 'processing' ? 'default' : 'outline'}
                              onClick={() => handleStatusUpdate(order._id || order.id, 'processing')}
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Package className="h-4 w-4" />
                              Processing
                            </Button>
                            <Button
                              variant={order.status === 'completed' ? 'default' : 'outline'}
                              onClick={() => handleStatusUpdate(order._id || order.id, 'completed')}
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Check className="h-4 w-4" />
                              Completed
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-8">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Order Items
                      </h4>
                      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50 text-left">
                            <tr>
                              <th className="px-4 py-3 font-medium">Product</th>
                              <th className="px-4 py-3 font-medium">Unit Price</th>
                              <th className="px-4 py-3 font-medium">Quantity</th>
                              <th className="px-4 py-3 font-medium text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr
                                key={`${order._id || order.id}-item-${index}`}
                                className="border-b border-gray-100 last:border-none"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    {item.productDetails?.imageUrl && (
                                      <div className="h-16 w-16 mr-3 rounded overflow-hidden border border-gray-100">
                                        <img
                                          src={item.productDetails.imageUrl}
                                          alt={item.name}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-medium">
                                        {item.name}
                                        {item.productId && item.productId.category && (
                                          <span className="text-xs text-muted-foreground ml-2">({item.productId.category})</span>
                                        )}
                                      </p>
                                      {/* Show the product details */}
                                      {item.productId && (
                                        <>
                                          {item.productId.weight && (
                                            <p className="text-xs text-muted-foreground">
                                              Weight: {item.productId.weight}
                                            </p>
                                          )}
                                          {item.productId.stock !== undefined && (
                                            <p className={`text-xs ${item.productId.stock < 5 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                                              Current stock: {item.productId.stock} {item.productId.stock < 5 ? '(Low)' : ''}
                                            </p>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">LKR {item.price.toFixed(2)}</td>
                                <td className="px-4 py-3">{item.quantity}</td>
                                <td className="px-4 py-3 text-right font-medium">LKR {(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-muted/50">
                            <tr>
                              <td colSpan="3" className="px-4 py-3 font-medium text-right">
                                Total:
                              </td>
                              <td className="px-4 py-3 font-bold text-right">
                                LKR {order.total.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      }
    </motion.div >
  );
};

export default AdminOrders;
