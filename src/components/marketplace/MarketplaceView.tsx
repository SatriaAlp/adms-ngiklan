import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { Product } from '../../types';
import { Search, Filter, Store, X, SlidersHorizontal, Megaphone, Monitor, TrendingUp, Zap, Share2, Briefcase, MapPin, SearchX } from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    navigate,
  } = useApp();

  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'terpopuler' | 'terbaru' | 'murah' | 'mahal'>('terpopuler');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Icon Mapping for Categories
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'digital-ads': return <Megaphone className="w-6 h-6" />;
      case 'website-development': return <Monitor className="w-6 h-6" />;
      case 'marketing-distribution': return <TrendingUp className="w-6 h-6" />;
      case 'automation-blast': return <Zap className="w-6 h-6" />;
      case 'social-media': return <Share2 className="w-6 h-6" />;
      case 'legal-bisnis': return <Briefcase className="w-6 h-6" />;
      case 'layanan-offline': return <MapPin className="w-6 h-6" />;
      default: return <Store className="w-6 h-6" />;
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = !selectedCategory || p.category === selectedCategory || p.category === 'ALL';
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const price = p.discountPrice || p.price;
      const matchesMinPrice = !minPrice || price >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || price <= Number(maxPrice);

      return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
    }).sort((a, b) => {
      if (sortBy === 'terbaru') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // Mock popularity sorting for now, using ID length or random for demo
      if (sortBy === 'terpopuler') return a.title.length - b.title.length;
      if (sortBy === 'murah') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === 'mahal') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      return 0;
    });
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, sortBy]);

  // Featured Products (Manual pick for demo)
  const popularTitles = ['Google Ads', 'Instagram Ads', 'Landing Page Conversion', 'Website / Company Profile Corporate', 'Optimasi SEO Website / Google Index', 'Kelola Sosmed', 'WhatsApp Blast', 'Sebar Brosur'];
  const popularProducts = products.filter(p => popularTitles.includes(p.title)).slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="bg-navy relative overflow-hidden">
        {/* Abstract Background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Solusi Digital & Bisnis <br className="hidden md:block"/> dalam Satu Marketplace
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
            Temukan layanan digital marketing, website, SEO, social media, automation, legalitas, dan kebutuhan bisnis lainnya dari tim profesional ADMS.
          </p>
          
          {/* Main Search Bar in Hero */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2 flex items-center shadow-2xl relative">
            <Search className="w-6 h-6 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari layanan yang Anda butuhkan... (Contoh: Google Ads, SEO, Website)"
              className="w-full bg-transparent border-none pl-4 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-0 placeholder-slate-400"
            />
            <button
              onClick={() => {
                document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap hidden sm:block"
            >
              Jelajahi Layanan
            </button>
          </div>
        </div>
      </div>

      {/* 2. KATEGORI POPULER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.slice(0, 7).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-navy transition-all flex flex-col items-center justify-center gap-3 group text-center h-full"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-navy text-slate-600 group-hover:text-white flex items-center justify-center transition-colors">
                {getCategoryIcon(cat.slug)}
              </div>
              <span className="font-bold text-xs text-slate-700 group-hover:text-navy transition-colors">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. PRODUK POPULER SECTION */}
      {!searchQuery && !selectedCategory && popularProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-navy">Layanan Paling Populer</h2>
            <button
              onClick={() => document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-bold text-rose-600 hover:text-rose-700 hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {popularProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenDetail={(product) => setSelectedProductDetail(product)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. MAIN MARKETPLACE SECTION */}
      <div id="product-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        
        {/* Header Section (Title & Mobile Filter Button) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-navy">
              {searchQuery ? 'Hasil Pencarian' : selectedCategory ? 'Layanan Kategori Ini' : 'Semua Layanan'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Menampilkan {filteredProducts.length} layanan terbaik untuk Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-sm text-slate-700 shadow-sm"
            >
              <Filter className="w-4 h-4" /> Filter
            </button>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm shrink-0">
              <span className="text-xs text-slate-500 hidden sm:block">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none focus:ring-0 appearance-none pr-4"
              >
                <option value="terpopuler">Terpopuler</option>
                <option value="terbaru">Terbaru Ditambahkan</option>
                <option value="murah">Harga Terendah</option>
                <option value="mahal">Harga Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Filter (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-navy text-base flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filter Pencarian
                </span>
                {(selectedCategory || minPrice || maxPrice) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori Layanan</label>
                <div className="space-y-1 text-sm">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-between ${
                      !selectedCategory ? 'bg-navy/5 text-navy font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>Semua Kategori</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-between ${
                        selectedCategory === cat.slug ? 'bg-navy/5 text-navy font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Harga Layanan (Rp)</label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <input
                    type="number"
                    placeholder="Minimal"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Maksimal"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-4 shadow-sm">
                <SearchX className="w-16 h-16 text-slate-300 mx-auto" />
                <h4 className="text-xl font-bold text-navy">Layanan Tidak Ditemukan</h4>
                <p className="text-slate-500 max-w-md mx-auto">Kami tidak menemukan layanan yang sesuai dengan pencarian atau filter Anda. Silakan coba kata kunci lain.</p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery('');
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="bg-navy hover:bg-navy/90 text-white font-bold px-6 py-3 rounded-xl transition-colors inline-block mt-4"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)} />
          <div className="relative bg-white rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-navy">Filter Pencarian</h3>
              <button onClick={() => setShowMobileFilter(false)} className="p-2 rounded-xl bg-slate-100 text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Reused Filter Content for Mobile */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-center ${!selectedCategory ? 'border-navy bg-navy/5 text-navy font-bold' : 'border-slate-200 text-slate-600'}`}
                  >
                    Semua
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-center truncate ${selectedCategory === cat.slug ? 'border-navy bg-navy/5 text-navy font-bold' : 'border-slate-200 text-slate-600'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rentang Harga</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-navy" />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-navy" />
                </div>
              </div>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-full bg-navy text-white font-bold py-3.5 rounded-xl"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

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
