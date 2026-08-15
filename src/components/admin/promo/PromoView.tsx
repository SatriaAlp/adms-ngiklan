import React, { useState, useEffect } from 'react';
import { 
  Tag, Plus, Search, Filter, Percent, DollarSign, Calendar, Edit, Trash2, Power, PowerOff
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const PromoView: React.FC = () => {
  const { addNotification } = useApp();
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE', // PERCENTAGE, FIXED
    value: 0,
    maxDiscount: 0,
    minPurchase: 0,
    quota: 100,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
    isActive: true
  });

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const data = await api.getPromos();
      setPromos(data);
    } catch (error) {
      addNotification('Gagal memuat data promo', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      addNotification('Kode promo wajib diisi', 'error');
      return;
    }

    try {
      await api.createPromo({
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      });
      addNotification('Promo berhasil dibuat', 'success');
      setModalOpen(false);
      fetchPromos();
    } catch (error) {
      addNotification('Terjadi kesalahan saat menyimpan promo', 'error');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.togglePromoStatus(id, !currentStatus);
      addNotification(`Promo berhasil di${!currentStatus ? 'aktifkan' : 'nonaktifkan'}`, 'success');
      fetchPromos();
    } catch (error) {
      addNotification('Gagal mengubah status promo', 'error');
    }
  };

  const filteredPromos = promos.filter(p => p.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Manajemen Promo</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola kode voucher dan diskon platform-wide.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({
              code: '', type: 'PERCENTAGE', value: 0, maxDiscount: 0, minPurchase: 0, quota: 100,
              startDate: new Date().toISOString().slice(0, 16),
              endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
              isActive: true
            });
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-navy text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Promo Baru
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode promo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Grid of Promos */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredPromos.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Tag className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada promo</h3>
          <p className="text-sm text-slate-500">Silakan buat promo baru untuk menarik pelanggan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromos.map((promo) => (
            <div key={promo.id} className={`bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all ${
              promo.isActive ? 'border-emerald-200 hover:shadow-md' : 'border-slate-200 opacity-75'
            }`}>
              <div className={`p-4 border-b flex justify-between items-center ${promo.isActive ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  {promo.type === 'PERCENTAGE' ? (
                    <Percent className={`w-5 h-5 ${promo.isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                  ) : (
                    <DollarSign className={`w-5 h-5 ${promo.isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                  )}
                  <h3 className={`font-black text-lg tracking-wider ${promo.isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {promo.code}
                  </h3>
                </div>
                <button 
                  onClick={() => handleToggleStatus(promo.id, promo.isActive)}
                  className={`p-1.5 rounded-md transition-colors ${promo.isActive ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                  title={promo.isActive ? "Nonaktifkan" : "Aktifkan"}
                >
                  {promo.isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="text-center mb-2">
                  <span className="block text-3xl font-black text-navy mb-1">
                    {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `Rp${promo.value.toLocaleString('id-ID')}`}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {promo.type === 'PERCENTAGE' ? 'Diskon Persentase' : 'Potongan Harga Tetap'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <span>Min. Belanja:</span>
                    <span className="font-bold text-navy">Rp{promo.minPurchase.toLocaleString('id-ID')}</span>
                  </div>
                  {promo.type === 'PERCENTAGE' && promo.maxDiscount > 0 && (
                    <div className="flex justify-between">
                      <span>Maks. Diskon:</span>
                      <span className="font-bold text-navy">Rp{promo.maxDiscount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Berlaku Hingga:</span>
                    <span className="font-bold text-slate-700">{new Date(promo.endDate).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Pemakaian:</span>
                    <span className="font-bold text-cyan-600">{promo.used} / {promo.quota}</span>
                  </div>
                  
                  {/* Progress bar for quota */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500" 
                      style={{ width: `${(promo.used / promo.quota) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-navy mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-cyan-500" />
              Buat Promo Baru
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Kode Promo</label>
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '')})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-lg font-bold tracking-widest text-navy"
                    placeholder="CONTOH: MERDEKA50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tipe Diskon</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="PERCENTAGE">Persentase (%)</option>
                    <option value="FIXED">Potongan Tetap (Rp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nilai ({formData.type === 'PERCENTAGE' ? '%' : 'Rp'})
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.value || ''}
                    onChange={(e) => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                {formData.type === 'PERCENTAGE' && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Maks. Diskon (Rp)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.maxDiscount || ''}
                      onChange={(e) => setFormData({...formData, maxDiscount: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="0 = Tanpa batas"
                    />
                  </div>
                )}

                <div className={`col-span-2 ${formData.type === 'PERCENTAGE' ? 'sm:col-span-1' : ''}`}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Min. Belanja (Rp)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.minPurchase || ''}
                    onChange={(e) => setFormData({...formData, minPurchase: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Kuota Pemakaian</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.quota || ''}
                    onChange={(e) => setFormData({...formData, quota: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mulai Berlaku</label>
                  <input 
                    type="datetime-local" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Berakhir Pada</label>
                  <input 
                    type="datetime-local" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-6 flex items-center gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-navy text-white font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Buat Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
