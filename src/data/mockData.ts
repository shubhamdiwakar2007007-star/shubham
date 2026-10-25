import { FoodItem, Category, Restaurant, CustomerReview, BlogPost, Coupon, UserProfile } from '../types';

export const CITIES = [
  'Jaipur',
  'Delhi NCR',
  'Mumbai',
  'Bengaluru',
  'Pune',
  'Hyderabad',
  'Kolkata',
  'Ahmedabad',
  'Chandigarh',
  'Chennai'
];

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', iconName: 'Grid', color: '#FF7518', count: 48 },
  { id: 'indian', name: 'Indian', iconName: 'Flame', color: '#E65100', count: 18 },
  { id: 'pizza', name: 'Pizza', iconName: 'Pizza', color: '#D84315', count: 12 },
  { id: 'burger', name: 'Burger', iconName: 'Sandwich', color: '#EF6C00', count: 10 },
  { id: 'chinese', name: 'Chinese', iconName: 'Soup', color: '#C62828', count: 14 },
  { id: 'south-indian', name: 'South Indian', iconName: 'UtensilsCrossed', color: '#F57C00', count: 9 },
  { id: 'desserts', name: 'Desserts', iconName: 'Cake', color: '#AD1457', count: 8 },
  { id: 'beverages', name: 'Beverages', iconName: 'Coffee', color: '#00838F', count: 11 },
  { id: 'healthy', name: 'Healthy', iconName: 'Salad', color: '#2E7D32', count: 7 }
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'dish-1',
    name: 'Chicken Biryani',
    slug: 'chicken-biryani',
    category: 'indian',
    cuisine: 'Mughlai / Hyderabadi',
    price: 249,
    originalPrice: 320,
    rating: 4.8,
    reviewsCount: 2100,
    description: 'Aromatic & flavorful',
    longDescription: 'Authentic dum pukht biryani cooked with marinated succulent chicken pieces, aged long-grain basmati rice, fragrant whole spices, saffron, and fried onions. Served with spiced mint raita and salan.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    badge: 'Bestseller',
    isVeg: false,
    isSpicy: true,
    calories: 580,
    prepTimeMinutes: 25,
    ingredients: ['Basmati Rice', 'Farm Fresh Chicken', 'Saffron', 'Whole Spices', 'Ghee', 'Fried Onions', 'Mint & Coriander'],
    allergens: ['Dairy (Ghee)'],
    portionSizes: [
      { name: 'Regular (Serves 1)', priceMultiplier: 1.0 },
      { name: 'Medium (Serves 2)', priceMultiplier: 1.7 },
      { name: 'Family Pot (Serves 4)', priceMultiplier: 3.0 }
    ],
    addOns: [
      { name: 'Extra Spiced Raita', price: 30 },
      { name: 'Mirchi Ka Salan (Curry)', price: 40 },
      { name: 'Extra Boiled Egg (2 pcs)', price: 40 },
      { name: 'Roasted Papad & Pickle', price: 25 }
    ],
    restaurantId: 'rest-1',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 'dish-2',
    name: 'Margherita Pizza',
    slug: 'margherita-pizza',
    category: 'pizza',
    cuisine: 'Italian',
    price: 299,
    originalPrice: 360,
    rating: 4.6,
    reviewsCount: 1800,
    description: 'Classic delight',
    longDescription: 'Hand-stretched sourdough crust fired to blistered perfection. Topped with imported San Marzano tomato reduction, melted fresh Fior di Latte mozzarella, extra virgin olive oil, and hand-torn sweet basil leaves.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
    badge: 'Popular',
    isVeg: true,
    isSpicy: false,
    calories: 620,
    prepTimeMinutes: 20,
    ingredients: ['Sourdough Base', 'San Marzano Tomato Sauce', 'Fresh Mozzarella', 'Fresh Basil', 'EVOO'],
    allergens: ['Gluten', 'Dairy'],
    portionSizes: [
      { name: 'Regular 8"', priceMultiplier: 1.0 },
      { name: 'Medium 10"', priceMultiplier: 1.4 },
      { name: 'Large 12"', priceMultiplier: 1.8 }
    ],
    addOns: [
      { name: 'Extra Buffalo Mozzarella', price: 60 },
      { name: 'Garlic Butter Crust Dip', price: 40 },
      { name: 'Jalapenos & Sundried Tomatoes', price: 45 },
      { name: 'Chili Flakes & Herb Shaker', price: 15 }
    ],
    restaurantId: 'rest-2',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 'dish-3',
    name: 'Crispy Chicken Burger',
    slug: 'crispy-chicken-burger',
    category: 'burger',
    cuisine: 'American',
    price: 199,
    originalPrice: 249,
    rating: 4.5,
    reviewsCount: 1200,
    description: 'Juicy & Crunchy',
    longDescription: 'Golden buttermilk-fried crispy chicken breast coated with secret seasoned crumbs, layered with crisp iceberg lettuce, tangy dill pickles, and signature house smoked paprika mayo in a butter-toasted brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    badge: 'Trending',
    isVeg: false,
    isSpicy: true,
    calories: 540,
    prepTimeMinutes: 18,
    ingredients: ['Crispy Chicken Fillet', 'Brioche Bun', 'Iceberg Lettuce', 'Cheddar Cheese Slice', 'House Mayo', 'Pickles'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    portionSizes: [
      { name: 'Single Patty', priceMultiplier: 1.0 },
      { name: 'Double Crunchy Patty', priceMultiplier: 1.6 }
    ],
    addOns: [
      { name: 'Cheddar Cheese Melt', price: 35 },
      { name: 'Crispy Bacon (Chicken)', price: 50 },
      { name: 'Peri-Peri Crinkle Fries', price: 79 },
      { name: 'Chilled Coke Can (300ml)', price: 40 }
    ],
    restaurantId: 'rest-3',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 'dish-4',
    name: 'Paneer Butter Masala',
    slug: 'paneer-butter-masala',
    category: 'indian',
    cuisine: 'North Indian',
    price: 229,
    originalPrice: 280,
    rating: 4.7,
    reviewsCount: 980,
    description: 'Rich & Creamy',
    longDescription: 'Fresh malai paneer cubes simmered in a velvety gravy of vine-ripened tomatoes, sweet cashews, fresh butter, cream, and infused with crushed kasuri methi and green cardamom notes.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    badge: 'Chef Special',
    isVeg: true,
    isSpicy: false,
    calories: 490,
    prepTimeMinutes: 20,
    ingredients: ['Malai Paneer', 'Tomato Puree', 'Cashew Paste', 'Butter', 'Fresh Cream', 'Kasuri Methi', 'Cardamom'],
    allergens: ['Dairy', 'Nuts (Cashews)'],
    portionSizes: [
      { name: 'Half Bowl (Serves 1)', priceMultiplier: 1.0 },
      { name: 'Full Handi (Serves 2-3)', priceMultiplier: 1.7 }
    ],
    addOns: [
      { name: 'Butter Garlic Naan (2 pcs)', price: 75 },
      { name: 'Laccha Paratha (2 pcs)', price: 65 },
      { name: 'Jeera Rice Bowl', price: 90 },
      { name: 'Sirka Pyaz (Pickled Onions)', price: 20 }
    ],
    restaurantId: 'rest-4',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 'dish-5',
    name: 'Chocolate Lava Cake',
    slug: 'chocolate-lava-cake',
    category: 'desserts',
    cuisine: 'Bakery & Dessert',
    price: 149,
    originalPrice: 199,
    rating: 4.9,
    reviewsCount: 1100,
    description: 'Heavenly Dessert',
    longDescription: 'Decadent dark chocolate soufflé cake with a warm, molten ganache center that oozes luxuriously upon first spoon cut. Dusted with fine cocoa and served with rich Belgian chocolate drizzle.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    badge: 'Must Try',
    isVeg: true,
    isSpicy: false,
    calories: 380,
    prepTimeMinutes: 12,
    ingredients: ['Belgian Dark Chocolate 70%', 'Pure Cocoa', 'Butter', 'Brown Sugar', 'Vanilla Extract'],
    allergens: ['Gluten', 'Dairy'],
    portionSizes: [
      { name: 'Single Cup', priceMultiplier: 1.0 },
      { name: 'Twin Pack (Save 15%)', priceMultiplier: 1.7 }
    ],
    addOns: [
      { name: 'Vanilla Bean Ice Cream Scoop', price: 49 },
      { name: 'Crushed Roasted Hazelnut Dust', price: 30 },
      { name: 'Warm Chocolate Fudge Dip', price: 35 }
    ],
    restaurantId: 'rest-2',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 'dish-6',
    name: 'Hakka Noodles & Wok Tossed Veg',
    slug: 'hakka-noodles',
    category: 'chinese',
    cuisine: 'Indo-Chinese',
    price: 189,
    originalPrice: 230,
    rating: 4.5,
    reviewsCount: 750,
    description: 'Smoky & Wok-tossed',
    longDescription: 'Thin noodles stir-fried on intense wok fire with crunchy shredded cabbage, capsicum, scallions, French beans, toasted garlic, and dark umami soy drizzle.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
    badge: 'Hot',
    isVeg: true,
    isVegan: true,
    isSpicy: true,
    calories: 420,
    prepTimeMinutes: 15,
    ingredients: ['Wheat Noodles', 'Cabbage', 'Bell Peppers', 'Garlic', 'Scallions', 'Soy Sauce', 'Chili Oil'],
    allergens: ['Gluten', 'Soy'],
    portionSizes: [
      { name: 'Regular Box', priceMultiplier: 1.0 },
      { name: 'Large Sharing Box', priceMultiplier: 1.6 }
    ],
    addOns: [
      { name: 'Crispy Veg Spring Rolls (4 pcs)', price: 99 },
      { name: 'Veg Manchurian Gravy Dip', price: 60 },
      { name: 'Spicy Schezwan Sauce Dip', price: 25 }
    ],
    restaurantId: 'rest-5',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 'dish-7',
    name: 'Crispy Masala Dosa',
    slug: 'crispy-masala-dosa',
    category: 'south-indian',
    cuisine: 'South Indian',
    price: 159,
    originalPrice: 199,
    rating: 4.8,
    reviewsCount: 1420,
    description: 'Golden, crispy & aromatic',
    longDescription: 'Paper-thin, golden fermenteed rice-lentil crepe cooked with pure desi ghee, stuffed with spiced mustard-tempered mashed potatoes. Served with fresh coconut chutney, tomato onion chutney, and steaming piping hot drumstick sambar.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    badge: 'Pure Ghee',
    isVeg: true,
    isSpicy: false,
    calories: 360,
    prepTimeMinutes: 15,
    ingredients: ['Rice Lentil Batter', 'Desi Ghee', 'Potatoes', 'Mustard Seeds', 'Curry Leaves', 'Coconut'],
    allergens: ['Dairy (Ghee)'],
    portionSizes: [
      { name: 'Single Standard', priceMultiplier: 1.0 },
      { name: 'Special Cheese Masala Dosa', priceMultiplier: 1.35 }
    ],
    addOns: [
      { name: 'Medu Vada (1 pc)', price: 35 },
      { name: 'Extra Gunpowder Podi with Ghee', price: 30 },
      { name: 'Filter Coffee Tumbler', price: 45 }
    ],
    restaurantId: 'rest-6',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 'dish-8',
    name: 'Mediterranean Greek Salad',
    slug: 'mediterranean-greek-salad',
    category: 'healthy',
    cuisine: 'Continental',
    price: 219,
    originalPrice: 260,
    rating: 4.7,
    reviewsCount: 520,
    description: 'Crisp, nutritious & fresh',
    longDescription: 'Crisp garden romaine lettuce, English cucumbers, cherry tomatoes, Kalamata olives, thinly sliced red onion, and crumbled creamy Greek feta cheese, tossed in oregano infused extra virgin olive oil dressing.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    badge: 'Low Calorie',
    isVeg: true,
    isSpicy: false,
    calories: 280,
    prepTimeMinutes: 10,
    ingredients: ['Romaine Lettuce', 'Feta Cheese', 'Kalamata Olives', 'Cherry Tomatoes', 'English Cucumber', 'EVOO Dressing'],
    allergens: ['Dairy (Feta)'],
    portionSizes: [
      { name: 'Regular Bowl', priceMultiplier: 1.0 },
      { name: 'Protein Boosted (Grilled Paneer)', priceMultiplier: 1.4 }
    ],
    addOns: [
      { name: 'Warm Garlic Herb Focaccia (2 pcs)', price: 50 },
      { name: 'Extra Feta Cheese Crumbles', price: 40 },
      { name: 'Toasted Pumpkin & Chia Seeds', price: 30 }
    ],
    restaurantId: 'rest-2',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 'dish-9',
    name: 'Alphonso Mango Lassi',
    slug: 'alphonso-mango-lassi',
    category: 'beverages',
    cuisine: 'Beverages',
    price: 119,
    originalPrice: 150,
    rating: 4.8,
    reviewsCount: 890,
    description: 'Thick, chilled & fruity',
    longDescription: 'Slow-churned velvety whole milk curd blended with real Alphonso mango pulp, green cardamom powder, and garnished with slivered pistachios and saffron strands.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80',
    badge: 'Chilled',
    isVeg: true,
    isSpicy: false,
    calories: 220,
    prepTimeMinutes: 8,
    ingredients: ['Cultured Yogurt (Dahi)', 'Alphonso Mango Pulp', 'Pistachios', 'Saffron', 'Cardamom'],
    allergens: ['Dairy', 'Nuts (Pistachio)'],
    portionSizes: [
      { name: 'Regular Glass (350ml)', priceMultiplier: 1.0 },
      { name: 'Large Kulhad (500ml)', priceMultiplier: 1.4 }
    ],
    addOns: [
      { name: 'Extra Pistachio & Almond Crumb', price: 20 },
      { name: 'Kulfi Ice Cream Float', price: 40 }
    ],
    restaurantId: 'rest-1',
    isFeatured: false,
    isAvailable: true
  }
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Royal Biryani Darbar',
    slug: 'royal-biryani-darbar',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    logo: '👑',
    cuisine: ['Biryani', 'Mughlai', 'North Indian', 'Kebabs'],
    rating: 4.8,
    reviewsCount: 3420,
    deliveryTimeMinutes: 28,
    deliveryFee: 0,
    minOrder: 199,
    isOpen: true,
    featuredOffer: '30% OFF up to ₹100',
    address: 'Tonk Road, Bapu Nagar, Jaipur'
  },
  {
    id: 'rest-2',
    name: 'Pizza Roma Artisanal',
    slug: 'pizza-roma-artisanal',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    logo: '🍕',
    cuisine: ['Italian', 'Artisan Pizza', 'Pasta', 'Desserts'],
    rating: 4.7,
    reviewsCount: 2840,
    deliveryTimeMinutes: 24,
    deliveryFee: 30,
    minOrder: 250,
    isOpen: true,
    featuredOffer: 'Flat ₹50 OFF on orders > ₹399',
    address: 'C-Scheme, Subhash Marg, Jaipur'
  },
  {
    id: 'rest-3',
    name: 'The Burger Junction',
    slug: 'the-burger-junction',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&auto=format&fit=crop&q=80',
    logo: '🍔',
    cuisine: ['Gourmet Burgers', 'Crispy Fries', 'Shakes'],
    rating: 4.6,
    reviewsCount: 1950,
    deliveryTimeMinutes: 22,
    deliveryFee: 25,
    minOrder: 150,
    isOpen: true,
    featuredOffer: 'Free Peri Peri Fries above ₹350',
    address: 'Malviya Nagar, Sector 4, Jaipur'
  },
  {
    id: 'rest-4',
    name: 'The Grand Spice Route',
    slug: 'the-grand-spice-route',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=80',
    logo: '🍛',
    cuisine: ['Pure Veg', 'North Indian', 'Paneer Specials', 'Tandoor'],
    rating: 4.7,
    reviewsCount: 1670,
    deliveryTimeMinutes: 30,
    deliveryFee: 0,
    minOrder: 200,
    isOpen: true,
    featuredOffer: '20% OFF on all Curry Combos',
    address: 'Vaishali Nagar, Gandhi Path, Jaipur'
  },
  {
    id: 'rest-5',
    name: 'Dragon Wok Asian Kitchen',
    slug: 'dragon-wok-asian-kitchen',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    logo: '🥢',
    cuisine: ['Chinese', 'Dim Sum', 'Noodles', 'Pan-Asian'],
    rating: 4.5,
    reviewsCount: 1120,
    deliveryTimeMinutes: 26,
    deliveryFee: 35,
    minOrder: 199,
    isOpen: true,
    featuredOffer: 'Buy 1 Get 1 Dim Sum on Weekdays',
    address: 'MI Road, City Centre, Jaipur'
  },
  {
    id: 'rest-6',
    name: 'Sagar Ratna Delights',
    slug: 'sagar-ratna-delights',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80',
    logo: '🥥',
    cuisine: ['South Indian', 'Ghee Dosas', 'Filter Coffee'],
    rating: 4.8,
    reviewsCount: 2280,
    deliveryTimeMinutes: 20,
    deliveryFee: 20,
    minOrder: 120,
    isOpen: true,
    featuredOffer: 'Combo meals starting ₹199',
    address: 'Raja Park, Lane 3, Jaipur'
  }
];

