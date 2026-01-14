
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



import { useSearchParams } from 'react-router-dom';

// Helper to get effective price for filtering/sorting
const getEffectivePrice = (product) => {
  if (product.price) return product.price;
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map(v => v.price).filter(p => !isNaN(p));
    return prices.length > 0 ? Math.min(...prices) : 0;
  }
  return 0;
};

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
  const [searchParams] = useSearchParams();

  // Initialize state from session storage or URL params
  useEffect(() => {
    // Check URL params first
    const categoryParam = searchParams.get('category');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
      // Clear other state if coming from a direct link, or keep defaults
      setSearchTerm('');
      setSelectedSubCategories([]);
    } else {
      // Fallback to session storage if no URL param
      const savedState = sessionStorage.getItem('shop_state');
      if (savedState) {
        try {
          const { searchTerm, selectedCategory, selectedSubCategories, priceRange } = JSON.parse(savedState);
          if (searchTerm) setSearchTerm(searchTerm);
          if (selectedCategory) setSelectedCategory(selectedCategory);
          if (selectedSubCategories) setSelectedSubCategories(selectedSubCategories);
          if (priceRange) setPriceRange(priceRange);
        } catch (e) {
          console.error("Failed to restore shop state", e);
        }
      }
    }
  }, [searchParams]);

  // Save state to session storage on change
  useEffect(() => {
    const state = {
      searchTerm,
      selectedCategory,
      selectedSubCategories,
      priceRange
    };
    sessionStorage.setItem('shop_state', JSON.stringify(state));
  }, [searchTerm, selectedCategory, selectedSubCategories, priceRange]);

  // Save/Restore Scroll Position
  useEffect(() => {
    // Restore scroll after products load
    if (!loading && products.length > 0) {
      const savedScroll = sessionStorage.getItem('shop_scroll_pos');
      if (savedScroll) {
        // slight delay to allow layout to settle
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll));
        }, 100);
      }
    }

    // Save scroll on unmount (or before unload)
    return () => {
      sessionStorage.setItem('shop_scroll_pos', window.scrollY.toString());
    };
  }, [loading, products.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 1. Check Cache First (Stale-While-Revalidate)
        const cachedData = sessionStorage.getItem('cached_products');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setProducts(parsedData);
          setLoading(false); // Show cached data immediately

          // Calculate max price from cache
          if (parsedData.length > 0) {
            const max = Math.max(...parsedData.map(p => getEffectivePrice(p)));
            setMaxPrice(Math.ceil(max / 100) * 100);
            setPriceRange([0, Math.ceil(max / 100) * 100]);
          }
        } else {
          setLoading(true); // Only show loading if no cache
        }

        // 2. Fetch Fresh Data in Background
        const data = await getProducts();
        const productArray = Array.isArray(data) ? data : [];

        // Update state and cache
        setProducts(productArray);
        sessionStorage.setItem('cached_products', JSON.stringify(productArray));
        if (!cachedData) setLoading(false); // Turn off loading if we didn't have cache

        // Calculate max price from fresh data
        if (productArray.length > 0) {
          const max = Math.max(...productArray.map(p => getEffectivePrice(p)));
          setMaxPrice(Math.ceil(max / 100) * 100);
          setPriceRange([0, Math.ceil(max / 100) * 100]);
        }

        // 3. Preload Images
        productArray.forEach((product) => {
          if (product.imageUrl || product.image) {
            const img = new Image();
            img.src = product.imageUrl || product.image;
          }
        });

      } catch (error) {
        console.error('Error fetching products:', error);
        // Keep cached data if API fails, only error if no cache
        if (!sessionStorage.getItem('cached_products')) {
          setProducts([]);
          toast({
            title: "Error",
            description: "Failed to load products. Please try again later.",
            variant: "destructive"
          });
        }
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
    ? []
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
    const term = searchTerm.toLowerCase().trim();

    const matchesSearch = !term ||
      (product.name?.toLowerCase() || '').includes(term) ||
      (product.description?.toLowerCase() || '').includes(term);

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSubCategory = selectedSubCategories.length === 0 || selectedSubCategories.includes(product.subCategory);

    const productPrice = getEffectivePrice(product);
    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];

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
      {/* Minimal Search Section */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search for spices, sauces..."
            className="pl-12 pr-4 h-12 w-full bg-background shadow-sm border-border focus-visible:ring-1 focus-visible:ring-primary transition-all text-base rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
