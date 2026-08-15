import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Check, Zap, ShieldCheck, PlusCircle, ArrowRight } from 'lucide-react';

export const PricingView: React.FC = () => {
  const { adPackages, navigate } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-emerald-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Skema Harga Transparan & Pemasangan Iklan</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Pilih Paket Promosi & Iklan Terbaik
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-normal">
          Mulai dari pasang iklan gratis Rp0 hingga paket promosi prioritas premium untuk meningkatkan penjualan produk digital Anda.
        </p>
      </div>

      {/* Ad Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-slate-500 tracking-wider">Gratis</span>
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">Iklan Gratis</h3>
              <p className="text-3xl font-black text-slate-900 mt-2">Rp0 <span className="text-xs text-slate-500 font-normal">/ 30 hari</span></p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Pasang promosi produk atau jasa Anda secara gratis di katalog publik ADMS.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 font-medium pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tayang di Katalog Publik Iklan</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Masa Aktif 30 Hari</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Statistik View & Click</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Link Direct Ke WhatsApp</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => navigate('iklan-gratis')}
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors"
          >
            Pasang Gratis Rp0
          </button>
        </div>

        {/* Dynamic Packages from adPackages */}
        {adPackages.map((pkg, idx) => {
          const isFeatured = idx === 1; // Gold/Middle package highlighted

          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                isFeatured
                  ? 'border-slate-900 ring-2 ring-slate-900 shadow-lg relative'
                  : 'border-slate-200 hover:shadow-md'
              }`}
            >
              {isFeatured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-900 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                  Paling Populer
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase text-slate-500 tracking-wider">Sponsor</span>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900">{pkg.name}</h3>
                  <p className="text-2xl font-black text-slate-900 mt-2">
                    Rp{pkg.price.toLocaleString('id-ID')} <span className="text-xs text-slate-500 font-normal">/ {pkg.durationDays} hari</span>
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {pkg.description}
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 font-medium pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Prioritas Posisi Teratas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pin Banner Hero Section</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Badge "Sponsor Verified"</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Promosi di Social Media ADMS</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('iklan-gratis')}
                className={`w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  isFeatured
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                Pilih Paket
              </button>
            </div>
          );
        })}
      </div>

      {/* Merchant Subscription Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-black text-2xl text-white">Ingin Berjualan Produk Digital Sebagai Merchant?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
            Buka toko digital Anda di ADMS, unggah produk digital tanpa batas, dan terima pembayaran otomatis via Custom Payment Gateway.
          </p>
        </div>
        <button
          onClick={() => navigate('dashboard')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs shrink-0 flex items-center gap-2 transition-all"
        >
          <span>Daftar Merchant Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
