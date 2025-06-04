import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import WeArePage from '@/pages/WeArePage';
import OurProductsPage from '@/pages/OurProductsPage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailsPage from '@/pages/ProductDetailsPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmation from '@/pages/OrderConfirmation';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import LoginPage from '@/pages/admin/LoginPage';
import AccomplishmentsPage from '@/pages/AccomplishmentsPage';
import GalleryBlogPage from '@/pages/GalleryBlogPage';
import ContactUsPage from '@/pages/ContactUsPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/we-are" element={<WeArePage />} />
          <Route path="/our-products" element={<OurProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path="/accomplishments" element={<AccomplishmentsPage />} />
          <Route path="/gallery-blog" element={<GalleryBlogPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
