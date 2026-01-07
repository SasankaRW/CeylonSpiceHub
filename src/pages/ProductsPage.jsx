
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ProductCard from '@/components/ProductCard';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { Search, Filter, X } from 'lucide-react';
import { getProducts } from '@/api/index';
import { useToast } from '@/components/ui/use-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        const productArray = Array.isArray(data) ? data : [];
        setProducts(productArray);

        // Calculate max price from products
        if (productArray.length > 0) {
          const max = Math.max(...productArray.map(p => p.price || 0));
          setMaxPrice(Math.ceil(max / 100) * 100); // Round up to nearest 100
          setPriceRange([0, Math.ceil(max / 100) * 100]);
        }
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

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Get subcategories for selected category
  const availableSubCategories = selectedCategory === 'all'
    ? [...new Set(products.map(p => p.subCategory).filter(Boolean))]
    : [...new Set(products.filter(p => p.category === selectedCategory).map(p => p.subCategory).filter(Boolean))];

  // Toggle subcategory selection
  const toggleSubCategory = (subCat) => {
    setSelectedSubCategories(prev =>
      prev.includes(subCat)
        ? prev.filter(s => s !== subCat)
        : [...prev, subCat]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubCategories([]);
    setPriceRange([0, maxPrice]);
    setSearchTerm('');
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSubCategory = selectedSubCategories.length === 0 || selectedSubCategories.includes(product.subCategory);
    const matchesPrice = (product.price || 0) >= priceRange[0] && (product.price || 0) <= priceRange[1];

    return matchesSearch && matchesCategory && matchesSubCategory && matchesPrice;
  });

  const FilterSidebar = () => (
    <Card className="p-6 sticky top-24 h-fit shadow-soft border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary font-serif">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <Label className="text-base font-semibold mb-3 block">Category</Label>
        <div className="space-y-2">
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedSubCategories([]); // Reset subcategories when changing category
              }}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
                }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {category === 'all' ? 'All Products' : category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Subcategory Filter */}
      {availableSubCategories.length > 0 && (
        <div className="mb-6">
          <Label className="text-base font-semibold mb-3 block">Subcategory</Label>
          <div className="space-y-2">
            {availableSubCategories.map(subCat => (
              <label
                key={subCat}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted px-3 py-2 rounded-md transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSubCategories.includes(subCat)}
                  onChange={() => toggleSubCategory(subCat)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm">{subCat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="mb-6">
        <Label className="text-base font-semibold mb-3 block">
          Price Range: LKR {priceRange[0]} - LKR {priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={maxPrice}
          step={100}
          className="mt-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>LKR 0</span>
          <span>LKR {maxPrice}</span>
        </div>
      </div>

      {/* Active Filters Count */}
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-primary mb-4 font-serif">Shop</h1>
        <p className="text-lg text-muted-foreground">
          Discover our authentic collection of Ceylon spices and artisanal products
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full"
          variant="outline"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Main Content - Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {/* Sidebar - Mobile (Collapsible) */}
        {showMobileFilters && (
          <div className="lg:hidden col-span-1">
            <FilterSidebar />
          </div>
        )}

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id || product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-lg text-muted-foreground mb-4">
                No products found matching your criteria.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
