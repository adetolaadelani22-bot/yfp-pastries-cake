import React, { useState } from 'react';
import { Sparkles, Upload, Check, Calendar, ArrowRight, Clock, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { formatNaira } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CustomCakePageProps {
  onNavigate: (view: string, param?: any) => void;
}

const CAKE_SIZES = [
  { id: '6-inch', label: '6-inch (Serves 6–8)', basePrice: 15000 },
  { id: '8-inch', label: '8-inch (Serves 12–16)', basePrice: 22000, isPopular: true },
  { id: '10-inch', label: '10-inch (Serves 20–25)', basePrice: 30000 },
  { id: '12-inch', label: '12-inch (Serves 30–40)', basePrice: 40000 },
  { id: '2-tier', label: '2-Tier (8" + 6" Serves 35+)', basePrice: 65000 },
];

const FLAVORS = [
  {
    id: 'belgian-choc',
    name: 'Belgian Chocolate',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80',
    extra: 0
  },
  {
    id: 'vanilla-bean',
    name: 'Madagascar Vanilla',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=200&q=80',
    extra: 0
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet',
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=200&q=80',
    extra: 1500
  },
  {
    id: 'carrot-spice',
    name: 'Carrot & Spice',
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=200&q=80',
    extra: 2000
  },
  {
    id: 'funfetti',
    name: 'Rainbow Funfetti',
    image: '/celebration-cake-cat.jpg',
    extra: 1000
  },
  {
    id: 'strawberry-cream',
    name: 'Berry Sweet Cream',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=200&q=80',
    extra: 2500
  }
];

const LAYERS = [
  { count: 1, label: '1 Layer', extra: 0 },
  { count: 2, label: '2 Layers', extra: 2500 },
  { count: 3, label: '3 Layers', extra: 5000 },
  { count: 4, label: '4 Layers', extra: 8000 }
];

const FROSTINGS = [
  { id: 'buttercream', name: 'Swiss Buttercream', extra: 0 },
  { id: 'fondant', name: 'Luxury Fondant', extra: 4500 },
  { id: 'whipped', name: 'Whipped Cream', extra: 1500 },
  { id: 'naked', name: 'Semi-Naked Rustic', extra: 0 }
];

export const CustomCakePage: React.FC<CustomCakePageProps> = ({ onNavigate }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { user, openAuthModal } = useAuth();

  const [selectedSize, setSelectedSize] = useState(CAKE_SIZES[1]);
  const [selectedFlavor, setSelectedFlavor] = useState(FLAVORS[0]);
  const [selectedLayers, setSelectedLayers] = useState(LAYERS[1]);
  const [selectedFrosting, setSelectedFrosting] = useState(FROSTINGS[0]);
  const [inscription, setInscription] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    // Default 2 days in future
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  // Customer contact info
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '07064918034');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');

  React.useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.email) setCustomerEmail(user.email);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  // Dynamic price calculation
  const calculatedTotal = React.useMemo(() => {
    return (
      selectedSize.basePrice +
      selectedFlavor.extra +
      selectedLayers.extra +
      selectedFrosting.extra
    );
  }, [selectedSize, selectedFlavor, selectedLayers, selectedFrosting]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Image size exceeds 8MB. Please upload a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: 'custom-cake-item',
      name: `Custom Designed Cake (${selectedSize.label})`,
      image: referenceImage || selectedFlavor.image,
      category: 'Celebration Cakes',
      unitPrice: calculatedTotal,
      quantity: 1,
      selectedSize: `${selectedFlavor.name} • ${selectedLayers.label} • ${selectedFrosting.name}`,
      inscription: inscription.trim() || undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      stockAvailable: 99
    });
    setIsCartOpen(true);
  };

  const handleSubmitCustomRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      openAuthModal('order_required');
      return;
    }

    if (!customerName || !customerPhone || !customerEmail) {
      alert('Please provide your name, phone number, and email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/custom-cakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
          },
          cakeSize: selectedSize.label,
          flavor: selectedFlavor.name,
          layers: selectedLayers.count,
          frosting: selectedFrosting.name,
          inscription: inscription.trim(),
          referenceImage,
          specialInstructions: specialInstructions.trim(),
          preferredDeliveryDate: deliveryDate,
          deliveryType: 'delivery',
          estimatedPrice: calculatedTotal
        })
      });

      const data = await res.json();
      setIsSubmitting(false);
      if (res.ok && data.requestId) {
        setSubmittedRequestId(data.requestId);
      } else {
        alert(data.error || 'Failed to submit cake design request');
      }
    } catch {
      setIsSubmitting(false);
      alert('Network error submitting request. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      {/* Title & Introduction matching UI Reference */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#A68322] bg-[#FAF3E3] px-3.5 py-1.5 rounded-full border border-[#DEB346]/40 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#DEB346]" />
          <span>Interactive Cake Studio</span>
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#181310] tracking-tight">
          Design Your Cake
        </h1>
        <p className="text-xs sm:text-sm text-[#6E5C4D] mt-2 leading-relaxed">
          Craft your bespoke celebration cake step-by-step. Select sizes, hand-picked flavors, layers, and upload your design vision.
        </p>
      </div>

      {/* SUCCESS CONFIRMATION STATE */}
      {submittedRequestId ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E8DEC8] shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#181310]">Custom Cake Request Submitted!</h2>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Your unique design request has been received by Executive Pastry Chef Yatex. We will review your reference image and send you a custom quote and design confirmation shortly.
          </p>
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EDE5D8] inline-block font-mono font-bold text-sm text-[#181310]">
            Request ID: <span className="text-[#DEB346]">{submittedRequestId}</span>
          </div>
          <div className="flex justify-center space-x-3 pt-4">
            <button
              onClick={() => onNavigate('account')}
              className="bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow"
            >
              Track in My Account
            </button>
            <button
              onClick={() => {
                setSubmittedRequestId(null);
                setInscription('');
                setReferenceImage(null);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-full text-xs font-bold"
            >
              Design Another Cake
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitCustomRequest} className="space-y-8">
          {/* STEP 1: CHOOSE CAKE SIZE */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#181310]">
                1. Choose Cake Size
              </h2>
              <span className="text-xs text-[#A68322] font-semibold">Step 1 of 4</span>
            </div>

            <div className="space-y-2.5">
              {CAKE_SIZES.map((size) => {
                const isSelected = selectedSize.id === size.id;
                return (
                  <label
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#181310] bg-[#FAF6EE] shadow-xs'
                        : 'border-[#EAE1D3] hover:border-[#DEB346] bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#181310] bg-[#181310]' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#DEB346]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">{size.label}</span>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-[#181310]">
                      {formatNaira(size.basePrice)}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* STEP 2: SELECT CAKE FLAVOR - Matching Reference Circular Grid */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#181310]">
                2. Select Cake Flavor
              </h2>
              <span className="text-xs text-[#A68322] font-semibold">Step 2 of 4</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {FLAVORS.map((flavor) => {
                const isSelected = selectedFlavor.id === flavor.id;
                return (
                  <div
                    key={flavor.id}
                    onClick={() => setSelectedFlavor(flavor)}
                    className="flex flex-col items-center cursor-pointer text-center group"
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 p-0.5 transition-all mb-1.5 ${
                        isSelected
                          ? 'border-[#181310] ring-2 ring-[#DEB346] shadow-md'
                          : 'border-gray-200 group-hover:border-[#DEB346]'
                      }`}
                    >
                      <img
                        src={flavor.image}
                        alt={flavor.name}
                        className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className={`text-[11px] font-bold line-clamp-1 ${isSelected ? 'text-[#181310]' : 'text-gray-600'}`}>
                      {flavor.name}
                    </span>
                    {flavor.extra > 0 && (
                      <span className="text-[10px] text-[#A68322] font-semibold">+{formatNaira(flavor.extra)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 3: NUMBER OF LAYERS */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#181310]">
                3. Number of Layers
              </h2>
              <span className="text-xs text-[#A68322] font-semibold">Step 3 of 4</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {LAYERS.map((layer) => {
                const isSelected = selectedLayers.count === layer.count;
                return (
                  <button
                    key={layer.count}
                    type="button"
                    onClick={() => setSelectedLayers(layer)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#181310] bg-[#181310] text-[#DEB346] shadow-sm'
                        : 'border-[#EAE1D3] bg-white text-gray-800 hover:border-[#DEB346]'
                    }`}
                  >
                    <p className="text-xs font-bold">{layer.label}</p>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#DEB346]/80' : 'text-gray-500'}`}>
                      {layer.extra === 0 ? 'Standard' : `+${formatNaira(layer.extra)}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 4: FROSTING TYPE */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#181310]">
                4. Frosting Type
              </h2>
              <span className="text-xs text-[#A68322] font-semibold">Step 4 of 4</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {FROSTINGS.map((frosting) => {
                const isSelected = selectedFrosting.id === frosting.id;
                return (
                  <button
                    key={frosting.id}
                    type="button"
                    onClick={() => setSelectedFrosting(frosting)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#181310] bg-[#181310] text-[#DEB346] shadow-sm'
                        : 'border-[#EAE1D3] bg-white text-gray-800 hover:border-[#DEB346]'
                    }`}
                  >
                    <p className="text-xs font-bold">{frosting.name}</p>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#DEB346]/80' : 'text-gray-500'}`}>
                      {frosting.extra === 0 ? 'Included' : `+${formatNaira(frosting.extra)}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 5: INSCRIPTION, REFERENCE IMAGE & SPECIAL REQUESTS */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-5">
            <h2 className="font-serif font-bold text-base sm:text-lg text-[#181310] border-b border-[#F0EAE1] pb-3">
              5. Finishing Touches & Design Reference
            </h2>

            {/* Cake Inscription Input */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Custom Cake Inscription (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Happy 30th Birthday Deola! With Love"
                value={inscription}
                onChange={(e) => setInscription(e.target.value)}
                maxLength={50}
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
              />
            </div>

            {/* Reference Image Upload from Reference UI */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Upload Reference Image (Optional)
              </label>
              <div className="border-2 border-dashed border-[#DDD5C7] hover:border-[#DEB346] rounded-2xl p-6 text-center bg-[#FAF7F2] relative transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {referenceImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={referenceImage}
                      alt="Reference design"
                      className="w-24 h-24 object-cover rounded-xl shadow-md border mb-2"
                    />
                    <p className="text-xs font-bold text-emerald-700">Image Attached Successfully</p>
                    <span className="text-[10px] text-gray-500">Click or drag another to replace</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-500">
                      <Upload className="w-5 h-5 text-[#DEB346]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        Drag & drop or <span className="text-[#A68322] underline">browse photo</span>
                      </p>
                      <p className="text-[10px] text-gray-500">Supports PNG, JPG up to 8MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Special Instructions & Color Palette
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Royal emerald green and gold accents. Less sugar, allergy alert for peanuts."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
              />
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Preferred Delivery / Event Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl pl-10 pr-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                * We require a minimum of 24–48 hours baking & chilling time for custom designs.
              </p>
            </div>
          </section>

          {/* CONTACT INFO (FOR CUSTOM QUOTE) */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-base sm:text-lg text-[#181310] border-b border-[#F0EAE1] pb-3">
              6. Your Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amaka Eze"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+234 803 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="amaka@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346]"
                />
              </div>
            </div>
          </section>

          {/* DYNAMIC TOTAL & ACTION BAR - Matching Reference */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E8E1D5] py-4 px-4 shadow-2xl z-30">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-gray-500 uppercase font-semibold">Estimated Total</span>
                <p className="font-serif font-black text-2xl text-[#181310] leading-none">
                  {formatNaira(calculatedTotal)}
                </p>
                <span className="text-[10px] text-[#A68322]">
                  {selectedSize.label} • {selectedFlavor.name}
                </span>
              </div>

              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-initial bg-[#181310] hover:bg-[#261E17] text-[#DEB346] px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider border border-[#DEB346]/40 transition-all shadow"
                >
                  Add to Cart
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-[#DEB346] to-[#C49422] hover:from-[#F0C85F] hover:to-[#DEB346] text-[#120F0D] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Design Request'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
