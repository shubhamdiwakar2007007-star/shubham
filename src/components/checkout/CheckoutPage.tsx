import React, { useState } from 'react';
import { MapPin, Phone, User, CreditCard, Clock, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, AlertCircle, ShoppingBag, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAddress } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTaxes,
    cartPackagingFee,
    cartTotal,
    appliedCoupon,
    user,
    addAddress,
    placeOrder,
    setActivePage,
    openAuthModal,
    addToast
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses[0]?.id || ''
  );
  const [deliveryOption, setDeliveryOption] = useState<'Standard' | 'Express' | 'Scheduled'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState<string>('rahul@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // New Address form modal/toggle
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    landmark: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    postalCode: '302015',
    type: 'Home' as const
  });

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-neutral-200 text-center max-w-md w-full shadow-sm space-y-4">
          <div className="w-16 h-16 bg-orange-50 text-[#FF7518] rounded-full mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Your cart is empty</h2>
          <p className="text-xs text-neutral-500">
            Please add some food items from our menu before proceeding to checkout.
          </p>
          <button
            onClick={() => setActivePage('menu')}
            className="px-6 py-2.5 bg-[#FF7518] text-white text-xs font-bold rounded-full shadow hover:bg-[#e0630d] transition-all"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.phone) {
      addToast('Please fill out street address and phone number', 'error');
      return;
    }
    addAddress(newAddr);
    setShowNewAddress(false);
  };

  const selectedAddress =
    user?.addresses.find((a) => a.id === selectedAddressId) ||
    user?.addresses[0] || {
      id: 'addr-default',
      name: user?.name || 'Customer',
      phone: user?.phone || '+91 98765 43210',
      street: 'C-Scheme, Subhash Marg',
      city: 'Jaipur',
      state: 'Rajasthan',
      postalCode: '302001',
      type: 'Home' as const
    };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      placeOrder({
        address: selectedAddress,
        deliveryOption,
        paymentMethod
      });
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Progress Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
            <span className={currentStep >= 1 ? 'text-[#FF7518]' : ''}>1. Delivery Address</span>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
            <span className={currentStep >= 2 ? 'text-[#FF7518]' : ''}>2. Delivery Option</span>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
            <span className={currentStep >= 3 ? 'text-[#FF7518]' : ''}>3. Payment & Place</span>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#FF7518] h-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Checkout Steps (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {!user && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-neutral-900">Have a TasteHub account?</p>
                  <p className="text-neutral-600">Sign in to use your saved delivery addresses and track live orders.</p>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="px-4 py-2 bg-[#FF7518] hover:bg-[#e0630d] text-white font-bold rounded-xl whitespace-nowrap shadow-sm"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF7518]" />
                  <h3 className="text-base font-extrabold text-neutral-900">Delivery Address</h3>
                </div>
                <button
                  onClick={() => setShowNewAddress(!showNewAddress)}
                  className="text-xs font-bold text-[#FF7518] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* New Address Form */}
              {showNewAddress && (
                <form onSubmit={handleSaveNewAddress} className="mb-6 p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-800">Add New Delivery Location</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Receiver Name"
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                      className="p-2.5 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="p-2.5 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="House/Flat No., Building Name, Street"
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Landmark"
                      value={newAddr.landmark}
                      onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                      className="p-2.5 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="p-2.5 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={newAddr.postalCode}
                      onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                      className="p-2.5 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewAddress(false)}
                      className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#FF7518] text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses List */}
              <div className="space-y-3">
                {user?.addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <label
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FF7518] bg-orange-50/40 ring-1 ring-[#FF7518]'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                            {addr.type}
                          </span>
                          <span className="text-sm font-bold text-neutral-900">{addr.name}</span>
                        </div>
                        <span className="text-xs text-neutral-500 font-medium">{addr.phone}</span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-2">
                        {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.postalCode}
                      </p>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Delivery Option */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100">
                <Clock className="w-5 h-5 text-[#FF7518]" />
                <h3 className="text-base font-extrabold text-neutral-900">Delivery Speed</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryOption('Standard')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    deliveryOption === 'Standard'
                      ? 'border-[#FF7518] bg-orange-50/40 ring-1 ring-[#FF7518]'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className="text-xs font-bold text-neutral-900">Standard Delivery</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">25 - 35 mins</p>
                  <p className="text-xs font-extrabold text-emerald-600 mt-2">
                    {cartDeliveryFee === 0 ? 'FREE' : `₹${cartDeliveryFee}`}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryOption('Express')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    deliveryOption === 'Express'
                      ? 'border-[#FF7518] bg-orange-50/40 ring-1 ring-[#FF7518]'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className="text-xs font-bold text-neutral-900">⚡ Express Delivery</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Priority 15 - 20 mins</p>
                  <p className="text-xs font-extrabold text-[#FF7518] mt-2">+₹25</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryOption('Scheduled')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    deliveryOption === 'Scheduled'
                      ? 'border-[#FF7518] bg-orange-50/40 ring-1 ring-[#FF7518]'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className="text-xs font-bold text-neutral-900">📅 Scheduled Window</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Choose your time</p>
                  <p className="text-xs font-bold text-neutral-600 mt-2">Standard Rate</p>
                </button>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100">
                <CreditCard className="w-5 h-5 text-[#FF7518]" />
                <h3 className="text-base font-extrabold text-neutral-900">Payment Method</h3>
                <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold ml-auto">
                  100% Secure Sandbox
                </span>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#FF7518] bg-orange-50/40 ring-1 ring-[#FF7518]'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900">UPI / QR Code</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                        GPay • PhonePe • Paytm
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Fastest payment directly from your bank app.
                    </p>
                    {paymentMethod === 'UPI' && (
                      <div className="pt-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="p-2 text-xs bg-white border border-neutral-300 rounded-xl w-60 focus:outline-none focus:border-[#FF7518]"
                        />
                      </div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    readOnly
                    className="text-[#FF7518] focus:ring-[#FF7518] mt-1"
                  />
                </label>

                {/* Credit / Debit Card Option */}
                <label
                  onClick={() => setPaymentMethod('Card')}
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-[#FF7518] bg-orange-50/40 ring-1 ring-[#FF7518]'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900">Credit / Debit Card</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                        Visa • Mastercard • Rupay
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Encrypted tokenized processing through PCI-DSS secure gateway.
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Card'}
                    readOnly
                    className="text-[#FF7518] focus:ring-[#FF7518] mt-1"
                  />
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#FF7518] bg-orange-50/40 ring-1 ring-[#FF7518]'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-neutral-900">Cash on Delivery (COD)</span>
                    <p className="text-xs text-neutral-500">
                      Pay in cash or scan rider's QR code when your order arrives.
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    readOnly
                    className="text-[#FF7518] focus:ring-[#FF7518] mt-1"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm sticky top-28">
              <h3 className="text-base font-extrabold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
                Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-start text-xs">
                    <div>
                      <span className="font-bold text-neutral-900">
                        {item.quantity} × {item.foodItem.name}
                      </span>
                      {item.customization?.portionSize && (
                        <p className="text-[11px] text-neutral-400">
                          {item.customization.portionSize}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-neutral-800">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-neutral-100 text-xs text-neutral-600 mt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-800">₹{cartSubtotal}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon ({appliedCoupon?.code})</span>
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
                  <span>Packaging & Handling</span>
                  <span>₹{cartPackagingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Taxes (5%)</span>
                  <span>₹{cartTaxes}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-neutral-200 text-base font-extrabold text-neutral-900">
                  <span>To Pay</span>
                  <span className="text-[#FF7518] text-lg">₹{cartTotal}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompleteOrder}
                className="w-full mt-6 py-4 bg-[#FF7518] hover:bg-[#e0630d] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Order...</span>
                  </div>
                ) : (
                  <>
                    <span>Place Order (₹{cartTotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>TasteHub Safe & Contactless Delivery Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
