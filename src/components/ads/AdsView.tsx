import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Sparkles, Filter, Search, PlusCircle, ExternalLink, Eye, MousePointer, ShieldCheck, Zap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const AdsView: React.FC = () => {
  const { ads, categories, searchQuery, setSearchQuery, navigate, activeRole, approveAd, rejectAd } = useApp();
  const [filterType, setFilterType] = useState<'ALL' | 'FREE' | 'PREMIUM'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || ad.type === filterType;
    const matchesCat = selectedCategory === 'ALL' || ad.category === selectedCategory;
    return matchesSearch && matchesType && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          <div className="px-3 py-1 bg-slate-900/80 border border-slate-700/50 rounded-full flex items-center gap-2 mb-2 w-max">
            <Megaphone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Platform Pemasangan Iklan Terpadu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manajemen Iklan & Promosi Marketplace
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
            Pasang iklan untuk bisnis Anda atau tingkatkan jangkauan dengan iklan sponsor premium di seluruh jaringan ADMS.
          </p>
        </div>

        {(activeRole === 'MERCHANT' || activeRole === 'ADMIN') && (
          <button
            onClick={() => setIsCreateAdModalOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs flex items-center gap-2 shrink-0 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pasang Iklan</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari iklan promosi..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">


          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold focus:outline-none"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.map((ad) => (
          <div
            key={ad.id}
            className={`bg-white rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
              ad.type === 'PREMIUM'
                ? 'border-amber-300 ring-1 ring-amber-200'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              {/* Image Header with Badge */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={ad.images?.[0] || ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  {ad.type === 'premium' || ad.type === 'PREMIUM' || ad.type === 'featured' ? (
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" /> Sponsor Premium
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Zap className="w-3 h-3 text-emerald-400" /> Iklan Reguler
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-[10px] border border-slate-200 shadow-xs">
                  {ad.category}
                </span>

                {/* Moderation Badge */}
                {ad.status === 'pending' && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <AlertTriangle className="w-4 h-4" /> Menunggu Moderasi
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug">
                  {ad.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 font-normal leading-relaxed">
                  {ad.description}
                </p>

                {/* Impression / Click Counter */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{(ad.viewsCount ?? ad.impressions ?? 0).toLocaleString('id-ID')} Views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MousePointer className="w-3.5 h-3.5 text-slate-400" />
                    <span>{(ad.clicksCount ?? ad.clicks ?? 0).toLocaleString('id-ID')} Clicks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold text-slate-600 truncate">
                {ad.merchantName || 'ADMS Verified Partner'}
              </span>

              {activeRole === 'ADMIN' && ad.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => rejectAd(ad.id)}
                    className="p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors"
                    title="Tolak Iklan"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => approveAd(ad.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Setujui
                  </button>
                </div>
              ) : (
                <a
                  href={ad.websiteUrl || ad.targetUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <span>Lihat Promo</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAds.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3">
          <p className="font-bold text-slate-800 text-base">Tidak ada iklan ditemukan</p>
          <p className="text-xs text-slate-500">Coba ubah kata kunci atau kata pencarian Anda.</p>
        </div>
      )}
    </div>
  );
};
