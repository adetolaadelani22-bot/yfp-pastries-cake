import fs from 'fs';
import path from 'path';
import {
  Product,
  Category,
  Order,
  CustomCakeRequest,
  CateringRequest,
  DeliveryZone,
  Coupon,
  Review,
  ContactMessage,
  BusinessSettings,
  AuditLog,
  User
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_DELIVERY_ZONES,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS
} from './initialData';

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customCakes: CustomCakeRequest[];
  cateringRequests: CateringRequest[];
  deliveryZones: DeliveryZone[];
  coupons: Coupon[];
  reviews: Review[];
  contacts: ContactMessage[];
  settings: BusinessSettings;
  auditLogs: AuditLog[];
  users: User[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialDatabase(): DatabaseSchema {
  const initialOrders: Order[] = [
    {
      id: "ord-101",
      orderNumber: "YFP-2026-000101",
      customer: {
        fullName: "Amaka Eze",
        email: "amaka@example.com",
        phone: "+2348031234567"
      },
      deliveryMethod: "delivery",
      deliveryDetails: {
        address: "14 Admiralty Way, Flat 3B",
        area: "Lekki Phase 1",
        city: "Lagos",
        deliveryTimePreference: "asap",
        orderNotes: "Please call when security gate arrives"
      },
      items: [
        {
          productId: "prod-sig-choc-cake",
          name: "Signature Chocolate Cake",
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
          unitPrice: 18000,
          quantity: 1,
          totalPrice: 18000,
          selectedSize: "8-inch",
          inscription: "Happy 30th Birthday Amaka!"
        },
        {
          productId: "prod-meat-pie",
          name: "Premium Meat Pie",
          image: "https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=800&q=80",
          unitPrice: 2000,
          quantity: 1,
          totalPrice: 2000,
          selectedSize: "Pack of 4"
        }
      ],
      subtotal: 20000,
      deliveryFee: 1000,
      discountAmount: 2000,
      couponCode: "YFP10",
      totalAmount: 19000,
      paymentMethod: "paystack",
      paymentStatus: "paid",
      paymentReference: "PSTK_REF_9812401",
      orderStatus: "out_for_delivery",
      timeline: [
        { status: "order_received", timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), note: "Order received via Paystack checkout" },
        { status: "payment_confirmed", timestamp: new Date(Date.now() - 3600000 * 2.9).toISOString(), note: "Payment of ₦19,000 confirmed" },
        { status: "preparing", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: "Baker Yatex started preparing chocolate cake" },
        { status: "ready", timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(), note: "Order packaged in thermal delivery box" },
        { status: "out_for_delivery", timestamp: new Date(Date.now() - 3600000 * 0.3).toISOString(), note: "Dispatched with YFP dispatch rider (Ibrahim)" }
      ],
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 0.3).toISOString()
    }
  ];

  const initialCustomCakes: CustomCakeRequest[] = [
    {
      id: "cake-req-1",
      requestId: "YFP-CAKE-20260917-001",
      customer: {
        name: "Dr. Somtochukwu",
        email: "somto@example.com",
        phone: "+2348189876543"
      },
      cakeSize: "10-inch (Serves 20-25)",
      flavor: "Belgian Chocolate & Red Velvet Swirl",
      layers: 3,
      frosting: "Buttercream",
      inscription: "Happy 50th Golden Jubilee Daddy!",
      referenceImage: "/celebration-cake-cat.jpg",
      specialInstructions: "Royal blue theme with gold drip and edible chocolate balls. Need it delivered before 1 PM.",
      preferredDeliveryDate: "2026-09-22",
      deliveryType: "delivery",
      deliveryAddress: "Victoria Garden City (VGC), Lekki",
      estimatedPrice: 38000,
      quotedPrice: 42000,
      status: "quote_sent",
      adminNotes: "Custom gold leaf and acrylic topper requested. Price approved with ₦4,000 topper supplement.",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  return {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    orders: initialOrders,
    customCakes: initialCustomCakes,
    cateringRequests: [],
    deliveryZones: INITIAL_DELIVERY_ZONES,
    coupons: INITIAL_COUPONS,
    reviews: INITIAL_REVIEWS,
    contacts: [],
    settings: INITIAL_SETTINGS,
    auditLogs: [
      {
        id: "log-1",
        timestamp: new Date().toISOString(),
        user: "System",
        action: "INITIALIZATION",
        resource: "Database",
        details: "Platform database initialized with bakery seed data."
      }
    ],
    users: [
      {
        id: "usr-admin-1",
        name: "Yatex Bakare",
        email: "admin@yfpbakery.ng",
        phone: "07064918034",
        role: "admin",
        createdAt: new Date().toISOString()
      },
      {
        id: "usr-staff-1",
        name: "Ibrahim Bello",
        email: "staff@yfpbakery.ng",
        phone: "07064918034",
        role: "staff",
        createdAt: new Date().toISOString()
      },
      {
        id: "usr-cust-1",
        name: "Amaka Eze",
        email: "amaka@example.com",
        phone: "+2348031234567",
        role: "customer",
        createdAt: new Date().toISOString()
      }
    ]
  };
}

class Store {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure settings and delivery zones reflect latest business contact & Nigerian states
        parsed.settings = INITIAL_SETTINGS;
        parsed.deliveryZones = INITIAL_DELIVERY_ZONES;
        if (parsed.categories) {
          parsed.categories = parsed.categories.map((c: Category) => {
            if (c.slug === 'pastries' || c.id === 'cat-pastries' || (c.image && c.image.includes('1509440159596'))) {
              return { ...c, image: '/pastries-cat.jpg' };
            }
            if (c.slug === 'celebration-cakes' || c.id === 'cat-celebration' || (c.image && c.image.includes('1535141192574'))) {
              return { ...c, image: '/celebration-cake-cat.jpg' };
            }
            return c;
          });
        }
        if (!parsed.users) {
          parsed.users = [];
        }
        this.saveData(parsed);
        return parsed;
      }
    } catch (e) {
      console.error("Failed to read database file, reinitializing", e);
    }
    const initial = getInitialDatabase();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Failed to write to database file", e);
    }
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]): void {
    this.data[key] = value;
    this.saveData(this.data);
  }

  public logAudit(user: string, action: string, resource: string, details: string) {
    const log: AuditLog = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString(),
      user,
      action,
      resource,
      details
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs.pop();
    }
    this.saveData(this.data);
  }
}

export const db = new Store();
