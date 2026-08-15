import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Megaphone, Sparkles, CheckCircle2, Image as ImageIcon, 
  ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Zap, 
  MapPin, Phone, Mail, User, Info, FileText, Check, ArrowLeftCircle,
  Car, Smartphone, Home, Briefcase, Tv, Heart, PlusCircle
} from 'lucide-react';
import { UserRole } from '../../types';

export const PostFreeAdView: React.FC = () => {
  const { 
    createAd, 
    categories, 
    adPackages, 
    currentUser, 
    addNotification,
    isLoggedIn,
    setIsLoginModalOpen,
    setPendingAdPublishPayload,
    pendingAdPublishPayload,
    navigate,
    ads
  } = useApp();

  // Landing page state
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // Multi-step state
  const [step, setStep] = useState<number>(1);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Mobil');
  const [subcategory, setSubcategory] = useState('');
  const [condition, setCondition] = useState<'baru' | 'bekas'>('bekas');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [provinsi, setProvinsi] = useState('Jawa Barat');
  const [kota, setKota] = useState('Bandung');
  const [kecamatan, setKecamatan] = useState('');
  const [contactName, setContactName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  
  // Package/Publishing states
  const [adType, setAdType] = useState<'free' | 'premium'>('free');
  const [selectedPackageId, setSelectedPackageId] = useState(adPackages[0]?.id || 'pkg-1');

  // Pre-fill contact details from current user
  useEffect(() => {
    if (currentUser) {
      setContactName(currentUser.name || '');
      setWhatsapp(currentUser.phone || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Listen for login completion to advance to step 7
  useEffect(() => {
    if (isLoggedIn && step === 6 && !pendingAdPublishPayload) {
      setStep(7);
    }
  }, [isLoggedIn, step, pendingAdPublishPayload]);

  // Preset location listings
  const locationsData: { [prov: string]: string[] } = {
    'DKI Jakarta': ['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Barat', 'Jakarta Utara', 'Jakarta Timur'],
    'Jawa Barat': ['Bandung', 'Bekasi', 'Depok', 'Bogor', 'Tangerang', 'Cirebon'],
    'Jawa Tengah': ['Semarang', 'Surakarta', 'Yogyakarta', 'Magelang', 'Solo'],
    'Jawa Timur': ['Surabaya', 'Malang', 'Kediri', 'Madiun', 'Sidoarjo'],
    'Bali': ['Denpasar', 'Kuta', 'Seminyak', 'Ubud', 'Jimbaran']
  };

  // Mock Unsplash image search library by category to make demo look premium
  const mockupImagesByCategory: { [cat: string]: string[] } = {
    'Mobil': [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80'
    ],
    'Motor': [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&auto=format&fit=crop&q=80'
    ],
    'Handphone': [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849906660-4d447af5c6a1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80'
    ],
    'Properti': [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
    ]
  };

  const handleAddMockPhoto = () => {
    const list = mockupImagesByCategory[category] || [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80'
    ];
    const nextImg = list[images.length % list.length];
    setImages(prev => [...prev, nextImg]);
    addNotification('Foto produk mockup berhasil ditambahkan!', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      addNotification('Foto berhasil diunggah dari perangkat Anda!', 'success');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim()) {
        addNotification('Mohon isi judul iklan', 'error');
        return;
      }
      if (price <= 0) {
        addNotification('Mohon isi harga produk dengan benar', 'error');
        return;
      }
    }
    if (step === 2 && !description.trim()) {
      addNotification('Mohon isi deskripsi lengkap iklan', 'error');
      return;
    }
    if (step === 3 && images.length === 0) {
      addNotification('Mohon tambahkan minimal 1 foto produk', 'error');
      return;
    }
    if (step === 5) {
      if (!contactName.trim() || !whatsapp.trim() || !email.trim()) {
        addNotification('Mohon lengkapi informasi kontak pengiklan', 'error');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handlePublish = (status: 'pending' | 'draft') => {
    const payload = {
      title,
      category: category.toLowerCase(),
      subcategory: subcategory || undefined,
      condition,
      price,
      description,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=80'],
      location: `${kota}, ${provinsi}`,
      contactName,
      whatsapp,
      websiteUrl: email,
      type: adType,
      status,
      packageName: adType === 'free' ? 'Iklan Gratis' : adPackages.find(p => p.id === selectedPackageId)?.name || 'Paket Premium',
      viewsCount: 0,
      clicksCount: 0,
    };

    if (!isLoggedIn) {
      setPendingAdPublishPayload(payload);
      setIsLoginModalOpen(true);
      addNotification('Silakan login terlebih dahulu untuk menyelesaikan pemasangan iklan.', 'warning');
      return;
    }

    createAd(payload);
    setStep(7);
    addNotification('Iklan berhasil dikirim dan siap ditinjau oleh Admin!', 'success');
  };

  if (showLanding) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-navy-dark via-navy to-navy-light border border-navy-dark p-8 sm:p-12 overflow-hidden shadow-2xl text-white">
          {/* Decorative glows */}
          <div className="absolute -top-20 -left-20 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none opacity-40"></div>
          <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[90px] pointer-events-none opacity-30"></div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 backdrop-blur-md text-gold text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> Pasang Iklan Baris Klasifikasi Gratis
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Pasang Iklan Anda <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent font-black">Sekarang Juga!</span>
            </h1>

            <p className="text-slate-350 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              Jangkau ribuan calon pembeli potensial di seluruh Indonesia dengan cepat, mudah, dan Rp0 biaya pasang! Iklan Anda akan ditampilkan di direktori classifieds kami secara instan.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setShowLanding(false)}
                className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-navy font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <PlusCircle className="w-5 h-5 text-navy" />
                <span>Mulai Pasang Iklan Gratis</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section (inspired by ngiklan.oketheme.com Kategori) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Kategori Iklan Baris</h3>
              <p className="text-xs text-slate-500 font-medium">Pilih kategori iklan yang sesuai untuk produk atau jasa Anda.</p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 w-fit">
              Classifieds Categories
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'Mobil', icon: Car, color: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50' },
              { name: 'Motor', icon: Car, color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50' },
              { name: 'Handphone', icon: Smartphone, color: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100/50' },
              { name: 'Properti', icon: Home, color: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/50' },
              { name: 'Elektronik', icon: Tv, color: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/50' },
              { name: 'Jasa', icon: Briefcase, color: 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100/50' },
              { name: 'Rumah Tangga', icon: Home, color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100/50' },
              { name: 'Hobi', icon: Heart, color: 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100/50' },
            ].map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCategory(cat.name === 'Elektronik' || cat.name === 'Rumah Tangga' || cat.name === 'Hobi' ? 'Handphone' : cat.name);
                  setShowLanding(false);
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 group cursor-pointer ${cat.color}`}
              >
                <div className="p-3 rounded-xl bg-white shadow-xs group-hover:scale-110 transition-transform">
                  <cat.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold mt-2.5 whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-500 border border-amber-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Iklan Gratis Rp0</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Pasang iklan Anda secara gratis tanpa dipungut biaya sepeser pun selama 30 hari penuh.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-50 text-cyan-500 border border-cyan-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Moderasi Cepat & Aman</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Setiap iklan ditinjau secara berkala untuk menjaga keaslian produk dan menghindari penipuan.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 border border-emerald-100">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Premium Boost</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Tingkatkan iklan Anda ke tingkat Premium VIP Sponsor agar langsung tampil di beranda depan.</p>
            </div>
          </div>
        </div>

        {/* Latest Ads Listing (inspired by ngiklan.oketheme.com Iklan Terbaru) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Iklan Klasifikasi Terbaru</h3>
              <p className="text-xs text-slate-500 font-medium">Lihat apa yang dipromosikan orang lain saat ini.</p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 w-fit">
              Latest Classified Ads
            </span>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl">
              <p className="text-xs text-slate-500 font-medium">Belum ada iklan baris terpasang.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ads.slice(0, 8).map((ad) => (
                <div key={ad.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                  <div className="relative h-40 bg-slate-100">
                    <img 
                      src={ad.images?.[0] || 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=80'} 
                      alt={ad.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2.5 left-2.5">
                      {ad.type === 'premium' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                          VIP Sponsor
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-950/80 text-white font-bold text-[9px] uppercase tracking-wider shadow-sm">
                          Gratis
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-white/95 text-slate-900 border border-slate-200 font-bold text-[9px] shadow-sm capitalize">
                      Kondisi: {ad.condition || 'bekas'}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                      {ad.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 truncate" title={ad.title}>
                      {ad.title}
                    </h4>
                    <div className="text-sm font-black text-slate-900">
                      Rp{ad.price.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <div className="flex items-center gap-1 truncate max-w-[75%]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{ad.location || 'Indonesia'}</span>
                    </div>
                    <span className="text-cyan-600 uppercase tracking-widest text-[9px] font-black shrink-0">
                      Iklan Baris
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Upper Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowLanding(true)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeftCircle className="w-5 h-5 text-slate-500" />
          <span>Kembali ke Halaman Pemasangan</span>
        </button>

        <div className="text-right">
          <h2 className="text-sm font-bold text-slate-800">Pembuat Iklan Gratis</h2>
          <p className="text-[10px] text-slate-400 font-medium">Halaman Khusus Iklan Baris Klasifikasi</p>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: The Form Wizard */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between min-h-[500px]">
          
          {/* Form Header */}
          <div>
            <div className="bg-slate-950 text-white px-6 py-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center font-bold text-navy">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Buat Iklan Baris Baru</h3>
                <p className="text-xs text-slate-400 font-normal">Isi semua detail di bawah untuk mempromosikan produk Anda gratis.</p>
              </div>
            </div>

            {/* Progress Stepper Bar */}
            {step < 7 && (
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between overflow-x-auto gap-4">
                {[
                  { num: 1, label: 'Informasi' },
                  { num: 2, label: 'Deskripsi' },
                  { num: 3, label: 'Foto' },
                  { num: 4, label: 'Lokasi' },
                  { num: 5, label: 'Kontak' },
                  { num: 6, label: 'Pratinjau' }
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-1.5 shrink-0">
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                        step === s.num 
                          ? 'bg-slate-900 text-white' 
                          : step > s.num 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {step > s.num ? <Check className="w-3 h-3 text-white" /> : s.num}
                    </div>
                    <span className={`text-[10px] font-bold ${step === s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Stepper Wizard Contents */}
            <div className="p-6 space-y-5">
              
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Info className="w-4 h-4 text-cyan-600" />
                    Langkah 1: Informasi Dasar Iklan
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Iklan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Toyota Avanza 2022 Siap Pakai Murah"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      >
                        <option value="Mobil">Mobil</option>
                        <option value="Motor">Motor</option>
                        <option value="Handphone">Handphone</option>
                        <option value="Properti">Properti</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Subkategori</label>
                      <input
                        type="text"
                        placeholder="Contoh: Hatchback, Mobil Bekas"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kondisi Barang *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCondition('baru')}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          condition === 'baru' 
                            ? 'bg-slate-900 border-slate-900 text-white' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Baru
                      </button>
                      <button
                        type="button"
                        onClick={() => setCondition('bekas')}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          condition === 'bekas' 
                            ? 'bg-slate-900 border-slate-900 text-white' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Bekas
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Harga (Rupiah) *</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 185000000"
                      value={price || ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <FileText className="w-4 h-4 text-cyan-600" />
                    Langkah 2: Deskripsi Lengkap Iklan
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Lengkap *</label>
                    <textarea
                      required
                      rows={8}
                      placeholder="Tuliskan spesifikasi lengkap, kelebihan, riwayat pemakaian, atau penawaran produk Anda secara mendetail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <ImageIcon className="w-4 h-4 text-cyan-600" />
                    Langkah 3: Unggah Foto Produk
                  </h4>

                  <input
                    type="file"
                    id="page-file-upload"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div 
                    onClick={() => document.getElementById('page-file-upload')?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-2xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-all group"
                  >
                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-slate-800 mt-2">Pilih dari Perangkat Anda atau Seret & lepas</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Mendukung format JPG, PNG, WEBP (maks. 5MB per file)</p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleAddMockPhoto}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[10px] flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Gunakan Foto Mockup Otomatis
                    </button>
                  </div>

                  {images.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Foto Tersimpan ({images.length})</label>
                      <div className="grid grid-cols-4 gap-3">
                        {images.map((imgUrl, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 group h-20">
                            <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => handleRemovePhoto(i)}
                              className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    Langkah 4: Lokasi Penjualan
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Provinsi *</label>
                      <select
                        value={provinsi}
                        onChange={(e) => {
                          setProvinsi(e.target.value);
                          setKota(locationsData[e.target.value]?.[0] || '');
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      >
                        {Object.keys(locationsData).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kota / Kabupaten *</label>
                      <select
                        value={kota}
                        onChange={(e) => setKota(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      >
                        {(locationsData[provinsi] || []).map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kecamatan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Lengkong, Sumur Bandung"
                      value={kecamatan}
                      onChange={(e) => setKecamatan(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Phone className="w-4 h-4 text-cyan-600" />
                    Langkah 5: Kontak Pengiklan
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penjual *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6 */}
              {step === 6 && (
                <div className="space-y-5 animate-fade-in">
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    Langkah 6: Pilih Paket Iklan Baris
                  </h4>

                  {/* Package Chooser */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setAdType('free')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          adType === 'free'
                            ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            <span className="font-bold text-xs">Iklan Gratis Rp0</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            30 Hari
                          </span>
                        </div>
                        <p className={`text-[10px] mt-1.5 leading-relaxed ${adType === 'free' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Iklan standar di listing pencarian. Melalui moderasi admin terlebih dahulu.
                        </p>
                      </div>

                      <div
                        onClick={() => setAdType('premium')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          adType === 'premium'
                            ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-cyan-400" />
                            <span className="font-bold text-xs">Premium Boost</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold animate-pulse">
                            VIP Sponsor
                          </span>
                        </div>
                        <p className={`text-[10px] mt-1.5 leading-relaxed ${adType === 'premium' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Penempatan prioritas tinggi di beranda depan untuk penjualan ekstra cepat.
                        </p>
                      </div>
                    </div>

                    {adType === 'premium' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <label className="block text-[10px] font-bold text-slate-700 uppercase">
                          Pilih Paket Sponsor
                        </label>
                        <select
                          value={selectedPackageId}
                          onChange={(e) => setSelectedPackageId(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
                        >
                          {adPackages.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                              {pkg.name} - Rp{pkg.price.toLocaleString('id-ID')} / {pkg.durationDays} hari
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* STEP 7 */}
              {step === 7 && (
                <div className="space-y-6 py-10 text-center animate-fade-in flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-xl text-slate-900">Iklan Anda Berhasil Dikirim!</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-normal">
                      Iklan gratis Anda saat ini sedang ditinjau oleh tim moderasi kami. Anda akan mendapatkan notifikasi setelah iklan tayang secara publik.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 w-full max-w-md px-4">
                    <button
                      onClick={() => navigate('iklan-gratis')}
                      className="w-full px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <span>Lanjutkan ke Semua Iklan Gratis</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => navigate('ads')}
                      className="w-full px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-850 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
                    >
                      <span>Kelola Iklan di Dashboard</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Footer Controls */}
          {step < 7 && (
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between mt-auto">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {step < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Lanjutkan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePublish('pending')}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Publikasikan Iklan Gratis
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Premium Card Preview Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold fill-gold" /> Pratinjau Langsung
              </h4>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">
                Live Card
              </span>
            </div>

            {/* The Live Render Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="relative h-44 overflow-hidden bg-slate-100">
                {images.length > 0 ? (
                  <img src={images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <span className="text-[10px] mt-1 font-medium">Belum ada foto</span>
                  </div>
                )}
                
                <div className="absolute top-2.5 left-2.5">
                  {adType === 'premium' ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                      VIP Sponsor
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-950/90 text-white font-bold text-[9px] uppercase tracking-wider">
                      Gratis
                    </span>
                  )}
                </div>

                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-white/95 text-slate-900 border border-slate-200 font-bold text-[9px] shadow-sm capitalize">
                  Kondisi: {condition}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  {category} {subcategory && `/ {subcategory}`}
                </span>

                <h4 className="font-bold text-sm text-slate-900 truncate">
                  {title || 'Judul Iklan Anda'}
                </h4>

                <div className="text-base font-black text-slate-900 pt-0.5">
                  Rp{price.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                <div className="flex items-center gap-1 truncate max-w-[70%]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{kota}, {provinsi}</span>
                </div>
                <span className="text-cyan-600 uppercase tracking-widest text-[9px] font-black">
                  Iklan Baris
                </span>
              </div>
            </div>

            {/* Description Preview snippet */}
            {description && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-[10px] text-slate-400 uppercase">Cuplikan Deskripsi</div>
                <p className="line-clamp-3 leading-relaxed font-normal">{description}</p>
              </div>
            )}
            
            {/* Contact Preview snippet */}
            {contactName && (
              <div className="bg-slate-950 p-3.5 rounded-2xl text-white flex items-center justify-between text-[10px]">
                <div>
                  <div className="text-slate-400 font-medium">Hubungi</div>
                  <div className="font-bold text-xs truncate max-w-[120px]">{contactName}</div>
                </div>
                {whatsapp && (
                  <div className="px-3 py-1 rounded bg-emerald-600 text-white font-bold text-[9px] shrink-0">
                    WhatsApp Aktif
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
