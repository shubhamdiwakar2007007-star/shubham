import React, { useState } from 'react';
import { User, MapPin, Heart, Clock, LogOut, ShieldCheck, Plus, Trash2, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodImage } from '../common/FoodImage';

export const AccountPage: React.FC = () => {
  const {
    user,
    logout,
    updateUserProfile,
    orders,
    dishes,
    favorites,
    addToCart,
    setSelectedOrderId,
    setActivePage,
    deleteAddress,
    addAddress,
    openAuthModal,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'addresses' | 'profile'>('orders');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  if (!user) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center max-w-md shadow-sm space-y-4">
          <div className="w-16 h-16 bg-orange-50 text-[#FF7518] rounded-full mx-auto flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Sign In to TasteHub</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Please sign in to view your orders, live tracking status, saved delivery addresses, and favorite dishes.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => openAuthModal('signin')}
              className="w-full py-2.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Create Free Account
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="w-full py-2 text-neutral-500 hover:text-neutral-800 text-xs transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: profileName, phone: profilePhone });
    setIsEditingProfile(false);
  };

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      addToCart(item.foodItem, item.customization, item.quantity);
    });
    addToast('All items added to cart!', 'success');
    setActivePage('checkout');
  };

  const favoriteDishes = dishes.filter((d) => favorites.includes(d.id));

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Greeting Hero Banner */}
        <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#FF7518] shadow"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold">{user.name}</h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  {user.role === 'admin' ? 'Administrator' : 'TasteHub Member'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">{user.email} • {user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <button
                onClick={() => setActivePage('admin')}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-[#FF8A35] text-xs font-bold rounded-full border border-neutral-700 flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-red-400 text-xs font-bold rounded-full border border-neutral-700 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tabs & Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Tabs (Col 3) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-4 border border-neutral-200 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span>Order History</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Favorites</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {favorites.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {user.addresses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#FF7518] text-white shadow-md shadow-orange-500/20'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
          </div>

          {/* Active Tab Panel (Col 9) */}
          <div className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm min-h-[400px]">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-neutral-900 pb-3 border-b border-neutral-100">
                  Your Past & Active Orders
                </h3>

                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl border border-neutral-200/90 hover:border-neutral-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-neutral-900">
                            #{ord.id}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {ord.restaurantName} • {ord.createdAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrderId(ord.id);
                            setActivePage('order-detail');
                          }}
                          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          Track Order
                        </button>
                        <button
                          onClick={() => handleReorder(ord)}
                          className="px-3.5 py-1.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>

                    {/* Ordered items preview */}
                    <div className="bg-neutral-50 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div className="truncate text-neutral-700">
                        {ord.items.map((i) => `${i.quantity}x ${i.foodItem.name}`).join(' • ')}
                      </div>
                      <span className="font-extrabold text-neutral-900 text-sm shrink-0 ml-4">
                        ₹{ord.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-neutral-900 pb-3 border-b border-neutral-100">
                  Your Favorite Dishes
                </h3>

                {favoriteDishes.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500 text-xs">
                    You haven't marked any favorite dishes yet. Click the heart icon on any dish!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="p-4 rounded-2xl border border-neutral-200 flex items-center gap-3.5"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                          <FoodImage src={dish.image} alt={dish.name} category={dish.category} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-neutral-900 truncate">
                            {dish.name}
                          </h4>
                          <p className="text-xs text-[#FF7518] font-extrabold">₹{dish.price}</p>
                          <button
                            onClick={() => addToCart(dish)}
                            className="mt-2 px-3 py-1 bg-orange-50 border border-[#FF7518] text-[#FF7518] text-xs font-bold rounded-full hover:bg-orange-100 transition-colors"
                          >
                            Add to Cart +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-neutral-900 pb-3 border-b border-neutral-100">
                  Saved Delivery Locations
                </h3>

                <div className="space-y-3">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-2xl border border-neutral-200 flex items-start justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#FF7518] shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                              {addr.type}
                            </span>
                            <span className="text-sm font-bold text-neutral-900">{addr.name}</span>
                          </div>
                          <p className="text-xs text-neutral-600 mt-1">
                            {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city} - {addr.postalCode}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">Phone: {addr.phone}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-neutral-400 hover:text-red-500 p-1"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-neutral-900 pb-3 border-b border-neutral-100">
                  Profile Information
                </h3>

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full p-2.5 text-xs bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
