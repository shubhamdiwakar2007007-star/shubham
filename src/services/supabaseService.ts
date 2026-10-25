import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FoodItem, Order, Category, Restaurant, Coupon } from '../types';
import { FOOD_ITEMS, CATEGORIES, RESTAURANTS, COUPONS } from '../data/mockData';

// Map database row snake_case to frontend FoodItem camelCase
function mapDbDishToFoodItem(row: any): FoodItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || row.id,
    category: row.category_id || 'indian',
    cuisine: row.cuisine || '',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    rating: Number(row.rating || 4.5),
    reviewsCount: Number(row.reviews_count || 0),
    description: row.description || '',
    longDescription: row.long_description || row.description || '',
    image: row.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    badge: row.badge,
    isVeg: Boolean(row.is_veg),
    isVegan: Boolean(row.is_vegan),
    isSpicy: Boolean(row.is_spicy),
    calories: row.calories ? Number(row.calories) : undefined,
    prepTimeMinutes: Number(row.prep_time_minutes || 20),
    ingredients: row.ingredients || [],
    allergens: row.allergens || [],
    portionSizes: row.portion_sizes || [],
    addOns: row.add_ons || [],
    restaurantId: row.restaurant_id,
    isFeatured: Boolean(row.is_featured),
    isAvailable: row.is_available !== false
  };
}

// Map FoodItem camelCase to database row snake_case
function mapFoodItemToDbRow(dish: FoodItem): any {
  return {
    id: dish.id,
    name: dish.name,
    slug: dish.slug || dish.id,
    category_id: dish.category,
    restaurant_id: dish.restaurantId || 'rest-1',
    cuisine: dish.cuisine,
    price: dish.price,
    original_price: dish.originalPrice,
    rating: dish.rating,
    reviews_count: dish.reviewsCount,
    description: dish.description,
    long_description: dish.longDescription,
    image: dish.image,
    badge: dish.badge,
    is_veg: dish.isVeg,
    is_vegan: dish.isVegan || false,
    is_spicy: dish.isSpicy || false,
    calories: dish.calories,
    prep_time_minutes: dish.prepTimeMinutes,
    ingredients: dish.ingredients || [],
    allergens: dish.allergens || [],
    portion_sizes: dish.portionSizes || [],
    add_ons: dish.addOns || [],
    is_featured: dish.isFeatured || false,
    is_available: dish.isAvailable !== false
  };
}

export const supabaseService = {
  // Dishes / Food Items
  async getFoodItems(): Promise<{ data: FoodItem[]; isLiveDb: boolean }> {
    if (!isSupabaseConfigured()) {
      return { data: FOOD_ITEMS, isLiveDb: false };
    }

    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        if (error) console.warn('Supabase getFoodItems query notice:', error.message);
        return { data: FOOD_ITEMS, isLiveDb: false };
      }

      return { data: data.map(mapDbDishToFoodItem), isLiveDb: true };
    } catch (err) {
      console.error('Error fetching food items from Supabase:', err);
      return { data: FOOD_ITEMS, isLiveDb: false };
    }
  },

  async updateFoodItemPrice(id: string, price: number): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from('food_items')
        .update({ price })
        .eq('id', id);

      if (error) {
        console.error('Supabase update price error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error updating price:', err);
      return false;
    }
  },

  async toggleFoodItemAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from('food_items')
        .update({ is_available: isAvailable })
        .eq('id', id);

      if (error) {
        console.error('Supabase toggle availability error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error toggling availability:', err);
      return false;
    }
  },

  async createFoodItem(dish: FoodItem): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const row = mapFoodItemToDbRow(dish);
      const { error } = await supabase.from('food_items').insert(row);
      if (error) {
        console.error('Supabase create food item error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error creating food item:', err);
      return false;
    }
  },

  // Realtime subscription for Dishes
  subscribeToFoodItems(onPayload: (payload: any) => void) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel('public:food_items')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'food_items' },
        (payload) => {
          onPayload(payload);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  },

  // Orders
  async getOrders(userId?: string): Promise<{ data: Order[]; isLiveDb: boolean }> {
    if (!isSupabaseConfigured()) {
      return { data: [], isLiveDb: false };
    }

    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;

      if (error || !data) {
        return { data: [], isLiveDb: false };
      }

      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o.id,
        createdAt: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [],
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        deliveryFee: Number(o.delivery_fee),
        taxes: Number(o.taxes),
        packagingFee: Number(o.packaging_fee),
        total: Number(o.total),
        couponCode: o.coupon_code,
        status: o.status,
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status,
        deliveryOption: o.delivery_option,
        deliveryAddress: o.delivery_address,
        deliveryPartner: o.delivery_partner,
        restaurantName: o.restaurant_name || 'TasteHub Kitchen',
        estimatedDeliveryTime: o.estimated_delivery_time || '25-30 mins'
      }));

      return { data: mappedOrders, isLiveDb: true };
    } catch (err) {
      console.error('Error fetching orders from Supabase:', err);
      return { data: [], isLiveDb: false };
    }
  },

  async saveOrder(order: Order): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const { error: orderError } = await supabase.from('orders').insert({
        id: order.id,
        subtotal: order.subtotal,
        discount: order.discount,
        delivery_fee: order.deliveryFee,
        taxes: order.taxes,
        packaging_fee: order.packagingFee,
        total: order.total,
        coupon_code: order.couponCode,
        status: order.status,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        delivery_option: order.deliveryOption,
        delivery_address: order.deliveryAddress,
        delivery_partner: order.deliveryPartner,
        restaurant_name: order.restaurantName,
        estimated_delivery_time: order.estimatedDeliveryTime
      });

      if (orderError) {
        console.error('Error inserting order into Supabase:', orderError);
        return false;
      }

      // Insert Order Items
      if (order.items && order.items.length > 0) {
        const itemRows = order.items.map((item) => ({
          order_id: order.id,
          food_item_id: item.foodItem.id,
          food_name: item.foodItem.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          customization: item.customization || {}
        }));

        await supabase.from('order_items').insert(itemRows);
      }

      return true;
    } catch (err) {
      console.error('Error saving order:', err);
      return false;
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        console.error('Supabase update order status error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error updating order status in Supabase:', err);
      return false;
    }
  },

  // Realtime subscription for Orders
  subscribeToOrders(onPayload: (payload: any) => void) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          onPayload(payload);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
};
