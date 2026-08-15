import React, { useState } from 'react';
import { ShoppingBag, Store, Megaphone, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buyer' | 'merchant' | 'advertiser'>('buyer');

  const buyerSteps = [
    { num: '01', title: 'Cari Produk Digital', desc: 'Gunakan fitur pencarian atau jelajahi kategori template, ebook, software, dan aset digital.' },
    { num: '02', title: 'Pilih & Cek Detail', desc: 'Lihat preview produk, spesifikasi, serta ulasan pembeli terdahulu.' },
    { num: '03', title: 'Checkout & Pilih Pembayaran', desc: 'Isi informasi pesanan dan pilih metode pembayaran QRIS, Transfer Bank, atau E-Wallet.' },
    { num: '04', title: 'Bayar & Verifikasi', desc: 'Sistem pembayaran aman memproses transaksi secara otomatis secara instan.' },
    { num: '05', title: 'Download Produk Instan', desc: 'Unduh file digital langsung dari halaman transaksi atau menu My Downloads.' },
  ];

  const merchantSteps = [
    { num: '01', title: 'Daftar Akun ADMS', desc: 'Buat akun pengguna baru atau ubah peran menjadi Merchant.' },
    { num: '02', title: 'Buat & Lengkapi Profil Toko', desc: 'Unggah logo, banner toko, dan deskripsi usaha Anda.' },
    { num: '03', title: 'Upload Produk Digital', desc: 'Masukkan judul, harga, file produk, dan gambar preview aset.' },
    { num: '04', title: 'Proses Moderasi Cepat', desc: 'Tim Admin ADMS memverifikasi kelayakan dan keamanan produk.' },
    { num: '05', title: 'Mulai Berjualan & Terima Pendapatan', desc: 'Terima pesanan otomatis dan tarik pendapatan langsung ke rekening bank.' },
  ];

  const advertiserSteps = [
    { num: '01', title: 'Buat Iklan Promosi', desc: 'Isi form judul iklan, foto, WhatsApp kontak, dan lokasi bisnis.' },
    { num: '02', title: 'Pilih Paket Iklan', desc: 'Gunakan Iklan Gratis Rp0 atau pilih Paket Promosi (Basic, Featured, VIP).' },
    { num: '03', title: 'Submit Iklan', desc: 'Kirim iklan Anda untuk ditinjau oleh tim moderasi ADMS.' },
    { num: '04', title: 'Moderasi Admin', desc: 'Iklan disetujui dalam hitungan menit untuk menjamin kualitas tayangan.' },
    { num: '05', title: 'Iklan Tayang & Analitik', desc: 'Iklan aktif dipublikasikan dan Anda dapat memantau statistik jumlah views & klik.' },
  ];

  const currentSteps =
    activeTab === 'buyer' ? buyerSteps : activeTab === 'merchant' ? merchantSteps : advertiserSteps;

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Panduan Platform</span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">Cara Kerja ADMS</h2>
          <p className="text-slate-600 text-xs sm:text-sm font-normal">
            Proses mudah dan transparan untuk Pembeli, Merchant, maupun Pengiklan.
          </p>

          {/* Toggle Role Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-xl gap-1">
              <button
                onClick={() => setActiveTab('buyer')}
                className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                  activeTab === 'buyer'
                    ? 'bg-white text-navy shadow-xs'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                Untuk Pembeli
              </button>
              <button
                onClick={() => setActiveTab('merchant')}
                className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                  activeTab === 'merchant'
                    ? 'bg-white text-navy shadow-xs'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-gold" />
                Untuk Merchant
              </button>
              <button
                onClick={() => setActiveTab('advertiser')}
                className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                  activeTab === 'advertiser'
                    ? 'bg-white text-navy shadow-xs'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5 text-gold" />
                Untuk Pengiklan
              </button>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {currentSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-5 rounded-xl flex flex-col justify-between space-y-4 transition-all shadow-2xs hover:shadow-xs"
            >
              <div>
                <span className="text-2xl font-black text-gold/40">{step.num}</span>
                <h3 className="font-bold text-navy text-xs sm:text-sm mt-2">{step.title}</h3>
                <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-normal">{step.desc}</p>
              </div>

              <div className="pt-2 flex items-center text-[11px] font-bold text-slate-700 border-t border-slate-200/80">
                <span>Langkah {idx + 1}</span>
                {idx < 4 && <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
