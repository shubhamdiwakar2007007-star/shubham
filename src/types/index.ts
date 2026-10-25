export interface FoodItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  cuisine: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  longDescription?: string;
  image: string;
  badge?: string;
  isVeg: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  calories?: number;
  prepTimeMinutes: number;
  ingredients?: string[];
  allergens?: string[];
  portionSizes?: { name: string; priceMultiplier: number }[];
  addOns?: { name: string; price: number }[];
  restaurantId?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
  count?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  image: string;
  logo: string;
  cuisine: string[];
  rating: number;
  reviewsCount: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  featuredOffer?: string;
  address: string;
}

export interface CartCustomization {
  portionSize?: string;
  selectedAddOns?: string[];
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  foodItem: FoodItem;
  quantity: number;
  unitPrice: number;
  customization?: CartCustomization;
}

export interface UserAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  taxes: number;
  packagingFee: number;
  total: number;
  couponCode?: string;
  status: 'Placed' | 'Confirmed' | 'Preparing' | 'Ready' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  deliveryAddress: UserAddress;
  deliveryOption: 'Standard' | 'Express' | 'Scheduled';
  estimatedDeliveryTime: string;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    rating: number;
  };
  restaurantName: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  dishName?: string;
  isVerifiedPurchase: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorAvatar: string;
  publishedDate: string;
  readTime: string;
  image: string;
  tags: string[];
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'delivery_partner';
  avatar: string;
  addresses: UserAddress[];
  favoriteDishIds: string[];
}
