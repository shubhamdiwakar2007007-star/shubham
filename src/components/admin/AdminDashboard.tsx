import React, { useState } from 'react';
import { ShieldCheck, ShoppingBag, Clock, DollarSign, Store, Plus, Edit2, Check, X, Search, Database, Upload, AlertCircle, CheckCircle2, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodItem } from '../../types';
import { FoodImage } from '../common/FoodImage';
import { CATEGORIES, RESTAURANTS, COUPONS } from '../../data/mockData';
import { uploadDishImage, isSupabaseConfigured, SUPABASE_URL, testSupabaseConnection } from '../../lib/supabase';

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
    isSupabaseLive,
    checkSupabaseConnection,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders' | 'promotions' | 'database'>('overview');
  const [editingPriceDishId, setEditingPriceDishId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Diagnostics State
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    loading: boolean;
    connected: boolean;
    message: string;
  }>({
    tested: false,
    loading: false,
    connected: isSupabaseConfigured(),
    message: isSupabaseConfigured() ? 'Supabase environment detected' : 'Running in local fallback database mode'
  });

  // Local URL/Key form state for testing
  const [customUrl, setCustomUrl] = useState(() => localStorage.getItem('tastehub_supabase_url') || '');
  const [customKey, setCustomKey] = useState(() => localStorage.getItem('tastehub_supabase_key') || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // New Dish State
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'indian',
    cuisine: 'North Indian',
    price: 249,
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isSpicy: false,
    prepTimeMinutes: 20
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleSavePrice = (dishId: string) => {
    if (tempPrice > 0) {
      updateDishPrice(dishId, tempPrice);
      setEditingPriceDishId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    addToast('Uploading image to Supabase Storage...', 'info');

    const result = await uploadDishImage(file);
    setIsUploadingImage(false);

    if (result.url) {
      setNewDish((prev) => ({ ...prev, image: result.url! }));
      addToast('Image uploaded successfully!', 'success');
    } else {
      addToast(result.error || 'Failed to upload image', 'error');
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
      image: newDish.image,
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
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      isVeg: true,
      isSpicy: false,
      prepTimeMinutes: 20
    });
  };

  const handleRunDiagnostic = async () => {
    setConnectionStatus((prev) => ({ ...prev, loading: true }));
    const result = await checkSupabaseConnection();
    setConnectionStatus({
      tested: true,
      loading: false,
      connected: result.connected,
      message: result.message
    });
    if (result.connected) {
      addToast('Supabase database connection verified!', 'success');
    } else {
      addToast('Supabase check: ' + result.message, 'info');
    }
  };

  const handleSaveCredentials = () => {
    if (customUrl) {
      localStorage.setItem('tastehub_supabase_url', customUrl.trim());
    } else {
      localStorage.removeItem('tastehub_supabase_url');
    }
    if (customKey) {
      localStorage.setItem('tastehub_supabase_key', customKey.trim());
    } else {
      localStorage.removeItem('tastehub_supabase_key');
    }
    setSaveStatus('Credentials saved to browser session! Reloading to initialize Supabase client...');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
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
              className="w-full py-2.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Sign In as Administrator
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
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
              className="w-full py-2.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Switch to Administrator Demo
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
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
              <span>TasteHub Administration & Database Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Restaurant & Operations Manager
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Real-time order dispatch, pricing controls, Supabase database synchronization, and storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              isSupabaseConfigured()
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                : 'bg-amber-950/80 border border-amber-800 text-amber-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isSupabaseConfigured() ? 'Supabase Live Connected' : 'Local Fallback Mode'}</span>
            </div>

            <button
              onClick={() => setActivePage('home')}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-full text-xs font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              ← Storefront
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            📊 Operations Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            🛵 Live Orders Queue ({orders.filter((o) => o.status !== 'Delivered').length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            🍲 Dishes & Menu Pricing ({dishes.length})
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'promotions'
                ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            🏷️ Promotions & Coupons
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'bg-[#191919] text-white shadow-md'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#FF7518]" />
            <span>Supabase Database ({isSupabaseConfigured() ? 'Live' : 'Config'})</span>
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
                  Update kitchen states and dispatch riders in real-time. Synced with Supabase.
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
                      className="text-xs font-bold p-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#FF7518] cursor-pointer"
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
                  Adjust selling prices or toggle item availability with instantaneous Supabase storefront sync.
                </p>
              </div>

              <button
                onClick={() => setShowAddDishModal(true)}
                className="px-4 py-2 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
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
                            className="p-1 bg-emerald-600 text-white rounded cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingPriceDishId(null)}
                            className="p-1 bg-neutral-300 text-neutral-700 rounded cursor-pointer"
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
                            className="text-neutral-400 hover:text-neutral-800 p-0.5 cursor-pointer"
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
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
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

        {/* Tab 5: Supabase Database Integration & Diagnostics */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#FF7518]" />
                    <h3 className="text-lg font-extrabold text-neutral-900">
                      Supabase Cloud Database Architecture
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Centralized database with Row Level Security (RLS), Realtime replication, and Storage.
                  </p>
                </div>

                <button
                  onClick={handleRunDiagnostic}
                  disabled={connectionStatus.loading}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus.loading ? 'animate-spin' : ''}`} />
                  <span>{connectionStatus.loading ? 'Verifying...' : 'Test Supabase Connection'}</span>
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                connectionStatus.connected
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}>
                {connectionStatus.connected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <div className="font-bold text-sm">
                    {connectionStatus.connected ? 'Connected to Supabase' : 'Offline / Standalone Fallback Active'}
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {connectionStatus.message}
                  </p>
                  {SUPABASE_URL && (
                    <p className="font-mono text-[11px] text-neutral-500">
                      Target Project: {SUPABASE_URL}
                    </p>
                  )}
                </div>
              </div>

              {/* Architecture Components Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">AUTH & PROFILES</span>
                  <div className="font-bold text-neutral-900 text-xs">Supabase Auth</div>
                  <p className="text-[11px] text-neutral-500">Linked to <code className="text-[#FF7518]">profiles</code> table via auth.uid() trigger</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">MENU CATALOG</span>
                  <div className="font-bold text-neutral-900 text-xs">food_items table</div>
                  <p className="text-[11px] text-neutral-500">Public read, admin write with RLS security policies</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">REALTIME DISPATCH</span>
                  <div className="font-bold text-neutral-900 text-xs">Postgres Replication</div>
                  <p className="text-[11px] text-neutral-500">Instant updates for food_items and orders</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">MEDIA ASSETS</span>
                  <div className="font-bold text-neutral-900 text-xs">Storage Buckets</div>
                  <p className="text-[11px] text-neutral-500"><code className="text-[#FF7518]">dish-images</code> & <code className="text-[#FF7518]">avatars</code> buckets</p>
                </div>
              </div>
            </div>

            {/* Quick Connect & SQL Migration Instructions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credentials Configuration */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span>Supabase Project Connection Settings</span>
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Enter your Supabase Project URL and Public Anon Key below, or configure them in your <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">.env.example</code>.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">
                      Supabase Project URL (VITE_SUPABASE_URL)
                    </label>
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://your-project-id.supabase.co"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">
                      Supabase Anon / Public Key (VITE_SUPABASE_ANON_KEY)
                    </label>
                    <input
                      type="password"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>

                  {saveStatus && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                      {saveStatus}
                    </div>
                  )}

                  <button
                    onClick={handleSaveCredentials}
                    className="w-full py-2.5 bg-[#FF7518] hover:bg-[#e0630d] text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Save & Reconnect Supabase Client
                  </button>
                </div>
              </div>

              {/* Schema Execution Instructions */}
              <div className="bg-[#111111] text-white rounded-3xl p-6 border border-neutral-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#FF7518]">
                    Executable SQL Schema Guide (supabase_schema.sql)
                  </h4>
                  <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded-full text-neutral-300">
                    Ready in root directory
                  </span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your project includes the complete SQL migration file <code className="text-orange-300">supabase_schema.sql</code>. To provision your database:
                </p>

                <ol className="text-xs text-neutral-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Open your Supabase Project Dashboard.</li>
                  <li>Click on <strong>SQL Editor</strong> in the left sidebar.</li>
                  <li>Open <code className="text-white bg-neutral-900 px-1 py-0.5 rounded">supabase_schema.sql</code> from this project and paste into the editor.</li>
                  <li>Click <strong>Run</strong>. This creates all 10 tables, RLS policies, Storage buckets, and seed dishes.</li>
                  <li>In Supabase <strong>Authentication &gt; URL Configuration</strong>, ensure your app URL is set as Site URL.</li>
                </ol>

                <div className="pt-2">
                  <div className="text-[11px] text-neutral-400 bg-neutral-900 p-3 rounded-xl border border-neutral-800 font-mono">
                    ✓ 10 Tables • ✓ RLS Security • ✓ Updated_at Triggers • ✓ Realtime Enabled
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Dish Modal with Supabase Storage File Upload */}
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
                  <button onClick={() => setShowAddDishModal(false)} className="cursor-pointer">
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
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl capitalize cursor-pointer"
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

                  {/* Supabase Storage Image Upload */}
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">
                      Dish Photo (Supabase Storage: dish-images)
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200">
                        <img src={newDish.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <label className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-neutral-300 hover:border-[#FF7518] rounded-xl cursor-pointer bg-neutral-50 hover:bg-orange-50/20 transition-colors">
                          <Upload className="w-4 h-4 text-neutral-500" />
                          <span className="text-neutral-600 font-bold">
                            {isUploadingImage ? 'Uploading...' : 'Upload Image File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploadingImage}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Uploads directly to Supabase Storage bucket <code>dish-images</code>.
                        </p>
                      </div>
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
                        className="rounded text-green-600 focus:ring-green-600 cursor-pointer"
                      />
                      <span>Vegetarian</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={newDish.isSpicy}
                        onChange={(e) => setNewDish({ ...newDish, isSpicy: e.target.checked })}
                        className="rounded text-red-600 focus:ring-red-600 cursor-pointer"
                      />
                      <span>Spicy</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddDishModal(false)}
                      className="px-4 py-2 text-neutral-500 hover:text-neutral-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploadingImage}
                      className="px-5 py-2 bg-[#FF7518] hover:bg-[#e0630d] text-white font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
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
