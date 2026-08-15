import { Request, Response } from "express";
import { ai } from "../config/ai";

export const chatWithAssistant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: "Pesan tidak boleh kosong" });
      return;
    }

    // Check if API key is set
    if (!process.env.GEMINI_API_KEY || !ai) {
      // Fallback response if GEMINI_API_KEY is not configured
      res.json({
        reply: `Halo! Saya ADMS Assistant. ADMS (Armada Digital Marketing System) menyediakan marketplace produk digital, marketplace multi-merchant, dan platform iklan gratis maupun berbayar.
          
Daftar pertanyaan populer:
1. Cara Pasang Iklan Gratis: Buka menu Iklan > Pasang Iklan Gratis.
2. Menjadi Merchant: Buka menu Merchant > Daftar Toko Baru.
3. Paket Iklan Berbayar: Mulai dari Rp10.000 (Basic), Rp25.000 (Featured), hingga Rp50.000 (VIP Premium).

Ada yang bisa saya bantu lebih lanjut?`,
      });
      return;
    }

    const systemInstruction = `Anda adalah ADMS Assistant, asisten AI resmi yang ramah, profesional, dan berbahasa Indonesia untuk platform "ADMS (Armada Digital Marketing System)".

Informasi Platform ADMS:
- ADMS adalah gabungan Marketplace Produk Digital, Multi-Vendor Merchant, dan Advertising Platform.
- Fitur utama: Belanja produk digital (Template Canva, Ebook, Software, Source Code, AI Prompt, Course), Toko Merchant, Iklan Gratis (Rp0), Iklan Berbayar/Promosi (Basic Rp10k, Featured Rp25k, VIP Premium Rp50k), dan Dashboard terpadu.
- Iklan Gratis: 1 iklan aktif, durasi 7 hari, 2 gambar, moderasi admin.
- Iklan Berbayar: Pilihan boost, featured placement di homepage, pencarian teratas, dan badge khusus.
- Payment Gateway: Mendukung QRIS, Transfer Bank (BCA, Mandiri), E-Wallet, dan Siap terintegrasi dengan Payment Gateway buatan Afifah.
- Setelah pembayaran berhasil, produk digital dapat diunduh langsung secara instan dari halaman 'My Downloads' / Nota Pesanan.

Tugas Anda:
Jawablah pertanyaan pengguna dengan jelas, sopan, ringkas, profesional, dan dalam Bahasa Indonesia. Jika pertanyaan tidak diketahui atau membutuhkan penanganan teknis khusus, berikan informasi fallback untuk menghubungi Customer Support WhatsApp ADMS di +62 812-3456-7890.`;

    const response = await ai!.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Maaf, saya tidak dapat memproses tanggapan saat ini. Silakan hubungi Customer Support ADMS.";

    res.json({ reply: replyText });
  } catch (err) {
    console.error("Gemini Chat API Error:", err);
    res.json({
      reply: "Halo! Saya ADMS Assistant. Terjadi kendala teknis singkat saat menghubungkan ke AI. Kamu dapat menanyakan seputar produk digital, cara beriklan gratis, atau pendaftaran merchant di ADMS. Silakan coba kembali atau hubungi CS kami.",
    });
  }
};
