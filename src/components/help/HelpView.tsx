import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Mail, Phone, ShoppingBag, Store, Megaphone, ShieldCheck } from 'lucide-react';

export const HelpView: React.FC = () => {
  const { setIsChatOpen } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apa itu ADMS (PT. Armada Digital Marketing Syariah)?',
      a: 'ADMS adalah platform terpadu yang menggabungkan marketplace produk digital (template, ebook, source code, aset desain), jaringan merchant multi-vendor, dan platform pemasangan iklan gratis serta promosi sponsor.',
    },
    {
      q: 'Bagaimana cara membeli produk digital di ADMS?',
      a: 'Pilih produk yang Anda inginkan di halaman Marketplace, klik "Tambah ke Keranjang" atau "Beli Sekarang", lengkapi informasi Anda, lalu selesaikan pembayaran via Custom Payment Gateway. Setelah pembayaran terverifikasi, link instan download akan otomatis dikirimkan.',
    },
    {
      q: 'Bagaimana cara memasang iklan di ADMS?',
      a: 'Klik tombol "Pasang Iklan" di bagian atas halaman. Anda dapat memilih pasang iklan gratis Rp0 atau memilih paket sponsor premium untuk prioritas tayang di Hero Section dan halaman utama.',
    },
    {
      q: 'Bagaimana cara mendaftar sebagai Merchant / Penjual?',
      a: 'Buka Dashboard, ganti peran ke mode Merchant atau klik "Daftar Merchant". Lengkapi profil toko Anda, dan Anda bisa langsung mulai mengunggah produk digital untuk dijual.',
    },
    {
      q: 'Apakah pembayaran di ADMS aman?',
      a: 'Sangat aman. ADMS menggunakan sistem transaksi terenkripsi dan Custom Payment Gateway khusus yang memverifikasi setiap pembayaran secara otomatis.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 text-cyan-400 text-xs font-bold border border-slate-700">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Pusat Bantuan & Customer Service ADMS</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">Ada Pertanyaan? Kami Siap Membantu</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
          Temukan panduan lengkap, jawaban pertanyaan umum, atau hubungi tim customer support kami secara langsung.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Panduan Pembeli</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Cara mencari produk digital, melakukan pembayaran instan, dan mengakses file yang telah dibeli.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Panduan Merchant</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Cara membuka toko, mengunggah file lisensi, mengatur harga, dan menarik saldo penjualan.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
            <Megaphone className="w-5 h-5 text-cyan-600" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Panduan Iklan</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Cara membuat iklan gratis Rp0 atau memesan paket promosi sponsor prioritas untuk bisnis Anda.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="font-black text-xl text-slate-900">Pertanyaan Sering Diajukan (FAQ)</h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
              </button>

              {openFaq === idx && (
                <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Customer Support Contact */}
      <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-base text-slate-900">Butuh Bantuan Langsung?</h4>
          <p className="text-xs text-slate-600 font-normal">
            Gunakan AI Assistant Customer Service kami yang aktif 24/7 untuk menjawab pertanyaan Anda.
          </p>
        </div>

        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs flex items-center gap-2 shrink-0 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <span>Buka Chat Support (AI)</span>
        </button>
      </div>
    </div>
  );
};
