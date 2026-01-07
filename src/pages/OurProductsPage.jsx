
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ChevronDown, ChevronRight, Package } from 'lucide-react';
import api from '@/api/index';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const OurProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const { toast } = useToast();
  const [catalogRef, catalogInView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        const data = response.data;
        setProducts(Array.isArray(data) ? data : []);

        // Auto-expand all categories initially
        const categories = getCategories(Array.isArray(data) ? data : []);
        const expanded = {};
        categories.forEach(cat => {
          expanded[cat] = true;
        });
        setExpandedCategories(expanded);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
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

  const getCategories = (productList) => {
    const categories = [...new Set(productList.map(p => p.category).filter(Boolean))];
    return categories.sort();
  };

  const getSubCategories = (category, productList) => {
    const subCats = [...new Set(
      productList
        .filter(p => p.category === category)
        .map(p => p.subCategory || 'Other')
    )];
    return subCats.sort();
  };

  const getProductsBySubCategory = (category, subCategory, productList) => {
    return productList.filter(p =>
      p.category === category &&
      (p.subCategory || 'Other') === subCategory
    );
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Category images mapping
  const categoryImages = {
    'Sauces': 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80',
    'Chutney': 'https://images.unsplash.com/photo-1596040033229-a0b3b46fe6f1?w=400&q=80',
    'Jam': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80',
    'Wines': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    'Spices': 'https://images.unsplash.com/photo-1596040033229-a0b3b46fe6f1?w=400&q=80'
  };

  const getCategoryImage = (category) => {
    return categoryImages[category] || 'https://images.unsplash.com/photo-1596040033229-a0b3b46fe6f1';
  };

  const filteredProducts = products.filter(product =>
    (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const categories = getCategories(filteredProducts);

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
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif">Product Catalog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our complete collection organized by categories and subcategories.
        </p>
      </motion.div>

      <div className="sticky top-20 z-40 bg-background/95 p-4 rounded-lg shadow-soft backdrop-blur border border-border/50">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-2 ml-4">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-6 w-60" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          ref={catalogRef}
          initial={{ opacity: 0, y: 20 }}
          animate={catalogInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {categories.map((category, categoryIndex) => {
            const subCategories = getSubCategories(category, filteredProducts);
            const isExpanded = expandedCategories[category];

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card className="overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 border border-border/50">
                  {/* Category Banner Image */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={getCategoryImage(category)}
                      alt={category}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <motion.button
                    onClick={() => toggleCategory(category)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="h-6 w-6 text-primary" />
                      </motion.div>

                      <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-primary font-serif">{category}</h2>
                        <span className="text-sm text-muted-foreground">
                          {filteredProducts.filter(p => p.category === category).length} products
                        </span>
                      </div>
                    </div>
                  </motion.button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-6">
                      {subCategories.map((subCategory, subIndex) => {
                        const subCategoryProducts = getProductsBySubCategory(category, subCategory, filteredProducts);

                        return (
                          <motion.div
                            key={subCategory}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                            className="ml-4 border-l-2 border-primary/20 pl-6"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Package className="h-5 w-5 text-secondary" />
                              <h3 className="text-xl font-semibold text-secondary">
                                {subCategory}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                ({subCategoryProducts.length})
                              </span>
                            </div>
                            <ul className={`space-y-2 ml-7 ${subCategoryProducts.length > 6 ? 'grid grid-cols-1 md:grid-cols-2 gap-x-8' : ''}`}>
                              {subCategoryProducts.map((product, prodIndex) => (
                                <motion.li
                                  key={product._id || product.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: prodIndex * 0.02 }}
                                  className="flex items-center gap-2 group"
                                >
                                  <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-accent group-hover:bg-primary transition-colors"
                                    whileHover={{ scale: 1.5 }}
                                  />
                                  <span className="text-foreground group-hover:text-primary transition-colors">
                                    {product.name}
                                  </span>
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg text-muted-foreground">No products found matching your search.</p>
        </motion.div>
      )}
    </div>
  );
};

export default OurProductsPage;
