import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../marketplace/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface FeaturedProductsProps {
  onOpenDetail?: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onOpenDetail }) => {
  const { products, navigate } = useApp();
  const featured = products.slice(0, 4);

  return (
    <section className="py-14 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Rekomendasi Utama</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Produk Digital Pilihan</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 font-normal">
              Aset digital terlaris dan berkualitas tinggi yang diverifikasi oleh tim ADMS.
            </p>
          </div>

          <button
            onClick={() => navigate('marketplace')}
            className="flex items-center gap-1.5 text-slate-900 hover:text-cyan-600 font-bold text-xs sm:text-sm transition-colors shrink-0"
          >
            Lihat Semua Produk
            <ArrowRight className="w-4 h-4 text-cyan-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((prod) => (
            <ProductCard key={prod.id} product={prod} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </div>
    </section>
  );
};
