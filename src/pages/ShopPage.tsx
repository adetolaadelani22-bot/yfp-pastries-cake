import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ShoppingBag, X, Check } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/formatters';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  initialCategory = 'All',
  onSelectProduct,
  onEditProduct
}) => {
  const { itemCount, totalAmount, setIsCartOpen, lastAddedNotification } = useCart();
  const [isRecentAdd, setIsRecentAdd] = useState(false);

  useEffect(() => {
    if (!lastAddedNotification) return;
    setIsRecentAdd(true);
    const timer = setTimeout(() => {
      setIsRecentAdd(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, [lastAddedNotification?.timestamp]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'popular' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const categoryList = useMemo(() => {
    return ['All', ...categories.map(c => c.name)];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category match
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesIngredient = p.ingredients.some(i => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesIngredient) return false;
      }
      // Price filter
      if (p.price > maxPrice) return false;
      // In stock filter
      if (inStockOnly && p.availability === 'out_of_stock') return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
      {/* Title & Search / Filter Controls matching the reference UI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#181310] tracking-tight">
            Shop Bakery Menu
          </h1>
          <p className="text-xs text-[#7A6A59]">
            Showing {filteredProducts.length} delicious handmade pastries & cakes
          </p>
        </div>

        {/* Search Input & Filter Button */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search pastries, cakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#DDD5C7] rounded-xl pl-9 pr-8 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`p-2 rounded-xl border flex items-center space-x-1.5 text-xs font-semibold shadow-xs transition-colors ${
              filterDrawerOpen
                ? 'bg-[#181310] text-[#DEB346] border-[#181310]'
                : 'bg-white text-gray-700 border-[#DDD5C7] hover:border-[#DEB346]'
            }`}
            title="Filter and sort"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Category Pills Slider - Matching Reference */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categoryList.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-[#181310] text-[#DEB346] shadow-md'
                  : 'bg-white text-[#5E4E40] border border-[#E5DAC8] hover:border-[#C4A984]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Expandable Filter & Sorting Drawer */}
      {filterDrawerOpen && (
        <div className="bg-white p-5 rounded-2xl border border-[#DDD5C7] shadow-lg mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs animate-in fade-in duration-200">
          {/* Sorting */}
          <div>
            <label className="block uppercase font-bold text-gray-600 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 font-medium text-gray-800 focus:outline-none focus:border-[#DEB346]"
            >
              <option value="featured">Featured First</option>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="uppercase font-bold text-gray-600">Max Price</label>
              <span className="font-extrabold text-[#A68322]">{formatNaira(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#DEB346]"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>₦500</span>
              <span>₦50,000</span>
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="flex flex-col justify-center space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-[#DEB346] rounded focus:ring-0"
              />
              <span className="font-medium text-gray-700">In-Stock Only</span>
            </label>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setMaxPrice(50000);
                setInStockOnly(false);
                setSortBy('featured');
              }}
              className="text-xs text-rose-600 hover:underline text-left font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#EDE5D8]">
          <ShoppingBag className="w-12 h-12 text-[#C9B9A6] mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-gray-800">No baked items match your search</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filter settings to browse our delicious catalog.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setMaxPrice(50000);
              setInStockOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-[#181310] text-[#DEB346] text-xs font-bold rounded-full"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onEditProduct={onEditProduct}
            />
          ))}
        </div>
      )}

      {/* STICKY BOTTOM CART BAR - Matching UI Reference */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-30">
          <button
            id="shop-view-cart-bar"
            onClick={() => setIsCartOpen(true)}
            className={`w-full bg-[#181310] hover:bg-[#261E17] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
              isRecentAdd ? 'border-[#DEB346] ring-2 ring-[#DEB346]/50' : 'border-[#DEB346]/40'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                {isRecentAdd && (
                  <span className="absolute -inset-1 rounded-full bg-[#DEB346] opacity-75 animate-ping pointer-events-none" />
                )}
                <motion.div
                  key={`shop-badge-${itemCount}-${lastAddedNotification?.timestamp || 0}`}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: [1.3, 0.9, 1.1, 1] }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="w-8 h-8 rounded-full bg-[#DEB346] text-[#181310] font-black text-xs flex items-center justify-center relative z-10"
                >
                  {itemCount}
                </motion.div>
              </div>
              <div className="text-left">
                <span className="font-serif font-bold text-sm tracking-wide block">
                  View Cart ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
                </span>
                {isRecentAdd && lastAddedNotification && (
                  <span className="text-[11px] text-[#DEB346] font-medium flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse mr-1" />
                    +{lastAddedNotification.quantity} {lastAddedNotification.name} added
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#DEB346] text-sm sm:text-base">
                {formatNaira(totalAmount)}
              </span>
              <motion.div
                animate={isRecentAdd ? { rotate: [0, -14, 14, -8, 8, 0], scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
              </motion.div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
