import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, MapPin, Zap, ArrowUpRight } from 'lucide-react';
import { ClassifiedDetailModal } from '../ads/ClassifiedDetailModal';
import { Advertisement } from '../../types';

export const LatestClassifiedAds: React.FC = () => {
  const { ads, navigate } = useApp();
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  // Get first 4 published FREE ads
  const latestAds = ads.filter((ad) => ad.status === 'published' && (ad.type === 'free' || ad.type === 'FREE')).slice(0, 4);

  const formatRupiah = (amount: number) => {
    return amount === 0
      ? 'Rp0 / Gratis'
      : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Iklan Baris Terbaru</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Iklan Gratis Terpopuler</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 font-normal">
              Telusuri penawaran iklan baris gratis terpopuler dari kategori mobil, motor, properti, dan gadget.
            </p>
          </div>

          <button
            onClick={() => navigate('iklan-gratis')}
            className="flex items-center gap-1.5 text-slate-900 hover:text-cyan-600 font-bold text-xs sm:text-sm transition-colors shrink-0"
          >
            Lihat Semua Iklan Gratis
            <ArrowRight className="w-4 h-4 text-cyan-600" />
          </button>
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestAds.map((ad) => (
            <div
              key={ad.id}
              onClick={() => setSelectedAd(ad)}
              className={`bg-white rounded-2xl border transition-all hover:shadow-lg flex flex-col justify-between overflow-hidden cursor-pointer group ${
                ad.type === 'PREMIUM' || ad.type === 'premium'
                  ? 'border-amber-300 ring-1 ring-amber-200/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={ad.images?.[0] || 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=80'}
                    alt={ad.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* VIP / Free Badges */}
                  <div className="absolute top-2.5 left-2.5">
                    {ad.type === 'PREMIUM' || ad.type === 'premium' ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-md animate-pulse">
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

                {/* Content */}
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

              {/* Location Card Footer */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px] text-slate-500 font-semibold">
                <div className="flex items-center gap-1 truncate max-w-[70%]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{ad.location}</span>
                </div>
                <span className="text-cyan-600 uppercase tracking-widest text-[9px] font-black shrink-0 flex items-center gap-0.5">
                  Detail <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classified Detail Popup */}
      <ClassifiedDetailModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
    </section>
  );
};
