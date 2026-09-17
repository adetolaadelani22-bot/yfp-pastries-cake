import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, DeliveryZone } from '../types';

export interface LastAddedNotification {
  name: string;
  quantity: number;
  timestamp: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryMethod: 'delivery' | 'pickup';
  setDeliveryMethod: (method: 'delivery' | 'pickup') => void;
  selectedZone: DeliveryZone | null;
  setSelectedZone: (zone: DeliveryZone | null) => void;
  deliveryFee: number;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  lastAddedNotification: LastAddedNotification | null;
  clearLastAddedNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('yfp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [lastAddedNotification, setLastAddedNotification] = useState<LastAddedNotification | null>(null);

  const clearLastAddedNotification = () => {
    setLastAddedNotification(null);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('yfp_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const deliveryFee = deliveryMethod === 'pickup' ? 0 : (selectedZone ? selectedZone.fee : 1000);

  const totalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCartItems(prev => {
      // Check if duplicate with same product, size, and inscription exists
      const existingIdx = prev.findIndex(
        item =>
          item.productId === newItem.productId &&
          item.selectedSize === newItem.selectedSize &&
          item.inscription === newItem.inscription
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      } else {
        const id = 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
        return [...prev, { ...newItem, id }];
      }
    });

    setLastAddedNotification({
      name: newItem.name,
      quantity: newItem.quantity,
      timestamp: Date.now()
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponCode(data.coupon.code);
        setDiscountAmount(data.discountAmount);
        return { success: true, message: `Coupon ${data.coupon.code} applied successfully!` };
      } else {
        return { success: false, message: data.message || 'Invalid coupon code' };
      }
    } catch {
      return { success: false, message: 'Network error validating coupon' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        deliveryMethod,
        setDeliveryMethod,
        selectedZone,
        setSelectedZone,
        deliveryFee,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        lastAddedNotification,
        clearLastAddedNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
