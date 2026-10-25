import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodImage } from '../common/FoodImage';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTaxes,
    cartPackagingFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActivePage
  } = useApp();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#FF7518]" />
              <h2 className="text-lg font-extrabold tracking-tight">Your Cart</h2>
              <span className="text-xs bg-[#FF7518] text-white px-2 py-0.5 rounded-full font-bold">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 bg-orange-50 text-[#FF7518] rounded-full mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-800">Your cart is empty</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                    Delicious biryanis, hot pizzas, and juicy burgers are waiting for you!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('menu');
                  }}
                  className="px-6 py-2.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-full shadow transition-all"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex gap-3.5 items-center"
                    >
                      {/* Dish Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                        <FoodImage
                          src={item.foodItem.image}
                          alt={item.foodItem.name}
                          category={item.foodItem.category}
                        />
                      </div>

                      {/* Info & Customization */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-bold text-neutral-900 truncate">
                            {item.foodItem.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-neutral-400 hover:text-red-500 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.customization?.portionSize && (
                          <p className="text-[11px] text-neutral-500">
                            {item.customization.portionSize}
                          </p>
                        )}

                        {item.customization?.selectedAddOns && item.customization.selectedAddOns.length > 0 && (
                          <p className="text-[10px] text-neutral-400 truncate">
                            +{item.customization.selectedAddOns.join(', ')}
                          </p>
                        )}

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-extrabold text-[#191919]">
                            ₹{item.unitPrice * item.quantity}
                          </span>

                          <div className="flex items-center bg-white border border-neutral-200 rounded-full px-2 py-0.5 shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="text-neutral-500 hover:text-[#FF7518] p-0.5"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-neutral-500 hover:text-[#FF7518] p-0.5"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart link */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={clearCart}
                    className="text-xs text-neutral-400 hover:text-red-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Coupon Code Section */}
                <div className="pt-2 border-t border-neutral-100">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="w-full pl-8 pr-3 py-2 text-xs uppercase font-medium bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Active Coupon Banner */}
                  {appliedCoupon && (
                    <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-emerald-700 tracking-wide">
                          {appliedCoupon.code}
                        </span>
                        <span>• You saved ₹{cartDiscount}!</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:underline text-[11px] font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Suggested Coupon Chips */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-neutral-400">Available:</span>
                    <button
                      onClick={() => applyCoupon('TASTE30')}
                      className="text-[10px] bg-orange-50 text-[#FF7518] border border-orange-200 px-2 py-0.5 rounded-full font-bold hover:bg-orange-100"
                    >
                      TASTE30 (30% OFF)
                    </button>
                    <button
                      onClick={() => applyCoupon('FREEDEL')}
                      className="text-[10px] bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-full font-medium hover:bg-neutral-200"
                    >
                      FREEDEL
                    </button>
                  </div>
                </div>

                {/* Free Delivery Tracker */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-xs">
                  {cartSubtotal >= 299 ? (
                    <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Congratulations! You unlocked FREE Delivery.</span>
                    </div>
                  ) : (
                    <p className="text-amber-800">
                      Add <strong className="text-[#FF7518]">₹{299 - cartSubtotal}</strong> more to unlock <strong>FREE Delivery</strong>!
                    </p>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-800">₹{cartSubtotal}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Coupon Discount</span>
                      <span>-₹{cartDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      {cartDeliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `₹${cartDeliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging Charge</span>
                    <span>₹{cartPackagingFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Government Taxes (GST 5%)</span>
                    <span>₹{cartTaxes}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-extrabold text-neutral-900">
                    <span>Grand Total</span>
                    <span className="text-base text-[#FF7518]">₹{cartTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50 space-y-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-[#FF7518] hover:bg-[#e0630d] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-between px-5 transition-all group active:scale-[0.99]"
              >
                <div className="text-left">
                  <div className="text-[11px] text-white/80 font-normal">TOTAL TO PAY</div>
                  <div className="text-base font-extrabold">₹{cartTotal}</div>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
