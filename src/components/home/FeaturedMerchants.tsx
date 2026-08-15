import React from 'react';
import { useApp } from '../../context/AppContext';
import { Store, ShieldCheck, Star, ArrowRight, MapPin } from 'lucide-react';

export const FeaturedMerchants: React.FC = () => {
  const { merchants, setSelectedMerchantId, navigate } = useApp();

  const handleStoreClick = (merchantId: string) => {
    setSelectedMerchantId(merchantId);
    navigate('merchant-detail');
  };

  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mitra Vendor</span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">Merchant Terverifikasi</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 font-normal">Daftar kreator dan penyedia aset digital terpercaya di ADMS.</p>
          </div>

          <button
            onClick={() => navigate('merchants')}
            className="flex items-center gap-1.5 text-navy hover:text-gold font-bold text-xs sm:text-sm transition-colors"
          >
            Lihat Semua Merchant
            <ArrowRight className="w-4 h-4 text-gold" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {merchants.map((merchant) => (
            <div
              key={merchant.id}
              onClick={() => handleStoreClick(merchant.id)}
              className="group bg-white hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 cursor-pointer transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={merchant.logoUrl || merchant.logo}
                    alt={merchant.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-navy text-sm truncate group-hover:text-gold transition-colors">
                        {merchant.name}
                      </h3>
                      {merchant.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-gold shrink-0" title="Verified Merchant" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {merchant.rating}
                      </span>
                      <span>•</span>
                      <span>Verified</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-xs line-clamp-2 mt-3 leading-relaxed font-normal">
                  {merchant.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Official Merchant
                </span>
                <span className="text-navy font-bold group-hover:underline flex items-center gap-1">
                  Kunjungi Toko <ArrowRight className="w-3 h-3 text-gold" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
