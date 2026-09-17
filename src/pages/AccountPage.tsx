import React, { useState, useEffect } from 'react';
import { User, Package, Heart, Sparkles, MapPin, LogOut, ArrowRight, ShieldCheck, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order, CustomCakeRequest, Product } from '../types';
import { formatNaira, formatDateTime, getStatusBadgeInfo, getFallbackBakeryImage } from '../utils/formatters';
import { ReceiptModal } from '../components/ReceiptModal';

interface AccountPageProps {
  onNavigateToShop: () => void;
  onNavigateToTracking: (order: Order) => void;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  onNavigateToAdmin: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onNavigateToShop,
  onNavigateToTracking,
  allProducts,
  onSelectProduct,
  onNavigateToAdmin
}) => {
  const { user, logout, wishlist, clearWishlist } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'custom-cakes' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customCakes, setCustomCakes] = useState<CustomCakeRequest[]>([]);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchCustomCakes();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch {}
  };

  const fetchCustomCakes = async () => {
    try {
      const res = await fetch('/api/custom-cakes');
      const data = await res.json();
      if (Array.isArray(data)) setCustomCakes(data);
    } catch {}
  };

  const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 space-y-8">
      {/* User Header Profile */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-[#181310] text-[#DEB346] font-serif font-black text-2xl flex items-center justify-center border-2 border-[#DEB346] shadow">
            {user ? user.name[0] : 'Y'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif font-black text-xl sm:text-2xl text-[#181310]">
                {user ? user.name : 'Guest User'}
              </h1>
              {user?.role === 'admin' && (
                <span className="bg-[#DEB346] text-[#120F0D] text-[10px] uppercase font-black px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'guest@example.com'}</p>
            <p className="text-xs text-gray-500">{user?.phone || '+234 803 000 0000'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {user?.role === 'admin' && (
            <button
              onClick={onNavigateToAdmin}
              className="bg-[#181310] hover:bg-[#DEB346] text-[#DEB346] hover:text-[#181310] px-4 py-2 rounded-xl text-xs font-bold border border-[#DEB346]/40 shadow transition-colors"
            >
              Open Staff Operations
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#E8DEC8] pb-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-white text-[#181310] border-t-2 border-[#181310] shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('custom-cakes')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'custom-cakes'
              ? 'bg-white text-[#181310] border-t-2 border-[#181310] shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Custom Cake Requests ({customCakes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'bg-white text-[#181310] border-t-2 border-[#181310] shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Wishlist ({wishlist.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#EDE5D8]">
              <Package className="w-12 h-12 text-[#C4B4A2] mx-auto mb-2" />
              <h3 className="font-serif font-bold text-base text-gray-800">No past orders found</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">You haven't placed an order yet.</p>
              <button
                onClick={onNavigateToShop}
                className="bg-[#181310] text-[#DEB346] px-5 py-2 rounded-full text-xs font-bold uppercase"
              >
                Start Ordering
              </button>
            </div>
          ) : (
            orders.map((ord) => {
              const badge = getStatusBadgeInfo(ord.orderStatus);
              return (
                <div key={ord.id} className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-xs text-gray-900">{ord.orderNumber}</span>
                      <p className="text-[11px] text-gray-500">{formatDateTime(ord.createdAt)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badge.bg} ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="font-black text-sm text-[#181310]">{formatNaira(ord.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    {ord.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-gray-700">
                        <span>{item.quantity}x {item.name} {item.selectedSize ? `(${item.selectedSize})` : ''}</span>
                        <span>{formatNaira(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => onNavigateToTracking(ord)}
                      className="text-xs font-bold text-[#A68322] hover:underline flex items-center space-x-1"
                    >
                      <span>Track Order Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="p-1.5 text-xs text-gray-600 hover:text-black flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Custom Cake Requests */}
      {activeTab === 'custom-cakes' && (
        <div className="space-y-4">
          {customCakes.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#EDE5D8]">
              <Sparkles className="w-12 h-12 text-[#DEB346] mx-auto mb-2" />
              <h3 className="font-serif font-bold text-base text-gray-800">No custom cake requests</h3>
              <p className="text-xs text-gray-500 mt-1">Design your bespoke cake in our custom builder.</p>
            </div>
          ) : (
            customCakes.map((req) => (
              <div key={req.id} className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="font-mono font-bold text-xs text-gray-900">{req.requestId}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    {req.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p><strong>Size:</strong> {req.cakeSize}</p>
                  <p><strong>Flavor:</strong> {req.flavor}</p>
                  <p><strong>Layers:</strong> {req.layers} layers</p>
                  <p><strong>Frosting:</strong> {req.frosting}</p>
                  {req.inscription && <p className="col-span-2 text-gray-600 italic">"{req.inscription}"</p>}
                </div>
                {req.estimatedPrice && (
                  <div className="text-right text-xs font-bold text-[#A68322]">
                    Estimated Price: {formatNaira(req.estimatedPrice)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#EDE5D8]">
              <Heart className="w-12 h-12 text-rose-300 mx-auto mb-2" />
              <h3 className="font-serif font-bold text-base text-gray-800">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">Click the heart icon on any pastry or cake to save it here.</p>
              <button
                onClick={onNavigateToShop}
                className="bg-[#181310] text-[#DEB346] px-5 py-2 rounded-full text-xs font-bold uppercase"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{wishlistProducts.length} saved treats</span>
                <button onClick={clearWishlist} className="text-xs text-rose-600 hover:underline">
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="bg-white rounded-xl p-3 border border-[#E8DEC8] hover:border-[#DEB346] cursor-pointer shadow-xs transition-all"
                  >
                    <img
                      src={p.images[0] || getFallbackBakeryImage(p.category)}
                      alt={p.name}
                      className="w-full aspect-square object-cover rounded-lg mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getFallbackBakeryImage(p.category);
                      }}
                    />
                    <h4 className="font-serif font-bold text-xs text-gray-900 truncate">{p.name}</h4>
                    <p className="text-xs font-bold text-[#A68322] mt-0.5">{formatNaira(p.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Printable Receipt Modal if requested */}
      {selectedReceiptOrder && (
        <ReceiptModal order={selectedReceiptOrder} onClose={() => setSelectedReceiptOrder(null)} />
      )}
    </div>
  );
};
