import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, PlusCircle, Sparkles } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  const { 
    navigate, 
    setIsCreateAdModalOpen,
    isLoggedIn,
    setIsLoginModalOpen,
    addNotification,
    setPendingPostAd
  } = useApp();

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-lg text-white">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-cyan-400 border border-slate-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Siap Mengembangkan Bisnis Anda?
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
              Mulai Temukan Produk Digital & Pasang Iklan Anda Hari Ini!
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Bergabunglah bersama ribuan pengguna, merchant, dan advertiser di ADMS (PT. Armada Digital Marketing Syariah).
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => navigate('marketplace')}
                className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                Jelajahi Marketplace
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('iklan-gratis')}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                Pasang Iklan Gratis Rp0
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
