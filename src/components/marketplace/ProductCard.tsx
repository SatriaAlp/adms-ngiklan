import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Heart, ShoppingBag, Store, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, navigate, setSelectedMerchantId, setSelectedProduct, setPaymentPopupProduct } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.priceType === 'CONTACT_US') {
      // Free consultation via WhatsApp
      const message = `Halo admin ADMS, saya tertarik dengan layanan *${product.title}*. Mohon info lebih lanjut.`;
      window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      // Payment popup
      setPaymentPopupProduct(product);
    }
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
      onClick={() => setSelectedProduct(product)}
      className="group bg-white hover:bg-white border border-slate-200 hover:border-indigo-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Gradient Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-110 ${
            isWishlisted
              ? 'bg-rose-500/90 text-white shadow-lg'
              : 'bg-white/80 text-slate-700 hover:text-rose-600 hover:bg-white shadow-sm'
          }`}
          title={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
              BEST SELLER
            </span>
          )}
          {product.isNew && (
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
              NEW
            </span>
          )}
          {product.isPromo && (
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
              PROMO
            </span>
          )}
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="bg-white/95 text-slate-900 backdrop-blur-sm border border-white/20 text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
            {product.categoryName}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 relative">
        <div>
          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors min-h-[40px] sm:min-h-[48px]">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-slate-500 text-xs line-clamp-2 mt-1.5 leading-relaxed font-normal min-h-[32px] sm:min-h-[36px]">
            {product.shortDescription}
          </p>
        </div>

        <div className="space-y-3 pt-3 mt-auto">
          {/* Rating & Terjual */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">{product.salesCount} terjual</span>
          </div>

          {/* Merchant Info */}
          <button
            type="button"
            onClick={handleMerchantClick}
            className="flex items-center gap-2 text-xs text-slate-600 hover:text-indigo-600 transition-colors font-semibold text-left w-full group/merchant"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 group-hover/merchant:bg-indigo-100 transition-colors">
              <Store className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <span className="truncate">{product.merchantName}</span>
          </button>

          {/* Pricing */}
          <div className="flex flex-col py-1 min-h-[46px] justify-end">
            {product.priceType === 'CONTACT_US' ? (
              <span className="font-black text-base sm:text-lg text-rose-600">Hubungi Kami</span>
            ) : (
              <>
                {product.priceType === 'STARTING_FROM' ? (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none">Mulai dari</span>
                ) : (
                  <span className="text-[10px] font-bold text-transparent mb-0.5 leading-none select-none hidden sm:block">&nbsp;</span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="font-black text-base sm:text-lg text-slate-900">
                    {formatRupiah(product.discountPrice || product.price)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-xs text-slate-400 line-through font-medium">
                      {formatRupiah(product.price)}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProduct(product);
                }}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200 hover:border-slate-300 shadow-xs"
              >
                Lihat Detail
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold text-xs py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-cyan-100 hover:border-cyan-200 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Keranjang
              </button>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPaymentPopupProduct(product);
              }}
              className="w-full bg-gradient-to-r from-navy to-indigo-900 hover:from-indigo-900 hover:to-navy text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg transform active:scale-[0.98]"
            >
              Pesan Sekarang
            </button>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const message = `Halo admin ADMS, saya tertarik dengan layanan *${product.title}*. Mohon info lebih lanjut.`;
                window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="w-full bg-gradient-to-r from-[#25D366] to-[#1DA851] hover:from-[#1DA851] hover:to-[#128C3E] text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg transform active:scale-[0.98]"
            >
              Konsultasi Gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
