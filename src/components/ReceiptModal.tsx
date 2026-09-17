import React from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import { formatNaira, formatDateTime, getStatusBadgeInfo } from '../utils/formatters';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const badge = getStatusBadgeInfo(order.orderStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E0D8CB] my-8 flex flex-col">
        {/* Top Control Bar (Hidden during print) */}
        <div className="no-print bg-[#181310] text-[#FAF7F2] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-sm tracking-wide">Official Order Receipt</span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-[#DEB346] hover:bg-[#F2CA5C] text-[#120F0D] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2C231B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="receipt-print-area" className="p-6 sm:p-8 bg-white text-[#1C1713] space-y-6">
          {/* Header */}
          <div className="text-center border-b border-[#E8E1D5] pb-6">
            <div className="w-16 h-16 rounded-full bg-white shadow-md border-2 border-[#C8A358] p-0.5 overflow-hidden mx-auto mb-2.5">
              <img
                src="/logo.png"
                alt="YFP Pastries & Cakes"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.svg';
                }}
              />
            </div>
            <h2 className="font-serif font-black text-2xl tracking-wide text-[#120F0D]">
              YFP PASTRIES & CAKES
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-[#A68322] font-bold">
              Yatex's Food Plug — Lagos, Nigeria
            </p>
            <p className="text-xs text-gray-600 mt-1">
              12B Admiralty Way, Lekki Phase 1 • +234 812 345 6789 • orders@yfpbakery.ng
            </p>
          </div>

          {/* Order Details Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#FAF7F2] p-4 rounded-xl border border-[#EDE5D8]">
            <div>
              <p className="text-gray-500 uppercase font-semibold text-[10px]">Order Number</p>
              <p className="font-bold text-sm text-[#181310] font-mono">{order.orderNumber}</p>
              <p className="text-gray-500 uppercase font-semibold text-[10px] mt-2">Date & Time</p>
              <p className="font-medium text-gray-800">{formatDateTime(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase font-semibold text-[10px]">Customer</p>
              <p className="font-bold text-[#181310]">{order.customer.fullName}</p>
              <p className="text-gray-600 truncate">{order.customer.email}</p>
              <p className="text-gray-600">{order.customer.phone}</p>
            </div>
          </div>

          {/* Delivery or Pickup Details */}
          <div className="text-xs border-b border-[#E8E1D5] pb-4">
            <span className="text-gray-500 uppercase font-bold text-[10px]">Fulfillment Details:</span>
            {order.deliveryMethod === 'pickup' ? (
              <p className="font-semibold text-gray-800 mt-0.5">
                Bakery Pickup at 12B Admiralty Way, Lekki Phase 1, Lagos
              </p>
            ) : (
              <div className="mt-0.5 space-y-0.5">
                <p className="font-semibold text-gray-800">
                  {order.deliveryDetails?.address}, {order.deliveryDetails?.area}, Lagos
                </p>
                {order.deliveryDetails?.landmark && (
                  <p className="text-gray-500">Landmark: {order.deliveryDetails.landmark}</p>
                )}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E8E1D5] text-gray-500 text-[10px] uppercase font-bold">
                  <th className="text-left pb-2">Item</th>
                  <th className="text-center pb-2">Qty</th>
                  <th className="text-right pb-2">Unit</th>
                  <th className="text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2.5">
                    <td className="py-2 text-left">
                      <p className="font-bold text-gray-900">{item.name}</p>
                      {item.selectedSize && (
                        <p className="text-[10px] text-[#A68322] font-semibold">{item.selectedSize}</p>
                      )}
                      {item.inscription && (
                        <p className="text-[10px] text-gray-500 italic">"{item.inscription}"</p>
                      )}
                    </td>
                    <td className="py-2 text-center text-gray-700 font-medium">{item.quantity}</td>
                    <td className="py-2 text-right text-gray-700">{formatNaira(item.unitPrice)}</td>
                    <td className="py-2 text-right font-bold text-gray-900">{formatNaira(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="border-t-2 border-[#181310] pt-3 space-y-1.5 text-xs text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">{formatNaira(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({order.deliveryDetails?.area || 'Lekki'})</span>
              <span className="font-medium">{order.deliveryFee === 0 ? 'Free' : formatNaira(order.deliveryFee)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode || 'Promo'})</span>
                <span className="font-bold">-{formatNaira(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-serif font-black text-[#181310] pt-2 border-t border-dashed border-[#DDD5C7]">
              <span>Grand Total</span>
              <span className="text-lg text-[#A68322]">{formatNaira(order.totalAmount)}</span>
            </div>
          </div>

          {/* Payment & Security Footer */}
          <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EDE5D8] flex items-center justify-between text-xs">
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-semibold">Payment Status</p>
              <p className="font-bold text-emerald-700 uppercase flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{order.paymentStatus === 'paid' ? 'Paid & Verified' : 'Payment on Delivery'}</span>
              </p>
            </div>
            {order.paymentReference && (
              <div className="text-right">
                <p className="text-gray-500 text-[10px] uppercase font-semibold">Payment Reference</p>
                <p className="font-mono text-[11px] font-semibold text-gray-800">{order.paymentReference}</p>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-gray-500 pt-2 border-t border-[#E8E1D5]">
            Thank you for ordering with YFP Pastries & Cakes! Baked fresh with love in Lagos.
          </div>
        </div>

        {/* Footer close (Hidden during print) */}
        <div className="no-print bg-[#FAF7F2] p-4 border-t border-[#E8E1D5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#181310] text-white hover:bg-[#DEB346] hover:text-[#181310] rounded-xl text-xs font-bold transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
