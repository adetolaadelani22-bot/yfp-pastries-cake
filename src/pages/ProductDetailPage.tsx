import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Heart, Plus, Minus, Check, Sparkles, Clock, AlertTriangle, ShieldCheck, Edit, Camera } from 'lucide-react';
import { Product, Review } from '../types';
import { formatNaira, getFallbackBakeryImage } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (p: Product) => void;
  onEditProduct?: (p: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onEditProduct
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist, isAdmin } = useAuth();

  const [activeImage, setActiveImage] = useState(product.images[0] || getFallbackBakeryImage(product.category));
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (product.options && product.options.length > 0) {
      const defaultChoice = product.options[0].choices.find(c => c.isDefault) || product.options[0].choices[0];
      return defaultChoice.label;
    }
    return '';
  });
  const [quantity, setQuantity] = useState(1);
  const [inscription, setInscription] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  // Sync active image when product changes
  useEffect(() => {
    setActiveImage(product.images[0]);
    if (product.options && product.options.length > 0) {
      const defaultChoice = product.options[0].choices.find(c => c.isDefault) || product.options[0].choices[0];
      setSelectedSize(defaultChoice.label);
    }
    setQuantity(1);
    setInscription('');
    // Fetch product reviews
    fetch(`/api/reviews?productId=${product.id}`)
      .then(r => r.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, [product]);

  // Calculate dynamic unit price based on selected size option
  const unitPrice = React.useMemo(() => {
    let base = product.discountPrice || product.price;
    if (product.options && product.options.length > 0 && selectedSize) {
      const choice = product.options[0].choices.find(c => c.label === selectedSize);
      if (choice) {
        base += choice.priceAdjustment;
      }
    }
    return Math.max(0, base);
  }, [product, selectedSize]);

  const totalPrice = unitPrice * quantity;
  const isFavorited = isInWishlist(product.id);

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.isBestseller))
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      image: activeImage || product.images[0],
      category: product.category,
      unitPrice,
      quantity,
      selectedSize: selectedSize || undefined,
      inscription: inscription.trim() || undefined,
      stockAvailable: product.stockQuantity
    });

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setIsCartOpen(true);
    }, 400);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });
      const newRev = await res.json();
      setReviews(prev => [newRev, ...prev]);
      setShowReviewForm(false);
      setReviewComment('');
    } catch {
      alert('Could not submit review. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
      {/* Top Navigation Bar from Reference */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-bold text-gray-700 hover:text-[#181310] bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Menu</span>
        </button>

        <button
          onClick={() => toggleWishlist(product.id)}
          className={`p-2 rounded-full border bg-white shadow-xs transition-colors ${
            isFavorited ? 'border-rose-300 text-rose-500' : 'border-gray-200 text-gray-600 hover:text-rose-500'
          }`}
          title={isFavorited ? 'Remove from Saved' : 'Save to Favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Product Images Gallery */}
        <div className="space-y-3">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#F5EFE6] border border-[#E8DEC8] shadow-md relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getFallbackBakeryImage(product.category);
              }}
            />
            {product.isBestseller && (
              <span className="absolute top-3 left-3 bg-[#DEB346] text-[#120F0D] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                Bestseller
              </span>
            )}
          </div>

          {/* Thumbnail list if multiple images exist */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img ? 'border-[#DEB346] shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getFallbackBakeryImage(product.category);
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Controls matching UI reference */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A68322]">
                {product.category}
              </span>
              {isAdmin && onEditProduct && (
                <button
                  onClick={() => onEditProduct(product)}
                  className="bg-[#181310] hover:bg-[#DEB346] text-[#DEB346] hover:text-[#181310] px-3 py-1 rounded-lg text-xs font-bold border border-[#DEB346]/40 flex items-center space-x-1.5 shadow-xs transition-colors"
                  title="Admin: Edit price or picture"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Price / Pic</span>
                </button>
              )}
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#181310] tracking-tight mt-0.5">
              {product.name}
            </h1>

            {/* Price & Rating Row */}
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-2xl font-black text-[#181310]">
                {formatNaira(unitPrice)}
              </span>
              {isAdmin && onEditProduct && (
                <button
                  onClick={() => onEditProduct(product)}
                  className="text-xs text-[#A68322] hover:text-[#181310] font-bold underline flex items-center space-x-1"
                  title="Admin: Change price"
                >
                  <Edit className="w-3 h-3" />
                  <span>Change Price</span>
                </button>
              )}
              <div className="flex items-center space-x-1 bg-[#FAF2DC] text-[#A68322] px-2.5 py-1 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-[#DEB346] text-[#DEB346]" />
                <span>{product.rating.toFixed(1)} ({product.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#615143] leading-relaxed">
            {product.description}
          </p>

          {/* SIZE SELECTION PILLS - from Reference */}
          {product.options && product.options.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#181310] uppercase tracking-wider mb-2">
                Select {product.options[0].name}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.options[0].choices.map((choice) => {
                  const isSelected = selectedSize === choice.label;
                  const calculatedChoicePrice = product.price + choice.priceAdjustment;
                  return (
                    <button
                      key={choice.label}
                      type="button"
                      onClick={() => setSelectedSize(choice.label)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#181310] bg-[#181310] text-[#DEB346] shadow-sm'
                          : 'border-[#DDD4C5] bg-white text-gray-800 hover:border-[#DEB346]'
                      }`}
                    >
                      <p className="text-xs font-bold">{choice.label}</p>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#DEB346]/90' : 'text-gray-500'}`}>
                        {formatNaira(calculatedChoicePrice)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold text-[#181310] uppercase tracking-wider mb-2">
              Quantity
            </label>
            <div className="inline-flex items-center space-x-3 bg-white border border-[#DDD4C5] rounded-xl p-1.5 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-gray-700 flex items-center justify-center hover:bg-gray-200"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold w-6 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-gray-700 flex items-center justify-center hover:bg-gray-200"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cake Inscription Input (Optional) - Matching Reference */}
          {(product.category === 'Cakes' || product.category === 'Celebration Cakes') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#181310] uppercase tracking-wider">
                  Cake Inscription (Optional)
                </label>
                <span className="text-[10px] text-gray-400">Written with chocolate piping</span>
              </div>
              <input
                type="text"
                placeholder="e.g., Happy 25th Birthday Chloe!"
                value={inscription}
                onChange={(e) => setInscription(e.target.value)}
                maxLength={45}
                className="w-full bg-white border border-[#DDD4C5] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#DEB346] shadow-xs"
              />
            </div>
          )}

          {/* Ingredients & Allergens Information */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EBE3D6] space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-[#7A6A59]">
              <Clock className="w-3.5 h-3.5 text-[#DEB346]" />
              <span><strong>Preparation Time:</strong> {product.prepTime}</span>
            </div>
            {product.allergens && product.allergens.length > 0 && (
              <div className="flex items-start space-x-2 text-gray-600">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>Allergens:</strong> {product.allergens.join(', ')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#EDE5D8] text-[11px] text-[#7A6A59]">
              <strong>Ingredients:</strong> {product.ingredients.join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* YOU MAY ALSO LIKE SECTION - Matching Reference */}
      {relatedProducts.length > 0 && (
        <div className="mt-14 pt-8 border-t border-[#E8E1D5]">
          <h3 className="font-serif font-bold text-lg text-[#181310] mb-4">
            You May Also Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className="bg-white rounded-xl overflow-hidden border border-[#E8E1D5] hover:border-[#DEB346] shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col p-2.5"
              >
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#181310] line-clamp-1">{rel.name}</h4>
                <p className="text-xs font-black text-[#A68322] mt-0.5">{formatNaira(rel.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CUSTOMER REVIEWS SECTION */}
      <div className="mt-12 pt-8 border-t border-[#E8E1D5]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#181310]">Customer Reviews</h3>
            <p className="text-xs text-gray-500">Verified taste test reviews</p>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="text-xs font-bold text-[#A68322] hover:underline"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-xl border border-[#DDD5C7] mb-6 space-y-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="e.g. Bukola S."
                className="w-full bg-[#FAF7F2] border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-[#DEB346]"
                  >
                    <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-[#DEB346]' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Comment</label>
              <textarea
                rows={2}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this treat..."
                className="w-full bg-[#FAF7F2] border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>
            <button
              type="submit"
              className="bg-[#181310] text-[#DEB346] px-4 py-2 rounded-lg font-bold text-xs"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No reviews yet for this product. Be the first to review!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-3.5 rounded-xl border border-[#EDE5D8] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-gray-900">{rev.customerName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold flex items-center space-x-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>
                <div className="flex space-x-0.5 text-[#DEB346]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#DEB346]" />
                  ))}
                </div>
                <p className="text-[#594B3C] leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR - Matching Reference */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E8E1D5] py-3.5 px-4 shadow-2xl z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <span className="text-[11px] text-gray-500 uppercase font-semibold">Total Price ({quantity} {quantity === 1 ? 'item' : 'items'})</span>
            <p className="font-serif font-black text-xl text-[#181310] leading-none">
              {formatNaira(totalPrice)}
            </p>
          </div>

          <button
            id="detail-add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.availability === 'out_of_stock'}
            className="flex-1 sm:flex-initial sm:px-12 py-3.5 rounded-full font-bold text-sm tracking-wide shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-98 bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310]"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <span>Add to Cart — {formatNaira(totalPrice)}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
