
import { v4 as uuidv4 } from 'uuid';

// Order management
const getOrders = () => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

export const createOrder = (cartItems, customerInfo) => {
  const orders = getOrders();
  const newOrder = {
    id: uuidv4(),
    items: cartItems,
    customerInfo,
    status: 'pending',
    total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  return newOrder;
};

export const updateOrderStatus = (orderId, status) => {
  const orders = getOrders();
  const updatedOrders = orders.map(order =>
    order.id === orderId ? { ...order, status } : order
  );
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
};

export const getAllOrders = () => getOrders();

export const getOrderById = (orderId) => {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
};

export const getOrderStats = () => {
  const orders = getOrders();
  return {
    total: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    completed: orders.filter(order => order.status === 'completed').length,
    totalRevenue: orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0)
  };
};
