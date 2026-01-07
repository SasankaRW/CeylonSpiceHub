import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Package, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import api, { getDashboardStats, getProducts } from '@/api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState({
    labels: [],
    data: []
  });
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const lowStockProducts = (Array.isArray(products) ? products : []).filter(p => p && p.stock < 10);

  useEffect(() => {
    fetchDashboardData();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      // Ensure products is always an array
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set empty array on error
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch order stats
      const statsResponse = await getDashboardStats();
      setStats(statsResponse);

      // Fetch recent orders
      const ordersResponse = await api.get('/orders');
      // Take the 5 most recent orders
      const sortedOrders = ordersResponse.data.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5);
      setRecentOrders(sortedOrders);

      // Generate fake revenue trend data (to be replaced with real data)
      generateRevenueTrend(ordersResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Generate revenue trend data from orders
  const generateRevenueTrend = (orders) => {
    // Group orders by day and calculate revenue for each day
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const labels = last7Days.map(date => format(date, 'MMM dd'));

    // Calculate revenue per day
    const data = last7Days.map(date => {
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      return dayRevenue;
    });

    setRevenueTrend({
      labels,
      data
    });
  };

  const cards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: <ShoppingBag className="h-6 w-6" />,
      description: "All time orders"
    },
    {
      title: "Pending Orders",
      value: stats.pending,
      icon: <Clock className="h-6 w-6" />,
      description: "Awaiting processing"
    },
    {
      title: "Total Revenue",
      value: `LKR ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="h-6 w-6" />,
      description: "Total earnings"
    },
    {
      title: "Low Stock Items",
      value: lowStockProducts.length,
      icon: <Package className="h-6 w-6" />,
      description: "Products below 10 units"
    }
  ];

  const generateOrderName = (order) => {
    const date = order.createdAt ? new Date(order.createdAt) : new Date();
    const formattedDate = format(date, 'yyyyMMdd');
    const customerInfo = order.customerInfo || {};
    const firstName = customerInfo.firstName || 'X';
    const lastName = customerInfo.lastName || 'X';
    const customerInitials = `${firstName[0]}${lastName[0]}`.toUpperCase();
    return `CSH-${formattedDate}-${customerInitials}`;
  };

  // Revenue chart data
  const revenueChartData = {
    labels: revenueTrend.labels,
    datasets: [
      {
        label: 'Daily Revenue (LKR)',
        data: revenueTrend.data,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Revenue (LKR) - Last 7 Days',
      },
    },
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>
        <Button onClick={fetchDashboardData}>Refresh Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar options={chartOptions} data={revenueChartData} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order._id || order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{generateOrderName(order)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <span className="font-medium">LKR {order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
