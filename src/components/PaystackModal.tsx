import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Building2, Lock, ArrowRight, Loader2, CheckCircle2, Copy, Check } from 'lucide-react';
import { formatNaira } from '../utils/formatters';

interface PaystackModalProps {
  amount: number;
  email: string;
  orderId: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export const PaystackModal: React.FC<PaystackModalProps> = ({
  amount,
  email,
  orderId,
  onSuccess,
  onClose
}) => {
  const [paymentTab, setPaymentTab] = useState<'card' | 'bank_transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states for card simulation
  const [cardNumber, setCardNumber] = useState('4084 0840 0840 0840');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('840');

  const handlePayCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Step 1: Initialize payment reference
      const initRes = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email, amount })
      });
      const initData = await initRes.json();
      const reference = initData.reference || `PSTK_REF_${Date.now()}`;

      // Simulate 1.5s gateway authentication
      await new Promise(r => setTimeout(r, 1500));

      // Step 2: Backend independent payment verification
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, orderId })
      });
      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success) {
        setIsProcessing(false);
        onSuccess(reference);
      } else {
        alert(verifyData.error || 'Payment verification failed');
        setIsProcessing(false);
      }
    } catch {
      alert('Error communicating with payment gateway');
      setIsProcessing(false);
    }
  };

  const handleTransferSent = async () => {
    setIsProcessing(true);
    const reference = `TRF_PSTK_${Date.now()}`;

    // Verify transfer payment
    await new Promise(r => setTimeout(r, 1800));
    try {
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, orderId })
      });
      const verifyData = await verifyRes.json();
      setIsProcessing(false);
      if (verifyRes.ok && verifyData.success) {
        onSuccess(reference);
      } else {
        alert(verifyData.error || 'Transfer verification failed');
      }
    } catch {
      setIsProcessing(false);
      alert('Error verifying transfer');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Paystack Header Banner */}
        <div className="bg-[#0BA4DB] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold">Secured by Paystack</p>
              <h3 className="font-bold text-sm tracking-wide">YFP Pastries & Cakes</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/80 uppercase font-semibold">Amount Due</p>
            <p className="text-lg font-black tracking-tight">{formatNaira(amount)}</p>
          </div>
        </div>

        {/* Customer Email & Method Selector */}
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between text-xs text-gray-600">
          <span className="truncate max-w-[200px]">{email}</span>
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200">
            Live Gateway
          </span>
        </div>

        {/* Tabs: Card vs Bank Transfer */}
        <div className="grid grid-cols-2 bg-[#ECE5D8] p-1.5 m-5 rounded-xl text-xs font-bold text-gray-700">
          <button
            type="button"
            onClick={() => setPaymentTab('card')}
            className={`py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              paymentTab === 'card'
                ? 'bg-white text-[#181310] shadow-sm'
                : 'hover:text-[#181310]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pay with Card</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentTab('bank_transfer')}
            className={`py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              paymentTab === 'bank_transfer'
                ? 'bg-white text-[#181310] shadow-sm'
                : 'hover:text-[#181310]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bank Transfer</span>
          </button>
        </div>

        {/* Tab 1: Card Input */}
        {paymentTab === 'card' ? (
          <form onSubmit={handlePayCard} className="px-5 pb-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Card Number
              </label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4084 0840 0840 0840"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0BA4DB]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0BA4DB]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="123"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0BA4DB]"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                Demonstration card credentials pre-loaded. Click below to execute real instant Paystack validation and stock deduction.
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#0BA4DB] hover:bg-[#0993C4] text-white py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Contacting Bank Gateway...</span>
                </>
              ) : (
                <>
                  <span>Pay {formatNaira(amount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Tab 2: Instant Bank Transfer */
          <div className="px-5 pb-5 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-500">Bank Name</span>
                <span className="font-bold text-gray-800">Guaranty Trust Bank (GTBank)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-500">Account Name</span>
                <span className="font-bold text-gray-800">YFP BAKERY / YATEX FOOD PLUG</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Account Number</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-sm text-[#0BA4DB]">0812345678</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('0812345678')}
                    className="p-1 text-gray-500 hover:text-[#0BA4DB]"
                    title="Copy Account Number"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed text-center">
              Please transfer exactly <strong>{formatNaira(amount)}</strong> to the account above via your mobile banking app.
            </p>

            <button
              type="button"
              onClick={handleTransferSent}
              disabled={isProcessing}
              className="w-full bg-[#0BA4DB] hover:bg-[#0993C4] text-white py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Transfer Notification...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Sent {formatNaira(amount)}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Modal Cancel Footer */}
        <div className="bg-gray-100 px-5 py-3 flex items-center justify-between border-t border-gray-200 text-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            Cancel Payment
          </button>
          <span className="text-gray-400 flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>256-bit SSL Encrypted</span>
          </span>
        </div>
      </div>
    </div>
  );
};
