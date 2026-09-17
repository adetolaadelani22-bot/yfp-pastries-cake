import { Product, Category, DeliveryZone, Coupon, BusinessSettings, Review } from '../types';

export const INITIAL_SETTINGS: BusinessSettings = {
  businessName: "YFP Pastries & Cakes",
  tagline: "Yatex's Food Plug — Freshly Baked, Handcrafted Luxury in Osun & Nationwide Delivery",
  phone: "07064918034",
  whatsappPhone: "07064918034",
  email: "adetolaadelani22@gmail.com",
  address: "Ila-Orangun, Osun State, Nigeria",
  operatingHours: {
    weekdays: "Monday – Saturday: 7:00 AM – 9:00 PM",
    sundays: "Sunday: 8:00 AM – 6:00 PM",
  },
  minimumOrder: 2000,
  currency: "NGN",
  deliveryNotice: "Fresh batches baked every morning from our Ila-Orangun bakery hub. Express delivery across all 36 Nigerian States + FCT Abuja!",
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-pastries",
    name: "Pastries",
    slug: "pastries",
    image: "/pastries-cat.jpg",
    description: "Flaky golden meat pies, fish pies, sausage rolls and savory treats.",
    itemCount: 4,
    active: true,
  },
  {
    id: "cat-cakes",
    name: "Cakes",
    slug: "cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    description: "Rich layered chocolate, red velvet, vanilla cream & celebration cakes.",
    itemCount: 4,
    active: true,
  },
  {
    id: "cat-snacks",
    name: "Snacks",
    slug: "snacks",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    description: "Crunchy Nigerian chin chin, doughnuts, and scotch eggs.",
    itemCount: 3,
    active: true,
  },
  {
    id: "cat-chops",
    name: "Small Chops",
    slug: "small-chops",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    description: "Authentic Nigerian party finger food boxes and mini chops.",
    itemCount: 2,
    active: true,
  },
  {
    id: "cat-celebration",
    name: "Celebration Cakes",
    slug: "celebration-cakes",
    image: "/celebration-cake-cat.jpg",
    description: "Bespoke tiered cakes for birthdays, weddings and milestones.",
    itemCount: 2,
    active: true,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-sig-choc-cake",
    name: "Signature Chocolate Cake",
    slug: "signature-chocolate-cake",
    category: "Cakes",
    description: "Indulgent layers of moist, premium Belgian chocolate cake filled and frosted with our signature silky dark chocolate ganache. Perfect for celebrations or personal luxury. Handcrafted fresh to order.",
    price: 18000,
    rating: 4.8,
    reviewsCount: 120,
    stockQuantity: 25,
    availability: "in_stock",
    prepTime: "Ready in 4 hours or pre-order",
    sku: "YFP-CAKE-001",
    isFeatured: true,
    isBestseller: true,
    active: true,
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80"
    ],
    ingredients: ["Belgian Dark Chocolate (70%)", "Pure Butter", "Organic Dutch Cocoa", "Farm Fresh Eggs", "Cane Sugar", "Double Cream", "Madagascar Vanilla"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    options: [
      {
        name: "Size",
        choices: [
          { label: "6-inch", priceAdjustment: -6000 },
          { label: "8-inch", priceAdjustment: 0, isDefault: true },
          { label: "10-inch", priceAdjustment: 7000 },
          { label: "12-inch", priceAdjustment: 17000 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-meat-pie",
    name: "Premium Meat Pie",
    slug: "premium-meat-pie",
    category: "Pastries",
    description: "The gold standard Nigerian meat pie. Buttery, melt-in-your-mouth shortcrust pastry generously loaded with seasoned minced beef, potatoes, and tender carrots. Golden-baked every morning.",
    price: 500,
    discountPrice: undefined,
    rating: 4.9,
    reviewsCount: 310,
    stockQuantity: 80,
    availability: "in_stock",
    prepTime: "Freshly baked & ready for instant delivery",
    sku: "YFP-PAST-002",
    isFeatured: true,
    isBestseller: true,
    active: true,
    images: [
      "/pastries-cat.jpg",
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80"
    ],
    ingredients: ["Minced Lean Beef", "Irish Potatoes", "Carrots", "Pastry Butter", "Flour", "Onions", "YFP Spice Blend"],
    allergens: ["Gluten", "Dairy"],
    options: [
      {
        name: "Pack Option",
        choices: [
          { label: "Single Pie (1 pc)", priceAdjustment: 0, isDefault: true },
          { label: "Pack of 4", priceAdjustment: 1500 },
          { label: "Box of 10 (Party Pack)", priceAdjustment: 4300 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-glazed-doughnut",
    name: "Glazed Ring Doughnut",
    slug: "glazed-ring-doughnut",
    category: "Snacks",
    description: "Super soft, pillowy yeast-raised doughnut rings dipped in a warm, glossy vanilla bean sugar glaze. Light, airy, and delicately sweet.",
    price: 800,
    rating: 4.7,
    reviewsCount: 88,
    stockQuantity: 45,
    availability: "in_stock",
    prepTime: "Available now",
    sku: "YFP-SNAK-003",
    isFeatured: false,
    isBestseller: true,
    active: true,
    images: [
      "https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
    ],
    ingredients: ["Wheat Flour", "Yeast", "Pure Butter", "Whole Milk", "Vanilla Sugar Glaze"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    options: [
      {
        name: "Quantity",
        choices: [
          { label: "Single Doughnut", priceAdjustment: 0, isDefault: true },
          { label: "Box of 4", priceAdjustment: 2200 },
          { label: "Box of 6", priceAdjustment: 3800 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-fish-pie",
    name: "Flaky Fish Pie",
    slug: "flaky-fish-pie",
    category: "Pastries",
    description: "Deliciously flaky golden crust filled with fresh ocean mackerel, sweet bell peppers, sweetcorn, and delicate savory herbs. A customer favorite for seafood lovers.",
    price: 600,
    rating: 4.8,
    reviewsCount: 64,
    stockQuantity: 30,
    availability: "in_stock",
    prepTime: "Freshly baked",
    sku: "YFP-PAST-004",
    isFeatured: false,
    isBestseller: false,
    active: true,
    images: [
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80"
    ],
    ingredients: ["Mackerel Fish", "Sweetcorn", "Onions", "Pastry Butter", "White Pepper", "Wheat Flour"],
    allergens: ["Gluten", "Dairy", "Fish"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-scotch-egg",
    name: "Scotch Egg",
    slug: "scotch-egg",
    category: "Snacks",
    description: "A hard-boiled farm-fresh egg wrapped in spiced minced pork and beef sausage meat, breaded in seasoned panko crumbs, and deep-fried to a golden crunch.",
    price: 800,
    rating: 4.8,
    reviewsCount: 52,
    stockQuantity: 35,
    availability: "in_stock",
    prepTime: "Ready to eat",
    sku: "YFP-SNAK-005",
    isFeatured: false,
    isBestseller: false,
    active: true,
    images: [
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
    ],
    ingredients: ["Farm Fresh Eggs", "Minced Sausage Meat", "Nutmeg", "Breadcrumbs", "Herbs"],
    allergens: ["Gluten", "Eggs"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-sausage-roll",
    name: "Sausage Roll",
    slug: "sausage-roll",
    category: "Pastries",
    description: "Flaky puff pastry wrapped around savory seasoned sausage meat. Golden brushed with egg wash and baked crisp.",
    price: 600,
    rating: 4.7,
    reviewsCount: 95,
    stockQuantity: 50,
    availability: "in_stock",
    prepTime: "Fresh daily",
    sku: "YFP-PAST-006",
    isFeatured: true,
    isBestseller: true,
    active: true,
    images: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
    ],
    ingredients: ["Seasoned Sausage Meat", "Puff Pastry", "Thyme", "Garlic", "Egg Glaze"],
    allergens: ["Gluten", "Eggs"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-chin-chin",
    name: "Chin Chin Pack (500g)",
    slug: "chin-chin-pack",
    category: "Snacks",
    description: "Addictively crunchy, sweet Nigerian chin chin made with real butter, condensed milk, and warm nutmeg. Perfectly cut and fried to a golden golden crunch.",
    price: 2500,
    rating: 4.9,
    reviewsCount: 180,
    stockQuantity: 60,
    availability: "in_stock",
    prepTime: "Sealed & ready for dispatch",
    sku: "YFP-SNAK-007",
    isFeatured: true,
    isBestseller: true,
    active: true,
    images: [
      "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80"
    ],
    ingredients: ["Wheat Flour", "Pure Butter", "Sugar", "Milk", "Nutmeg", "Vegetable Oil"],
    allergens: ["Gluten", "Dairy"],
    options: [
      {
        name: "Pack Size",
        choices: [
          { label: "Standard Pack (500g)", priceAdjustment: 0, isDefault: true },
          { label: "Jumbo Tub (1kg)", priceAdjustment: 2200 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-mini-chops",
    name: "Mini Chops Platter",
    slug: "mini-chops-platter",
    category: "Small Chops",
    description: "The ultimate Nigerian party box. Contains 5 crispy beef samosas, 5 vegetable spring rolls, 8 fluffy puff-puffs, and succulent peppered gizzard/chicken bites.",
    price: 4500,
    rating: 4.9,
    reviewsCount: 73,
    stockQuantity: 20,
    availability: "in_stock",
    prepTime: "30-45 minutes freshly made",
    sku: "YFP-CHOP-008",
    isFeatured: true,
    isBestseller: true,
    active: true,
    images: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
    ],
    ingredients: ["Spring Rolls (5)", "Samosas (5)", "Puff Puff (8)", "Peppered Chicken", "Chili Pepper Glaze"],
    allergens: ["Gluten"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-red-velvet",
    name: "Red Velvet Cream Cheese Cake",
    slug: "red-velvet-cream-cheese-cake",
    category: "Cakes",
    description: "Vibrant crimson velvet sponge with hints of cocoa, paired with luscious whipped Philadelphia cream cheese frosting and white chocolate curls.",
    price: 19500,
    rating: 4.9,
    reviewsCount: 94,
    stockQuantity: 18,
    availability: "in_stock",
    prepTime: "Ready in 4 hours",
    sku: "YFP-CAKE-009",
    isFeatured: true,
    isBestseller: false,
    active: true,
    images: [
      "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80"
    ],
    ingredients: ["Buttermilk", "Cocoa Powder", "Philadelphia Cream Cheese", "Butter", "Flour", "Natural Red Colorant"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    options: [
      {
        name: "Size",
        choices: [
          { label: "6-inch", priceAdjustment: -6500 },
          { label: "8-inch", priceAdjustment: 0, isDefault: true },
          { label: "10-inch", priceAdjustment: 7500 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-custom-birthday-cake",
    name: "Custom Celebration Birthday Cake",
    slug: "custom-celebration-birthday-cake",
    category: "Celebration Cakes",
    description: "Showstopping handcrafted designer cake tailored to your event. Features custom color theme, edible golden leaf, customized acrylic or chocolate topper, and macarons.",
    price: 25000,
    rating: 5.0,
    reviewsCount: 46,
    stockQuantity: 10,
    availability: "in_stock",
    prepTime: "Requires 24-48 hours pre-order",
    sku: "YFP-CAKE-010",
    isFeatured: true,
    isBestseller: true,
    active: true,
    images: [
      "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80"
    ],
    ingredients: ["Sponge of choice", "Swiss Meringue Buttercream", "Edible 24k Gold Flakes", "French Macarons"],
    allergens: ["Gluten", "Dairy", "Eggs", "Nuts (in macarons)"],
    options: [
      {
        name: "Size",
        choices: [
          { label: "8-inch (Serves 15)", priceAdjustment: 0, isDefault: true },
          { label: "10-inch (Serves 25)", priceAdjustment: 10000 },
          { label: "2-Tier (8\" + 6\")", priceAdjustment: 25000 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  { id: "zone-osun", name: "Osun State (Ila-Orangun, Osogbo, Ife, Ede)", fee: 1500, estimatedDeliveryHours: "Same Day (1-3 hrs)", active: true },
  { id: "zone-lagos", name: "Lagos State (Island, Mainland & Lekki)", fee: 3500, estimatedDeliveryHours: "Next Day Express", active: true },
  { id: "zone-abuja", name: "Abuja (FCT)", fee: 4500, estimatedDeliveryHours: "1-2 Days Express", active: true },
  { id: "zone-oyo", name: "Oyo State (Ibadan, Ogbomoso, Oyo)", fee: 2500, estimatedDeliveryHours: "Same Day / Next Day", active: true },
  { id: "zone-ogun", name: "Ogun State (Abeokuta, Ijebu, Sagamu)", fee: 3000, estimatedDeliveryHours: "Next Day Express", active: true },
  { id: "zone-ondo", name: "Ondo State (Akure, Ondo Town, Owo)", fee: 3000, estimatedDeliveryHours: "Next Day Express", active: true },
  { id: "zone-ekiti", name: "Ekiti State (Ado-Ekiti, Ikere)", fee: 3000, estimatedDeliveryHours: "Next Day Express", active: true },
  { id: "zone-kwara", name: "Kwara State (Ilorin, Offa)", fee: 2500, estimatedDeliveryHours: "Next Day Express", active: true },
  { id: "zone-kogi", name: "Kogi State (Lokoja, Okene)", fee: 3500, estimatedDeliveryHours: "1-2 Days", active: true },
  { id: "zone-edo", name: "Edo State (Benin City, Auchi)", fee: 3500, estimatedDeliveryHours: "1-2 Days", active: true },
  { id: "zone-delta", name: "Delta State (Asaba, Warri)", fee: 4000, estimatedDeliveryHours: "1-2 Days", active: true },
  { id: "zone-rivers", name: "Rivers State (Port Harcourt)", fee: 4500, estimatedDeliveryHours: "1-2 Days", active: true },
  { id: "zone-enugu", name: "Enugu State (Enugu, Nsukka)", fee: 4000, estimatedDeliveryHours: "1-2 Days", active: true },
  { id: "zone-anambra", name: "Anambra State (Awka, Onitsha)", fee: 4000, estimatedDeliveryHours: "1-2 Days", active: true },
  { id: "zone-imo", name: "Imo State (Owerri)", fee: 4000, estimatedDeliveryHours: "1-2 Days", active: true },
  { id: "zone-abia", name: "Abia State (Umuahia, Aba)", fee: 4500, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-akwa-ibom", name: "Akwa Ibom State (Uyo, Eket)", fee: 4500, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-cross-river", name: "Cross River State (Calabar)", fee: 5000, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-bayelsa", name: "Bayelsa State (Yenagoa)", fee: 4500, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-ebonyi", name: "Ebonyi State (Abakaliki)", fee: 4500, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-benue", name: "Benue State (Makurdi)", fee: 4500, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-plateau", name: "Plateau State (Jos)", fee: 4500, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-nasarawa", name: "Nasarawa State (Lafia, Karu)", fee: 4000, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-niger", name: "Niger State (Minna, Suleja)", fee: 4000, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-kaduna", name: "Kaduna State (Kaduna, Zaria)", fee: 4500, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-kano", name: "Kano State (Kano City)", fee: 4500, estimatedDeliveryHours: "2 Days", active: true },
  { id: "zone-katsina", name: "Katsina State (Katsina)", fee: 5000, estimatedDeliveryHours: "2-3 Days", active: true },
  { id: "zone-bauchi", name: "Bauchi State (Bauchi)", fee: 5000, estimatedDeliveryHours: "2-3 Days", active: true },
  { id: "zone-gombe", name: "Gombe State (Gombe)", fee: 5000, estimatedDeliveryHours: "2-3 Days", active: true },
  { id: "zone-adamawa", name: "Adamawa State (Yola)", fee: 5500, estimatedDeliveryHours: "2-3 Days", active: true },
  { id: "zone-taraba", name: "Taraba State (Jalingo)", fee: 5500, estimatedDeliveryHours: "2-3 Days", active: true },
  { id: "zone-borno", name: "Borno State (Maiduguri)", fee: 6000, estimatedDeliveryHours: "3 Days", active: true },
  { id: "zone-yobe", name: "Yobe State (Damaturu)", fee: 6000, estimatedDeliveryHours: "3 Days", active: true },
  { id: "zone-jigawa", name: "Jigawa State (Dutse)", fee: 5500, estimatedDeliveryHours: "2-3 Days", active: true },
  { id: "zone-kebbi", name: "Kebbi State (Birnin Kebbi)", fee: 5500, estimatedDeliveryHours: "2-3 Days", active: true },
  { id: "zone-sokoto", name: "Sokoto State (Sokoto City)", fee: 5500, estimatedDeliveryHours: "2-3 Days", active: true },
  { id: "zone-zamfara", name: "Zamfara State (Gusau)", fee: 5500, estimatedDeliveryHours: "2-3 Days", active: true }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "YFP10",
    discountType: "percentage",
    value: 10,
    minOrderAmount: 3000,
    maxDiscount: 5000,
    active: true,
    timesUsed: 42
  },
  {
    id: "coup-2",
    code: "WELCOME",
    discountType: "fixed",
    value: 1500,
    minOrderAmount: 10000,
    active: true,
    timesUsed: 19
  },
  {
    id: "coup-3",
    code: "YATEXVIP",
    discountType: "percentage",
    value: 15,
    minOrderAmount: 20000,
    maxDiscount: 10000,
    active: true,
    timesUsed: 8
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "prod-sig-choc-cake",
    customerName: "Chioma A.",
    rating: 5,
    comment: "The best chocolate cake I have tasted in Lagos! So rich and moist without being overly sweet. Delivered right on time for my birthday party.",
    date: "2026-09-10",
    verifiedPurchase: true
  },
  {
    id: "rev-2",
    productId: "prod-meat-pie",
    customerName: "Tunde O.",
    rating: 5,
    comment: "Proper meat pie with real chunks of meat, not just potato mash like others do. Flaky crust is pure heaven.",
    date: "2026-09-12",
    verifiedPurchase: true
  },
  {
    id: "rev-3",
    productId: "prod-chin-chin",
    customerName: "Folake D.",
    rating: 5,
    comment: "Crispy, fresh, not oily at all! My kids finished the 500g tub in two days. Ordering another immediately.",
    date: "2026-09-14",
    verifiedPurchase: true
  }
];
