import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, Sparkles, CheckCircle2, Image as ImageIcon, 
  ArrowLeft, ArrowRight, ShieldCheck, ChevronRight, Info,
  FileText, Check, ArrowLeftCircle, DollarSign, LayoutTemplate, Link
} from 'lucide-react';
import { CategorySlug } from '../../types';

export const UploadProductView: React.FC = () => {
  const { 
    createProduct, 
    currentUser, 
    addNotification,
    isLoggedIn,
    navigate
  } = useApp();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategorySlug>('template');
  const [price, setPrice] = useState<number>(0);
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>(['Lisensi Komersial', 'Akses File Selamanya', 'Update Gratis Berkala']);

  const getCategoryName = (slug: CategorySlug): string => {
    switch (slug) {
      case 'template': return 'Template';
      case 'ebook': return 'Ebook';
      case 'software': return 'Software';
      case 'website': return 'Website';
      case 'design': return 'Design';
      case 'video': return 'Video';
      case 'audio': return 'Audio';
      case 'course': return 'Course';
      case 'social-media': return 'Social Media';
      case 'digital-marketing': return 'Digital Marketing';
      case 'business': return 'Business';
      case 'education': return 'Education';
      case 'tools': return 'Tools';
      case 'jasa': return 'Jasa';
      default: return 'Lainnya';
    }
  };

  // Mock Unsplash image search library by category to make demo look premium
  const mockupImagesByCategory: { [cat in CategorySlug]?: string[] } = {
    'template': [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80'
    ],
    'ebook': [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80'
    ],
    'software': [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=80'
    ],
    'website': [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
    ]
  };

  const handleAddMockPhoto = () => {
    const list = mockupImagesByCategory[category] || [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=80'
    ];
    const randomImg = list[Math.floor(Math.random() * list.length)];
    setThumbnail(randomImg);
    addNotification('Foto mockup produk digital ditambahkan!', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbnail(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      addNotification('Foto produk berhasil diunggah!', 'success');
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures(prev => [...prev, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      addNotification('Mohon lengkapi judul produk digital', 'error');
      return;
    }
    if (price <= 0) {
      addNotification('Mohon isi harga produk dengan benar', 'error');
      return;
    }
    if (!shortDescription.trim()) {
      addNotification('Mohon isi deskripsi singkat produk', 'error');
      return;
    }

    createProduct({
      title,
      price,
      category,
      categoryName: getCategoryName(category),
      shortDescription,
      fullDescription: fullDescription || shortDescription,
      fileUrl: fileUrl || 'https://example.com/download-link.zip',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      features,
    });

    addNotification('Produk digital sukses diunggah ke katalog Marketplace!', 'success');
    navigate('marketplace');
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Upper Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeftCircle className="w-5 h-5 text-slate-500" />
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="text-right">
          <h2 className="text-sm font-bold text-slate-800">Unggah Produk Marketplace</h2>
          <p className="text-[10px] text-slate-400 font-medium">Halaman Penjualan Produk Digital & Lisensi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-slate-950 text-white px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center font-bold text-navy">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Terbitkan Produk Digital Baru</h3>
              <p className="text-xs text-slate-400 font-normal">Buat listing penjualan digital untuk Canva template, Ebook, Source Code, dll.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Produk *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Canva Template Feed Instagram Toko Online Minimalis"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Digital *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategorySlug)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="template">Template Design</option>
                  <option value="ebook">Ebook & File PDF</option>
                  <option value="software">Software & Automation</option>
                  <option value="website">Source Code Web</option>
                  <option value="video">Video Asset / Preset</option>
                  <option value="course">Video Course / Kursus</option>
                  <option value="lainnya">Kategori Lainnya</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Harga Jual (Rupiah) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-400">Rp</span>
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="49000"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Ringkas *</label>
              <input
                type="text"
                required
                placeholder="Tulis ringkasan singkat produk dalam 1 kalimat (max 100 karakter)"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Spesifikasi & Detail Produk</label>
              <textarea
                rows={5}
                placeholder="Tuliskan petunjuk instalasi, apa saja file yang didapat, benefit produk, dll..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
              ></textarea>
            </div>

            {/* File Download Link */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Link Download File (Google Drive/Dropbox) *</label>
              <div className="relative">
                <Link className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/drive/folders/sample"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-normal">Tautan ini akan diberikan secara instan & aman kepada pembeli setelah pembayaran divalidasi gateway.</p>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Foto Cover Produk Cover *</label>
              <div className="flex gap-4 items-center">
                <input
                  type="file"
                  id="product-file-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <div 
                  onClick={() => document.getElementById('product-file-upload')?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-all flex-1"
                >
                  <ImageIcon className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-[11px] font-bold text-slate-800 mt-1">Pilih File dari Komputer</p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAddMockPhoto}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[10px] flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Gunakan Cover Mockup
                  </button>
                </div>
              </div>
            </div>

            {/* Features tags builder */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Spesifikasi / Keunggulan Produk</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: Format File Figma (.fig)"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="bg-slate-900 text-white px-4 rounded-xl text-xs font-bold hover:bg-slate-800 shrink-0"
                >
                  Tambah
                </button>
              </div>

              {features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {features.map((feat, idx) => (
                    <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                      {feat}
                      <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-slate-400 hover:text-slate-950 font-bold ml-0.5">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Terbitkan ke Marketplace
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold fill-gold" /> Pratinjau Card Marketplace
              </h4>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">
                Live Card
              </span>
            </div>

            {/* Live Render Product Card */}
            <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col pointer-events-none">
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                {thumbnail ? (
                  <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <span className="text-[10px] mt-1 font-medium">Belum ada cover</span>
                  </div>
                )}
                
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-navy text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    NEW
                  </span>
                </div>

                <div className="absolute bottom-2 left-2.5">
                  <span className="bg-white/95 text-slate-900 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs capitalize">
                    {getCategoryName(category)}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                    {title || 'Judul Produk Digital Anda'}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed font-normal">
                    {shortDescription || 'Deskripsi singkat produk digital.'}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="font-bold text-amber-500">⭐ 5.0 <span className="text-slate-400 font-normal">(0)</span></span>
                    <span>0 terjual</span>
                  </div>

                  <div className="font-black text-sm text-slate-900">
                    {formatRupiah(price)}
                  </div>
                </div>
              </div>
            </div>

            {/* Features bullet preview */}
            {features.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                <div className="font-bold text-[10px] text-slate-400 uppercase">Fitur yang Didapat Pembeli</div>
                <ul className="space-y-1">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5 font-medium text-slate-700 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
