import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatNaira } from '../utils/formatters';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onNavigateToShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateToCheckout, onNavigateToShop }) => {
  const { user, requireAuthForOrder } = useAuth();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryMethod,
    setDeliveryMethod,
    deliveryFee,
    totalAmount,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; error: boolean } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setIsApplyingCoupon(true);
    setCouponFeedback(null);
    const res = await applyCoupon(inputCoupon);
    setIsApplyingCoupon(false);
    if (res.success) {
      setCouponFeedback({ text: res.message, error: false });
      setInputCoupon('');
    } else {
      setCouponFeedback({ text: res.message, error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#1E1814] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#E8E1D5] bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#181310] text-[#DEB346] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="font-serif font-bold text-lg text-[#181310]">
                Your Order ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-20 h-20 rounded-full bg-[#EFE9DC] flex items-center justify-center text-[#B5A593] mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#181310] mb-2">Your cart is empty</h3>
                <p className="text-xs text-[#7A6B5C] max-w-xs mb-6">
                  Craving fresh chocolate cake, warm meat pies, or crunchy chin chin?
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToShop();
                  }}
                  className="bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  Explore Bakery Menu
                </button>
              </div>
            ) : (
              <>
                {/* Delivery Option Toggle */}
                <div className="bg-white p-3 rounded-xl border border-[#E8E1D5] shadow-xs">
                  <label className="text-xs font-bold text-[#6B5A4B] uppercase tracking-wider block mb-2">
                    Fulfillment Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-[#F3EDE2] p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                        deliveryMethod === 'delivery'
                          ? 'bg-[#181310] text-[#DEB346] shadow'
                          : 'text-[#615143] hover:text-[#181310]'
                      }`}
                    >
                      Door Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                        deliveryMethod === 'pickup'
                          ? 'bg-[#181310] text-[#DEB346] shadow'
                          : 'text-[#615143] hover:text-[#181310]'
                      }`}
                    >
                      Bakery Pickup (Free)
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3.5 rounded-xl border border-[#EBE3D6] shadow-xs flex items-center space-x-3.5"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-sm text-[#181310] truncate">
                          {item.name}
                        </h4>
                        {item.selectedSize && (
                          <p className="text-[11px] text-[#A68322] font-semibold">{item.selectedSize}</p>
                        )}
                        {item.inscription && (
                          <p className="text-[10px] text-gray-500 italic truncate">
                            "{item.inscription}"
                          </p>
                        )}
                        <p className="text-xs font-extrabold text-[#181310] mt-1">
                          {formatNaira(item.unitPrice * item.quantity)}
                        </p>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex flex-col items-end space-y-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center space-x-1.5 bg-[#F6F2EA] rounded-lg p-1 border border-[#E5DDCF]">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-5 h-5 rounded flex items-center justify-center hover:bg-white text-gray-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center hover:bg-white text-gray-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="bg-white p-3 rounded-xl border border-[#E8E1D5]">
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. YFP10)"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                        className="w-full bg-[#FAF7F2] border border-[#E2D8C9] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#181310] uppercase font-bold focus:outline-none focus:border-[#DEB346]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !inputCoupon.trim()}
                      className="bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>

                  {couponCode && (
                    <div className="mt-2 text-xs flex items-center justify-between bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
                      <div className="flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Code <strong>{couponCode}</strong> applied (-{formatNaira(discountAmount)})</span>
                      </div>
                      <button onClick={removeCoupon} className="text-xs text-rose-600 underline font-semibold">
                        Remove
                      </button>
                    </div>
                  )}

                  {couponFeedback && (
                    <p className={`text-xs mt-1.5 ${couponFeedback.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {couponFeedback.text}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Totals & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-[#E8E1D5] bg-white space-y-3 shadow-lg">
              <div className="space-y-1.5 text-xs text-[#635345]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#181310]">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{deliveryMethod === 'pickup' ? 'Bakery Pickup' : 'Estimated Delivery (Nationwide)'}</span>
                  <span className="font-semibold text-[#181310]">
                    {deliveryMethod === 'pickup' ? 'Free' : formatNaira(deliveryFee)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-bold">-{formatNaira(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif font-bold text-[#181310] pt-2 border-t border-[#F0EAE1]">
                  <span>Total Amount</span>
                  <span className="text-lg text-[#A68322]">{formatNaira(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    setIsCartOpen(false);
                    requireAuthForOrder(() => {
                      onNavigateToCheckout();
                    });
                    return;
                  }
                  setIsCartOpen(false);
                  onNavigateToCheckout();
                }}
                className="w-full bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center space-x-2 transition-all transform active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
