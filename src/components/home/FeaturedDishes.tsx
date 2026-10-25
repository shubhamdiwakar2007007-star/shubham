import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, Plus, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodItem } from '../../types';
import { FoodImage } from '../common/FoodImage';

export const FeaturedDishes: React.FC = () => {
  const {
    dishes,
    selectedCategory,
    favorites,
    toggleFavorite,
    cart,
    addToCart,
    updateQuantity,
    setSelectedFoodForModal,
    setActivePage
  } = useApp();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter based on active category if selected (or show all featured if 'all')
  const filteredDishes = dishes.filter((dish) => {
    if (selectedCategory === 'all') return true;
    return dish.category === selectedCategory;
  });

  // Ensure at least the 5 primary showcase dishes are front and center
  const displayDishes = filteredDishes.length > 0 ? filteredDishes : dishes;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="featured-dishes" className="bg-white py-12 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191919] tracking-tight">
              Featured Dishes
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Handpicked favorites just for you.
            </p>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button
              onClick={() => setActivePage('menu')}
              className="text-sm font-semibold text-[#191919] hover:text-[#FF7518] transition-colors"
            >
              View All
            </button>

            {/* Carousel navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                aria-label="Scroll left"
                className="w-8 h-8 rounded-full border border-neutral-200 hover:border-neutral-400 bg-white flex items-center justify-center text-neutral-600 hover:text-black transition-all shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                aria-label="Scroll right"
                className="w-8 h-8 rounded-full border border-neutral-200 hover:border-neutral-400 bg-white flex items-center justify-center text-neutral-600 hover:text-black transition-all shadow-sm active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 5-Card Responsive Carousel / Grid */}
        <div
          ref={scrollContainerRef}
          className="flex lg:grid lg:grid-cols-5 gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
        >
          {displayDishes.slice(0, 10).map((dish) => {
            const isFav = favorites.includes(dish.id);
            // Check if this item is in cart
            const inCartItems = cart.filter((c) => c.foodItem.id === dish.id);
            const totalQtyInCart = inCartItems.reduce((acc, curr) => acc + curr.quantity, 0);

            return (
              <div
                key={dish.id}
                className="w-64 sm:w-72 lg:w-auto shrink-0 snap-start bg-white rounded-2xl border border-neutral-100/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group overflow-hidden"
              >
                {/* Food Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 cursor-pointer"
                  onClick={() => setSelectedFoodForModal(dish)}
                >
                  <FoodImage
                    src={dish.image}
                    alt={dish.name}
                    category={dish.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Scrim for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                  {/* Veg / Non-Veg Indicator Dot */}
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

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(dish.id);
                    }}
                    aria-label={`Save ${dish.name} to favorites`}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Dish Title */}
                    <h3
                      onClick={() => setSelectedFoodForModal(dish)}
                      className="text-base font-bold text-[#191919] group-hover:text-[#FF7518] transition-colors line-clamp-1 cursor-pointer"
                    >
                      {dish.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      {dish.description}
                    </p>

                    {/* Star Rating and Reviews count */}
                    <div className="flex items-center gap-1.5 mt-2 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-neutral-800">{dish.rating}</span>
                      <span className="text-neutral-400">({dish.reviewsCount > 999 ? `${(dish.reviewsCount / 1000).toFixed(1)}k` : dish.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Price and Add button */}
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-neutral-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-[#191919]">
                        ₹{dish.price}
                      </span>
                      {dish.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          ₹{dish.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart button / Quantity Stepper */}
                    {totalQtyInCart > 0 ? (
                      <div className="flex items-center bg-orange-50 border border-[#FF7518] rounded-full px-2 py-1 shadow-sm">
                        <button
                          type="button"
                          onClick={() => {
                            if (inCartItems[0]) {
                              updateQuantity(inCartItems[0].cartItemId, inCartItems[0].quantity - 1);
                            }
                          }}
                          className="w-5 h-5 flex items-center justify-center text-[#FF7518] hover:bg-orange-100 rounded-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#FF7518]">
                          {totalQtyInCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (inCartItems[0]) {
                              updateQuantity(inCartItems[0].cartItemId, inCartItems[0].quantity + 1);
                            } else {
                              addToCart(dish);
                            }
                          }}
                          className="w-5 h-5 flex items-center justify-center text-[#FF7518] hover:bg-orange-100 rounded-full"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(dish)}
                        className="px-4 py-1.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-full shadow-sm hover:shadow-orange-500/20 transition-all flex items-center gap-1 active:scale-95"
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
      </div>
    </section>
  );
};
