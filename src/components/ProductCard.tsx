import React from 'react';
import { Star, Plus, Heart, Check, Edit, Camera } from 'lucide-react';
import { Product } from '../types';
import { formatNaira, getFallbackBakeryImage } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onEditProduct }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, isAdmin } = useAuth();
  const [justAdded, setJustAdded] = React.useState(false);

  const isFavorited = isInWishlist(product.id);
  const canEdit = Boolean(isAdmin && onEditProduct);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.availability === 'out_of_stock') return;

    // If product has complex size choices, navigate to details so customer can pick size & inscription
    if (product.options && product.options.length > 0) {
      onSelect(product);
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0] || getFallbackBakeryImage(product.category),
      category: product.category,
      unitPrice: product.discountPrice || product.price,
      quantity: 1,
      stockAvailable: product.stockQuantity
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canEdit && onEditProduct) {
      onEditProduct(product);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#EBE4D8] hover:border-[#D9C4A2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5F0E6]">
        <img
          src={product.images[0] || getFallbackBakeryImage(product.category)}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackBakeryImage(product.category);
          }}
        />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-[#120F0D]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow">
          <Star className="w-3 h-3 text-[#DEB346] fill-[#DEB346]" />
          <span>{product.rating.toFixed(1)}</span>
        </div>

        {/* Top Right Badges: Bestseller / Out of Stock / Wishlist */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5">
          {product.isBestseller && (
            <span className="bg-[#DEB346] text-[#120F0D] text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow">
              Bestseller
            </span>
          )}
          {product.availability === 'out_of_stock' && (
            <span className="bg-rose-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow">
              Sold Out
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-rose-500 shadow flex items-center justify-center transition-colors"
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Admin Only: Quick Edit Button */}
        {canEdit && (
          <button
            onClick={handleEditClick}
            className="absolute top-12 left-3 bg-[#181310]/90 hover:bg-[#DEB346] text-[#DEB346] hover:text-[#181310] px-2 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 shadow border border-[#DEB346]/40 transition-colors z-10"
            title="Edit price or picture for this item"
          >
            <Edit className="w-3 h-3" />
            <span>Edit Price</span>
          </button>
        )}

        {/* Prep Time Tag on bottom of image */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[#5C4C3E] text-[10px] px-2 py-0.5 rounded font-medium shadow-sm">
          {product.prepTime}
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider text-[#A68322] mb-1">
            <span>{product.category}</span>
            {canEdit && (
              <button
                onClick={handleEditClick}
                className="text-[10px] text-gray-400 hover:text-[#A68322] flex items-center space-x-0.5 font-normal lowercase"
                title="Edit price"
              >
                <Edit className="w-2.5 h-2.5" />
                <span>edit</span>
              </button>
            )}
          </div>
          <h3 className="font-serif font-bold text-base text-[#1A1613] line-clamp-1 group-hover:text-[#A68322] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-[#736353] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-sm sm:text-base font-extrabold text-[#1A1613] tracking-tight">
                {formatNaira(product.price)}
              </span>
              {canEdit && (
                <button
                  onClick={handleEditClick}
                  className="text-[10px] text-gray-400 hover:text-[#A68322] underline ml-1 cursor-pointer"
                  title="Admin: Edit price"
                >
                  ✎
                </button>
              )}
            </div>
            {product.options && product.options.length > 0 && (
              <span className="text-[10px] text-[#8C7A68] block">Starting price</span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.availability === 'out_of_stock'}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 shadow-sm transition-all duration-200 ${
              product.availability === 'out_of_stock'
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#120F0D]'
            }`}
            title="Add to order"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