export const TESTIMONIALS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Amazing food quality and super fast delivery! TasteHub is now my go-to food app.',
    date: 'Yesterday',
    dishName: 'Chicken Biryani & Butter Naan',
    isVerifiedPurchase: true
  },
  {
    id: 'rev-2',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The Margherita Pizza arrived piping hot with crispy crust. Their live order tracking kept me updated every minute.',
    date: '3 days ago',
    dishName: 'Margherita Pizza 12"',
    isVerifiedPurchase: true
  },
  {
    id: 'rev-3',
    name: 'Ananya Sen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Chocolate Lava cake was pure heaven! The packaging maintained the molten center perfectly.',
    date: '1 week ago',
    dishName: 'Chocolate Lava Cake',
    isVerifiedPurchase: true
  },
  {
    id: 'rev-4',
    name: 'Vikram Roy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Best food ordering UI in town. Transparent billing, no surprise fees, and delivered in just 22 minutes.',
    date: '2 weeks ago',
    dishName: 'Crispy Chicken Burger',
    isVerifiedPurchase: true
  }
];

export const COUPONS: Coupon[] = [
  {
    code: 'TASTE30',
    description: 'Flat 30% OFF on your first order up to ₹150',
    discountPercent: 30,
    maxDiscount: 150,
    minOrder: 199,
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    code: 'FREEDEL',
    description: 'Free Delivery on any order above ₹249',
    discountAmount: 40,
    minOrder: 249,
    expiryDate: '2026-11-30',
    isActive: true
  },
  {
    code: 'FESTIVE50',
    description: 'Special 50% discount on gourmet meals over ₹499',
    discountPercent: 50,
    maxDiscount: 200,
    minOrder: 499,
    expiryDate: '2026-12-25',
    isActive: true
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Art of Dum Biryani: Why Layering and Slow Fire Matter',
    slug: 'the-art-of-dum-biryani',
    excerpt: 'Explore the centuries-old royal Mughlai tradition of sealing brass pots with dough to trap aromatic steam.',
    content: `Dum cooking (derived from Persian 'dum pukht', meaning 'air-cooked') is an art form mastered over centuries. When fragrant basmati rice is layered alternately with marinated tender meat, brown crispy onions (birista), fresh mint, and saffron-infused milk, something magical occurs inside the sealed handi.

    At TasteHub partner kitchens, our chefs honor this time-tested method. Slow cooking under steady low flame ensures every grain of rice absorbs the deep essence of whole green cardamoms, star anise, cinnamon quills, and rich ghee without drying out.

    Next time you order our signature Chicken Biryani, notice how the steam bursts with aroma the second you open the lid. That is the true mark of authentic dum cooking!`,
    category: 'Culinary Secrets',
    author: 'Chef Ranveer K.',
    authorAvatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&auto=format&fit=crop&q=80',
    publishedDate: 'Oct 20, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    tags: ['Biryani', 'Culinary History', 'Authentic Indian']
  },
  {
    id: 'blog-2',
    title: 'Sourdough vs Commercial Pizza Crusts: The Fermentation Difference',
    slug: 'sourdough-vs-commercial-pizza-crusts',
    excerpt: 'Why 48-hour slow cold fermentation creates a light, bubbly crust that is both easier to digest and incredibly flavorful.',
    content: `A truly great Neapolitan pizza lives or dies by its crust. Unlike fast commercial dough loaded with excessive yeast and sugar, artisanal sourdough relies on wild natural cultures and a minimum 48-hour cold fermentation process.

    This slow breakdown turns complex carbohydrates into easily digestible sugars, developing the characteristic complex tangy note and forming airy, blistered 'cornicione' leopard crusts when blasted at 450°C in a stone oven.

    Pair this with authentic crushed San Marzano tomatoes and creamy Fior di Latte mozzarella, and you understand why TasteHub's Margherita Pizza is a timeless favorite.`,
    category: 'Kitchen Craft',
    author: 'Marco Rossi',
    authorAvatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=120&auto=format&fit=crop&q=80',
    publishedDate: 'Oct 15, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80',
    tags: ['Pizza', 'Sourdough', 'Italian']
  },
  {
    id: 'blog-3',
    title: '5 Clean Eating Food Hacks For High-Performance Workdays',
    slug: '5-clean-eating-hacks-for-busy-workdays',
    excerpt: 'How mindful ingredient choices can prevent mid-afternoon energy slumps and keep your focus razor-sharp.',
    content: `In the rush of back-to-back meetings and deadlines, ordering lunch is often an afterthought. However, food heavy in refined sugars and trans fats triggers massive insulin spikes followed by the dreaded 3 PM crash.

    Here are 5 science-backed principles our nutritional team recommends:
    1. Balance complex carbohydrates with high protein (e.g. paneer, chicken, or lentils).
    2. Add vibrant raw greens to maintain hydration and gut enzyme balance.
    3. Choose cold-pressed oils and ghee in moderate amounts for healthy brain fats.
    4. Stay hydrated with traditional electrolyte drinks like buttermilk or coconut water instead of carbonated sodas.
    5. Allow 15 uninterrupted minutes to savor your meal instead of typing between bites.`,
    category: 'Healthy Living',
    author: 'Dr. Radhika Sen',
    authorAvatar: 'https://images.unsplash.com/photo-1594824813627-9c968f864cf4?w=120&auto=format&fit=crop&q=80',
    publishedDate: 'Oct 10, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    tags: ['Wellness', 'Productivity', 'Nutrition']
  }
];

export const DEMO_USER: UserProfile = {
  id: 'usr-demo-1',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  addresses: [
    {
      id: 'addr-1',
      type: 'Home',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      street: 'Flat 402, Royal Palms Residency, Tonk Road',
      landmark: 'Near Gandhi Circle',
      city: 'Jaipur',
      state: 'Rajasthan',
      postalCode: '302015',
      isDefault: true
    },
    {
      id: 'addr-2',
      type: 'Work',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      street: 'Tower B, 6th Floor, Cyber Tech Park, Malviya Nagar',
      landmark: 'Opposite World Trade Park',
      city: 'Jaipur',
      state: 'Rajasthan',
      postalCode: '302017',
      isDefault: false
    }
  ],
  favoriteDishIds: ['dish-1', 'dish-2', 'dish-5']
};

export const DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-1',
  name: 'Admin TasteHub',
  email: 'admin@tastehub.com',
  phone: '+91 98980 00000',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  addresses: [],
  favoriteDishIds: []
};
