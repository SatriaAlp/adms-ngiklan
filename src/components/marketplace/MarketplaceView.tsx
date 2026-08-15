import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { Product, Advertisement, Merchant } from '../../types';
import { Search, Filter, SlidersHorizontal, Store, Megaphone, ShoppingBag, X, Sparkles, ShieldCheck } from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const {
    products,
    ads,
    merchants,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeSearchTypeTab,
    setActiveSearchTypeTab,
    setSelectedMerchantId,
    navigate,
  } = useApp();

  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'terbaru' | 'terpopuler' | 'murah' | 'mahal'>('terpopuler');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMinPrice = !minPrice || (p.discountPrice || p.price) >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || (p.discountPrice || p.price) <= Number(maxPrice);

      return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
    }).sort((a, b) => {
      if (sortBy === 'terbaru') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'terpopuler') return b.salesCount - a.salesCount;
      if (sortBy === 'murah') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === 'mahal') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      return 0;
    });
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, sortBy]);

  // Filtered Ads
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const matchesSearch =
        !searchQuery ||
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && ad.status === 'published';
    });
  }, [ads, searchQuery]);

  // Filtered Merchants
  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      return (
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [merchants, searchQuery]);

  return (
    <div className="py-10 bg-white text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-navy">Marketplace & Directory ADMS</h1>
          <p className="text-slate-600 text-sm">
            Temukan ribuan produk digital, iklan promosi terverifikasi, dan merchant terbaik.
          </p>
        </div>

        {/* Global Search Bar */}
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

        {/* Main Grid: Sidebar Filters Left, Results Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-5">
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

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between ${
                      !selectedCategory ? 'bg-navy text-white font-bold border border-navy' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>Semua Kategori</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between ${
                        selectedCategory === cat.slug ? 'bg-navy text-white font-bold border border-navy' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rentang Harga (Rp)</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Sorting Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
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

          {/* Results Area Right */}
          <div className="lg:col-span-3 space-y-8">
            {/* 1. PRODUK SECTION */}
            {(activeSearchTypeTab === 'semua' || activeSearchTypeTab === 'produk') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-extrabold text-navy text-lg flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-gold" />
                    Produk Digital ({filteredProducts.length})
                  </h3>
                </div>

                {filteredProducts.length === 0 ? (
                  /* Section 39: Empty State */
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

            {/* 3. MERCHANT SECTION */}
            {(activeSearchTypeTab === 'semua' || activeSearchTypeTab === 'merchant') && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-extrabold text-navy text-lg flex items-center gap-2">
                    <Store className="w-5 h-5 text-gold" />
                    Merchant Terverifikasi ({filteredMerchants.length})
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
                          {m.isVerified && <ShieldCheck className="w-4 h-4 text-gold shrink-0" />}
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
      </div>

      {/* Product Detail Modal */}
      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          onClose={() => setSelectedProductDetail(null)}
        />
      )}
    </div>
  );
};
