import { OrderStatus } from '../types';

export function formatNaira(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₦0';
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function getStatusBadgeInfo(status: OrderStatus): { label: string; color: string; bg: string } {
  switch (status) {
    case 'pending_payment':
      return { label: 'Pending Payment', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-300' };
    case 'payment_confirmed':
      return { label: 'Payment Confirmed', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-300' };
    case 'order_received':
      return { label: 'Order Received', color: 'text-blue-800', bg: 'bg-blue-100 border-blue-300' };
    case 'preparing':
      return { label: 'Baking & Preparing', color: 'text-purple-800', bg: 'bg-purple-100 border-purple-300' };
    case 'ready':
      return { label: 'Ready for Dispatch', color: 'text-indigo-800', bg: 'bg-indigo-100 border-indigo-300' };
    case 'out_for_delivery':
      return { label: 'Out for Delivery', color: 'text-amber-900', bg: 'bg-amber-200 border-amber-400' };
    case 'delivered':
      return { label: 'Delivered', color: 'text-green-800', bg: 'bg-green-100 border-green-300' };
    case 'cancelled':
      return { label: 'Cancelled', color: 'text-rose-800', bg: 'bg-rose-100 border-rose-300' };
    default:
      return { label: status, color: 'text-gray-800', bg: 'bg-gray-100 border-gray-300' };
  }
}

export function getFallbackBakeryImage(category?: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('pie') || cat.includes('pastr')) {
    return '/pastries-cat.jpg';
  }
  if (cat.includes('celebrat')) {
    return '/celebration-cake-cat.jpg';
  }
  if (cat.includes('cake')) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('snack') || cat.includes('doughnut') || cat.includes('chin')) {
    return 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('chop')) {
    return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80';
  }
  return '/pastries-cat.jpg';
}
