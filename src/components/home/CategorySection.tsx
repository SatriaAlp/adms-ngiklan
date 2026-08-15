import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Megaphone,
  Monitor,
  TrendingUp,
  Zap,
  Share2,
  Briefcase,
  MapPin,
  Code,
  Palette,
  Grid,
  ArrowRight
} from 'lucide-react';
import { CategorySlug } from '../../types';

export const CategorySection: React.FC = () => {
  const { categories, setSelectedCategory, navigate } = useApp();

  const getCategoryTheme = (slug: string) => {
    switch (slug) {
      case 'digital-ads': 
        return { icon: <Megaphone className="w-7 h-7 text-rose-500 group-hover:text-white transition-colors duration-300" />, bg: 'bg-rose-50', hoverBg: 'hover:bg-rose-500', border: 'border-rose-100', textHover: 'group-hover:text-rose-500' };
      case 'website-development': 
        return { icon: <Monitor className="w-7 h-7 text-indigo-500 group-hover:text-white transition-colors duration-300" />, bg: 'bg-indigo-50', hoverBg: 'hover:bg-indigo-500', border: 'border-indigo-100', textHover: 'group-hover:text-indigo-500' };
      case 'marketing-distribution': 
        return { icon: <TrendingUp className="w-7 h-7 text-emerald-500 group-hover:text-white transition-colors duration-300" />, bg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-500', border: 'border-emerald-100', textHover: 'group-hover:text-emerald-500' };
      case 'automation-blast': 
        return { icon: <Zap className="w-7 h-7 text-amber-500 group-hover:text-white transition-colors duration-300" />, bg: 'bg-amber-50', hoverBg: 'hover:bg-amber-500', border: 'border-amber-100', textHover: 'group-hover:text-amber-500' };
      case 'social-media': 
        return { icon: <Share2 className="w-7 h-7 text-sky-500 group-hover:text-white transition-colors duration-300" />, bg: 'bg-sky-50', hoverBg: 'hover:bg-sky-500', border: 'border-sky-100', textHover: 'group-hover:text-sky-500' };
      case 'legal-bisnis': 
        return { icon: <Briefcase className="w-7 h-7 text-violet-500 group-hover:text-white transition-colors duration-300" />, bg: 'bg-violet-50', hoverBg: 'hover:bg-violet-500', border: 'border-violet-100', textHover: 'group-hover:text-violet-500' };
      case 'layanan-offline': 
        return { icon: <MapPin className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />, bg: 'bg-orange-50', hoverBg: 'hover:bg-orange-500', border: 'border-orange-100', textHover: 'group-hover:text-orange-500' };
      case 'source-code': 
        return { icon: <Code className="w-7 h-7 text-cyan-500 group-hover:text-white transition-colors duration-300" />, bg: 'bg-cyan-50', hoverBg: 'hover:bg-cyan-500', border: 'border-cyan-100', textHover: 'group-hover:text-cyan-500' };
      case 'template-design': 
        return { icon: <Palette className="w-7 h-7 text-pink-500 group-hover:text-white transition-colors duration-300" />, bg: 'bg-pink-50', hoverBg: 'hover:bg-pink-500', border: 'border-pink-100', textHover: 'group-hover:text-pink-500' };
      default: 
        return { icon: <Grid className="w-7 h-7 text-slate-500 group-hover:text-white transition-colors duration-300" />, bg: 'bg-slate-100', hoverBg: 'hover:bg-slate-600', border: 'border-slate-200', textHover: 'group-hover:text-slate-700' };
    }
  };

  const handleCategoryClick = (slug: CategorySlug) => {
    setSelectedCategory(slug);
    navigate('marketplace');
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-600 text-[10px] font-black uppercase tracking-widest shadow-xs">
            Kategori Pilihan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Jelajahi <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy to-cyan-500">Kategori Layanan</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            Temukan berbagai kebutuhan digital marketing, website, pembuatan legalitas usaha, hingga layanan offline dalam satu platform.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {categories.map((cat) => {
            const theme = getCategoryTheme(cat.slug);
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="group relative bg-white border border-slate-200 hover:border-transparent p-5 rounded-2xl text-left transition-all duration-300 flex flex-col items-center sm:items-start gap-4 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 overflow-hidden"
              >
                {/* Hover Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className={`relative z-10 p-3.5 rounded-xl ${theme.bg} ${theme.border} border group-hover:scale-110 ${theme.hoverBg} transition-all duration-300 shadow-sm group-hover:shadow-md flex items-center justify-center`}>
                  {theme.icon}
                </div>
                
                <div className="relative z-10 text-center sm:text-left w-full mt-2">
                  <h3 className={`font-black text-slate-900 text-sm sm:text-base leading-snug ${theme.textHover} transition-colors duration-300`}>
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start gap-1 mt-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-bold text-slate-500">{cat.productCount}+ Layanan</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
