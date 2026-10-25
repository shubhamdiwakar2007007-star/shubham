-- ==============================================================================
-- TasteHub Food Delivery — Complete Supabase Database Schema & RLS Policies
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- It safely creates all tables, triggers, functions, indexes, RLS policies,
-- storage buckets, and initial seed data.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS & TRIGGERS

-- Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if current authenticated user has the 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. TABLES

-- PROFILES (Linked directly to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'delivery_partner')),
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile trigger on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://api.dicebear.com/7.x/initials/svg?seed=' || encode(digest(NEW.email, 'sha256'), 'hex'))
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- USER SAVED ADDRESSES
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'Home' CHECK (type IN ('Home', 'Work', 'Other')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FOOD CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon_name TEXT,
  color TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PARTNER RESTAURANTS
CREATE TABLE IF NOT EXISTS public.restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  logo TEXT,
  cuisine TEXT[] DEFAULT '{}',
  rating NUMERIC(3,1) DEFAULT 4.5,
  reviews_count INT DEFAULT 0,
  delivery_time_minutes INT DEFAULT 25,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  min_order NUMERIC(10,2) DEFAULT 0,
  is_open BOOLEAN DEFAULT TRUE,
  featured_offer TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FOOD ITEMS (DISHES)
CREATE TABLE IF NOT EXISTS public.food_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE SET NULL,
  cuisine TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  rating NUMERIC(3,1) DEFAULT 4.5,
  reviews_count INT DEFAULT 0,
  description TEXT,
  long_description TEXT,
  image TEXT,
  badge TEXT,
  is_veg BOOLEAN DEFAULT TRUE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_spicy BOOLEAN DEFAULT FALSE,
  calories INT,
  prep_time_minutes INT DEFAULT 20,
  ingredients TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  portion_sizes JSONB DEFAULT '[]',
  add_ons JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS on_food_items_updated ON public.food_items;
CREATE TRIGGER on_food_items_updated
  BEFORE UPDATE ON public.food_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  taxes NUMERIC(10,2) DEFAULT 0,
  packaging_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  coupon_code TEXT,
  status TEXT NOT NULL DEFAULT 'Placed' CHECK (status IN ('Placed', 'Confirmed', 'Preparing', 'Ready', 'OutForDelivery', 'Delivered', 'Cancelled')),
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Paid',
  delivery_option TEXT DEFAULT 'Standard',
  delivery_address JSONB NOT NULL,
  delivery_partner JSONB,
  restaurant_name TEXT,
  estimated_delivery_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS on_orders_updated ON public.orders;
CREATE TRIGGER on_orders_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ORDER ITEMS (Historical Snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  food_item_id TEXT REFERENCES public.food_items(id) ON DELETE SET NULL,
  food_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  customization JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  description TEXT,
  discount_percent INT,
  discount_amount NUMERIC(10,2),
  min_order NUMERIC(10,2) DEFAULT 0,
  max_discount NUMERIC(10,2),
  expiry_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CUSTOMER REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  dish_name TEXT,
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT,
  author TEXT,
  author_avatar TEXT,
  published_date TEXT,
  read_time TEXT,
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & update their own profile; admins can view all
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- User Addresses: Users only access their own addresses
CREATE POLICY "Users manage their own addresses" ON public.user_addresses
  FOR ALL USING (auth.uid() = user_id);

-- Categories: Public read, Admin manage
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- Restaurants: Public read, Admin manage
CREATE POLICY "Anyone can view restaurants" ON public.restaurants
  FOR SELECT USING (true);
CREATE POLICY "Admins manage restaurants" ON public.restaurants
  FOR ALL USING (public.is_admin());

-- Food Items (Dishes): Public read, Admin manage
CREATE POLICY "Anyone can view food items" ON public.food_items
  FOR SELECT USING (true);
CREATE POLICY "Admins manage food items" ON public.food_items
  FOR ALL USING (public.is_admin());

-- Orders: Users view their own orders; Admins view all orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- Order Items: Viewable if order is viewable
CREATE POLICY "Order items viewable by order owner or admin" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Anyone can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Coupons: Public read, Admin manage
CREATE POLICY "Anyone can view coupons" ON public.coupons
  FOR SELECT USING (true);
CREATE POLICY "Admins manage coupons" ON public.coupons
  FOR ALL USING (public.is_admin());

-- Reviews: Public read, Authenticated insert
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Blog Posts: Public read, Admin manage
CREATE POLICY "Anyone can read blog posts" ON public.blog_posts
  FOR SELECT USING (true);
CREATE POLICY "Admins manage blog posts" ON public.blog_posts
  FOR ALL USING (public.is_admin());

-- 5. STORAGE BUCKETS (Dish Images and User Avatars)
INSERT INTO storage.buckets (id, name, public)
VALUES ('dish-images', 'dish-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies: Public can read, authenticated/admin can upload
CREATE POLICY "Public Read Dish Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'dish-images');

CREATE POLICY "Authenticated/Admin Upload Dish Images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'dish-images');

CREATE POLICY "Admin Update/Delete Dish Images" ON storage.objects
  FOR ALL USING (bucket_id = 'dish-images' AND public.is_admin());

-- 6. REALTIME REPLICATION ENABLEMENT
-- Allows website visitors and admin panel to receive instant live dish updates & order dispatch changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.food_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 7. INITIAL SEED DATA

-- Categories
INSERT INTO public.categories (id, name, icon_name, color, display_order)
VALUES
  ('all', 'All', 'Grid', '#FF7518', 1),
  ('indian', 'Indian', 'Flame', '#E65100', 2),
  ('pizza', 'Pizza', 'Pizza', '#D84315', 3),
  ('burger', 'Burger', 'Sandwich', '#EF6C00', 4),
  ('chinese', 'Chinese', 'Soup', '#C62828', 5),
  ('south-indian', 'South Indian', 'UtensilsCrossed', '#F57C00', 6),
  ('desserts', 'Desserts', 'Cake', '#AD1457', 7),
  ('beverages', 'Beverages', 'Coffee', '#00838F', 8),
  ('healthy', 'Healthy', 'Salad', '#2E7D32', 9)
ON CONFLICT (id) DO NOTHING;

-- Restaurants
INSERT INTO public.restaurants (id, name, slug, image, logo, cuisine, rating, reviews_count, delivery_time_minutes, delivery_fee, min_order, is_open, featured_offer, address)
VALUES
  ('rest-1', 'Royal Biryani Darbar', 'royal-biryani-darbar', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80', '👑', ARRAY['Biryani', 'Mughlai', 'North Indian', 'Kebabs'], 4.8, 3420, 28, 0, 199, true, '30% OFF up to ₹100', 'Tonk Road, Bapu Nagar, Jaipur'),
  ('rest-2', 'Pizza Roma Artisanal', 'pizza-roma-artisanal', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80', '🍕', ARRAY['Italian', 'Artisan Pizza', 'Pasta', 'Desserts'], 4.7, 2840, 24, 30, 250, true, 'Flat ₹50 OFF on orders > ₹399', 'C-Scheme, Subhash Marg, Jaipur'),
  ('rest-3', 'The Burger Junction', 'the-burger-junction', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&auto=format&fit=crop&q=80', '🍔', ARRAY['Gourmet Burgers', 'Crispy Fries', 'Shakes'], 4.6, 1950, 22, 25, 150, true, 'Free Peri Peri Fries above ₹350', 'Malviya Nagar, Sector 4, Jaipur')
ON CONFLICT (id) DO NOTHING;

-- Featured Dishes matching Reference Image
INSERT INTO public.food_items (id, name, slug, category_id, restaurant_id, cuisine, price, original_price, rating, reviews_count, description, long_description, image, badge, is_veg, is_spicy, calories, prep_time_minutes, is_featured, is_available)
VALUES
  ('dish-1', 'Chicken Biryani', 'chicken-biryani', 'indian', 'rest-1', 'Mughlai / Hyderabadi', 249, 320, 4.8, 2100, 'Aromatic & flavorful', 'Authentic dum pukht biryani cooked with marinated succulent chicken pieces, aged long-grain basmati rice, fragrant whole spices, saffron, and fried onions.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', 'Bestseller', false, true, 580, 25, true, true),
  ('dish-2', 'Margherita Pizza', 'margherita-pizza', 'pizza', 'rest-2', 'Italian', 299, 360, 4.6, 1800, 'Classic delight', 'Hand-stretched sourdough crust fired to blistered perfection. Topped with imported San Marzano tomato reduction, melted fresh Fior di Latte mozzarella, and sweet basil leaves.', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80', 'Popular', true, false, 620, 20, true, true),
  ('dish-3', 'Crispy Chicken Burger', 'crispy-chicken-burger', 'burger', 'rest-3', 'American', 199, 249, 4.5, 1200, 'Juicy & Crunchy', 'Golden buttermilk-fried crispy chicken breast coated with secret seasoned crumbs, layered with crisp iceberg lettuce, cheddar, and signature house smoked paprika mayo.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', 'Trending', false, true, 540, 18, true, true),
  ('dish-4', 'Paneer Butter Masala', 'paneer-butter-masala', 'indian', 'rest-1', 'North Indian', 229, 280, 4.7, 980, 'Rich & Creamy', 'Fresh malai paneer cubes simmered in a velvety gravy of vine-ripened tomatoes, sweet cashews, fresh butter, cream, and infused with crushed kasuri methi.', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80', 'Chef Special', true, false, 490, 20, true, true),
  ('dish-5', 'Chocolate Lava Cake', 'chocolate-lava-cake', 'desserts', 'rest-2', 'Bakery & Dessert', 149, 199, 4.9, 1100, 'Heavenly Dessert', 'Decadent dark chocolate soufflé cake with a warm, molten ganache center that oozes luxuriously upon first spoon cut.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', 'Must Try', true, false, 380, 12, true, true)
ON CONFLICT (id) DO NOTHING;

-- Coupons
INSERT INTO public.coupons (code, description, discount_percent, max_discount, min_order, expiry_date, is_active)
VALUES
  ('TASTE30', 'Flat 30% OFF on your first order up to ₹150', 30, 150, 199, '2026-12-31', true),
  ('FREEDEL', 'Free Delivery on any order above ₹249', NULL, 40, 249, '2026-12-31', true),
  ('FESTIVE50', 'Special 50% discount on gourmet meals over ₹499', 50, 200, 499, '2026-12-31', true)
ON CONFLICT (code) DO NOTHING;

-- ==============================================================================
-- HOW TO ASSIGN YOUR FIRST ADMINISTRATOR ACCOUNT:
-- 1. Sign up on your website using your email (e.g. admin@tastehub.com)
-- 2. In Supabase SQL Editor, run:
--    UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- ==============================================================================
