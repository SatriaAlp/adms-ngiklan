import React, { useState } from 'react';
import { Store, Mail, Phone, User, Lock, UploadCloud, MapPin, CheckCircle2, ChevronRight, Check, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/apiClient';

export const MerchantRegistrationView: React.FC = () => {
  const { navigate, addNotification } = useApp();
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    storeName: '',
    storeUsername: '',
    category: '',
    description: '',
    logo: null as File | null,
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName) newErrors.fullName = 'Nama Lengkap wajib diisi';
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.whatsapp) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    } else if (!/^[0-9]{9,15}$/.test(formData.whatsapp.replace(/[^0-9]/g, ''))) {
      newErrors.whatsapp = 'Format nomor WhatsApp tidak valid';
    }

    if (!formData.storeName) newErrors.storeName = 'Nama Toko wajib diisi';
    if (!formData.storeUsername) {
      newErrors.storeUsername = 'Username Toko wajib diisi';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.storeUsername)) {
      newErrors.storeUsername = 'Username hanya boleh huruf, angka, dan underscore';
    }

    if (!formData.category) newErrors.category = 'Kategori wajib dipilih';
    if (!formData.description) newErrors.description = 'Deskripsi Toko wajib diisi';
    if (!formData.address) newErrors.address = 'Alamat / Kota wajib diisi';
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi Password tidak cocok';
    }

    if (!formData.logo) {
      newErrors.logo = 'Logo Toko wajib diunggah';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Anda harus menyetujui Syarat & Ketentuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({...prev, logo: 'Format logo harus JPG, PNG, atau WEBP'}));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({...prev, logo: 'Ukuran maksimal 2MB'}));
        return;
      }
      setFormData(prev => ({ ...prev, logo: file }));
      setErrors(prev => {
        const newErr = {...prev};
        delete newErr.logo;
        return newErr;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await api.registerMerchant({
          fullName: formData.fullName,
          email: formData.email,
          whatsapp: formData.whatsapp,
          storeName: formData.storeName,
          storeUsername: formData.storeUsername,
          category: formData.category,
          description: formData.description,
          address: formData.address,
        });
        setIsSubmitted(true);
      } catch (error) {
        addNotification('Gagal mendaftarkan merchant, silakan coba lagi', 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      addNotification('Mohon periksa kembali form Anda', 'error');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 sm:p-10 text-center border-b border-slate-100">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy mb-3">Pengajuan Merchant Berhasil</h2>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto leading-relaxed text-sm">
              Terima kasih telah mendaftar. Data Anda sedang diproses untuk verifikasi oleh Admin ADMS. Proses ini biasanya memakan waktu 1x24 jam kerja.
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-50 text-amber-700 font-bold border border-amber-200">
              <span className="text-sm">Status:</span>
              <span className="uppercase tracking-widest px-2 py-1 bg-amber-100 rounded-md text-amber-800 text-[10px]">Pending Verification</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-slate-50 space-y-8">
            <h3 className="text-lg font-black text-navy flex items-center gap-2 mb-2">
              <Store className="w-5 h-5 text-cyan-500" />
              Detail Pengajuan Anda
            </h3>
            
            {/* Account Info */}
            <div>
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Informasi Akun</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Nama Lengkap</span>
                  <span className="font-bold text-slate-800 text-sm">{formData.fullName}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Email Aktif</span>
                  <span className="font-bold text-slate-800 text-sm">{formData.email}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Nomor WhatsApp</span>
                  <span className="font-bold text-slate-800 text-sm">{formData.whatsapp}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Tanggal Pengajuan</span>
                  <span className="font-bold text-slate-800 text-sm">{new Date().toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Store Info */}
            <div>
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Informasi Toko</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="sm:col-span-2 flex items-center gap-4 mb-2">
                  {formData.logo && (
                    <img 
                      src={URL.createObjectURL(formData.logo)} 
                      alt="Logo Toko" 
                      className="w-16 h-16 rounded-xl border border-slate-200 object-cover"
                    />
                  )}
                  <div>
                    <span className="block text-[11px] text-slate-500 mb-1">Logo Toko</span>
                    <span className="font-bold text-slate-800 text-sm">{formData.logo?.name || 'Terunggah'}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Nama Toko</span>
                  <span className="font-bold text-slate-800 text-sm">{formData.storeName}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Username / Slug</span>
                  <span className="font-bold text-slate-800 text-sm">@{formData.storeUsername}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Kategori Utama</span>
                  <span className="font-bold text-slate-800 text-sm">{formData.category}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Alamat / Kota</span>
                  <span className="font-bold text-slate-800 text-sm">{formData.address}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-[11px] text-slate-500 mb-1.5">Deskripsi Toko</span>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {formData.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => navigate('home')}
                className="px-8 py-3.5 bg-navy hover:bg-navy/90 text-white font-bold rounded-xl transition-all shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <button onClick={() => navigate('home')} className="text-sm font-bold text-slate-500 hover:text-cyan-600 flex items-center gap-1 mb-4 transition-colors">
          <span>Beranda</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-navy">Daftar Merchant</span>
        </button>
        <h1 className="text-3xl font-black text-navy">Daftar Sebagai Merchant</h1>
        <p className="text-slate-500 mt-2">Bergabung dengan ekosistem digital ADMS dan mulai berjualan.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Section 1: Informasi Personal */}
          <div>
            <h3 className="font-bold text-lg text-navy mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-5 h-5 text-cyan-500" />
              Informasi Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.fullName ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                  placeholder="Sesuai KTP"
                />
                {errors.fullName && <p className="text-rose-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Aktif <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                    placeholder="contoh@email.com"
                  />
                </div>
                {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor WhatsApp <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.whatsapp ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                    placeholder="08123456789"
                  />
                </div>
                {errors.whatsapp && <p className="text-rose-500 text-xs mt-1">{errors.whatsapp}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Informasi Toko */}
          <div>
            <h3 className="font-bold text-lg text-navy mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Store className="w-5 h-5 text-cyan-500" />
              Detail Toko / Agensi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Toko <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.storeName ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                  placeholder="Contoh: Digital Studio"
                />
                {errors.storeName && <p className="text-rose-500 text-xs mt-1">{errors.storeName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Username Toko <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.storeUsername}
                  onChange={(e) => setFormData({...formData, storeUsername: e.target.value.toLowerCase()})}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.storeUsername ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                  placeholder="digital_studio"
                />
                <p className="text-[10px] text-slate-500 mt-1">adms.com/merchant/{formData.storeUsername || 'username'}</p>
                {errors.storeUsername && <p className="text-rose-500 text-xs mt-1">{errors.storeUsername}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori Utama <span className="text-rose-500">*</span></label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.category ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Template & Design">Template & Design</option>
                  <option value="Source Code">Source Code / Web Script</option>
                  <option value="E-Book & Course">E-Book & Course</option>
                  <option value="Audio & Video">Audio & Video Asset</option>
                  <option value="Marketing Tool">Marketing Tool</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                {errors.category && <p className="text-rose-500 text-xs mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat / Kota <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.address ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                    placeholder="Contoh: Jakarta Selatan"
                  />
                </div>
                {errors.address && <p className="text-rose-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Singkat Toko <span className="text-rose-500">*</span></label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.description ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none`}
                  placeholder="Ceritakan sedikit tentang toko dan produk yang Anda jual..."
                />
                {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Logo Toko <span className="text-rose-500">*</span></label>
                <div className={`border-2 border-dashed ${errors.logo ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} rounded-2xl p-6 text-center hover:bg-slate-100 transition-colors relative cursor-pointer group`}>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/webp" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {formData.logo ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      <span className="text-sm font-bold text-slate-700">{formData.logo.name}</span>
                      <span className="text-xs text-cyan-600 group-hover:underline">Ganti File</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <UploadCloud className="w-6 h-6 text-cyan-500" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Klik atau drag & drop file logo</span>
                      <span className="text-xs text-slate-500">Hanya JPG, PNG, atau WEBP. Maks 2MB.</span>
                    </div>
                  )}
                </div>
                {errors.logo && <p className="text-rose-500 text-xs mt-1">{errors.logo}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Keamanan */}
          <div>
            <h3 className="font-bold text-lg text-navy mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Lock className="w-5 h-5 text-cyan-500" />
              Keamanan Akun
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${errors.password ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Konfirmasi Password <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${errors.confirmPassword ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                    placeholder="Ketik ulang password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-rose-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input 
                  type="checkbox" 
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                  className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-cyan-500 checked:border-cyan-500 transition-colors cursor-pointer"
                />
                <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-slate-600 select-none">
                Saya menyetujui <a href="#" className="text-cyan-600 font-bold hover:underline">Syarat & Ketentuan</a> serta <a href="#" className="text-cyan-600 font-bold hover:underline">Kebijakan Privasi</a> ADMS.
              </span>
            </label>
            {errors.agreeTerms && <p className="text-rose-500 text-xs mt-1 ml-8">{errors.agreeTerms}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-navy hover:bg-navy/90 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Memproses Data...</span>
            ) : (
              <>
                <Store className="w-5 h-5" />
                <span>Daftar Sebagai Merchant</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
