import React, { useState, useEffect } from 'react';
import { X, Camera, Upload, CheckCircle2, DollarSign, Tag, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';
import { Product, ProductAvailability } from '../types';
import { formatNaira, getFallbackBakeryImage } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

interface QuickPriceModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (updatedProduct: Product) => void;
}

const BAKERY_IMAGE_PRESETS = [
  { label: 'Nigerian Meat Pie', category: 'Pastries', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Savory Beef Pie', category: 'Pastries', url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80' },
  { label: 'Signature Chocolate Cake', category: 'Cakes', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
  { label: 'Celebration Birthday Cake', category: 'Celebration Cakes', url: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80' },
  { label: 'Vanilla Floral Cake', category: 'Cakes', url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Red Velvet Cake', category: 'Cakes', url: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Golden Ring Doughnuts', category: 'Snacks', url: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Small Chops Platter', category: 'Small Chops', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
  { label: 'Crunchy Chin Chin', category: 'Snacks', url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Flaky Golden Croissant', category: 'Pastries', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80' }
];

export const QuickPriceModal: React.FC<QuickPriceModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveSuccess
}) => {
  const { isAdmin, user } = useAuth();

  // Strict security: customers are never allowed to access or see the price editor
  if (!isOpen || !product || !isAdmin) return null;

  const [price, setPrice] = useState<number>(product.price);
  const [discountPrice, setDiscountPrice] = useState<string>(
    product.discountPrice ? String(product.discountPrice) : ''
  );
  const [name, setName] = useState<string>(product.name);
  const [imageUrl, setImageUrl] = useState<string>(product.images[0] || '');
  const [stock, setStock] = useState<number>(product.stockQuantity);
  const [availability, setAvailability] = useState<ProductAvailability>(
    product.availability || 'in_stock'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setPrice(product.price);
      setDiscountPrice(product.discountPrice ? String(product.discountPrice) : '');
      setName(product.name);
      setImageUrl(product.images[0] || '');
      setStock(product.stockQuantity);
      setAvailability(product.availability || 'in_stock');
      setErrorMsg(null);
    }
  }, [product]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Selected image is too large. Please select a photo under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (price < 0) {
      setErrorMsg('Price cannot be negative');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const parsedDiscount = discountPrice.trim() ? Number(discountPrice) : undefined;
      const cleanImageUrl = imageUrl.trim() || product.images[0];

      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user?.role || 'admin'
        },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          discountPrice: parsedDiscount,
          stockQuantity: Number(stock),
          availability,
          images: [cleanImageUrl, ...product.images.slice(1)]
        })
      });

      if (!res.ok) {
        throw new Error('Failed to save price updates on server');
      }

      const updated = await res.json();
      onSaveSuccess(updated);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8DEC8] my-8 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF3E3] text-[#A68322] flex items-center justify-center">
              <Tag className="w-4 h-4 text-[#A68322]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#181310]">
                Edit Product Price & Picture
              </h3>
              <p className="text-[11px] text-gray-500">
                Live update on website for <strong className="text-gray-800">{product.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Main Price Input Card */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#DEB346]/40 space-y-3">
            <label className="block text-xs font-bold text-[#181310] uppercase tracking-wide">
              Product Price in Naira (₦)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-black text-[#A68322]">
                ₦
              </span>
              <input
                type="number"
                min="0"
                step="50"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white border-2 border-[#DEB346] rounded-xl pl-9 pr-4 py-2.5 text-xl font-black text-[#181310] focus:outline-hidden focus:ring-2 focus:ring-[#DEB346]"
                placeholder="500"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>Preview: <strong className="text-[#A68322] font-black">{formatNaira(price)}</strong></span>
              <span className="text-[10px] text-gray-400">Updates live on all pages</span>
            </div>
          </div>

          {/* Picture Preview & Edit */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#181310] flex items-center space-x-1.5">
              <Camera className="w-3.5 h-3.5 text-[#A68322]" />
              <span>Product Picture</span>
            </label>

            <div className="flex items-center space-x-3.5 p-3 rounded-2xl border border-gray-200 bg-[#FCFBF8]">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-[#DEB346] flex-shrink-0 relative">
                <img
                  src={imageUrl || getFallbackBakeryImage(product.category)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackBakeryImage(product.category);
                  }}
                />
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <label className="inline-flex items-center space-x-1.5 bg-white border border-[#DEB346] hover:bg-amber-50 px-3 py-1.5 rounded-lg cursor-pointer text-xs font-bold text-gray-700 shadow-2xs transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#A68322]" />
                  <span>Upload from Phone/PC</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste picture URL..."
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#DEB346]"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Curated Bakery Presets (1-Click Apply):
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {BAKERY_IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`flex-shrink-0 flex items-center space-x-1 px-2 py-1 rounded-md text-[10px] font-medium border transition-colors ${
                      imageUrl === preset.url
                        ? 'bg-[#DEB346] text-[#181310] font-bold border-[#DEB346]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#DEB346]'
                    }`}
                  >
                    <img src={preset.url} alt="" className="w-3.5 h-3.5 rounded object-cover" />
                    <span className="whitespace-nowrap">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Details (Stock & Status) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-[#FAF7F2] border border-gray-300 rounded-xl p-2 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as ProductAvailability)}
                className="w-full bg-[#FAF7F2] border border-gray-300 rounded-xl p-2 text-xs font-medium"
              >
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="preorder">Preorder</option>
              </select>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#181310] hover:bg-[#DEB346] text-[#DEB346] hover:text-[#181310] rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save New Price & Picture'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
