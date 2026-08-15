import React from 'react';
import { ShieldCheck, Zap, Download, Users, Lock, Sparkles } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <Download className="w-6 h-6 text-sky-400" />,
      title: 'Akses Instant Digital Download',
      desc: 'Setelah pembayaran berhasil terkonfirmasi, file digital langsung siap diunduh tanpa perlu menunggu konfirmasi manual.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: 'Iklan Gratis & Promosi Berbayar',
      desc: 'Dukungan penuh untuk pelaku UMKM dan kreator memasang iklan gratis atau memilih paket boost posisi teratas.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: 'Keamanan Transaksi Terjamin',
      desc: 'Sistem proteksi transaksi dan opsi Payment Gateway terintegrasi untuk menjamin keamanan dana pembeli dan merchant.',
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: 'Sistem Multi-Vendor Merchant',
      desc: 'Siapapun dapat membuka toko digital, mengunggah karya, serta mengelola pesanan dan laporan pendapatan secara mandiri.',
    },
  ];

  return (
    <section className="py-14 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keunggulan ADMS</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Mengapa Memilih Platform ADMS?</h2>
          <p className="text-slate-600 text-xs sm:text-sm font-normal">
            Platform modern yang dirancang khusus untuk mempercepat pertumbuhan produk digital dan promosi bisnis Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 p-6 rounded-xl space-y-3 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg w-fit text-slate-900 font-bold">
                {b.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{b.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
