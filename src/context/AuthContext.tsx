import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  role: Role;
  isAdmin: boolean;
  isStaff: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickLoginAs: (role: 'admin' | 'staff' | 'customer') => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  requireAuthForOrder: (onSuccess?: () => void) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('yfp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('yfp_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string>('welcome');
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  // First visit check: auto-open modal on first customer visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('yfp_visited_auth');
    if (!user && !hasVisited) {
      const timer = setTimeout(() => {
        setAuthModalReason('welcome');
        setIsAuthModalOpen(true);
        sessionStorage.setItem('yfp_visited_auth', 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('yfp_user', JSON.stringify(user));
      // If there was a pending order action, trigger it
      if (pendingAuthAction) {
        pendingAuthAction();
        setPendingAuthAction(null);
      }
    } else {
      localStorage.removeItem('yfp_user');
    }
  }, [user, pendingAuthAction]);

  useEffect(() => {
    localStorage.setItem('yfp_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const openAuthModal = (reason: string = 'general') => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const requireAuthForOrder = (onSuccess?: () => void): boolean => {
    if (user) {
      if (onSuccess) onSuccess();
      return true;
    }
    if (onSuccess) {
      setPendingAuthAction(() => onSuccess);
    }
    setAuthModalReason('order_required');
    setIsAuthModalOpen(true);
    return false;
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (e: any) {
      return { success: false, error: 'Could not connect to authentication server' };
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, phone })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (e: any) {
      return { success: false, error: 'Could not connect to registration server' };
    }
  };

  const quickLoginAs = (targetRole: 'admin' | 'staff' | 'customer') => {
    if (targetRole === 'admin') {
      setUser({
        id: 'usr-admin-1',
        name: 'Yatex Bakare',
        email: 'admin@yfpbakery.ng',
        phone: '07064918034',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
    } else if (targetRole === 'staff') {
      setUser({
        id: 'usr-staff-1',
        name: 'Ibrahim Bello',
        email: 'staff@yfpbakery.ng',
        phone: '07064918034',
        role: 'staff',
        createdAt: new Date().toISOString()
      });
    } else {
      setUser({
        id: 'usr-cust-1',
        name: 'Adetola Adelani',
        email: 'adetolaadelani22@gmail.com',
        phone: '07064918034',
        role: 'customer',
        createdAt: new Date().toISOString()
      });
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const clearWishlist = () => setWishlist([]);

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const role: Role = user?.role || 'customer';
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isStaff = isAdmin || user?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isStaff,
        login,
        register,
        logout,
        quickLoginAs,
        wishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        requireAuthForOrder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
