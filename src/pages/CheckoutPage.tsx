import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, ShieldCheck, MapPin, CreditCard, Building2, Truck, ShoppingBag, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { DeliveryZone, PaymentMethod, Order } from '../types';
import { formatNaira } from '../utils/formatters';
import { PaystackModal } from '../components/PaystackModal';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToShop, onOrderCompleted }) => {
  const {
    cartItems,
    subtotal,
    deliveryMethod,
    setDeliveryMethod,
    deliveryFee,
    selectedZone,
    setSelectedZone,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    totalAmount,
    clearCart
  } = useCart();

  const { user, openAuthModal } = useAuth();

  // Contact Information
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '07064918034');
  const [email, setEmail] = useState(user?.email || '');

  // Keep contact details synced with user session
  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Delivery details
  const [streetAddress, setStreetAddress] = useState('Ila-Orangun Main Road');
  const [landmark, setLandmark] = useState('Central Post / Palace Junction');
  const [deliveryTiming, setDeliveryTiming] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledDate, setScheduledDate] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');

  // Zones from backend
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedAreaName, setSelectedAreaName] = useState('Osun State (Ila-Orangun, Osogbo, Ife, Ede)');

  // Coupon state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Modal / processing states
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [showPaystackModal, setShowPaystackModal] = useState(false);

  useEffect(() => {
    fetch('/api/delivery-zones')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setZones(data);
          const defaultZ = data.find(z => z.name.toLowerCase().includes('osun')) || data[0];
          if (defaultZ) {
            setSelectedZone(defaultZ);
            setSelectedAreaName(defaultZ.name);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleZoneChange = (zoneName: string) => {
    setSelectedAreaName(zoneName);
    const found = zones.find(z => z.name === zoneName);
    if (found) {
      setSelectedZone(found);
    }
  };

  const handlePromoApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = await applyCoupon(promoCodeInput);
    if (res.success) {
      setPromoMsg({ text: res.message, error: false });
      setPromoCodeInput('');
    } else {
      setPromoMsg({ text: res.message, error: true });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      openAuthModal('order_required');
      return;
    }

    if (!fullName || !phone || !email) {
      alert('Please fill in your name, phone number, and email.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setIsPlacingOrder(true);

    const payload = {
      customer: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim()
      },
      deliveryMethod,
      deliveryDetails: {
        address: streetAddress.trim(),
        landmark: landmark.trim(),
        area: selectedAreaName,
        city: 'Lagos',
        deliveryTimePreference: deliveryTiming,
        scheduledDate: deliveryTiming === 'scheduled' ? scheduledDate : undefined,
        orderNotes: orderNotes.trim()
      },
      items: cartItems,
      couponCode: couponCode || undefined,
      paymentMethod
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const order = await res.json();
      setIsPlacingOrder(false);

      if (res.ok && order.id) {
        if (paymentMethod === 'paystack') {
          setPendingOrder(order);
          setShowPaystackModal(true);
        } else {
          // Pay on delivery or direct bank transfer
          clearCart();
          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } catch {}
          onOrderCompleted(order);
        }
      } else {
        alert(order.error || 'Failed to initialize order');
      }
    } catch {
      setIsPlacingOrder(false);
      alert('Network error placing order');
    }
  };

  const handlePaymentSuccess = (reference: string) => {
    setShowPaystackModal(false);
    clearCart();
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {}
    if (pendingOrder) {
      const verified = {
        ...pendingOrder,
        paymentStatus: 'paid' as const,
        paymentReference: reference,
        orderStatus: 'payment_confirmed' as const
      };
      onOrderCompleted(verified);
    }
  };

  if (cartItems.length === 0 && !pendingOrder) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-xl text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">Select your favorite freshly baked pastries or cakes to proceed to checkout.</p>
        <button
          onClick={onBackToShop}
          className="bg-[#181310] text-[#DEB346] px-6 py-2.5 rounded-full font-bold text-xs uppercase"
        >
          Browse Bakery Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      {/* Top Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={onBackToShop}
          className="p-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-black shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#181310] tracking-tight">
            Checkout
          </h1>
          <p className="text-xs text-gray-500">Complete your bakery order • Delivery across all 36 States in Nigeria</p>
        </div>
      </div>

      {!user && (
        <div className="mb-6 p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-amber-950">Customer Account Required to Place Order</h3>
              <p className="text-xs text-amber-800">
                You must create an account or sign in to complete checkout, receive real-time tracking, and download receipts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('order_required')}
            className="flex-shrink-0 bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Account / Sign In</span>
          </button>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details matching UI Reference */}
        <div className="lg:col-span-7 space-y-6">
          {/* FULFILLMENT METHOD TOGGLE */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] shadow-xs">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Delivery Option
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#F5EFE6] p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  deliveryMethod === 'delivery'
                    ? 'bg-[#181310] text-[#DEB346] shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Door Delivery
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'bg-[#181310] text-[#DEB346] shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Bakery Pickup (Free)
              </button>
            </div>
          </div>

          {/* STEP 1: CONTACT INFORMATION */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E1D5] shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#181310] border-b border-gray-100 pb-2">
              Contact Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Folashade Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="folashade@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: DELIVERY DETAILS (if delivery selected) */}
          {deliveryMethod === 'delivery' && (
            <div className="bg-white p-5 rounded-2xl border border-[#E8E1D5] shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-base text-[#181310] border-b border-gray-100 pb-2">
                Delivery Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Block 5, Flat 2, Admiralty Way"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Landmark / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Ebeano Supermarket"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Delivery Area (Lagos)
                    </label>
                    <select
                      value={selectedAreaName}
                      onChange={(e) => handleZoneChange(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-2.5 text-xs text-gray-900 font-semibold focus:outline-none focus:border-[#DEB346]"
                    >
                      {zones.map((z) => (
                        <option key={z.id} value={z.name}>
                          {z.name} ({formatNaira(z.fee)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Delivery Time Preference */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Timing</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryTiming('asap')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        deliveryTiming === 'asap'
                          ? 'border-[#181310] bg-[#181310] text-[#DEB346]'
                          : 'border-gray-200 bg-[#FAF7F2] text-gray-700'
                      }`}
                    >
                      ASAP (Same Day)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryTiming('scheduled')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        deliveryTiming === 'scheduled'
                          ? 'border-[#181310] bg-[#181310] text-[#DEB346]'
                          : 'border-gray-200 bg-[#FAF7F2] text-gray-700'
                      }`}
                    >
                      Schedule for Later
                    </button>
                  </div>
                  {deliveryTiming === 'scheduled' && (
                    <input
                      type="datetime-local"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="mt-2 w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2 text-xs"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD - Matching Reference */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E1D5] shadow-xs space-y-3">
            <h2 className="font-serif font-bold text-base text-[#181310] border-b border-gray-100 pb-2">
              Payment Method
            </h2>

            <label
              onClick={() => setPaymentMethod('paystack')}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'paystack'
                  ? 'border-[#181310] bg-[#FAF6EE] ring-1 ring-[#181310]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'paystack' ? 'border-[#181310] bg-[#181310]' : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'paystack' && <div className="w-1.5 h-1.5 rounded-full bg-[#DEB346]" />}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900">Card Payment (Paystack)</p>
                  <p className="text-[10px] text-gray-500">Mastercard, Visa, Verve & Bank App transfer</p>
                </div>
              </div>
              <CreditCard className="w-5 h-5 text-[#0BA4DB]" />
            </label>

            <label
              onClick={() => setPaymentMethod('bank_transfer')}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'bank_transfer'
                  ? 'border-[#181310] bg-[#FAF6EE] ring-1 ring-[#181310]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'bank_transfer' ? 'border-[#181310] bg-[#181310]' : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'bank_transfer' && <div className="w-1.5 h-1.5 rounded-full bg-[#DEB346]" />}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900">Direct Bank Transfer</p>
                  <p className="text-[10px] text-gray-500">Transfer directly to YFP GTBank Account</p>
                </div>
              </div>
              <Building2 className="w-5 h-5 text-[#DEB346]" />
            </label>

            <label
              onClick={() => setPaymentMethod('pay_on_delivery')}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'pay_on_delivery'
                  ? 'border-[#181310] bg-[#FAF6EE] ring-1 ring-[#181310]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'pay_on_delivery' ? 'border-[#181310] bg-[#181310]' : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'pay_on_delivery' && <div className="w-1.5 h-1.5 rounded-full bg-[#DEB346]" />}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900">Pay on Delivery</p>
                  <p className="text-[10px] text-gray-500">Cash or POS on dispatch arrival</p>
                </div>
              </div>
              <Truck className="w-5 h-5 text-gray-600" />
            </label>
          </div>

          {/* ORDER NOTES */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] shadow-xs">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Add Order Note (Optional)
            </label>
            <input
              type="text"
              placeholder="Write any specific request here (e.g., call upon gate arrival)..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
            />
          </div>
        </div>

        {/* Right Column: Order Summary & Placement matching UI Reference */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-[#E8E1D5] shadow-lg sticky top-28 space-y-4">
            <h2 className="font-serif font-bold text-base text-[#181310] border-b border-gray-100 pb-2">
              Order Summary ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
            </h2>

            {/* Item list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-2 flex items-center space-x-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{item.name}</p>
                    {item.selectedSize && (
                      <p className="text-[10px] text-[#A68322] font-semibold">{item.selectedSize}</p>
                    )}
                    <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-gray-900">
                    {formatNaira(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. YFP10)"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs uppercase font-bold focus:outline-none focus:border-[#DEB346]"
                />
                <button
                  type="button"
                  onClick={handlePromoApply}
                  className="bg-[#181310] text-[#DEB346] px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-black transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponCode && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded mt-2 border border-emerald-200">
                  <span>Code <strong>{couponCode}</strong> applied (-{formatNaira(discountAmount)})</span>
                  <button type="button" onClick={removeCoupon} className="text-rose-600 underline text-[10px]">
                    Remove
                  </button>
                </div>
              )}
              {promoMsg && (
                <p className={`text-[11px] mt-1 ${promoMsg.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {promoMsg.text}
                </p>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{deliveryMethod === 'pickup' ? 'Bakery Pickup' : `Delivery (${selectedAreaName})`}</span>
                <span className="font-semibold text-gray-900">
                  {deliveryMethod === 'pickup' ? 'Free' : formatNaira(deliveryFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-{formatNaira(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-serif font-black text-[#181310] pt-2 border-t border-dashed border-gray-200">
                <span>Total Due</span>
                <span className="text-xl text-[#A68322]">{formatNaira(totalAmount)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              id="checkout-place-order-btn"
              type="submit"
              disabled={isPlacingOrder}
              className="w-full bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              <span>{isPlacingOrder ? 'Processing...' : `Place Order — ${formatNaira(totalAmount)}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Paystack checkout with 256-bit encryption</span>
            </div>
          </div>
        </div>
      </form>

      {/* Paystack Payment Modal */}
      {showPaystackModal && pendingOrder && (
        <PaystackModal
          amount={pendingOrder.totalAmount}
          email={pendingOrder.customer.email}
          orderId={pendingOrder.id}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaystackModal(false)}
        />
      )}
    </div>
  );
};
