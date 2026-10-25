import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, ShoppingBag, Clock, DollarSign, Store, Plus, Edit2, Check, X, RefreshCw, Eye, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodItem, Order } from '../../types';
import { FoodImage } from '../common/FoodImage';
import { CATEGORIES, RESTAURANTS, COUPONS } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    dishes,
    orders,
    toggleDishAvailability,
    updateDishPrice,
    addNewDish,
    updateOrderStatus,
    setActivePage,
    openAuthModal,
    loginAsAdmin,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders' | 'promotions'>('overview');
  const [editingPriceDishId, setEditingPriceDishId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // New Dish State
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'indian',
    cuisine: 'North Indian',
    price: 249,
    description: '',
    isVeg: true,
    isSpicy: false,
    prepTimeMinutes: 20
  });

  const handleSavePrice = (dishId: string) => {
    if (tempPrice > 0) {
      updateDishPrice(dishId, tempPrice);
      setEditingPriceDishId(null);
    }
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name || !newDish.description) {
      addToast('Please provide a name and description', 'error');
      return;
    }
    const created: FoodItem = {
      id: 'dish-' + Date.now(),
      name: newDish.name,
      slug: newDish.name.toLowerCase().replace(/\s+/g, '-'),
      category: newDish.category,
      cuisine: newDish.cuisine,
      price: Number(newDish.price),
      rating: 4.8,
      reviewsCount: 1,
      description: newDish.description,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      badge: 'New',
      isVeg: newDish.isVeg,
      isSpicy: newDish.isSpicy,
      prepTimeMinutes: Number(newDish.prepTimeMinutes),
      isAvailable: true
    };
    addNewDish(created);
    setShowAddDishModal(false);
    setNewDish({
      name: '',
      category: 'indian',
      cuisine: 'North Indian',
      price: 249,
      description: '',
      isVeg: true,
      isSpicy: false,
      prepTimeMinutes: 20
    });
  };

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    o.restaurantName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    o.deliveryAddress.name.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );

  // Authentication & Authorization Guards
  if (!user) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center max-w-md shadow-sm space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Administrator Access Required</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            The operations dashboard is restricted to authorized TasteHub staff and kitchen administrators. Please sign in with your administrator credentials.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => openAuthModal('signin')}
              className="w-full py-2.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Sign In as Administrator
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-all"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center max-w-md shadow-sm space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Access Restricted</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            You are currently signed in as a customer (<strong>{user.name}</strong>). The administration dashboard requires administrator privileges.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => loginAsAdmin()}
              className="w-full py-2.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Switch to Administrator Demo
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-all"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7518] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>TasteHub Administration Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Restaurant & Operations Manager
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Real-time order dispatch, pricing controls, inventory toggles, and partner analytics.
            </p>
          </div>

          <button
            onClick={() => setActivePage('home')}
            className="self-start md:self-auto px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-full text-xs font-bold text-neutral-300 hover:text-white transition-colors"
          >
            ← View Customer Storefront
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            📊 Operations Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            🛵 Live Orders Queue ({orders.filter((o) => o.status !== 'Delivered').length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            🍲 Dishes & Menu Pricing ({dishes.length})
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'promotions'
                ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            🏷️ Promotions & Coupons
          </button>
        </div>

        {/* Tab 1: Overview & Metrics */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold mb-2">
                  <span>VERIFIED REVENUE</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-neutral-900">₹3,84,520</div>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">
                  ↑ +18.4% from last week
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold mb-2">
                  <span>TOTAL ORDERS</span>
                  <ShoppingBag className="w-4 h-4 text-[#FF7518]" />
                </div>
                <div className="text-2xl font-extrabold text-neutral-900">1,482</div>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">
                  ↑ 99.4% on-time delivery
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold mb-2">
                  <span>ACTIVE KITCHENS</span>
                  <Store className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl font-extrabold text-neutral-900">{RESTAURANTS.length}</div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Average prep time 21 mins
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold mb-2">
                  <span>ACTIVE DISPATCHES</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-extrabold text-[#FF7518]">
                  {orders.filter((o) => o.status !== 'Delivered').length}
                </div>
                <p className="text-[11px] text-amber-600 font-bold mt-1">
                  Avg arrival in 24 mins
                </p>
              </div>
            </div>

            {/* Popular Dishes & Restaurant Performance Table */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
              <h3 className="text-base font-extrabold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
                Top Performing Dishes This Month
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Dish Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Rating</th>
                      <th className="pb-3">Total Sold</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {dishes.slice(0, 5).map((dish) => (
                      <tr key={dish.id} className="hover:bg-neutral-50/80">
                        <td className="py-3 font-bold text-neutral-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>{dish.name}</span>
                        </td>
                        <td className="py-3 capitalize text-neutral-600">{dish.category}</td>
                        <td className="py-3 font-extrabold text-neutral-900">₹{dish.price}</td>
                        <td className="py-3 text-amber-600 font-bold">★ {dish.rating}</td>
                        <td className="py-3 font-semibold text-neutral-700">{dish.reviewsCount * 2} orders</td>
                        <td className="py-3">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Orders Queue */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Live Orders Management</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update kitchen states and dispatch riders in real-time.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Filter by Order ID or Name..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl border border-neutral-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-neutral-300 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-neutral-900">#{ord.id}</span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status}
                      </span>
                      <span className="text-xs text-neutral-400">• {ord.paymentMethod} ({ord.paymentStatus})</span>
                    </div>

                    <p className="text-xs text-neutral-600">
                      Customer: <strong>{ord.deliveryAddress.name}</strong> ({ord.deliveryAddress.phone})
                    </p>

                    <p className="text-[11px] text-neutral-500">
                      Destination: {ord.deliveryAddress.street}, {ord.deliveryAddress.city}
                    </p>

                    <div className="text-xs text-neutral-800 font-medium pt-1">
                      {ord.items.map((i) => `${i.quantity}x ${i.foodItem.name}`).join(', ')}
                    </div>
                  </div>

                  {/* Status Dropdown & Action Controls */}
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <span className="text-[10px] text-neutral-400 block">TOTAL AMOUNT</span>
                      <span className="text-base font-extrabold text-[#191919]">₹{ord.total}</span>
                    </div>

                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                      className="text-xs font-bold p-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready for Pickup</option>
                      <option value="OutForDelivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Menu & Pricing Management */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Dishes & Live Price Controls</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Adjust selling prices or toggle item availability with instantaneous storefront sync.
                </p>
              </div>

              <button
                onClick={() => setShowAddDishModal(true)}
                className="px-4 py-2 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Food Item</span>
              </button>
            </div>

            {/* Dishes Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dishes.map((dish) => (
                <div
                  key={dish.id}
                  className="p-4 rounded-2xl border border-neutral-200 flex gap-4 items-center justify-between bg-neutral-50/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                      <FoodImage src={dish.image} alt={dish.name} category={dish.category} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-neutral-900 truncate">{dish.name}</h4>
                      <p className="text-[11px] text-neutral-500 capitalize">{dish.category} • {dish.cuisine}</p>

                      {/* Price Editor */}
                      {editingPriceDishId === dish.id ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-bold text-neutral-700">₹</span>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            className="w-16 p-1 text-xs border rounded bg-white font-bold"
                          />
                          <button
                            onClick={() => handleSavePrice(dish.id)}
                            className="p-1 bg-emerald-600 text-white rounded"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingPriceDishId(null)}
                            className="p-1 bg-neutral-300 text-neutral-700 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-extrabold text-[#191919]">₹{dish.price}</span>
                          <button
                            onClick={() => {
                              setEditingPriceDishId(dish.id);
                              setTempPrice(dish.price);
                            }}
                            className="text-neutral-400 hover:text-neutral-800 p-0.5"
                            title="Edit Price"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <div className="text-right shrink-0">
                    <button
                      onClick={() => toggleDishAvailability(dish.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        dish.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Promotions & Coupons */}
        {activeTab === 'promotions' && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-neutral-900 pb-3 border-b border-neutral-100">
              Active Store Coupons & Discount Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {COUPONS.map((coupon) => (
                <div
                  key={coupon.code}
                  className="p-5 rounded-2xl border border-neutral-200 bg-orange-50/30 space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-[#FF7518] tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{coupon.description}</p>
                  <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-200/60 flex justify-between">
                    <span>Min Order: ₹{coupon.minOrder}</span>
                    <span>Valid until: Dec 2026</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Dish Modal */}
        {showAddDishModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              onClick={() => setShowAddDishModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 z-10 shadow-2xl animate-scaleUp">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                  <h3 className="text-base font-extrabold text-neutral-900">Add New Dish</h3>
                  <button onClick={() => setShowAddDishModal(false)}>
                    <X className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>

                <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Dish Name</label>
                    <input
                      type="text"
                      required
                      value={newDish.name}
                      onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                      placeholder="e.g. Tandoori Chicken Tikka"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Category</label>
                      <select
                        value={newDish.category}
                        onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl capitalize"
                      >
                        {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={newDish.price}
                        onChange={(e) => setNewDish({ ...newDish, price: Number(e.target.value) })}
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Short Description</label>
                    <textarea
                      required
                      value={newDish.description}
                      onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                      placeholder="e.g. Smoky tandoor marinated chicken morsels with mint chutney"
                      rows={2}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={newDish.isVeg}
                        onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.checked })}
                        className="rounded text-green-600 focus:ring-green-600"
                      />
                      <span>Vegetarian</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={newDish.isSpicy}
                        onChange={(e) => setNewDish({ ...newDish, isSpicy: e.target.checked })}
                        className="rounded text-red-600 focus:ring-red-600"
                      />
                      <span>Spicy</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddDishModal(false)}
                      className="px-4 py-2 text-neutral-500 hover:text-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#FF7518] text-white font-bold rounded-xl shadow-md"
                    >
                      Publish Dish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
