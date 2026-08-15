import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, FileText, Search, Filter, ShieldCheck, MapPin, Store, Mail, Phone, ExternalLink 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const MerchantVerificationView: React.FC = () => {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING, REJECTED, VERIFIED
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Detail Modal State
  const [selectedMerchant, setSelectedMerchant] = useState<any | null>(null);
  
  // Action Modal State
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    action: 'VERIFIED' | 'REJECTED';
    merchantId: string;
    merchantName: string;
    notes: string;
  } | null>(null);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const data = await api.getMerchants({ verificationStatus: activeTab });
      setMerchants(data);
    } catch (error) {
      addNotification('Gagal memuat data merchant', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [activeTab]);

  const handleVerificationAction = async () => {
    if (!actionModal) return;
    
    if (actionModal.action === 'REJECTED' && !actionModal.notes.trim()) {
      addNotification('Alasan penolakan wajib diisi', 'error');
      return;
    }

    try {
      await api.updateMerchantVerification(actionModal.merchantId, actionModal.action, actionModal.notes);
      addNotification(`Merchant berhasil di${actionModal.action === 'VERIFIED' ? 'verifikasi' : 'tolak'}`, 'success');
      setActionModal(null);
      setSelectedMerchant(null);
      fetchMerchants();
    } catch (error) {
      addNotification('Terjadi kesalahan sistem', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Merchant Verification</h2>
          <p className="text-slate-500 text-sm mt-1">Verifikasi pengajuan pendaftaran merchant baru.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex overflow-x-auto scrollbar-none">
        {['PENDING', 'VERIFIED', 'REJECTED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-navy text-white shadow-md'
                : 'text-slate-500 hover:text-navy hover:bg-slate-50'
            }`}
          >
            {tab === 'PENDING' ? 'Menunggu Review' : tab === 'VERIFIED' ? 'Disetujui' : 'Ditolak'}
          </button>
        ))}
      </div>

      {/* Grid of Pending Merchants */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : merchants.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada data {activeTab.toLowerCase()}</h3>
          <p className="text-sm text-slate-500">Semua pengajuan merchant sudah diverifikasi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((merchant) => (
            <div key={merchant.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <img 
                  src={merchant.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(merchant.name)}&background=e2e8f0&color=475569`} 
                  alt={merchant.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-navy truncate">{merchant.name}</h3>
                  <p className="text-xs text-slate-500 truncate">@{merchant.slug}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                  merchant.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                  merchant.verificationStatus === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {merchant.verificationStatus}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{merchant.owner?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{merchant.contactWhatsapp || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{merchant.location || '-'}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedMerchant(merchant)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Review Dokumen
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedMerchant(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md rounded-t-2xl z-10">
              <h3 className="text-xl font-black text-navy flex items-center gap-2">
                <Store className="w-5 h-5 text-cyan-500" />
                Detail Pengajuan Merchant
              </h3>
              <button onClick={() => setSelectedMerchant(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              
              {/* Account Info */}
              <div>
                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Informasi Akun</h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Nama Pemilik</span>
                    <span className="font-bold text-slate-800">{selectedMerchant.owner?.name}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Email Pemilik</span>
                    <span className="font-bold text-slate-800">{selectedMerchant.owner?.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Terdaftar Sejak</span>
                    <span className="font-bold text-slate-800">
                      {new Date(selectedMerchant.owner?.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Store Info */}
              <div>
                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Informasi Toko</h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="col-span-2 flex items-center gap-4 mb-2">
                    <img 
                      src={selectedMerchant.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMerchant.name)}&background=e2e8f0&color=475569`} 
                      alt="Logo" className="w-16 h-16 rounded-xl border border-slate-200"
                    />
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">Logo Toko</span>
                      <a href={selectedMerchant.logo} target="_blank" rel="noreferrer" className="text-cyan-600 font-bold text-xs flex items-center gap-1 hover:underline">
                        Lihat Gambar Penuh <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Nama Toko</span>
                    <span className="font-bold text-slate-800">{selectedMerchant.name}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Username / Slug</span>
                    <span className="font-bold text-slate-800">@{selectedMerchant.slug}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Nomor WhatsApp</span>
                    <span className="font-bold text-slate-800">{selectedMerchant.contactWhatsapp || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Alamat / Kota</span>
                    <span className="font-bold text-slate-800">{selectedMerchant.location || '-'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs text-slate-500 mb-1">Deskripsi Toko</span>
                    <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {selectedMerchant.description}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Footer */}
            {selectedMerchant.verificationStatus === 'PENDING' && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
                <button 
                  onClick={() => setActionModal({ isOpen: true, action: 'REJECTED', merchantId: selectedMerchant.id, merchantName: selectedMerchant.name, notes: '' })}
                  className="px-6 py-2.5 bg-white text-rose-600 font-bold border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  Tolak Pengajuan
                </button>
                <button 
                  onClick={() => setActionModal({ isOpen: true, action: 'VERIFIED', merchantId: selectedMerchant.id, merchantName: selectedMerchant.name, notes: '' })}
                  className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-sm transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve / Verifikasi
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action/Reason Modal */}
      {actionModal?.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActionModal(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className={`text-lg font-black mb-2 ${actionModal.action === 'VERIFIED' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {actionModal.action === 'VERIFIED' ? 'Konfirmasi Verifikasi' : 'Tolak Pengajuan Merchant'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {actionModal.action === 'VERIFIED' 
                ? `Apakah Anda yakin ingin menyetujui merchant ${actionModal.merchantName}? Akun owner akan di-upgrade otomatis menjadi Merchant.`
                : `Anda akan menolak pengajuan ${actionModal.merchantName}. Mohon berikan alasan penolakan.`}
            </p>

            <textarea 
              value={actionModal.notes}
              onChange={(e) => setActionModal({ ...actionModal, notes: e.target.value })}
              placeholder={actionModal.action === 'REJECTED' ? "Wajib diisi: Alasan penolakan..." : "Opsional: Catatan verifikasi..."}
              className={`w-full p-3 rounded-xl border text-sm mb-6 focus:outline-none focus:ring-2 resize-none h-24 ${
                actionModal.action === 'REJECTED' 
                  ? 'border-rose-200 focus:ring-rose-500 bg-rose-50/50' 
                  : 'border-slate-200 focus:ring-emerald-500 bg-slate-50'
              }`}
            />

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActionModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleVerificationAction}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-colors shadow-sm ${
                  actionModal.action === 'VERIFIED' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                {actionModal.action === 'VERIFIED' ? 'Ya, Verifikasi' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
