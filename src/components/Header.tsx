import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, User as UserIcon, Menu, X, Sparkles, Shield, ChevronDown, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatNaira } from '../utils/formatters';

interface HeaderProps {
  currentView?: string;
  activeView?: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenCart?: () => void;
  onSearchOpen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, activeView, onNavigate, onSearchOpen }) => {
  const effectiveView = activeView || currentView || 'home';
  const { itemCount, totalAmount, setIsCartOpen, lastAddedNotification } = useCart();
  const { user, isAdmin, logout, wishlist, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isRecentAdd, setIsRecentAdd] = useState(false);

  useEffect(() => {
    if (!lastAddedNotification) return;
    setIsRecentAdd(true);
    const timer = setTimeout(() => {
      setIsRecentAdd(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, [lastAddedNotification?.timestamp]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'custom-cake', label: 'Design Your Cake', highlight: true },
    { id: 'catering', label: 'Catering' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#120F0D] text-[#FAF7F2] border-b border-[#29221B] shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-[#1C1713] text-[#DEB346] text-xs font-medium py-1.5 px-4 text-center border-b border-[#2D241C] flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center space-x-2 text-xs tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#DEB346]" />
          <span className="font-semibold text-[#DEB346] tracking-wide">Freshly Baked Every Morning</span>
        </div>
        {/* Quick Admin Access (Only visible when logged in as admin) */}
        {isAdmin && (
          <div className="flex items-center space-x-2 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="hidden sm:inline-block bg-[#29221B] text-[#DEB346] border border-[#DEB346]/40 px-2 py-0.5 rounded text-[10px] font-bold">
                ✎ Admin Mode
              </span>
              <button
                onClick={() => onNavigate('admin')}
                className="text-[#DEB346] bg-[#29221B] hover:bg-[#3B3127] px-2.5 py-0.5 rounded border border-[#DEB346]/40 flex items-center space-x-1"
              >
                <Shield className="w-3 h-3" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#E3D9CC] hover:text-white hover:bg-[#251E18] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border-2 border-[#C8A358] p-0.5 overflow-hidden flex items-center justify-center transition-transform hover:scale-105">
                <img
                  src="/logo.png"
                  alt="YFP Pastries & Cakes"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.svg';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg sm:text-xl tracking-wider text-[#FAF7F2] uppercase leading-none">
                  YFP Pastries
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#DEB346] font-medium mt-0.5">
                  YATEX'S FOOD PLUG
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = effectiveView === link.id;
              if (link.highlight) {
                return (
                  <button
                    key={link.id}
                    id={`nav-${link.id}`}
                    onClick={() => onNavigate(link.id)}
                    className="relative group flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#120F0D] bg-gradient-to-r from-[#DEB346] to-[#C99726] hover:from-[#F0C85F] hover:to-[#DEB346] shadow-sm transition-all transform hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#120F0D]" />
                    <span>{link.label}</span>
                  </button>
                );
              }
              return (
                <button
                  key={link.id}
                  id={`nav-${link.id}`}
                  onClick={() => onNavigate(link.id)}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 py-1 border-b-2 ${
                    isActive
                      ? 'text-[#DEB346] border-[#DEB346]'
                      : 'text-[#D0C5B7] hover:text-[#FAF7F2] border-transparent hover:border-[#DEB346]/40'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Wishlist, Account, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button */}
            <button
              id="header-search-btn"
              onClick={() => onNavigate('shop')}
              className="p-2 text-[#D0C5B7] hover:text-[#DEB346] hover:bg-[#251E18] rounded-full transition-colors"
              title="Search products"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <button
              id="header-wishlist-btn"
              onClick={() => onNavigate('account', { tab: 'wishlist' })}
              className="relative p-2 text-[#D0C5B7] hover:text-[#DEB346] hover:bg-[#251E18] rounded-full transition-colors hidden sm:flex"
              title="Saved items"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#DEB346] text-[#120F0D] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account / User Menu */}
            <div className="relative">
              <button
                id="header-user-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-medium text-[#D0C5B7] hover:text-white hover:bg-[#251E18] border border-transparent hover:border-[#3B3026] transition-all"
                aria-label="User Account"
              >
                <div className="w-7 h-7 rounded-full bg-[#2C231B] text-[#DEB346] flex items-center justify-center border border-[#DEB346]/30">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="hidden md:inline max-w-[100px] truncate text-xs">
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#9E8E7D] hidden md:inline" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1A1512] border border-[#3B3026] rounded-xl shadow-2xl py-2 z-50 text-sm">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-[#2C231B]">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-[#9E8E7D] truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#DEB346]/20 text-[#DEB346] border border-[#DEB346]/30">
                          {user.role}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('account');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#2A211A] text-[#D8CEBF] transition-colors"
                      >
                        My Orders & Profile
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-[#2A211A] text-[#DEB346] font-medium flex items-center space-x-1.5"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Admin Control Center</span>
                        </button>
                      )}
                      <div className="border-t border-[#2C231B] my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-rose-400 hover:bg-[#2A211A] transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-xs text-[#9E8E7D] border-b border-[#2C231B]">
                        Account required to place and track orders
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAuthModal('general');
                        }}
                        className="w-full text-left px-4 py-2.5 bg-[#DEB346] text-[#181310] font-bold text-xs hover:bg-[#F0C85F] transition-colors flex items-center justify-between"
                      >
                        <span>Create Account / Sign In</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Button with Animated Badge */}
            <div className="relative">
              <button
                id="header-cart-btn"
                onClick={() => setIsCartOpen(true)}
                className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all transform active:scale-95 ${
                  isRecentAdd
                    ? 'bg-[#E8C056] text-[#120F0D] ring-2 ring-[#DEB346] shadow-lg shadow-[#DEB346]/20'
                    : 'bg-[#DEB346] hover:bg-[#E8C056] text-[#120F0D]'
                }`}
                aria-label="Shopping Cart"
              >
                {/* Radar ping when new item is added */}
                {isRecentAdd && (
                  <span className="absolute -inset-1 rounded-full bg-[#DEB346] opacity-75 animate-ping pointer-events-none" />
                )}

                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={isRecentAdd ? { rotate: [0, -14, 14, -8, 8, 0], scale: [1, 1.25, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#120F0D]" />
                  </motion.div>

                  {/* Visual Notification Badge */}
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        key={`badge-count-${itemCount}-${lastAddedNotification?.timestamp || 0}`}
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: [1.45, 0.9, 1.15, 1], opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                        className={`absolute -top-2.5 -right-2.5 text-[10px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isRecentAdd
                            ? 'bg-[#181310] text-[#DEB346] border-[#FAF7F2] shadow-md ring-2 ring-[#DEB346]'
                            : 'bg-[#120F0D] text-[#DEB346] border-[#DEB346]'
                        }`}
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <span className="hidden sm:inline font-bold">
                  {totalAmount > 0 ? formatNaira(totalAmount) : 'Cart'}
                </span>
              </button>

              {/* Dropdown Floating Visual Notification Pill */}
              <AnimatePresence>
                {isRecentAdd && lastAddedNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 18, stiffness: 320 }}
                    className="absolute top-full right-0 mt-2 z-50 pointer-events-none whitespace-nowrap bg-[#181310] text-[#DEB346] border border-[#DEB346]/80 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xl flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-medium truncate max-w-[130px] sm:max-w-[170px]">
                      +{lastAddedNotification.quantity} {lastAddedNotification.name}
                    </span>
                    <span className="bg-[#DEB346] text-[#181310] text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm">
                      Added!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#181310] border-b border-[#2D241C] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-between ${
                effectiveView === link.id
                  ? 'bg-[#292018] text-[#DEB346]'
                  : 'text-[#E3D9CC] hover:bg-[#251E18]'
              }`}
            >
              <span>{link.label}</span>
              {link.highlight && (
                <span className="text-[10px] bg-[#DEB346] text-[#120F0D] px-2 py-0.5 rounded-full font-bold uppercase">
                  Popular
                </span>
              )}
            </button>
          ))}
          <div className="pt-3 border-t border-[#2D241C] flex flex-col space-y-2">
            <button
              onClick={() => {
                onNavigate('account');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-[#D8CEBF] flex items-center space-x-2"
            >
              <UserIcon className="w-4 h-4 text-[#DEB346]" />
              <span>{user ? `Account (${user.name})` : 'Sign In / Register'}</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-[#DEB346] flex items-center space-x-2 bg-[#261E17] rounded-lg"
              >
                <Shield className="w-4 h-4 text-[#DEB346]" />
                <span>Admin Management Dashboard</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
