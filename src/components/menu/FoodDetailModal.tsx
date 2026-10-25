import React, { useState, useEffect } from 'react';
import { X, Star, Heart, Clock, Flame, ShieldAlert, Check, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodImage } from '../common/FoodImage';

export const FoodDetailModal: React.FC = () => {
  const {
    selectedFoodForModal,
    setSelectedFoodForModal,
    addToCart,
    favorites,
    toggleFavorite
  } = useApp();

  const [selectedPortion, setSelectedPortion] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Hot' | 'Extra Hot'>('Medium');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (selectedFoodForModal) {
      setSelectedPortion(selectedFoodForModal.portionSizes?.[0]?.name || 'Regular');
      setSelectedAddOns([]);
      setSpiceLevel(selectedFoodForModal.isSpicy ? 'Hot' : 'Medium');
      setSpecialNotes('');
      setQuantity(1);
    }
  }, [selectedFoodForModal]);

  if (!selectedFoodForModal) return null;

  const dish = selectedFoodForModal;
  const isFav = favorites.includes(dish.id);

  // Dynamic price calculation
  let basePrice = dish.price;
  if (dish.portionSizes) {
    const p = dish.portionSizes.find((ps) => ps.name === selectedPortion);
    if (p) basePrice = Math.round(dish.price * p.priceMultiplier);
  }

  let addOnsTotal = 0;
  if (dish.addOns) {
    selectedAddOns.forEach((addonName) => {
      const found = dish.addOns?.find((a) => a.name === addonName);
      if (found) addOnsTotal += found.price;
    });
  }

  const unitTotal = basePrice + addOnsTotal;
  const totalPrice = unitTotal * quantity;

  const handleAddOnToggle = (addonName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonName) ? prev.filter((a) => a !== addonName) : [...prev, addonName]
    );
  };

  const handleAddToCart = () => {
    addToCart(
      dish,
      {
        portionSize: selectedPortion,
        selectedAddOns,
        spiceLevel,
        specialInstructions: specialNotes.trim() || undefined
      },
      quantity
    );
    setSelectedFoodForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedFoodForModal(null)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-scaleUp">
          {/* Close button */}
          <button
            onClick={() => setSelectedFoodForModal(null)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Large Image Header */}
          <div className="relative h-64 sm:h-72 w-full bg-neutral-900">
            <FoodImage
              src={dish.image}
              alt={dish.name}
              category={dish.category}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(dish.id)}
              className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>

            {/* Badges on Bottom of Image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="bg-[#FF7518] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {dish.badge || dish.category}
                </span>
                {dish.prepTimeMinutes && (
                  <span className="bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {dish.prepTimeMinutes} mins
                  </span>
                )}
                {dish.calories && (
                  <span className="bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    {dish.calories} kcal
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
            {/* Title & Rating */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#191919]">{dish.name}</h2>
                  <p className="text-xs font-medium text-neutral-500 mt-0.5">{dish.cuisine}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-xs font-bold text-amber-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{dish.rating}</span>
                  <span className="text-neutral-400">({dish.reviewsCount})</span>
                </div>
              </div>

              <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
                {dish.longDescription || dish.description}
              </p>
            </div>

            {/* Portion Sizes Selector */}
            {dish.portionSizes && dish.portionSizes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                  Select Portion Size
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {dish.portionSizes.map((portion) => {
                    const isSelected = selectedPortion === portion.name;
                    const portionPrice = Math.round(dish.price * portion.priceMultiplier);
                    return (
                      <button
                        key={portion.name}
                        onClick={() => setSelectedPortion(portion.name)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#FF7518] bg-orange-50/50 ring-1 ring-[#FF7518]'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900">{portion.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FF7518]" />}
                        </div>
                        <span className="text-xs font-extrabold text-[#FF7518] mt-1 block">
                          ₹{portionPrice}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Spice Level Selector */}
            {dish.isSpicy && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Spice Level
                </h4>
                <div className="flex items-center gap-2">
                  {(['Mild', 'Medium', 'Hot', 'Extra Hot'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSpiceLevel(level)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        spiceLevel === level
                          ? 'border-[#FF7518] bg-[#FF7518] text-white shadow-sm'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons and Extras */}
            {dish.addOns && dish.addOns.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                  Custom Add-ons & Accompaniments
                </h4>
                <div className="space-y-2">
                  {dish.addOns.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.name);
                    return (
                      <label
                        key={addon.name}
                        onClick={() => handleAddOnToggle(addon.name)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#FF7518] bg-orange-50/40'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="rounded text-[#FF7518] focus:ring-[#FF7518] w-4 h-4"
                          />
                          <span className="text-xs font-medium text-neutral-800">{addon.name}</span>
                        </div>
                        <span className="text-xs font-bold text-neutral-700">+₹{addon.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Special Cooking Instructions
              </h4>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="E.g. Less oil, extra cutlery, keep spicy sauce separate..."
                rows={2}
                className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518] bg-neutral-50/60"
              />
            </div>

            {/* Allergen & Ingredients Notice */}
            {dish.allergens && dish.allergens.length > 0 && (
              <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Allergen Notice: </span>
                  <span>Contains {dish.allergens.join(', ')}. Please inform the kitchen in special notes if you have severe dietary allergies.</span>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer CTA with Quantity & Add to Cart */}
          <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-white border border-neutral-200 rounded-2xl px-3 py-1.5 shadow-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-[#FF7518]"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm font-extrabold text-neutral-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-[#FF7518]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-[#FF7518] hover:bg-[#e0630d] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-between px-6 transition-all active:scale-[0.99]"
            >
              <span className="flex items-center gap-2 text-sm">
                <ShoppingBag className="w-4 h-4" />
                Add Item to Cart
              </span>
              <span className="text-base font-extrabold">₹{totalPrice}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
