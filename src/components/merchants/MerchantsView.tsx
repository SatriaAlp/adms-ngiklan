import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, ShieldCheck, Star, Package, Search, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

export const MerchantsView: React.FC = () => {
  const { 
    merchants, products, navigate, activeRole, setActiveRole, 
    addNotification, setDashboardSubTab 
  } = useApp();
  const [search, setSearch] = useState('');

  const filteredMerchants = merchants.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-navy text-white rounded-2xl p-6 sm:p-8 border border-navy flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-navy/80 text-gold text-xs font-bold border border-gold/30">
            <Store className="w-3.5 h-3.5" />
            <span>Ekosistem Merchant Multi-Vendor Verified</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Direktori Merchant Official ADMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
            Beli produk digital berkualitas langsung dari kreator, developer, dan agensi digital terpercaya dengan jaminan keamanan ADMS.
          </p>
        </div>

        {activeRole === 'USER' && (
          <button
            onClick={() => {
              navigate('daftar-merchant');
            }}
            className="bg-gold hover:bg-gold/90 text-navy font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs flex items-center gap-2 shrink-0 transition-all"
          >
            <Store className="w-4 h-4" />
            <span>Daftar Jadi Merchant</span>
          </button>
        )}
        {activeRole === 'MERCHANT' && (
          <button
            onClick={() => {
              navigate('dashboard');
              setDashboardSubTab('products');
            }}
            className="bg-gold hover:bg-gold/90 text-navy font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs flex items-center gap-2 shrink-0 transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Kelola Produk Saya</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari merchant, toko, atau agensi..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <span className="text-xs text-slate-500 font-bold hidden sm:inline">
          Menampilkan {filteredMerchants.length} Merchant Terverifikasi
        </span>
      </div>

      {/* Merchant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMerchants.map((merchant) => {
          const merchantProducts = products.filter((p) => p.merchantId === merchant.id);

          return (
            <div
              key={merchant.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={merchant.logoUrl}
                    alt={merchant.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-navy truncate">{merchant.name}</h3>
                      {merchant.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-gold shrink-0" title="Verified Merchant" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {merchant.rating}
                      </span>
                      <span>•</span>
                      <span>{merchantProducts.length} Produk Digital</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed font-normal">
                  {merchant.description}
                </p>

                {/* Badges / Stats */}
                <div className="pt-3 flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Official Merchant
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-gold/20 text-gold text-[10px] font-bold border border-gold/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-gold" />
                    Responsif & Terpercaya
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-semibold">
                  Bergabung sejak 2025
                </span>
                <button
                  onClick={() => {
                    navigate('marketplace');
                  }}
                  className="px-4 py-2 rounded-lg bg-navy hover:bg-navy/90 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Lihat Produk</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
