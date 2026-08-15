import React from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, CheckCircle2, Sparkles, PlusCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export const AdvertisingSection: React.FC = () => {
  const { 
    adPackages, 
    setIsCreateAdModalOpen, 
    navigate,
    isLoggedIn,
    setIsLoginModalOpen,
    addNotification,
    setPendingPostAd
  } = useApp();

  const formatRupiah = (amount: number) => {
    return amount === 0
      ? 'Rp0'
      : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            <Megaphone className="w-3.5 h-3.5 text-cyan-600" />
            <span>Sistem Advertising ADMS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Promosikan Bisnis Anda</h2>
          <p className="text-slate-600 text-xs sm:text-sm font-normal">
            Jangkau lebih banyak calon pelanggan dengan iklan gratis maupun promosi berbayar yang dapat disesuaikan dengan kebutuhan usaha Anda.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {adPackages.map((pkg) => {
            const isFree = pkg.type === 'free';
            const isVIP = pkg.type === 'premium';
            const isFeatured = pkg.type === 'featured';

            return (
              <div
                key={pkg.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative border bg-white ${
                  isVIP
                    ? 'border-slate-900 ring-2 ring-slate-900 shadow-md'
                    : isFeatured
                    ? 'border-slate-300 shadow-xs'
                    : isFree
                    ? 'border-slate-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Package Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs ${
                        isVIP
                          ? 'bg-slate-900 text-cyan-400'
                          : isFeatured
                          ? 'bg-indigo-600 text-white'
                          : isFree
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base mt-2">{pkg.name}</h3>
                  <p className="text-slate-500 text-xs mt-1 min-h-[32px] leading-relaxed font-normal">{pkg.description}</p>

                  {/* Price */}
                  <div className="my-5 pb-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">{formatRupiah(pkg.price)}</span>
                      <span className="text-slate-500 text-xs font-normal">/ {pkg.durationDays} hari</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Maksimal {pkg.maxImages} Gambar Foto Produk</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Durasi Tayang {pkg.durationDays} Hari</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          pkg.isSearchBoost ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span className={pkg.isSearchBoost ? 'text-slate-900 font-bold' : 'text-slate-400 line-through'}>
                        Prioritas Pencarian
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          pkg.isFeaturedPlacement ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span className={pkg.isFeaturedPlacement ? 'text-slate-900 font-bold' : 'text-slate-400 line-through'}>
                        Posisi Featured Homepage
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          pkg.hasAnalytics ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span className={pkg.hasAnalytics ? 'text-slate-900 font-bold' : 'text-slate-400 line-through'}>
                        Statistik Views & Klik Lengkap
                      </span>
                    </li>
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => navigate('iklan-gratis')}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isVIP
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      : isFree
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Pilih {pkg.name}
                </button>
              </div>
            );
          })}
        </div>

        {/* Dynamic Pricing Note */}
        <div className="mt-8 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Setiap iklan baru akan melewati moderasi cepat oleh tim Admin ADMS sebelum dipublikasikan.</span>
        </div>
      </div>
    </section>
  );
};
