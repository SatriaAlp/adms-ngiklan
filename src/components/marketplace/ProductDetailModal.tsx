import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Store,
  ShieldCheck,
  CheckCircle2,
  Download,
  Share2,
  MessageCircle,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, wishlist, toggleWishlist, navigate, setSelectedMerchantId, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [selectedImg, setSelectedImg] = useState<number>(0);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleBuyNow = () => {
    addToCart(product);
    onClose();
    navigate('cart');
  };

  const handleVisitStore = () => {
    setSelectedMerchantId(product.merchantId);
    onClose();
    navigate('merchant-detail');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification('Link produk disalin ke clipboard!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl text-slate-800 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Grid: Gallery Left, Details Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-xl bg-slate-100 overflow-hidden border border-slate-200 relative">
              <img
                src={product.images[selectedImg] || product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-white/95 text-slate-900 border border-slate-200 text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                {product.categoryName}
              </span>
            </div>

            {/* Thumbnail Selection */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImg === idx ? 'border-slate-900 scale-102' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Info Column */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="text-slate-900 font-bold uppercase tracking-wider">{product.categoryName}</span>
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} ulasan)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-snug">
                {product.title}
              </h1>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-black text-slate-900">
                  {formatRupiah(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-slate-400 line-through font-normal">
                    {formatRupiah(product.price)}
                  </span>
                )}
                <span className="text-xs text-slate-500 ml-auto font-medium">{product.salesCount} Terjual</span>
              </div>

              {/* Merchant Badge Box */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                      <span>{product.merchantName}</span>
                      <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Merchant Terverifikasi ADMS</span>
                  </div>
                </div>

                <button
                  onClick={handleVisitStore}
                  className="text-xs font-bold text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Kunjungi Toko
                </button>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-800 flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-600" />
                  Tambah Keranjang
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold text-xs text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  Beli Sekarang
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-medium">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isWishlisted ? 'text-rose-600 font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Disukai' : 'Sukai Produk'}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Bagikan Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Description / Specs / Reviews */}
        <div className="pt-6 border-t border-slate-200">
          <div className="flex gap-4 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('desc')}
              className={`font-bold text-xs sm:text-sm pb-1 transition-colors border-b-2 ${
                activeTab === 'desc'
                  ? 'border-slate-900 text-slate-900 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Deskripsi & Fitur
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`font-bold text-xs sm:text-sm pb-1 transition-colors border-b-2 ${
                activeTab === 'specs'
                  ? 'border-slate-900 text-slate-900 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Spesifikasi Digital
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`font-bold text-xs sm:text-sm pb-1 transition-colors border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-slate-900 text-slate-900 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Ulasan Pembeli ({product.reviewCount})
            </button>
          </div>

          <div className="pt-4 text-xs sm:text-sm leading-relaxed text-slate-700 font-normal">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p>{product.fullDescription}</p>

                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2 uppercase tracking-wider">Fitur Utama Produk:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {product.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-medium">
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1.5 border-b border-slate-200 last:border-none">
                      <span className="text-slate-500">{key}</span>
                      <span className="text-slate-900 font-bold">{val}</span>
                    </div>
                  ))}
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Ukuran File</span>
                  <span className="text-slate-900 font-bold">{product.fileSize || 'Standard'}</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Rina Wijaya</span>
                    <span className="text-amber-500 font-bold">⭐ 5.0</span>
                  </div>
                  <p className="text-slate-600 font-normal">Produk digital berkualitas dan sangat membantu operasional tim kami.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Budi Santoso</span>
                    <span className="text-amber-500 font-bold">⭐ 5.0</span>
                  </div>
                  <p className="text-slate-600 font-normal">Proses download cepat dan link tidak ada masalah sama sekali. Highly recommended!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
