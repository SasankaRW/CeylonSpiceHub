import axios from 'axios';
import { getAuthToken } from '@/lib/auth';

// Create axios instance with relative URL to use Vite's proxy
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Products API
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    // Ensure we always return an array
    const data = response.data;
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array instead of throwing to prevent crashes
    if (error.response?.status === 404) {
      console.warn('Products endpoint not found, returning empty array');
      return [];
    }
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get('/products/featured');
    const data = response.data;
    // Ensure we always return an array
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data for featured products:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/products/category/${category}`);
    const data = response.data;
    // Ensure we always return an array
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data for category products:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

// Orders API
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    throw error;
  }
};

// Admin stats API
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/orders/stats/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Categories API
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Sliders API
export const getSliders = async () => {
  try {
    const response = await api.get('/sliders');
    return response.data;
  } catch (error) {
    console.error('Error fetching sliders:', error);
    throw error;
  }
};

export default api;
