import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { Product } from '../../types';
import { Search, Filter, ShoppingBag, Store, ShieldCheck, X } from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedMerchantId,
    navigate,
    merchants,
  } = useApp();

  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'terpopuler' | 'terbaru' | 'murah' | 'mahal'>('terpopuler');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [activeSearchTypeTab, setActiveSearchTypeTab] = useState<'semua' | 'produk' | 'merchant'>('semua');

  const formatRupiahInput = (val: string) => {
    const numberString = val.replace(/[^0-9]/g, '');
    if (!numberString) return '';
    return new Intl.NumberFormat('id-ID').format(Number(numberString));
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = !selectedCategory || p.category === selectedCategory || p.category === 'ALL';
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.merchantName && p.merchantName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const cleanMin = minPrice.replace(/\./g, '');
      const cleanMax = maxPrice.replace(/\./g, '');
      
      const matchesMinPrice = !minPrice || (p.discountPrice || p.price) >= Number(cleanMin);
      const matchesMaxPrice = !maxPrice || (p.discountPrice || p.price) <= Number(cleanMax);

      return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
    }).sort((a, b) => {
      if (sortBy === 'terbaru') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'terpopuler') return b.salesCount - a.salesCount;
      if (sortBy === 'murah') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === 'mahal') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      return 0;
    });
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, sortBy]);

  // Filtered Merchants
  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && m.verificationStatus === 'VERIFIED';
    });
  }, [merchants, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero title header */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
            Marketplace & Directory ADMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl font-normal">
            Temukan ribuan produk digital, iklan promosi terverifikasi, dan merchant terbaik.
          </p>
        </div>

        {/* 1. FILTER PENCARIAN (AT THE TOP) */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-bold text-navy text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold" /> Filter Pencarian
            </span>
            {(selectedCategory || minPrice || maxPrice) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setMinPrice('');
                  setMaxPrice('');
                }}
                className="text-xs text-rose-600 hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-gold"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rentang Harga (Rp)</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(formatRupiahInput(e.target.value))}
                  className="bg-white border border-slate-300 rounded-xl p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gold"
                />
                <input
                  type="text"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(formatRupiahInput(e.target.value))}
                  className="bg-white border border-slate-300 rounded-xl p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Sorting Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urutkan Berdasarkan</label>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-gold"
              >
                <option value="terpopuler">Terpopuler & Terjual Banyak</option>
                <option value="terbaru">Terbaru Ditambahkan</option>
                <option value="murah">Harga Terendah</option>
                <option value="mahal">Harga Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. GLOBAL SEARCH BAR */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-3 shadow-md">
          <div className="relative flex-1 w-full flex items-center">
            <Search className="w-5 h-5 text-slate-400 ml-3 absolute pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk, jasa, iklan, atau merchant..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-gold placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Tab Selector (Semua | Produk | Merchant) */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 w-full sm:w-auto">
            {(['semua', 'produk', 'merchant'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSearchTypeTab(tab as any)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  activeSearchTypeTab === tab
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                {tab === 'produk' ? 'Produk Digital' : tab === 'merchant' ? 'Merchant Directory' : 'Semua'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area (Stack Layout) */}
        <div className="space-y-10">
          {/* 3. PRODUK SECTION */}
          {(activeSearchTypeTab === 'semua' || activeSearchTypeTab === 'produk') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="font-extrabold text-navy text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  Produk Digital ({filteredProducts.length})
                </h3>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-sm">
                  <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
                  <h4 className="text-lg font-bold text-navy">Belum ada produk</h4>
                  <p className="text-slate-500 text-xs">Produk yang Anda cari belum tersedia atau tidak cocok dengan filter.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="bg-navy hover:bg-navy/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors inline-block mt-2"
                  >
                    Kembali ke Marketplace
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOpenDetail={(product) => setSelectedProductDetail(product)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. MERCHANT SECTION */}
          {(activeSearchTypeTab === 'semua' || activeSearchTypeTab === 'merchant') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="font-extrabold text-navy text-lg flex items-center gap-2">
                  <Store className="w-5 h-5 text-gold" />
                  Merchant Directory ({filteredMerchants.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMerchants.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMerchantId(m.id);
                      navigate('merchant-detail');
                    }}
                    className="bg-white border border-slate-200 hover:border-gold/40 shadow-sm hover:shadow-md rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <img src={m.logo} alt={m.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 font-bold text-navy text-sm">
                        <span className="truncate">{m.name}</span>
                        {m.verificationStatus === 'VERIFIED' && <ShieldCheck className="w-4 h-4 text-gold shrink-0" />}
                      </div>
                      <p className="text-slate-500 text-xs truncate mt-0.5">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          onClose={() => setSelectedProductDetail(null)}
        />
      )}
    </div>
  );
};
