import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutTemplate,
  BookOpen,
  Code,
  Globe,
  Palette,
  Video,
  Music,
  GraduationCap,
  Share2,
  TrendingUp,
  Briefcase,
  Award,
  Wrench,
  UserCheck,
  Grid,
} from 'lucide-react';
import { CategorySlug } from '../../types';

export const CategorySection: React.FC = () => {
  const { categories, setSelectedCategory, navigate } = useApp();

  const getCategoryIcon = (slug: CategorySlug) => {
    switch (slug) {
      case 'template': return <LayoutTemplate className="w-6 h-6 text-sky-400" />;
      case 'ebook': return <BookOpen className="w-6 h-6 text-emerald-400" />;
      case 'software': return <Code className="w-6 h-6 text-indigo-400" />;
      case 'website': return <Globe className="w-6 h-6 text-blue-400" />;
      case 'design': return <Palette className="w-6 h-6 text-pink-400" />;
      case 'video': return <Video className="w-6 h-6 text-rose-400" />;
      case 'audio': return <Music className="w-6 h-6 text-purple-400" />;
      case 'course': return <GraduationCap className="w-6 h-6 text-amber-400" />;
      case 'social-media': return <Share2 className="w-6 h-6 text-teal-400" />;
      case 'digital-marketing': return <TrendingUp className="w-6 h-6 text-cyan-400" />;
      case 'business': return <Briefcase className="w-6 h-6 text-orange-400" />;
      case 'education': return <Award className="w-6 h-6 text-lime-400" />;
      case 'tools': return <Wrench className="w-6 h-6 text-violet-400" />;
      case 'jasa': return <UserCheck className="w-6 h-6 text-emerald-300" />;
      default: return <Grid className="w-6 h-6 text-slate-400" />;
    }
  };

  const handleCategoryClick = (slug: CategorySlug) => {
    setSelectedCategory(slug);
    navigate('marketplace');
  };

  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori Pilihan</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Jelajahi Kategori Produk & Iklan</h2>
          <p className="text-slate-600 text-xs sm:text-sm font-normal">
            Temukan berbagai kebutuhan produk digital, aset kreatif, dan layanan promosi berdasarkan kategori.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 p-4 rounded-xl text-left transition-all flex flex-col items-start gap-3 shadow-2xs hover:shadow-xs"
            >
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 group-hover:border-slate-300 transition-colors">
                {getCategoryIcon(cat.slug)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-cyan-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{cat.productCount}+ Produk</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
