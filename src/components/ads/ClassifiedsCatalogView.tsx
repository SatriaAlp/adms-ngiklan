import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Megaphone, Sparkles, Search, Filter, MapPin, Tag, Phone, Zap, 
  ArrowUpDown, Grid, List, ShieldAlert, CheckCircle, RefreshCw,
  Car, Bike, Smartphone, Monitor, Home, HelpCircle, Briefcase, Shirt, Sofa, Trash2
} from 'lucide-react';
import { ClassifiedDetailModal } from './ClassifiedDetailModal';
import { Advertisement } from '../../types';

export const ClassifiedsCatalogView: React.FC = () => {
  const { ads, categories, navigate } = useApp();
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [conditionFilter, setConditionFilter] = useState<'ALL' | 'baru' | 'bekas' | 'jasa'>('ALL');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<'LATEST' | 'PRICE_ASC' | 'PRICE_DESC'>('LATEST');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  // Category list with icon maps for visual badges
  const categoryIcons: { [key: string]: React.ReactNode } = {
    'mobil': <Car className="w-5 h-5 text-indigo-500" />,
    'motor': <Bike className="w-5 h-5 text-teal-500" />,
    'handphone': <Smartphone className="w-5 h-5 text-sky-500" />,
    'elektronik': <Monitor className="w-5 h-5 text-purple-500" />,
    'properti': <Home className="w-5 h-5 text-amber-500" />,
    'tanah': <Tag className="w-5 h-5 text-emerald-500" />,
    'jasa': <HelpCircle className="w-5 h-5 text-rose-500" />,
    'lowongan': <Briefcase className="w-5 h-5 text-violet-500" />,
    'fashion': <Shirt className="w-5 h-5 text-pink-500" />,
    'rumah-tangga': <Sofa className="w-5 h-5 text-orange-500" />,
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedCat('ALL');
    setConditionFilter('ALL');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('LATEST');
  };

  const filteredAds = ads
    .filter((ad) => {
      const matchesSearch =
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation =
        !locationQuery || ad.location.toLowerCase().includes(locationQuery.toLowerCase());

      const matchesCat = selectedCat === 'ALL' || ad.category.toLowerCase() === selectedCat.toLowerCase();
      
      // Iklan Gratis page MUST ONLY show 'free' ads.
      const matchesType = ad.type === 'free' || ad.type === 'FREE';

      const matchesCondition =
        conditionFilter === 'ALL' || ad.condition.toLowerCase() === conditionFilter.toLowerCase();

      const adMin = minPrice ? parseFloat(minPrice) : null;
      const adMax = maxPrice ? parseFloat(maxPrice) : null;
      const matchesMinPrice = adMin === null || ad.price >= adMin;
      const matchesMaxPrice = adMax === null || ad.price <= adMax;

      return (
        matchesSearch && 
        matchesLocation && 
        matchesCat && 
        matchesType && 
        matchesCondition && 
        matchesMinPrice && 
        matchesMaxPrice && 
        ad.status === 'published'
      );
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.price - b.price;
      if (sortBy === 'PRICE_DESC') return b.price - a.price;
      return b.id.localeCompare(a.id); // LATEST
    });

  const formatRupiah = (amount: number) => {
    return amount === 0
      ? 'Rp0 / Gratis'
      : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* Premium Hero Portal Banner */}
      <div className="bg-navy py-16 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gold text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Portal Iklan Baris Modern Indonesia</span>
          </div>

          <div className="space-y-2 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Cari Barang Bekas, Jasa & Properti Terdekat
            </h1>
            <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-normal">
              Temukan penawaran terbaik dari jutaan penjual terverifikasi. Pasang iklan Anda 100% gratis tanpa komisi.
            </p>
          </div>

          {/* Floating Search Bar Widget */}
          <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-slate-100 flex flex-col md:flex-row gap-2.5 items-center">
            {/* Keyword Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari mobil bekas, handphone, laptop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>

            {/* Location Search */}
            <div className="relative w-full md:w-64 shrink-0">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Semua Lokasi / Kota"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>

            <button
              onClick={() => navigate('pasang-iklan-gratis')}
              className="w-full md:w-auto bg-gold hover:bg-gold/90 text-navy font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shrink-0"
            >
              <Zap className="w-4 h-4 fill-navy text-navy" />
              Pasang Iklan Gratis
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        
        {/* Category circle badges section */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-widest text-center lg:text-left">Jelajahi Berdasarkan Kategori</h3>
          <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-thin flex-nowrap lg:flex-wrap">
            <button
              onClick={() => setSelectedCat('ALL')}
              className={`px-4 py-3.5 rounded-2xl border text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                selectedCat === 'ALL'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>🌐</span>
              <span>Semua Kategori</span>
            </button>

            {Object.keys(categoryIcons).map((catKey) => (
              <button
                key={catKey}
                onClick={() => setSelectedCat(catKey)}
                className={`px-4 py-3.5 rounded-2xl border text-xs font-bold transition-all shrink-0 flex items-center gap-2.5 ${
                  selectedCat === catKey
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {categoryIcons[catKey]}
                <span className="capitalize">{catKey.replace('-', ' ')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2 Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Filter Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Filters Sidebar Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-slate-400" /> Filter Pencarian
                </span>
                
                <button
                  onClick={handleClearFilters}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Bersihkan
                </button>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Kisaran Harga (Rp)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Condition Select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Kondisi Barang</label>
                <div className="flex flex-col gap-1.5">
                  {(['ALL', 'baru', 'bekas', 'jasa'] as const).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setConditionFilter(cond)}
                      className={`px-3 py-2 rounded-xl border text-left text-xs font-semibold capitalize transition-all ${
                        conditionFilter === cond
                          ? 'bg-slate-900 border-slate-900 text-white font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50'
                      }`}
                    >
                      {cond === 'ALL' ? 'Semua Kondisi' : cond}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="bg-amber-50 border border-amber-200/50 rounded-3xl p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 text-amber-900">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
                <span className="font-extrabold text-xs uppercase tracking-wider">Panduan Keamanan</span>
              </div>
              <ul className="space-y-2 text-[11px] text-amber-800 font-medium leading-relaxed">
                <li className="flex gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Lakukan transaksi dengan COD (Ketemuan Langsung) di tempat ramai.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Periksa kualitas fisik barang secara teliti sebelum melakukan pembayaran.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Jangan pernah mentransfer uang muka (DP) terlebih dahulu kepada penjual.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Listings */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Controls Header */}
            <div className="bg-white p-4 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Ditemukan</span>
                <span className="font-bold text-slate-900 text-sm">{filteredAds.length}</span>
                <span>Iklan Aktif</span>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 mr-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold focus:outline-none"
                  >
                    <option value="LATEST">Iklan Terbaru</option>
                    <option value="PRICE_ASC">Harga Terendah</option>
                    <option value="PRICE_DESC">Harga Tertinggi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* VIP Sponsored Featured Banner Row */}
            {selectedCat === 'ALL' && filterType !== 'FREE' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 fill-amber-500" /> Sponsor Premium Terpopuler
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAds
                    .filter((ad) => ad.type === 'PREMIUM' || ad.type === 'premium')
                    .slice(0, 2)
                    .map((ad) => (
                      <div
                        key={`vip-${ad.id}`}
                        onClick={() => setSelectedAd(ad)}
                        className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-300 ring-1 ring-amber-200/50 rounded-2xl p-4 flex gap-4 cursor-pointer hover:shadow-md transition-all group"
                      >
                        <img
                          src={ad.images?.[0] || 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=80'}
                          alt={ad.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-amber-200"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[9px] text-amber-800 font-bold uppercase tracking-wider">
                                {ad.category}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[8px] uppercase tracking-wider">
                                SPONSOR
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors mt-0.5">
                              {ad.title}
                            </h4>
                          </div>

                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-sm font-black text-slate-900">{formatRupiah(ad.price)}</span>
                            <span className="text-[9px] text-slate-400 font-medium">({ad.location})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Main Ads List Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAds.map((ad) => (
                  <div
                    key={ad.id}
                    onClick={() => setSelectedAd(ad)}
                    className={`bg-white rounded-2xl border transition-all hover:shadow-lg flex flex-col justify-between overflow-hidden cursor-pointer group ${
                      ad.type === 'PREMIUM' || ad.type === 'premium'
                        ? 'border-amber-300 ring-1 ring-amber-200/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Image slider container */}
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img
                          src={ad.images?.[0] || 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=80'}
                          alt={ad.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5">
                          {ad.type === 'PREMIUM' || ad.type === 'premium' ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                              <Sparkles className="w-2.5 h-2.5" /> VIP
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-white font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                              <Zap className="w-2.5 h-2.5 text-emerald-400" /> Gratis
                            </span>
                          )}
                        </div>

                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/95 text-slate-900 border border-slate-200 font-bold text-[9px] shadow-sm capitalize">
                          {ad.condition}
                        </span>
                      </div>

                      {/* Body Content */}
                      <div className="p-4 space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {ad.category}
                        </span>

                        <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-cyan-600 transition-colors">
                          {ad.title}
                        </h3>

                        <div className="text-base font-black text-slate-900 pt-1">
                          {formatRupiah(ad.price)}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Location info */}
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px] text-slate-500 font-semibold">
                      <div className="flex items-center gap-1 truncate max-w-[70%]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ad.location}</span>
                      </div>
                      <span className="text-cyan-600 uppercase tracking-widest text-[9px] font-black shrink-0">
                        Lihat Detail
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View Mode
              <div className="space-y-4">
                {filteredAds.map((ad) => (
                  <div
                    key={ad.id}
                    onClick={() => setSelectedAd(ad)}
                    className={`bg-white rounded-2xl border p-4 flex flex-col sm:flex-row gap-4 cursor-pointer hover:shadow-md transition-all group ${
                      ad.type === 'PREMIUM' || ad.type === 'premium'
                        ? 'border-amber-300 ring-1 ring-amber-200/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={ad.images?.[0] || 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=80'}
                      alt={ad.title}
                      className="w-full sm:w-40 h-28 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {ad.category}
                          </span>
                          <span className="text-[10px] text-slate-300">•</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded capitalize">
                            {ad.condition}
                          </span>
                          {ad.type === 'PREMIUM' || ad.type === 'premium' ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[8px] uppercase tracking-wider flex items-center gap-0.5">
                              <Sparkles className="w-2 h-2" /> VIP SPONSOR
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-bold text-[8px] uppercase tracking-wider flex items-center gap-0.5">
                              <Zap className="w-2 h-2 text-emerald-400" /> GRATIS
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-cyan-600 transition-colors mt-1">
                          {ad.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal mt-0.5">
                          {ad.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2 flex-wrap gap-2">
                        <div className="text-sm font-black text-slate-900">
                          {formatRupiah(ad.price)}
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ad.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredAds.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-base">Tidak ada iklan ditemukan</p>
                  <p className="text-xs text-slate-500">Coba gunakan kata kunci pencarian lain atau kurangi filter kisaran harga.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Classified Detail Popup */}
      <ClassifiedDetailModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
    </div>
  );
};
