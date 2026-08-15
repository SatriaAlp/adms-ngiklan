import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Heart, ShoppingBag, Store, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { addToCart, wishlist, toggleWishlist, navigate, setSelectedMerchantId } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    navigate('cart');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleMerchantClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMerchantId(product.merchantId);
    navigate('merchant-detail');
  };

  return (
    <div
      onClick={() => onOpenDetail && onOpenDetail(product)}
      className="group bg-white hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-lg transition-all ${
            isWishlisted
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-white shadow-xs'
          }`}
          title={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              BEST SELLER
            </span>
          )}
          {product.isNew && (
            <span className="bg-navy text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              NEW
            </span>
          )}
          {product.isPromo && (
            <span className="bg-rose-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              PROMO
            </span>
          )}
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-2 left-2.5">
          <span className="bg-white/95 text-slate-900 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            {product.categoryName}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-gold transition-colors">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed font-normal">
            {product.shortDescription}
          </p>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          {/* Rating & Terjual */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
            <span className="text-slate-500 font-medium">{product.salesCount} terjual</span>
          </div>

          {/* Merchant Info */}
          <button
            type="button"
            onClick={handleMerchantClick}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-semibold text-left truncate"
          >
            <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{product.merchantName}</span>
          </button>

          {/* Pricing */}
          <div className="flex items-baseline justify-between pt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-sm sm:text-base text-slate-900">
                {formatRupiah(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-slate-400 line-through font-normal">
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
              Keranjang
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full bg-navy hover:bg-navy/90 text-white font-bold text-xs py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-xs"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
