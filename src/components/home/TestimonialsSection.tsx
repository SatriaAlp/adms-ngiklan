import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Rian Prasetya',
      role: 'Digital Marketer & Agency Owner',
      comment: 'ADMS membantu agensi saya mendapatkan ratusan calon klien dari iklan promosi gratis dan berbayarnya. Konversinya tinggi banget!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Siti Rahmawati',
      role: 'Merchant Template Canva',
      comment: 'Sebagai merchant di ADMS, penjualan template Canva saya meningkat drastis. Penarikan dana cepat dan pembeli bisa download otomatis.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Deni Kurniawan',
      role: 'Pembeli Aset Web Developer',
      comment: 'Source code Next.js yang saya beli di marketplace ADMS sangat memuaskan. Lengkap dengan panduan dan penjual sangat responsif.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Testimoni Pengguna</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Kata Mereka Tentang ADMS</h2>
          <p className="text-slate-600 text-xs sm:text-sm font-normal">
            Pengalaman nyata dari para pembeli, merchant, dan pengiklan di platform ADMS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs"
            >
              <div className="space-y-3">
                <Quote className="w-7 h-7 text-slate-300" />
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic font-normal">"{t.comment}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{t.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
