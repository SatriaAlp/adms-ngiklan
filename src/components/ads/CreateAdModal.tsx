import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Megaphone, Sparkles, CheckCircle2, Image as ImageIcon, 
  ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Zap, 
  MapPin, Phone, Mail, User, Info, FileText, Check 
} from 'lucide-react';
import { UserRole } from '../../types';

export const CreateAdModal: React.FC = () => {
  const { 
    isCreateAdModalOpen, 
    setIsCreateAdModalOpen, 
    createAd, 
    categories, 
    adPackages, 
    currentUser, 
    addNotification,
    isLoggedIn,
    setIsLoginModalOpen,
    setPendingAdPublishPayload,
    navigate,
    setDashboardSubTab
  } = useApp();

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
  }, [currentUser, isCreateAdModalOpen]);

  if (!isCreateAdModalOpen) return null;

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
    // Pick from library based on selected category, or fallback to general tech
    const list = mockupImagesByCategory[category] || [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1557838923-2985c318be48?w=600&auto=format&fit=crop&q=80',
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
        reader.readAsDataURL(file as Blob);
      });
      addNotification('Foto berhasil diunggah dari perangkat Anda!', 'success');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    // Validations
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
    setIsCreateAdModalOpen(false);
    
    // Redirect to ads catalog in dashboard
    setDashboardSubTab('ads-catalog');
    navigate('dashboard');
    
    // Reset Form
    setStep(1);
    setTitle('');
    setPrice(0);
    setDescription('');
    setImages([]);
    setSubcategory('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 transform transition-all animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Pasang Iklan Klasifikasi</h3>
              <p className="text-xs text-slate-400 font-medium">Buat iklan berkualitas premium di PT. ADMS</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateAdModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Breadcrumb / Progress Bar */}
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
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  step === s.num 
                    ? 'bg-slate-900 text-white' 
                    : step > s.num 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s.num ? <Check className="w-3 h-3 text-white" /> : s.num}
              </div>
              <span className={`text-[11px] font-bold ${step === s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* STEP 1: Informasi Iklan */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
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

          {/* STEP 2: Deskripsi Iklan */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-600" />
                Langkah 2: Deskripsi & Rincian Produk
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Lengkap *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Tuliskan spesifikasi lengkap, kelebihan, riwayat pemakaian, atau penawaran produk Anda secara mendetail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Foto */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-cyan-600" />
                Langkah 3: Unggah Foto Produk
              </h4>

              {/* Hidden file input selector */}
              <input
                type="file"
                id="ad-file-upload"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Drag and Drop / Choose File Card */}
              <div 
                onClick={() => document.getElementById('ad-file-upload')?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-all group"
              >
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800 mt-2">Pilih dari Perangkat Anda atau Seret & lepas</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Mendukung format JPG, PNG, WEBP (maks. 5MB per file)</p>
              </div>

              {/* Option to generate mockup instead */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddMockPhoto();
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[10px] flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Gunakan Foto Mockup Otomatis
                </button>
              </div>

              {/* Photo Preview List */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Foto Tersimpan ({images.length})</label>
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((imgUrl, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 group h-24">
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

          {/* STEP 4: Lokasi */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
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

          {/* STEP 5: Kontak */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-cyan-600" />
                Langkah 5: Kontak Pengiklan
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kontak Penjual *</label>
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

          {/* STEP 6: Pratinjau & Paket */}
          {step === 6 && (
            <div className="space-y-5 animate-fade-in">
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                Langkah 6: Pratinjau Listing Iklan Anda
              </h4>

              {/* Listing Card Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-4 items-start shadow-xs">
                {images.length > 0 && (
                  <img
                    src={images[0]}
                    alt="Preview"
                    className="w-24 h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                      {condition}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">{category}</span>
                  </div>
                  <h5 className="text-sm font-extrabold text-slate-900 mt-1 truncate">{title || 'Judul Iklan'}</h5>
                  <p className="text-sm font-black text-cyan-600 mt-0.5">Rp{price.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {kota}, {provinsi}
                  </p>
                </div>
              </div>

              {/* Package Chooser */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pilih Paket Iklan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setAdType('free')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      adType === 'free'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-xs">Iklan Gratis Rp0</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        Aktif 30 Hari
                      </span>
                    </div>
                    <p className={`text-[10px] mt-1 ${adType === 'free' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Iklan standar di listing pencarian. Melalui moderasi admin.
                    </p>
                  </div>

                  <div
                    onClick={() => setAdType('premium')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      adType === 'premium'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-xs">Premium Boost</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold animate-pulse">
                        Sponsor VIP
                      </span>
                    </div>
                    <p className={`text-[10px] mt-1 ${adType === 'premium' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Penempatan teratas di beranda utama & prioritas tinggi.
                    </p>
                  </div>
                </div>

                {adType === 'premium' && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase">
                      Pilih Paket Sponsor
                    </label>
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
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
        </div>

        {/* Form Footer Buttons */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
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
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                Lanjutkan
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handlePublish('draft')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                >
                  Simpan Draft
                </button>
                <button
                  type="button"
                  onClick={() => handlePublish('pending')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Publikasikan Iklan
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
