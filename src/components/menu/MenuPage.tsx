import React, { useState } from 'react';
import { Search, Filter, Star, Heart, Plus, Minus, ArrowUpDown, Clock, Check, Utensils, Store } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, RESTAURANTS } from '../../data/mockData';
import { FoodImage } from '../common/FoodImage';
import { FoodItem } from '../../types';

export const MenuPage: React.FC = () => {
  const {
    dishes,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    favorites,
    toggleFavorite,
    cart,
    addToCart,
    updateQuantity,
    setSelectedFoodForModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dishes' | 'restaurants'>('dishes');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [spicyOnly, setSpicyOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'price-low' | 'price-high'>('popularity');
  const [maxPrice, setMaxPrice] = useState<number>(400);

  // Filter Dishes
  const filteredDishes = dishes.filter((dish) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchCuisine = dish.cuisine.toLowerCase().includes(q);
      const matchDesc = dish.description.toLowerCase().includes(q);
      if (!matchName && !matchCuisine && !matchDesc) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
      return false;
    }

    // Veg Only filter
    if (vegOnly && !dish.isVeg) return false;

    // Spicy Only filter
    if (spicyOnly && !dish.isSpicy) return false;

    // Price filter
    if (dish.price > maxPrice) return false;

    return true;
  });

  // Sort Dishes
  const sortedDishes = [...filteredDishes].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return b.reviewsCount - a.reviewsCount; // popularity
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-16">
      {/* Page Title & Search Bar Header */}
      <div className="bg-[#111111] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#FF7518] uppercase tracking-wider">
                EXPLORE & DISCOVER
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                TasteHub Menu & Kitchens
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg">
                Freshly cooked gourmet delicacies from authentic handi biryanis to artisan sourdough pizzas.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish or cuisine..."
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-full text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#FF7518]"
              />
            </div>
          </div>

          {/* Tab selector: Dishes vs Restaurants */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-neutral-800">
            <button
              onClick={() => setActiveTab('dishes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'dishes'
                  ? 'bg-[#FF7518] text-white shadow-md'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>All Dishes ({sortedDishes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'restaurants'
                  ? 'bg-[#FF7518] text-white shadow-md'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Partner Restaurants ({RESTAURANTS.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Category Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        {activeTab === 'dishes' && (
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4 my-6">
            <div className="flex flex-wrap items-center gap-3">
              {/* Veg Only Toggle */}
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  vegOnly
                    ? 'bg-green-50 border-green-600 text-green-700 ring-1 ring-green-600'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
                <span>Veg Only</span>
              </button>

              {/* Spicy Filter */}
              <button
                onClick={() => setSpicyOnly(!spicyOnly)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  spicyOnly
                    ? 'bg-red-50 border-red-600 text-red-700 ring-1 ring-red-600'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <span>🌶️ Spicy</span>
              </button>

              {/* Price Range Slider */}
              <div className="flex items-center gap-2 text-xs text-neutral-600 pl-2 border-l border-neutral-200">
                <span>Max: <strong>₹{maxPrice}</strong></span>
                <input
                  type="range"
                  min="100"
                  max="400"
                  step="20"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 accent-[#FF7518]"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#FF7518]"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Content View: Dishes Grid */}
        {activeTab === 'dishes' ? (
          <div>
            {sortedDishes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
                <div className="w-16 h-16 bg-orange-50 text-[#FF7518] rounded-full mx-auto flex items-center justify-center text-2xl">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-neutral-900">No dishes match your filters</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try clearing some filters or searching for something else like "Biryani" or "Pizza".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setVegOnly(false);
                    setSpicyOnly(false);
                    setMaxPrice(400);
                  }}
                  className="px-5 py-2 bg-[#FF7518] text-white text-xs font-bold rounded-full"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedDishes.map((dish) => {
                  const isFav = favorites.includes(dish.id);
                  const inCartItems = cart.filter((c) => c.foodItem.id === dish.id);
                  const totalQty = inCartItems.reduce((acc, curr) => acc + curr.quantity, 0);

                  return (
                    <div
                      key={dish.id}
                      className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group overflow-hidden"
                    >
                      {/* Image */}
                      <div
                        onClick={() => setSelectedFoodForModal(dish)}
                        className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 cursor-pointer"
                      >
                        <FoodImage
                          src={dish.image}
                          alt={dish.name}
                          category={dish.category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                        {/* Veg/Non-Veg */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1 rounded-sm shadow">
                          <div
                            className={`w-3.5 h-3.5 border flex items-center justify-center ${
                              dish.isVeg ? 'border-green-600' : 'border-red-600'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                dish.isVeg ? 'bg-green-600' : 'bg-red-600'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Favorite button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(dish.id);
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? 'fill-red-500 text-red-500' : 'text-white'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h3
                            onClick={() => setSelectedFoodForModal(dish)}
                            className="text-base font-bold text-[#191919] group-hover:text-[#FF7518] transition-colors line-clamp-1 cursor-pointer"
                          >
                            {dish.name}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                            {dish.description}
                          </p>

                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <div className="flex items-center gap-1 font-bold text-neutral-800">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{dish.rating}</span>
                            </div>
                            <span className="text-neutral-300">·</span>
                            <span className="text-neutral-500 text-[11px] flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {dish.prepTimeMinutes}m
                            </span>
                          </div>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-neutral-100">
                          <span className="text-base font-extrabold text-[#191919]">
                            ₹{dish.price}
                          </span>

                          {totalQty > 0 ? (
                            <div className="flex items-center bg-orange-50 border border-[#FF7518] rounded-full px-2 py-0.5 shadow-sm">
                              <button
                                onClick={() => {
                                  if (inCartItems[0]) {
                                    updateQuantity(inCartItems[0].cartItemId, inCartItems[0].quantity - 1);
                                  }
                                }}
                                className="w-5 h-5 flex items-center justify-center text-[#FF7518] hover:bg-orange-100 rounded-full"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-[#FF7518]">
                                {totalQty}
                              </span>
                              <button
                                onClick={() => {
                                  if (inCartItems[0]) {
                                    updateQuantity(inCartItems[0].cartItemId, inCartItems[0].quantity + 1);
                                  } else {
                                    addToCart(dish);
                                  }
                                }}
                                className="w-5 h-5 flex items-center justify-center text-[#FF7518] hover:bg-orange-100 rounded-full"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(dish)}
                              className="px-4 py-1.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-full shadow-sm transition-all flex items-center gap-1 active:scale-95"
                            >
                              <span>Add</span>
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Restaurants Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESTAURANTS.map((rest) => (
              <div
                key={rest.id}
                className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative h-44 w-full bg-neutral-900 overflow-hidden">
                  <img
                    src={rest.image}
                    alt={rest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-neutral-900 flex items-center gap-1 shadow">
                    <span>{rest.logo}</span>
                    <span>{rest.isOpen ? 'Open Now' : 'Closed'}</span>
                  </div>
                  {rest.featuredOffer && (
                    <div className="absolute bottom-3 left-3 bg-[#FF7518] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      {rest.featuredOffer}
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">{rest.name}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">{rest.cuisine.join(' • ')}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl text-xs font-bold border border-emerald-200">
                      <Star className="w-3 h-3 fill-emerald-600" />
                      <span>{rest.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FF7518]" /> {rest.deliveryTimeMinutes} mins
                    </span>
                    <span>
                      {rest.deliveryFee === 0 ? (
                        <strong className="text-emerald-600">Free Delivery</strong>
                      ) : (
                        `₹${rest.deliveryFee} delivery`
                      )}
                    </span>
                    <span>Min order ₹{rest.minOrder}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategory(rest.cuisine[0]?.toLowerCase() || 'all');
                      setActiveTab('dishes');
                    }}
                    className="w-full py-2.5 mt-2 bg-neutral-900 hover:bg-[#FF7518] text-white text-xs font-bold rounded-xl transition-colors text-center"
                  >
                    View Restaurant Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
