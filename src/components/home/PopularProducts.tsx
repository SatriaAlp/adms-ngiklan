import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../marketplace/ProductCard';
import { TrendingUp, Flame } from 'lucide-react';
import { Product } from '../../types';

interface PopularProductsProps {
  onOpenDetail?: (product: Product) => void;
}

export const PopularProducts: React.FC<PopularProductsProps> = ({ onOpenDetail }) => {
  const { products } = useApp();
  const popularProducts = products.filter((p) => p.isBestSeller || p.isTrending || p.salesCount > 300);

  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Produk Terpopuler</h2>
            <p className="text-slate-600 text-xs sm:text-sm font-normal">Aset digital yang paling banyak dibeli dan memiliki ulasan positif.</p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent snap-x snap-mandatory">
          {popularProducts.map((product) => (
            <div key={product.id} className="min-w-[280px] sm:min-w-[320px] max-w-[340px] flex-shrink-0 snap-start">
              <ProductCard product={product} onOpenDetail={onOpenDetail} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
