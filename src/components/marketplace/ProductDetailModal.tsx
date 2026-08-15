import React, { useState } from 'react';
import { Product, ProductPackage } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Store,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ChevronRight,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, wishlist, toggleWishlist, navigate, setSelectedMerchantId, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    product?.packages && product.packages.length > 0 ? product.packages[1]?.id || product.packages[0]?.id : null
  );

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleBuyNow = () => {
    if (product.priceType === 'CONTACT_US') {
      addNotification('Silakan hubungi WhatsApp kami untuk layanan ini.', 'info');
      return;
    }
    
    // Create a modified product object with the selected package info
    const cartProduct = { ...product };
    if (product.packages && product.packages.length > 0 && selectedPackageId) {
      const selectedPkg = product.packages.find(p => p.id === selectedPackageId);
      if (selectedPkg) {
        cartProduct.id = `${product.id}_${selectedPkg.id}`;
        cartProduct.price = selectedPkg.price;
        cartProduct.discountPrice = undefined; // Packages usually don't have discount defined here
        cartProduct.title = `${product.title} - Paket ${selectedPkg.name}`;
      }
    }
    
    addToCart(cartProduct);
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
      <div className="relative bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-xl text-slate-800">
        
        {/* Sticky Header inside modal */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 p-4 px-6 sm:px-8 flex items-center justify-between z-10">
          <div className="flex items-center text-xs font-bold text-slate-500 hidden sm:flex">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5 mx-1" />
            <span>Marketplace</span>
            <ChevronRight className="w-3.5 h-3.5 mx-1" />
            <span className="text-navy">{product.categoryName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Top Grid: Info Left/Top, Packages/Buy Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Info Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Category & Title */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                    {product.categoryName}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount} ulasan)</span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                  {product.title}
                </h1>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Detail Tabs */}
              <div className="pt-4">
                <div className="flex gap-4 border-b border-slate-200 pb-3">
                  <button
                    onClick={() => setActiveTab('desc')}
                    className={`font-bold text-sm pb-1 transition-colors border-b-2 ${
                      activeTab === 'desc'
                        ? 'border-navy text-navy'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Detail Layanan
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`font-bold text-sm pb-1 transition-colors border-b-2 ${
                      activeTab === 'specs'
                        ? 'border-navy text-navy'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Syarat & Ketentuan
                  </button>
                </div>

                <div className="pt-5 text-sm leading-relaxed text-slate-700">
                  {activeTab === 'desc' && (
                    <div className="space-y-6">
                      <div className="whitespace-pre-line">
                        {product.fullDescription}
                      </div>

                      {product.features && product.features.length > 0 && (
                        <div>
                          <h4 className="font-bold text-slate-900 mb-3">Keunggulan & Apa yang Anda dapatkan:</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {product.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                      <p>
                        Dengan memesan layanan ini, Anda menyetujui bahwa estimasi pengerjaan dan harga dapat berubah sesuai dengan kompleksitas project khusus. Silakan berkonsultasi lebih lanjut jika Anda memiliki kebutuhan custom yang tidak tertera pada paket.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Action Column */}
            <div className="space-y-6">
              
              {/* Pricing Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                
                {product.priceType === 'CONTACT_US' ? (
                  <div className="text-center py-6">
                    <h3 className="text-xl font-black text-slate-900 mb-2">Tertarik dengan Layanan ini?</h3>
                    <p className="text-slate-500 text-sm mb-6">Hubungi kami untuk mendapatkan penawaran harga terbaik yang disesuaikan dengan kebutuhan Anda.</p>
                    <button
                      onClick={() => addNotification('Membuka WhatsApp...', 'info')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      Hubungi via WhatsApp
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      {product.priceType === 'STARTING_FROM' && !product.packages?.length && (
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 block">Harga Mulai Dari</span>
                      )}
                      
                      {!product.packages?.length ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-900">
                            {formatRupiah(product.discountPrice || product.price)}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <span className="text-slate-900 font-bold text-sm block border-b border-slate-100 pb-2">Pilih Paket Layanan</span>
                          <div className="space-y-2">
                            {product.packages.map((pkg) => (
                              <label
                                key={pkg.id}
                                className={`block cursor-pointer border rounded-xl p-4 transition-all ${
                                  selectedPackageId === pkg.id ? 'border-navy bg-slate-50 ring-1 ring-navy' : 'border-slate-200 hover:border-slate-300'
                                }`}
                                onClick={() => setSelectedPackageId(pkg.id)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`font-bold ${selectedPackageId === pkg.id ? 'text-navy' : 'text-slate-700'}`}>{pkg.name}</span>
                                  <span className="font-black text-slate-900">{formatRupiah(pkg.price)}</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed mb-2">{pkg.description}</p>
                                {pkg.deliveryTime && (
                                  <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded">Estimasi: {pkg.deliveryTime}</span>
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={handleBuyNow}
                        className="w-full py-3.5 rounded-xl bg-navy hover:bg-navy/90 font-bold text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        Pesan Sekarang
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 flex items-center justify-center gap-2 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-600" />
                        Tambah Keranjang
                      </button>
                    </div>
                  </>
                )}

                {/* Wishlist & Share */}
                <div className="flex items-center justify-center gap-6 text-sm text-slate-500 pt-6 font-medium">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      isWishlisted ? 'text-rose-600 font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    Wishlist
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Bagikan
                  </button>
                </div>
              </div>

              {/* Merchant Info Small Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <Store className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                      <span>{product.merchantName}</span>
                      <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Penyedia Layanan</span>
                  </div>
                </div>
                <button
                  onClick={handleVisitStore}
                  className="text-[10px] font-bold text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 px-2.5 py-1.5 rounded transition-colors"
                >
                  Kunjungi
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
