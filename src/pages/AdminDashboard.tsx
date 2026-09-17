import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Plus, Trash2, Edit, CheckCircle2, AlertTriangle, Sparkles, Tag, Users, Clock, DollarSign, Printer, Search, RefreshCw, Camera, Upload, Image as ImageIcon, X } from 'lucide-react';
import { Product, ProductAvailability, Order, OrderStatus, CustomCakeRequest, Coupon } from '../types';
import { formatNaira, formatDateTime, getStatusBadgeInfo, getFallbackBakeryImage } from '../utils/formatters';
import { ReceiptModal } from '../components/ReceiptModal';
import { useAuth } from '../context/AuthContext';

const BAKERY_IMAGE_PRESETS = [
  { label: 'Celebration Birthday Cake', url: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=600&q=80' },
  { label: 'Red Velvet Cake', url: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Chocolate Fudge Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' },
  { label: 'Nigerian Meat Pie', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { label: 'Savory Beef Pie', url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80' },
  { label: 'Flaky Golden Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80' },
  { label: 'Glazed Ring Doughnuts', url: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Frosted Cupcakes', url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Small Chops Platter', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
  { label: 'Crunchy Chin Chin', url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fresh Crusty Bread', url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80' },
  { label: 'Chocolate Chip Cookies', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80' }
];

interface AdminDashboardProps {
  products: Product[];
  onRefreshProducts: () => void;
  onSelectProduct: (p: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onRefreshProducts,
  onSelectProduct
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'custom-cakes' | 'catering' | 'coupons'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customCakes, setCustomCakes] = useState<CustomCakeRequest[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [cateringRequests, setCateringRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Edit Product / Picture Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Pastries');
  const [editPrice, setEditPrice] = useState(2500);
  const [editStock, setEditStock] = useState(25);
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editAvailability, setEditAvailability] = useState<ProductAvailability>('in_stock');
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // New Product Modal Form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Pastries');
  const [newProdPrice, setNewProdPrice] = useState(2500);
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80');

  // New Coupon Form
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(5000);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [ordRes, cakeRes, coupRes, catRes] = await Promise.all([
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/custom-cakes').then(r => r.json()),
        fetch('/api/coupons').then(r => r.json()),
        fetch('/api/catering').then(r => r.json())
      ]);

      if (Array.isArray(ordRes)) setOrders(ordRes);
      if (Array.isArray(cakeRes)) setCustomCakes(cakeRes);
      if (Array.isArray(coupRes)) setCoupons(coupRes);
      if (Array.isArray(catRes)) setCateringRequests(catRes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user?.role || 'admin'
        },
        body: JSON.stringify({ orderStatus: newStatus, staffName: user?.name || 'Staff' })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      }
    } catch {
      alert('Failed to update status');
    }
  };

  const handleUpdateCakeStatus = async (cakeId: string, status: string) => {
    try {
      const res = await fetch(`/api/custom-cakes/${cakeId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user?.role || 'admin'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setCustomCakes(prev => prev.map(c => c.id === cakeId ? { ...c, status: status as any } : c));
      }
    } catch {
      alert('Failed to update cake status');
    }
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditCategory(p.category);
    setEditPrice(p.price);
    setEditStock(p.stockQuantity);
    setEditDesc(p.description || '');
    setEditImage(p.images[0] || '');
    setEditAvailability(p.availability || 'in_stock');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Selected photo is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (isEditing) {
        setEditImage(result);
      } else {
        setNewProdImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSavingProduct(true);
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user?.role || 'admin'
        },
        body: JSON.stringify({
          name: editName.trim(),
          category: editCategory,
          price: Number(editPrice),
          stockQuantity: Number(editStock),
          description: editDesc.trim(),
          images: [editImage.trim() || editingProduct.images[0]],
          availability: editAvailability
        })
      });

      if (res.ok) {
        setEditingProduct(null);
        onRefreshProducts();
      } else {
        alert('Failed to update product details or picture.');
      }
    } catch {
      alert('Error updating product picture and information.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user?.role || 'admin'
        },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCategory,
          price: Number(newProdPrice),
          stockQuantity: Number(newProdStock),
          description: newProdDesc,
          images: [newProdImage],
          availability: 'in_stock',
          prepTime: '2-4 hours',
          ingredients: ['Flour', 'Butter', 'Sugar', 'Eggs']
        })
      });

      if (res.ok) {
        setShowAddProduct(false);
        onRefreshProducts();
        alert('Product added successfully!');
      }
    } catch {
      alert('Error creating product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bakery item?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': user?.role || 'admin'
        }
      });
      if (res.ok) {
        onRefreshProducts();
      }
    } catch {
      alert('Error deleting product');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user?.role || 'admin'
        },
        body: JSON.stringify({
          code: newCouponCode.toUpperCase().trim(),
          discountType: newCouponType,
          value: Number(newCouponValue),
          discountValue: Number(newCouponValue),
          minOrderAmount: Number(newCouponMin),
          isActive: true
        })
      });
      if (res.ok) {
        const c = await res.json();
        setCoupons(prev => [...prev, c]);
        setShowAddCoupon(false);
        setNewCouponCode('');
      }
    } catch {
      alert('Error adding coupon');
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
  const activeOrdersCount = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;
  const lowStockCount = products.filter(p => p.stockQuantity < 10).length;

  // Access check: only admins and staff can view or manage inventory/prices/images
  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-[#E8DEC8] shadow-md text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-[#A68322] rounded-2xl flex items-center justify-center mx-auto border border-[#E8DEC8]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-black text-xl text-gray-900">Restricted Access</h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          This terminal is reserved for Yatex administrators and kitchen staff. Customers are not permitted to edit prices, upload product pictures, or manage bakery inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-full bg-white shadow-md border-2 border-[#C8A358] p-0.5 overflow-hidden flex-shrink-0">
            <img
              src="/logo.png"
              alt="YFP Official Logo"
              className="w-full h-full object-contain rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.svg';
              }}
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Live Kitchen Terminal</span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#181310] tracking-tight mt-0.5">
              YFP Operations & Management
            </h1>
            <p className="text-xs text-gray-500">Lekki Phase 1 Hub • Orders, Live Inventory & Custom Cakes</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAllData}
            className="p-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-black flex items-center space-x-1 text-xs font-bold shadow-xs"
            title="Refresh All"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddProduct(true)}
            className="bg-[#181310] hover:bg-[#DEB346] text-[#DEB346] hover:text-[#181310] px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif font-black text-xl sm:text-2xl text-[#181310]">{formatNaira(totalRevenue)}</p>
          <p className="text-[10px] text-emerald-700 mt-1">Verified Paid Orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-serif font-black text-xl sm:text-2xl text-[#181310]">{activeOrdersCount}</p>
          <p className="text-[10px] text-amber-700 mt-1">In kitchen prep or transit</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Orders</span>
            <Package className="w-4 h-4 text-[#DEB346]" />
          </div>
          <p className="font-serif font-black text-xl sm:text-2xl text-[#181310]">{orders.length}</p>
          <p className="text-[10px] text-gray-500 mt-1">All-time lifetime records</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="font-serif font-black text-xl sm:text-2xl text-[#181310]">{lowStockCount}</p>
          <p className="text-[10px] text-rose-700 mt-1">Items below 10 units</p>
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
          <span>Orders Queue ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-white text-[#181310] border-t-2 border-[#181310] shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Inventory Products ({products.length})</span>
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
          onClick={() => setActiveTab('catering')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'catering'
              ? 'bg-white text-[#181310] border-t-2 border-[#181310] shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Catering Proposals ({cateringRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'coupons'
              ? 'bg-white text-[#181310] border-t-2 border-[#181310] shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Promo Codes ({coupons.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS QUEUE */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-[#E8DEC8] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7F2] text-gray-500 font-bold uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-3.5">Order</th>
                  <th className="p-3.5">Customer & Destination</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Amount & Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((ord) => {
                  const badge = getStatusBadgeInfo(ord.orderStatus);
                  return (
                    <tr key={ord.id} className="hover:bg-[#FCFAF7] transition-colors">
                      <td className="p-3.5 align-top">
                        <span className="font-mono font-bold text-gray-900">{ord.orderNumber}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDateTime(ord.createdAt)}</p>
                      </td>

                      <td className="p-3.5 align-top">
                        <p className="font-bold text-gray-900">{ord.customer.fullName}</p>
                        <p className="text-[11px] text-gray-500">{ord.customer.phone}</p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {ord.deliveryMethod === 'pickup' ? '📍 Bakery Pickup' : `🚚 ${ord.deliveryDetails?.area}`}
                        </p>
                      </td>

                      <td className="p-3.5 align-top">
                        <div className="space-y-0.5">
                          {ord.items.map((it, i) => (
                            <p key={i} className="text-[11px] text-gray-700">
                              <strong>{it.quantity}x</strong> {it.name}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td className="p-3.5 align-top">
                        <span className="font-black text-gray-900">{formatNaira(ord.totalAmount)}</span>
                        <p className={`text-[10px] font-bold ${ord.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {ord.paymentStatus === 'paid' ? '✓ Paid' : 'Pending POD'}
                        </p>
                      </td>

                      <td className="p-3.5 align-top">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                          className={`text-[11px] font-bold rounded-lg p-1 border focus:outline-none ${badge.bg} ${badge.color}`}
                        >
                          <option value="pending_payment">Pending Payment</option>
                          <option value="payment_confirmed">Payment Confirmed</option>
                          <option value="order_received">Order Received</option>
                          <option value="preparing">Baking & Decorating</option>
                          <option value="ready">Ready for Dispatch</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-3.5 align-top text-right">
                        <button
                          onClick={() => setReceiptOrder(ord)}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 inline-flex items-center space-x-1"
                          title="Print Receipt"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8]">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#181310]">Bakery Inventory & Pictures</h3>
              <p className="text-xs text-gray-500">Click on any product image or the "Edit Picture" button to update photo, price, or stock</p>
            </div>
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-[#181310] hover:bg-[#DEB346] text-[#DEB346] hover:text-[#181310] px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow self-start sm:self-auto transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#E8DEC8] hover:border-[#DEB346]/60 shadow-xs flex flex-col justify-between transition-all">
                <div className="flex space-x-3.5">
                  {/* Product Picture with hover/click edit indicator */}
                  <div
                    onClick={() => openEditProduct(p)}
                    className="relative group/pic flex-shrink-0 cursor-pointer overflow-hidden rounded-xl w-24 h-24 bg-gray-100 border border-[#E8DEC8]"
                    title="Click to edit picture"
                  >
                    <img
                      src={p.images[0] || getFallbackBakeryImage(p.category)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover/pic:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getFallbackBakeryImage(p.category);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/pic:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                      <Camera className="w-5 h-5 text-[#DEB346]" />
                      <span className="text-[9px] font-bold mt-1 text-[#DEB346]">Edit Pic</span>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-white px-1.5 py-0.5 rounded flex items-center space-x-0.5 group-hover/pic:hidden">
                      <Camera className="w-2.5 h-2.5 text-[#DEB346]" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif font-bold text-xs text-gray-900 truncate" title={p.name}>{p.name}</h4>
                      <div className="flex items-center space-x-0.5">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="text-gray-400 hover:text-[#A68322] p-1"
                          title="Edit product picture & details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-gray-400 hover:text-rose-600 p-1"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500">{p.category}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-black text-[#A68322]">{formatNaira(p.price)}</span>
                      <button
                        onClick={() => openEditProduct(p)}
                        className="text-[10px] text-[#A68322] hover:text-[#181310] font-bold underline flex items-center space-x-0.5"
                      >
                        <Edit className="w-2.5 h-2.5" />
                        <span>Edit Price</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-gray-100">
                      <span className={p.stockQuantity < 10 ? 'text-rose-600 font-bold' : 'text-gray-600'}>
                        Stock: {p.stockQuantity}
                      </span>
                      <span className="text-gray-400 text-[10px]">{p.prepTime}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100">
                  <button
                    onClick={() => openEditProduct(p)}
                    className="w-full bg-[#FAF7F2] hover:bg-[#181310] text-[#181310] hover:text-[#DEB346] py-1.5 px-3 rounded-lg text-[11px] font-bold border border-[#E8DEC8] hover:border-[#181310] transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#DEB346]" />
                    <span>Edit Picture / Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM CAKE REQUESTS */}
      {activeTab === 'custom-cakes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customCakes.map((req) => (
            <div key={req.id} className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3">
              <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                <div>
                  <span className="font-mono font-bold text-xs text-gray-900">{req.requestId}</span>
                  <p className="text-xs text-gray-700 font-bold mt-0.5">{req.customer.name} ({req.customer.phone})</p>
                </div>
                <select
                  value={req.status}
                  onChange={(e) => handleUpdateCakeStatus(req.id, e.target.value)}
                  className="text-xs font-bold border rounded-lg p-1 bg-[#FAF7F2]"
                >
                  <option value="pending_review">Pending Review</option>
                  <option value="quote_sent">Quote Sent</option>
                  <option value="approved">Approved</option>
                  <option value="baking">Baking</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <p><strong>Size:</strong> {req.cakeSize}</p>
                <p><strong>Flavor:</strong> {req.flavor}</p>
                <p><strong>Layers:</strong> {req.layers} Layers</p>
                <p><strong>Frosting:</strong> {req.frosting}</p>
                <p className="col-span-2"><strong>Event Date:</strong> {req.preferredDeliveryDate}</p>
                {req.inscription && (
                  <p className="col-span-2 text-gray-600 italic">"{req.inscription}"</p>
                )}
                {req.specialInstructions && (
                  <p className="col-span-2 text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Instructions:</strong> {req.specialInstructions}
                  </p>
                )}
              </div>

              {req.referenceImage && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Customer Reference Photo</p>
                  <img
                    src={req.referenceImage}
                    alt="Custom design"
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              )}

              <div className="text-right text-xs font-bold text-[#A68322] pt-2 border-t border-gray-100">
                Estimated Price: {formatNaira(req.estimatedPrice || 0)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CATERING INQUIRIES */}
      {activeTab === 'catering' && (
        <div className="space-y-3">
          {cateringRequests.length === 0 ? (
            <p className="text-xs text-gray-500 italic text-center py-10">No catering proposals submitted yet.</p>
          ) : (
            cateringRequests.map((cat, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-[#E8DEC8] text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">{cat.eventType} ({cat.guestCount} Guests)</span>
                  <span className="text-gray-500">Date: {cat.eventDate}</span>
                </div>
                <p className="text-gray-700">
                  <strong>Contact:</strong> {cat.contactName} • {cat.contactPhone} • {cat.contactEmail}
                </p>
                <div className="flex flex-wrap gap-1">
                  {cat.packagesSelected?.map((p: string, i: number) => (
                    <span key={i} className="bg-[#FAF7F2] text-gray-800 text-[10px] px-2 py-0.5 rounded border">
                      {p}
                    </span>
                  ))}
                </div>
                {cat.notes && <p className="text-gray-500 italic bg-gray-50 p-2 rounded">"{cat.notes}"</p>}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: PROMO CODES */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddCoupon(true)}
              className="bg-[#181310] text-[#DEB346] px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-xl border border-[#E8DEC8] shadow-xs text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-sm text-[#181310]">{c.code}</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-gray-600">
                  {c.discountType === 'percentage' ? `${c.discountValue ?? 0}% OFF` : `${formatNaira(c.discountValue ?? 0)} OFF`}
                </p>
                <p className="text-gray-400 text-[10px]">Min spend: {formatNaira(c.minOrderAmount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleCreateProduct} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-gray-900">Add New Bakery Product</h3>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="e.g. Vanilla Bean Cupcake"
                className="w-full bg-[#FAF7F2] border rounded-lg p-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full bg-[#FAF7F2] border rounded-lg p-2"
                >
                  <option value="Pastries">Pastries</option>
                  <option value="Cakes">Cakes</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Small Chops">Small Chops</option>
                  <option value="Celebration Cakes">Celebration Cakes</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Price (₦)</label>
                <input
                  type="number"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  className="w-full bg-[#FAF7F2] border rounded-lg p-2"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={newProdStock}
                onChange={(e) => setNewProdStock(Number(e.target.value))}
                className="w-full bg-[#FAF7F2] border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Description</label>
              <textarea
                rows={2}
                required
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                placeholder="Fresh ingredients, taste profile..."
                className="w-full bg-[#FAF7F2] border rounded-lg p-2"
              />
            </div>
            <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8DEC8] space-y-2.5">
              <label className="block font-bold text-gray-700">Product Picture</label>
              <div className="flex items-center space-x-3">
                <img
                  src={newProdImage}
                  alt="Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-[#DEB346] bg-gray-100 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div className="flex-1 space-y-1.5">
                  <label className="inline-flex items-center space-x-1.5 bg-white border border-[#DEB346] hover:bg-amber-50 px-2.5 py-1.5 rounded-lg cursor-pointer text-[11px] font-semibold text-gray-700 shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-[#A68322]" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    required
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="Or enter image URL"
                    className="w-full bg-white border rounded-lg p-1.5 text-[11px]"
                  />
                </div>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pt-1 scrollbar-thin">
                {BAKERY_IMAGE_PRESETS.slice(0, 6).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNewProdImage(preset.url)}
                    className="flex-shrink-0 text-[10px] bg-white border border-gray-200 hover:border-[#DEB346] rounded px-1.5 py-0.5 flex items-center space-x-1"
                  >
                    <img src={preset.url} alt="" className="w-3.5 h-3.5 rounded object-cover" />
                    <span>{preset.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddProduct(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#181310] text-[#DEB346] rounded-lg font-bold"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT PRODUCT & PICTURE MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleUpdateProduct}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl my-8 border border-[#E8DEC8]"
          >
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF3E3] text-[#A68322] flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-gray-900">Edit Product Picture & Details</h3>
                  <p className="text-[11px] text-gray-500">Update photo, price, or bakery stock</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PICTURE PREVIEW & UPLOAD SECTION */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-800 flex items-center space-x-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#A68322]" />
                  <span>Product Picture</span>
                </label>
                <span className="text-[10px] text-gray-500">Live Preview</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Image Preview Box */}
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-200 border-2 border-[#DEB346] flex-shrink-0 shadow-sm">
                  <img
                    src={editImage || editingProduct.images[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center text-[9px] text-[#DEB346] font-semibold">
                    Current Image
                  </div>
                </div>

                {/* Upload or URL Controls */}
                <div className="flex-1 space-y-2.5 w-full">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Upload New Photo from Device
                    </label>
                    <label className="flex items-center justify-center space-x-2 border-2 border-dashed border-[#DEB346]/60 hover:border-[#DEB346] bg-white hover:bg-amber-50/50 p-2.5 rounded-xl cursor-pointer transition-colors text-center">
                      <Upload className="w-4 h-4 text-[#A68322]" />
                      <span className="text-xs font-semibold text-gray-700">Choose File (PNG, JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Or Paste Image URL
                    </label>
                    <input
                      type="url"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#DEB346] focus:border-[#DEB346]"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Preset Library */}
              <div className="pt-2 border-t border-[#E8DEC8]">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Or Tap a Curated Bakery Preset Photo:
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {BAKERY_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditImage(preset.url)}
                      className={`flex-shrink-0 flex items-center space-x-1.5 p-1 rounded-lg border text-[10px] font-medium transition-all ${
                        editImage === preset.url
                          ? 'border-[#DEB346] bg-[#DEB346]/20 text-[#181310] font-bold'
                          : 'border-gray-200 bg-white hover:border-[#DEB346]'
                      }`}
                    >
                      <img src={preset.url} alt="" className="w-5 h-5 rounded object-cover" />
                      <span className="whitespace-nowrap">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border rounded-lg p-2 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-[#FAF7F2] border rounded-lg p-2"
                  >
                    <option value="Pastries">Pastries</option>
                    <option value="Cakes">Cakes</option>
                    <option value="Celebration Cakes">Celebration Cakes</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Small Chops">Small Chops</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Inventory Status</label>
                  <select
                    value={editAvailability}
                    onChange={(e) => setEditAvailability(e.target.value as ProductAvailability)}
                    className="w-full bg-[#FAF7F2] border rounded-lg p-2"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="preorder">Preorder</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-[#FAF7F2] border rounded-lg p-2"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProduct}
                className="px-5 py-2 bg-[#181310] hover:bg-[#DEB346] text-[#DEB346] hover:text-[#181310] rounded-xl font-bold flex items-center space-x-1.5 shadow transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSavingProduct ? 'Saving...' : 'Save Picture & Details'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleCreateCoupon} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-gray-900">Create Promo Code</h3>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. FLASH20"
                className="w-full bg-[#FAF7F2] border rounded-lg p-2 font-mono uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Discount Type</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full bg-[#FAF7F2] border rounded-lg p-2"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Naira (₦)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Value</label>
                <input
                  type="number"
                  required
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  className="w-full bg-[#FAF7F2] border rounded-lg p-2"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Min Order Amount (₦)</label>
              <input
                type="number"
                value={newCouponMin}
                onChange={(e) => setNewCouponMin(Number(e.target.value))}
                className="w-full bg-[#FAF7F2] border rounded-lg p-2"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCoupon(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#181310] text-[#DEB346] rounded-lg font-bold"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptOrder && (
        <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
      )}
    </div>
  );
};
