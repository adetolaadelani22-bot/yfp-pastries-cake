import React, { useState, useEffect } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, ChefHat, Phone, MessageSquare, Printer, ArrowLeft, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatNaira, formatDateTime, getStatusBadgeInfo } from '../utils/formatters';
import { ReceiptModal } from '../components/ReceiptModal';

interface OrderTrackingPageProps {
  initialOrder?: Order | null;
  onNavigateToShop: () => void;
}

const STEPS: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
  { status: 'order_received', label: 'Order Placed', icon: Package, desc: 'We received your order request' },
  { status: 'payment_confirmed', label: 'Payment Confirmed', icon: CheckCircle2, desc: 'Verified and queued for the kitchen' },
  { status: 'preparing', label: 'Baking & Decorating', icon: ChefHat, desc: 'Fresh ingredients being baked & crafted' },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, desc: 'On its way with our dispatch rider' },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Delivered fresh and ready to enjoy!' },
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ initialOrder, onNavigateToShop }) => {
  const [order, setOrder] = useState<Order | null>(initialOrder || null);
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
    } else {
      // Fetch latest order to demonstrate
      fetchLatestOrder();
    }
  }, [initialOrder]);

  const fetchLatestOrder = async () => {
    try {
      const res = await fetch('/api/orders');
      const orders: Order[] = await res.json();
      if (Array.isArray(orders) && orders.length > 0) {
        setOrder(orders[0]);
      }
    } catch {}
  };

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderNumber.trim()) return;

    setIsSearching(true);
    setSearchError('');

    try {
      const res = await fetch(`/api/orders/track/${searchOrderNumber.trim().toUpperCase()}`);
      const data = await res.json();
      setIsSearching(false);
      if (res.ok && data.id) {
        setOrder(data);
      } else {
        setSearchError(data.error || 'Order not found. Check order number.');
      }
    } catch {
      setIsSearching(false);
      setSearchError('Error connecting to tracking service');
    }
  };

  const refreshCurrentOrder = async () => {
    if (!order) return;
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orders/track/${order.orderNumber}`);
      const data = await res.json();
      setIsRefreshing(false);
      if (res.ok && data.id) {
        setOrder(data);
      }
    } catch {
      setIsRefreshing(false);
    }
  };

  // Status index for progress bar
  const currentStepIndex = React.useMemo(() => {
    if (!order) return 0;
    if (order.orderStatus === 'cancelled') return -1;
    const idx = STEPS.findIndex(s => s.status === order.orderStatus);
    return idx === -1 ? 0 : idx;
  }, [order]);

  const badge = order ? getStatusBadgeInfo(order.orderStatus) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      {/* Top Search & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={onNavigateToShop}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-700 hover:text-black bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-xs self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Menu</span>
        </button>

        {/* Search Order Bar */}
        <form onSubmit={handleSearchOrder} className="flex space-x-2 w-full sm:w-80">
          <input
            type="text"
            placeholder="Track (e.g. YFP-20260917-001)"
            value={searchOrderNumber}
            onChange={(e) => setSearchOrderNumber(e.target.value.toUpperCase())}
            className="flex-1 bg-white border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs font-mono uppercase font-bold focus:outline-none focus:border-[#DEB346] shadow-xs"
          />
          <button
            type="submit"
            disabled={isSearching || !searchOrderNumber.trim()}
            className="bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {isSearching ? '...' : <Search className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>

      {searchError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs mb-6">
          {searchError}
        </div>
      )}

      {!order ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EDE5D8] shadow-sm">
          <Package className="w-12 h-12 text-[#C4B4A2] mx-auto mb-3" />
          <h2 className="font-serif font-bold text-xl text-gray-900">Track Your Bakery Delivery</h2>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Enter your YFP order tracking number above to see real-time preparation status and rider dispatch.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Order Tracking</span>
                <div className="flex items-center space-x-2">
                  <h1 className="font-serif font-black text-xl text-[#181310] font-mono">
                    {order.orderNumber}
                  </h1>
                  <button
                    onClick={refreshCurrentOrder}
                    className={`p-1 text-gray-400 hover:text-black ${isRefreshing ? 'animate-spin' : ''}`}
                    title="Refresh live status"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Placed on {formatDateTime(order.createdAt)}</p>
              </div>

              <div className="flex items-center space-x-2">
                {badge && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${badge.bg} ${badge.color}`}>
                    {badge.label}
                  </span>
                )}
                <button
                  onClick={() => setShowReceipt(true)}
                  className="bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#181310] border border-[#DDD5C7] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#DEB346]" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>

            {/* Estimated Delivery Banner */}
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EDE5D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#181310] text-[#DEB346] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Estimated Delivery Time</p>
                  <p className="font-serif font-bold text-base text-[#181310]">
                    {order.estimatedDeliveryTime || 'Today, within 45–60 mins'}
                  </p>
                </div>
              </div>

              {order.deliveryDetails && (
                <div className="text-xs sm:text-right">
                  <p className="text-gray-500 uppercase font-semibold">Destination</p>
                  <p className="font-bold text-gray-800">{order.deliveryDetails.area}, Lagos</p>
                </div>
              )}
            </div>

            {/* PROGRESS STEPPER */}
            <div className="py-4">
              <div className="space-y-6">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={step.status} className="flex items-start space-x-4 relative">
                      {/* Vertical line connecting steps */}
                      {idx < STEPS.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 -bottom-4 w-0.5 ${
                            currentStepIndex > idx ? 'bg-[#DEB346]' : 'bg-gray-200'
                          }`}
                        />
                      )}

                      {/* Step Circle */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                          isDone
                            ? 'bg-[#181310] text-[#DEB346] ring-4 ring-[#FAF2DC]'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Step Label & Desc */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-serif text-sm font-bold ${
                              isCurrent ? 'text-[#DEB346]' : isDone ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full animate-pulse">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIDER / DISPATCH CARD (when out for delivery or preparing) */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                  alt="Dispatch Rider"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Assigned Dispatcher</p>
                <h4 className="font-serif font-bold text-sm text-gray-900">Babatunde Lawal</h4>
                <p className="text-xs text-gray-500">YFP Express Bike (Lekki Hub)</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="tel:+2348123456789"
                className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center border border-emerald-200 transition-colors"
                title="Call Dispatch Rider"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center shadow transition-colors"
                title="Chat with Bakery WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ORDER ITEMS SUMMARY */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
              Order Items ({order.items.length})
            </h3>
            <div className="divide-y divide-gray-100 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      {item.selectedSize && (
                        <p className="text-[10px] text-[#A68322] font-semibold">{item.selectedSize}</p>
                      )}
                      <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">{formatNaira(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 text-xs flex justify-between font-bold text-gray-900">
              <span>Total Paid / Due</span>
              <span className="text-[#A68322] font-black text-sm">{formatNaira(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {showReceipt && order && (
        <ReceiptModal order={order} onClose={() => setShowReceipt(false)} />
      )}
    </div>
  );
};
