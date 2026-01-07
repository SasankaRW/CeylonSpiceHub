
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';
import api from '@/api/index';
import { useToast } from '@/components/ui/use-toast';

const OurProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        // Ensure data is always an array
        const data = response.data;
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Set empty array on error
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Ensure products is always an array before filtering
  const filteredProducts = (Array.isArray(products) ? products : []).filter(product => {
    const matchesSearch = (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Sauces', name: 'Sauces' },
    { id: 'Chutney', name: 'Chutney' },
    { id: 'Jam', name: 'Jam' },
    { id: 'Wines', name: 'Wines' },
    { id: 'Spices', name: 'Spices' }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <img
          src="/logo.png"
          alt="Ceylon Spice Hub Logo"
          className="h-24 w-24 mx-auto mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Products</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our complete collection of authentic Ceylon spices and artisanal delights.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-40 bg-background/95 p-4 rounded-lg shadow-sm backdrop-blur">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap justify-center w-full md:w-auto">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-96 rounded-lg bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
};

export default OurProductsPage;
