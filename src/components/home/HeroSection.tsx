import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdmsLogo } from '../common/AdmsLogo';
import { Search, Sparkles, ArrowRight, PlusCircle, CheckCircle2, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export const HeroSection: React.FC = () => {
  const { 
    navigate, 
    setSearchQuery, 
    setIsCreateAdModalOpen, 
    products, 
    ads,
    isLoggedIn,
    setIsLoginModalOpen,
    addNotification,
    setPendingPostAd
  } = useApp();
  const [localSearch, setLocalSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearch = useDebounce(localSearch, 300);

  const searchResults = React.useMemo(() => {
    if (!debouncedSearch) return [];
    return products.filter(p => 
      p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      p.category.toLowerCase().includes(debouncedSearch.toLowerCase())
    ).slice(0, 4);
  }, [debouncedSearch, products]);

  const slides = [
    {
      title: "Ekosistem ADMS Live",
      subtitle: "Statistik Platform Real-Time",
      badge: "Live Monitor",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Produk Digital</p>
              <p className="text-2xl font-black text-white mt-0.5">{products.length * 150}+</p>
              <span className="text-[9px] text-emerald-400 font-semibold mt-1 inline-block flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> Instan Download
              </span>
            </div>
            <div className="bg-white/5 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Iklan Aktif</p>
              <p className="text-2xl font-black text-white mt-0.5">{ads.length * 80}+</p>
              <span className="text-[9px] text-emerald-400 font-semibold mt-1 inline-block flex items-center gap-0.5">
                ✓ Free & Sponsor
              </span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl flex items-center gap-3 hover:border-white/10 transition-colors">
            <img
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&auto=format&fit=crop&q=80"
              alt="Canva Template"
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[8px] font-bold text-gold">
                <span>BEST SELLER</span>
                <span>•</span>
                <span className="text-emerald-400">⭐ 4.9</span>
              </div>
              <h5 className="text-[11px] font-bold text-white truncate mt-0.5">365 Hari Social Media Content Calendar</h5>
              <p className="text-[11px] text-white font-black mt-0.5">Rp49.000 <span className="line-through text-slate-500 font-normal text-[8px]">Rp99.000</span></p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Promo Spesial Member",
      subtitle: "Cashback & Diskon Terbatas",
      badge: "Promo Merchant",
      badgeColor: "bg-gold/20 text-gold border-gold/30",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-4 rounded-xl border border-emerald-500/20 text-center">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase">DISKON 50%</span>
            <h4 className="text-base font-black text-white mt-2">Source Code & Canva Kit</h4>
            <p className="text-slate-300 text-[10px] mt-1">Dapatkan diskon potongan langsung untuk pembelian produk pertama dengan kode promo: <strong className="text-gold font-mono">ADMSBARU</strong></p>
          </div>
          <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&auto=format&fit=crop&q=80"
              alt="Promo Ad"
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-[11px] font-bold text-white truncate">Paket Premium Ads Exchange</h5>
              <p className="text-[10px] text-slate-300">Tayang 30 hari di Homepage & prioritas teratas pencarian.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pasang Iklan Tanpa Biaya",
      subtitle: "Iklan Baris Klasifikasi Rp 0",
      badge: "Sponsor Ad",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      content: (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-slate-300">Promosikan Jasa / Produk Anda</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Daftarkan diri Anda hari ini dan pasang iklan gratis tanpa komisi. Iklan Anda akan dilihat oleh ribuan visitor setiap harinya secara organik.
            </p>
            <button
              onClick={() => navigate('pasang-iklan-gratis')}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all active:scale-[0.98]"
            >
              Mulai Pasang Iklan Sekarang
            </button>
          </div>
        </div>
      )
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch);
      navigate('marketplace');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white pt-10 pb-14 lg:pt-14 lg:pb-20 border-b border-navy-dark">
      {/* Background Decorative Glowing Blobs */}
      <div className="absolute -top-20 -left-20 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none opacity-40"></div>
      <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[90px] pointer-events-none opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gold text-[11px] font-semibold tracking-wider">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Platform #1 Digital Marketplace & Ad Exchange</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Temukan <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent font-black">Produk Digital</span>.<br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-gold to-amber-400 bg-clip-text text-transparent font-black">Pasang Iklan</span>. Kembangkan Bisnis.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              ADMS adalah platform marketplace dan digital advertising terpadu yang membantu Anda menemukan produk digital terbaik, berjualan sebagai merchant, dan mempromosikan bisnis dalam satu ekosistem.
            </p>

            {/* Glassmorphic Search Bar (More Compact) */}
            <form onSubmit={handleSearchSubmit} className="pt-1 max-w-xl mx-auto lg:mx-0">
              <div className="relative flex items-center bg-white/10 border border-white/20 backdrop-blur-lg rounded-xl p-1 shadow-2xl focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300">
                <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder="Cari produk digital, jasa, atau iklan promosi..."
                  className="w-full bg-transparent px-2.5 py-1.5 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md active:scale-[0.98] shrink-0"
                >
                  Cari
                </button>
                
                {/* Live Search Dropdown */}
                {showDropdown && debouncedSearch && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-900">
                    {searchResults.length > 0 ? (
                      <div className="flex flex-col">
                        {searchResults.map(product => (
                          <div 
                            key={product.id}
                            onClick={() => {
                              setSearchQuery(product.title);
                              navigate('marketplace');
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors"
                          >
                            <img src={product.thumbnail} alt={product.title} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex flex-col flex-1 text-left">
                              <span className="text-sm font-bold text-navy truncate">{product.title}</span>
                              <span className="text-xs text-slate-500 capitalize">{product.category}</span>
                            </div>
                          </div>
                        ))}
                        <div 
                          onClick={handleSearchSubmit}
                          className="p-3 text-center text-xs font-bold text-emerald-600 hover:bg-emerald-50 cursor-pointer bg-slate-50"
                        >
                          Lihat Semua Hasil Pencarian
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-500">
                        Tidak ditemukan hasil untuk "{debouncedSearch}"
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] text-slate-400 justify-center lg:justify-start">
                <span className="font-semibold text-slate-400">Pencarian Populer:</span>
                <button type="button" onClick={() => { setSearchQuery('Canva'); navigate('marketplace'); }} className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">Template Canva</button>
                <span>•</span>
                <button type="button" onClick={() => { setSearchQuery('Ebook'); navigate('marketplace'); }} className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">Ebook Marketing</button>
                <span>•</span>
                <button type="button" onClick={() => { setSearchQuery('Website'); navigate('marketplace'); }} className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">Source Code Web</button>
              </div>
            </form>

            {/* CTAs with micro-animations (More Compact) */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => navigate('marketplace')}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-md hover:shadow-[0_0_15px_rgba(0,200,83,0.25)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                Jelajahi Marketplace
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => navigate('pasang-iklan-gratis')}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/25 hover:border-white/35 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pasang Iklan Gratis</span>
              </button>
            </div>

            {/* Trust Badges (More Compact) */}
            <div className="pt-4 grid grid-cols-3 gap-2 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Instan Download</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Merchant</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-300 font-semibold">
                <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Iklan Gratis Rp0</span>
              </div>
            </div>
          </div>

          {/* Right Floating Slideshow Mockup (Automated Slideshow) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 w-full min-h-[300px]">
            {/* Slide Container */}
            <div className="relative bg-white/5 backdrop-blur-md text-white p-5 rounded-2xl border border-white/10 shadow-2xl space-y-4 transition-all duration-500 overflow-hidden">
              {/* Card Header Preview */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <AdmsLogo variant="symbol" size="sm" />
                  <div>
                    <h4 className="font-bold text-white text-xs">{slides[currentSlide].title}</h4>
                    <p className="text-[9px] text-slate-400 font-medium">{slides[currentSlide].subtitle}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 ${slides[currentSlide].badgeColor}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                  {slides[currentSlide].badge}
                </span>
              </div>

              {/* Slide Content */}
              <div className="transition-all duration-300 transform translate-x-0 opacity-100">
                {slides[currentSlide].content}
              </div>

              {/* Slider dots */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-emerald-400 w-4' : 'bg-white/20'
                    }`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Overlay Floating Card - Out of phase float-delayed */}
            <div className="animate-float-delayed absolute -bottom-6 -left-4 md:-left-6 bg-slate-950/95 border border-white/10 p-3 rounded-xl shadow-2xl w-52 text-white z-20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-[10px] font-bold text-white truncate">Iklan Premium Baru</h5>
                <p className="text-[8px] text-slate-400 mt-0.5">Impression: 12.5K • Ctr: 5.4%</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[8px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                    Aktif
                  </span>
                  <span className="text-[8px] font-bold bg-gold/20 text-gold px-1.5 py-0.5 rounded-sm">VIP Boost</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
