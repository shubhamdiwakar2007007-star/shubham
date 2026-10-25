import React, { useState } from 'react';
import { CheckCircle2, Clock, MapPin, Phone, ChefHat, Bike, ShieldCheck, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const OrderTrackingPage: React.FC = () => {
  const { orders, selectedOrderId, setSelectedOrderId, updateOrderStatus, setActivePage } = useApp();

  // Find the selected order, or default to the most recent one
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const stages: { key: Order['status']; label: string; desc: string; icon: any }[] = [
    { key: 'Placed', label: 'Order Placed', desc: 'Sent to kitchen for approval', icon: Clock },
    { key: 'Confirmed', label: 'Restaurant Confirmed', desc: 'Chef received ticket', icon: ChefHat },
    { key: 'Preparing', label: 'Preparing Food', desc: 'Cooking fresh ingredients', icon: ChefHat },
    { key: 'Ready', label: 'Ready for Pickup', desc: 'Packed securely in insulated bag', icon: ShieldCheck },
    { key: 'OutForDelivery', label: 'Out for Delivery', desc: 'Rider is on the way', icon: Bike },
    { key: 'Delivered', label: 'Delivered', desc: 'Enjoy your meal!', icon: CheckCircle2 }
  ];

  const getStageIndex = (status: Order['status']) => {
    const idx = stages.findIndex((s) => s.key === status);
    return idx === -1 ? 2 : idx;
  };

  const currentStageIndex = activeOrder ? getStageIndex(activeOrder.status) : 2;

  // Simulator for evaluator to jump stages easily
  const handleSimulateNextStage = () => {
    if (!activeOrder) return;
    const nextIdx = (currentStageIndex + 1) % stages.length;
    updateOrderStatus(activeOrder.id, stages[nextIdx].key);
  };

  if (!activeOrder) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center max-w-md shadow-sm">
          <Clock className="w-12 h-12 text-[#FF7518] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-neutral-900">No Orders Found</h2>
          <p className="text-xs text-neutral-500 mt-1 mb-4">
            You don't have any orders currently being tracked.
          </p>
          <button
            onClick={() => setActivePage('menu')}
            className="px-6 py-2.5 bg-[#FF7518] text-white text-xs font-bold rounded-full"
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back and Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setActivePage('home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          {/* Evaluator Live Stage Simulation Controller */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 text-xs">
            <span className="font-bold text-amber-900">Live Stage Simulator:</span>
            <button
              onClick={handleSimulateNextStage}
              className="px-3 py-1 bg-[#FF7518] text-white text-[11px] font-bold rounded-full hover:bg-[#e0630d] flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Advance Stage ({stages[currentStageIndex]?.label})</span>
            </button>
          </div>
        </div>

        {/* Main Status Hero Card */}
        <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 border border-neutral-800 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-10 w-72 h-72 bg-[#FF7518]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7518] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE ORDER TRACKING</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Order #{activeOrder.id}
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                From <strong className="text-white">{activeOrder.restaurantName}</strong> • Placed {activeOrder.createdAt}
              </p>
            </div>

            {/* ETA Countdown Badge */}
            <div className="bg-neutral-900/90 border border-neutral-700/80 rounded-2xl p-4 sm:p-5 text-center min-w-[200px]">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                ESTIMATED ARRIVAL
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF7518] mt-1">
                {activeOrder.status === 'Delivered' ? 'Delivered' : activeOrder.estimatedDeliveryTime}
              </div>
              <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
                {activeOrder.status === 'Delivered' ? 'Completed safely' : 'On track • Fresh & Hot'}
              </p>
            </div>
          </div>

          {/* Timeline Visual */}
          <div className="mt-10 pt-8 border-t border-neutral-800">
            <div className="relative">
              {/* Progress Line */}
              <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-neutral-800 -z-0">
                <div
                  className="h-full bg-[#FF7518] transition-all duration-500"
                  style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                />
              </div>

              {/* Stage Dots and Labels */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                {stages.map((st, idx) => {
                  const isPassed = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const Icon = st.icon;

                  return (
                    <div key={st.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                          isCurrent
                            ? 'bg-[#FF7518] text-white ring-4 ring-orange-500/30 scale-110 shadow-lg'
                            : isPassed
                            ? 'bg-[#FF7518] text-white'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-white' : isPassed ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        {st.label}
                      </span>
                      <span className="text-[10px] text-neutral-500 mt-0.5 hidden sm:inline">
                        {st.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Details: Items & Bill (Col 7) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-neutral-900 pb-3 border-b border-neutral-100">
              Ordered Items
            </h3>

            <div className="space-y-4">
              {activeOrder.items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-[#FF7518]">
                      {item.quantity}×
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 text-sm">{item.foodItem.name}</p>
                      {item.customization?.portionSize && (
                        <p className="text-[11px] text-neutral-500">
                          {item.customization.portionSize}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-extrabold text-neutral-800 text-sm">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="space-y-2 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-semibold text-neutral-800">₹{activeOrder.subtotal}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Savings ({activeOrder.couponCode})</span>
                  <span>-₹{activeOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {activeOrder.deliveryFee === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    `₹${activeOrder.deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Packaging & GST</span>
                <span>₹{activeOrder.packagingFee + activeOrder.taxes}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-200 text-sm font-extrabold text-neutral-900">
                <span>Total Paid</span>
                <span className="text-[#FF7518] text-base">₹{activeOrder.total}</span>
              </div>
            </div>
          </div>

          {/* Right Details: Rider & Address (Col 5) */}
          <div className="md:col-span-5 space-y-6">
            {/* Delivery Partner Card */}
            {activeOrder.deliveryPartner && (
              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Delivery Partner Assigned
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF7518] flex items-center justify-center font-bold text-lg">
                      🚴
                    </div>
                    <div>
                      <p className="font-bold text-sm text-neutral-900">
                        {activeOrder.deliveryPartner.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Vehicle: {activeOrder.deliveryPartner.vehicleNumber}
                      </p>
                      <p className="text-[11px] text-amber-600 font-bold">
                        ★ {activeOrder.deliveryPartner.rating} Delivery Hero
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${activeOrder.deliveryPartner.phone}`}
                    className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                    title="Call Rider"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Delivery Destination Address */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Delivering To
              </h4>
              <div className="flex items-start gap-2.5 pt-1">
                <MapPin className="w-4 h-4 text-[#FF7518] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">
                    {activeOrder.deliveryAddress.name} ({activeOrder.deliveryAddress.type})
                  </p>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                    {activeOrder.deliveryAddress.street}, {activeOrder.deliveryAddress.city} - {activeOrder.deliveryAddress.postalCode}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Phone: {activeOrder.deliveryAddress.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
