import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apa itu ADMS (PT. Armada Digital Marketing Syariah)?',
      a: 'ADMS adalah platform serba ada yang menggabungkan marketplace produk digital (template, ebook, software, source code), sistem toko merchant multi-vendor, dan platform iklan (gratis & berbayar).',
    },
    {
      q: 'Bagaimana cara mendownload produk setelah pembelian?',
      a: 'Setelah pembayaran diverifikasi oleh sistem, Anda akan langsung diarahkan ke halaman Nota Pembayaran dengan tombol "Download Product". File juga tersimpan permanen di menu "My Downloads" pada Dashboard Anda.',
    },
    {
      q: 'Apakah saya bisa memasang iklan secara gratis di ADMS?',
      a: 'Ya! ADMS menyediakan fitur Iklan Gratis Rp0 untuk seluruh pengguna terdaftar. Anda dapat memasang 1 iklan aktif berdurasi 7 hari dengan fitur deskripsi, gambar, dan kontak WhatsApp.',
    },
    {
      q: 'Apa perbedaan Iklan Gratis dan Paket Iklan Premium?',
      a: 'Iklan Premium mendapatkan posisi featured di halaman utama, prioritas pencarian teratas, jumlah gambar lebih banyak, badge status khusus, dan laporan statistik views & klik lengkap.',
    },
    {
      q: 'Bagaimana cara menjadi Merchant dan berjualan produk digital?',
      a: 'Anda cukup mendaftar akun di ADMS, masuk ke Dashboard, lalu pilih "Buat Toko Baru". Setelah melengkapi profil toko, Anda dapat langsung mengunggah produk digital untuk mulai berjualan.',
    },
  ];

  return (
    <section className="py-14 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-600" /> Pertanyaan Umum
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions (FAQ)</h2>
          <p className="text-slate-600 text-xs sm:text-sm font-normal">
            Jawaban lengkap atas pertanyaan yang sering diajukan mengenai platform ADMS.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-3.5 text-left font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-cyan-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
