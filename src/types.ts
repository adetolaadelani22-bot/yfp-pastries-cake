export type Role = 'customer' | 'staff' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  title: string; // e.g. "Home", "Office"
  street: string;
  area: string; // e.g. "Lekki Phase 1"
  landmark?: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount: number;
  active: boolean;
}

export interface ProductOption {
  name: string; // e.g. "Size", "Quantity"
  choices: {
    label: string; // e.g. "6-inch", "8-inch", "Pack of 4"
    priceAdjustment: number; // e.g. 0, 6000, 12000
    isDefault?: boolean;
  }[];
}

export type ProductAvailability = 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  stockQuantity: number;
  availability: ProductAvailability;
  prepTime: string;
  ingredients: string[];
  allergens: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  sku: string;
  options?: ProductOption[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // unique item uuid in cart
  productId: string;
  name: string;
  image: string;
  category: string;
  unitPrice: number;
  quantity: number;
  selectedSize?: string;
  inscription?: string;
  specialInstructions?: string;
  stockAvailable: number;
}

export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'paystack' | 'bank_transfer' | 'pay_on_delivery';

export type OrderStatus =
  | 'pending_payment'
  | 'payment_confirmed'
  | 'order_received'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  selectedSize?: string;
  inscription?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. YFP-2026-000124
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  deliveryMethod: DeliveryMethod;
  deliveryDetails?: {
    address: string;
    landmark?: string;
    area: string;
    city: string;
    deliveryTimePreference: 'asap' | 'scheduled';
    scheduledDate?: string;
    scheduledSlot?: string;
    orderNotes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  orderStatus: OrderStatus;
  estimatedDeliveryTime?: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryZone {
  id: string;
  name: string; // e.g. "Lekki Phase 1"
  fee: number;
  estimatedDeliveryHours: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 10 (%) or 1500 (₦)
  discountValue?: number; // compatibility alias used across admin UI
  minOrderAmount: number;
  maxDiscount?: number;
  expiresAt?: string;
  active: boolean;
  timesUsed: number;
}

export interface CustomCakeRequest {
  id: string;
  requestId: string; // e.g. YFP-CAKE-20260917-001
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  cakeSize: string; // e.g. "8-inch (Serves 12-16)"
  flavor: string; // e.g. "Belgian Chocolate", "Red Velvet"
  layers: number; // 1, 2, 3, 4
  frosting: string; // "Buttercream", "Fondant", "Whipped Cream", "Naked"
  inscription?: string;
  referenceImage?: string; // base64 or URL
  specialInstructions?: string;
  preferredDeliveryDate: string;
  deliveryType: DeliveryMethod;
  deliveryAddress?: string;
  estimatedPrice: number;
  quotedPrice?: number;
  status: 'submitted' | 'under_review' | 'quote_sent' | 'approved' | 'preparing' | 'completed' | 'declined';
  adminNotes?: string;
  createdAt: string;
}

export interface CateringRequest {
  id: string;
  requestId: string;
  fullName: string;
  email: string;
  phone: string;
  eventType: 'Wedding' | 'Birthday' | 'Corporate' | 'Bridal Shower' | 'Anniversary' | 'Other';
  eventDate: string;
  guestCount: number;
  budgetRange: string;
  foodRequirements: string;
  additionalNotes?: string;
  status: 'new' | 'reviewing' | 'quoted' | 'accepted' | 'preparing' | 'completed';
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsappPhone: string;
  email: string;
  address: string;
  operatingHours: {
    weekdays: string;
    sundays: string;
  };
  minimumOrder: number;
  currency: string;
  deliveryNotice: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
}
