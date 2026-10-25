import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, CartItem, CartCustomization, Order, UserProfile, Coupon, UserAddress } from '../types';
import { FOOD_ITEMS, DEMO_USER, COUPONS } from '../data/mockData';
import { authService } from '../services/authService';
import { supabaseService } from '../services/supabaseService';
import { isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  user: UserProfile | null;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (params: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'customer' | 'admin';
  }) => Promise<{ success: boolean; message?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; code?: string; message: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  loginAsCustomer: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  logout: () => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (dish: FoodItem, customization?: CartCustomization, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTaxes: number;
  cartPackagingFee: number;
  cartTotal: number;

  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (dishId: string) => void;

  // Location
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // Navigation & Page State
  activePage: string;
  setActivePage: (page: string) => void;
  activeDishSlug: string | null;
  setActiveDishSlug: (slug: string | null) => void;
  activeBlogSlug: string | null;
  setActiveBlogSlug: (slug: string | null) => void;

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;

  // Orders
  orders: Order[];
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  placeOrder: (orderData: {
    address: UserAddress;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
    deliveryOption: 'Standard' | 'Express' | 'Scheduled';
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authModalTab: 'signin' | 'signup' | 'forgot';
  setAuthModalTab: (tab: 'signin' | 'signup' | 'forgot') => void;
  openAuthModal: (tab?: 'signin' | 'signup' | 'forgot') => void;
  isLocationOpen: boolean;
  setIsLocationOpen: (open: boolean) => void;
  selectedFoodForModal: FoodItem | null;
  setSelectedFoodForModal: (item: FoodItem | null) => void;

  // Menu items list (synced with Supabase)
  dishes: FoodItem[];
  toggleDishAvailability: (dishId: string) => void;
  updateDishPrice: (dishId: string, newPrice: number) => void;
  addNewDish: (dish: FoodItem) => void;

  // Database Connection Diagnostic
  isSupabaseLive: boolean;
  checkSupabaseConnection: () => Promise<{ configured: boolean; connected: boolean; message: string }>;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial authenticated user from persistent auth session
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(isSupabaseConfigured());

  // Verify auth initialization on mount
  useEffect(() => {
    authService.ready().then(() => {
      const current = authService.getCurrentUser();
      if (current) {
        setUser(current);
      }
    });
  }, []);

  const openAuthModal = (tab: 'signin' | 'signup' | 'forgot' = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthOpen(true);
  };

  const [cart, setCart] = useState<CartItem[]>([
    {
      cartItemId: 'init-1',
      foodItem: FOOD_ITEMS[0], // Chicken Biryani
      quantity: 1,
      unitPrice: 249,
      customization: { portionSize: 'Regular (Serves 1)' }
    },
    {
      cartItemId: 'init-2',
      foodItem: FOOD_ITEMS[4], // Chocolate Lava Cake
      quantity: 2,
      unitPrice: 149,
      customization: { portionSize: 'Single Cup' }
    }
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(COUPONS[0]); // default TASTE30
  const [favorites, setFavorites] = useState<string[]>(['dish-1', 'dish-2']);
  const [selectedCity, setSelectedCity] = useState<string>('Jaipur');
  const [activePage, setActivePage] = useState<string>('home');
  const [activeDishSlug, setActiveDishSlug] = useState<string | null>(null);
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('ORD-7842');
  const [dishes, setDishes] = useState<FoodItem[]>(FOOD_ITEMS);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Initial Dishes Load from Supabase + Realtime Subscription
  useEffect(() => {
    let isMounted = true;

    supabaseService.getFoodItems().then((res) => {
      if (isMounted) {
        if (res.data && res.data.length > 0) {
          setDishes(res.data);
        }
        setIsSupabaseLive(res.isLiveDb);
      }
    });

    // Supabase Realtime Channel for food items
    const foodSub = supabaseService.subscribeToFoodItems((payload) => {
      if (!isMounted) return;
      if (payload.eventType === 'UPDATE' && payload.new) {
        setDishes((prev) =>
          prev.map((d) =>
            d.id === payload.new.id
              ? {
                  ...d,
                  price: Number(payload.new.price),
                  isAvailable: payload.new.is_available !== false,
                  name: payload.new.name || d.name,
                  image: payload.new.image || d.image
                }
              : d
          )
        );
      } else if (payload.eventType === 'INSERT' && payload.new) {
        setDishes((prev) => {
          if (prev.some((d) => d.id === payload.new.id)) return prev;
          const newDish: FoodItem = {
            id: payload.new.id,
            name: payload.new.name,
            slug: payload.new.slug || payload.new.id,
            category: payload.new.category_id || 'indian',
            cuisine: payload.new.cuisine || '',
            price: Number(payload.new.price),
            rating: Number(payload.new.rating || 4.8),
            reviewsCount: Number(payload.new.reviews_count || 0),
            description: payload.new.description || '',
            image: payload.new.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
            badge: payload.new.badge,
            isVeg: Boolean(payload.new.is_veg),
            isSpicy: Boolean(payload.new.is_spicy),
            prepTimeMinutes: Number(payload.new.prep_time_minutes || 20),
            isAvailable: payload.new.is_available !== false
          };
          return [newDish, ...prev];
        });
      } else if (payload.eventType === 'DELETE' && payload.old) {
        setDishes((prev) => prev.filter((d) => d.id !== payload.old.id));
      }
    });

    // Supabase Realtime Channel for Orders
    const orderSub = supabaseService.subscribeToOrders((payload) => {
      if (!isMounted) return;
      if (payload.eventType === 'UPDATE' && payload.new) {
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === payload.new.id
              ? { ...ord, status: payload.new.status, paymentStatus: payload.new.payment_status || ord.paymentStatus }
              : ord
          )
        );
      }
    });

    return () => {
      isMounted = false;
      foodSub.unsubscribe();
      orderSub.unsubscribe();
    };
  }, []);

  const checkSupabaseConnection = async () => {
    const res = await testSupabaseConnection();
    setIsSupabaseLive(res.connected);
    return res;
  };

  // Auth Operations
  const loginUser = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthOpen(false);
      addToast(res.message || 'Logged in successfully!', 'success');
      return { success: true, message: res.message };
    } else {
      addToast(res.message || 'Login failed', 'error');
      return { success: false, message: res.message };
    }
  };

  const registerUser = async (params: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'customer' | 'admin';
  }) => {
    const res = await authService.register(params);
    if (res.success) {
      if (res.user) {
        setUser(res.user);
        setIsAuthOpen(false);
      }
      addToast(res.message || 'Account created successfully!', 'success');
      return { success: true, message: res.message };
    } else {
      addToast(res.message || 'Registration failed', 'error');
      return { success: false, message: res.message };
    }
  };

  const requestPasswordReset = async (email: string) => {
    return authService.requestPasswordReset(email);
  };

  const resetPassword = async (email: string, code: string, newPass: string) => {
    return authService.resetPassword(email, code, newPass);
  };

  const loginAsCustomer = async () => {
    const res = await authService.login('rahul.sharma@example.com', 'Password123!');
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthOpen(false);
      addToast('Logged in as Rahul Sharma (Demo Customer)', 'success');
    }
  };

  const loginAsAdmin = async () => {
    const res = await authService.login('admin@tastehub.com', 'Admin123!');
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthOpen(false);
      addToast('Logged in as TasteHub Administrator', 'info');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    addToast('You have been logged out safely.', 'info');
    if (activePage === 'account' || activePage === 'admin') {
      setActivePage('home');
    }
  };

  const updateUserProfile = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    const refreshed = await authService.updateProfile(user.id, updated);
    if (refreshed) {
      setUser(refreshed);
      addToast('Profile updated successfully', 'success');
    }
  };

  const addAddress = (newAddr: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const addrWithId: UserAddress = {
      ...newAddr,
      id: 'addr-' + Date.now()
    };
    const updatedAddresses = [...user.addresses, addrWithId];
    updateUserProfile({ addresses: updatedAddresses });
    addToast('New address saved', 'success');
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.filter((a) => a.id !== id);
    updateUserProfile({ addresses: updatedAddresses });
    addToast('Address removed', 'info');
  };

  // Cart operations
  const addToCart = (dish: FoodItem, customization?: CartCustomization, quantity = 1) => {
    let unitPrice = dish.price;
    if (customization?.portionSize && dish.portionSizes) {
      const p = dish.portionSizes.find((ps) => ps.name === customization.portionSize);
      if (p) {
        unitPrice = Math.round(dish.price * p.priceMultiplier);
      }
    }
    if (customization?.selectedAddOns && dish.addOns) {
      customization.selectedAddOns.forEach((addonName) => {
        const found = dish.addOns?.find((a) => a.name === addonName);
        if (found) unitPrice += found.price;
      });
    }

    const cartItemId = `${dish.id}-${customization?.portionSize || 'std'}-${(customization?.selectedAddOns || []).sort().join(',')}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cartItemId, foodItem: dish, quantity, unitPrice, customization }];
    });

    addToast(`Added ${quantity} × ${dish.name} to cart!`, 'success');
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    addToast('Cart cleared', 'info');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const cartDeliveryFee = cartSubtotal >= 299 || cartSubtotal === 0 ? 0 : 35;
  const cartPackagingFee = cartSubtotal > 0 ? 20 : 0;
  const cartTaxes = Math.round(cartSubtotal * 0.05);

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountPercent) {
      const rawDiscount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
      cartDiscount = appliedCoupon.maxDiscount
        ? Math.min(rawDiscount, appliedCoupon.maxDiscount)
        : rawDiscount;
    } else if (appliedCoupon.discountAmount) {
      cartDiscount = appliedCoupon.discountAmount;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee + cartTaxes + cartPackagingFee);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === cleanCode && c.isActive);
    if (!found) {
      addToast(`Invalid coupon code: "${code}"`, 'error');
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (cartSubtotal < found.minOrder) {
      addToast(`Minimum cart value of ₹${found.minOrder} required for ${cleanCode}`, 'error');
      return { success: false, message: `Minimum cart value of ₹${found.minOrder} required` };
    }
    setAppliedCoupon(found);
    addToast(`Coupon "${cleanCode}" applied successfully!`, 'success');
    return { success: true, message: `Coupon ${cleanCode} applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  const toggleFavorite = (dishId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(dishId);
      if (isFav) {
        addToast('Removed from favorites', 'info');
        return prev.filter((id) => id !== dishId);
      } else {
        addToast('Added to your favorites!', 'success');
        return [...prev, dishId];
      }
    });
  };

  // Initial orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-7842',
      createdAt: 'Today, 20 mins ago',
      items: [
        {
          cartItemId: 'order-item-1',
          foodItem: FOOD_ITEMS[0],
          quantity: 1,
          unitPrice: 249,
          customization: { portionSize: 'Regular (Serves 1)' }
        },
        {
          cartItemId: 'order-item-2',
          foodItem: FOOD_ITEMS[4],
          quantity: 1,
          unitPrice: 149
        }
      ],
      subtotal: 398,
      discount: 119,
      deliveryFee: 0,
      taxes: 20,
      packagingFee: 20,
      total: 319,
      couponCode: 'TASTE30',
      status: 'Preparing',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      deliveryAddress: DEMO_USER.addresses[0],
      deliveryOption: 'Standard',
      estimatedDeliveryTime: '20-25 mins',
      deliveryPartner: {
        name: 'Rajesh Kumar',
        phone: '+91 98234 56789',
        vehicleNumber: 'RJ 14 EX 4092',
        rating: 4.9
      },
      restaurantName: 'Royal Biryani Darbar'
    },
    {
      id: 'ORD-7210',
      createdAt: 'Yesterday, 8:15 PM',
      items: [
        {
          cartItemId: 'order-item-3',
          foodItem: FOOD_ITEMS[1],
          quantity: 2,
          unitPrice: 299
        }
      ],
      subtotal: 598,
      discount: 150,
      deliveryFee: 0,
      taxes: 30,
      packagingFee: 20,
      total: 498,
      couponCode: 'TASTE30',
      status: 'Delivered',
      paymentMethod: 'Card',
      paymentStatus: 'Paid',
      deliveryAddress: DEMO_USER.addresses[0],
      deliveryOption: 'Standard',
      estimatedDeliveryTime: 'Delivered at 8:46 PM',
      deliveryPartner: {
        name: 'Vikas Meena',
        phone: '+91 98234 11223',
        vehicleNumber: 'RJ 14 BK 8831',
        rating: 4.8
      },
      restaurantName: 'Pizza Roma Artisanal'
    }
  ]);

  const placeOrder = (orderData: {
    address: UserAddress;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
    deliveryOption: 'Standard' | 'Express' | 'Scheduled';
  }): Order => {
    const newOrderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: newOrderId,
      createdAt: 'Just now',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee: cartDeliveryFee,
      taxes: cartTaxes,
      packagingFee: cartPackagingFee,
      total: cartTotal,
      couponCode: appliedCoupon?.code,
      status: 'Placed',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'Paid',
      deliveryAddress: orderData.address,
      deliveryOption: orderData.deliveryOption,
      estimatedDeliveryTime: orderData.deliveryOption === 'Express' ? '15-20 mins' : '25-35 mins',
      deliveryPartner: {
        name: 'Suresh Verma',
        phone: '+91 98111 22334',
        vehicleNumber: 'RJ 14 CZ 9988',
        rating: 4.9
      },
      restaurantName: cart[0]?.foodItem.cuisine.includes('Biryani') ? 'Royal Biryani Darbar' : 'TasteHub Kitchen'
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrderId);
    clearCart();
    setActivePage('order-detail');
    addToast(`Order ${newOrderId} placed successfully!`, 'success');

    // Persist to Supabase if configured
    supabaseService.saveOrder(newOrder);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    addToast(`Order ${orderId} status updated to "${newStatus}"`, 'info');

    // Persist to Supabase
    supabaseService.updateOrderStatus(orderId, newStatus);
  };

  // Dish management for admin with Supabase synchronization
  const toggleDishAvailability = (dishId: string) => {
    const current = dishes.find((d) => d.id === dishId);
    const newAvail = current ? !current.isAvailable : true;
    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, isAvailable: newAvail } : d))
    );
    addToast('Dish availability toggled', 'info');

    // Persist to Supabase
    supabaseService.toggleFoodItemAvailability(dishId, newAvail);
  };

  const updateDishPrice = (dishId: string, newPrice: number) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, price: newPrice } : d))
    );
    addToast('Dish price updated', 'success');

    // Persist to Supabase
    supabaseService.updateFoodItemPrice(dishId, newPrice);
  };

  const addNewDish = (dish: FoodItem) => {
    setDishes((prev) => [dish, ...prev]);
    addToast(`Added new dish "${dish.name}" to menu!`, 'success');

    // Persist to Supabase
    supabaseService.createFoodItem(dish);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        requestPasswordReset,
        resetPassword,
        loginAsCustomer,
        loginAsAdmin,
        logout,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        updateUserProfile,
        addAddress,
        deleteAddress,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTaxes,
        cartPackagingFee,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        favorites,
        toggleFavorite,
        selectedCity,
        setSelectedCity,
        activePage,
        setActivePage,
        activeDishSlug,
        setActiveDishSlug,
        activeBlogSlug,
        setActiveBlogSlug,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        orders,
        selectedOrderId,
        setSelectedOrderId,
        placeOrder,
        updateOrderStatus,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        isLocationOpen,
        setIsLocationOpen,
        selectedFoodForModal,
        setSelectedFoodForModal,
        dishes,
        toggleDishAvailability,
        updateDishPrice,
        addNewDish,
        isSupabaseLive,
        checkSupabaseConnection,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
