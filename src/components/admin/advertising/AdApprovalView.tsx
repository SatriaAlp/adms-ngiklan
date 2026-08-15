import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Search, Megaphone, Image as ImageIcon, Link as LinkIcon 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const AdApprovalView: React.FC = () => {
  const { addNotification } = useApp();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Detail Modal State
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  
  // Action Modal State
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    action: 'APPROVED' | 'REJECTED';
    adId: string;
    merchantName: string;
    notes: string;
  } | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getAdRequests({ status: 'PENDING' });
      
      // Mock data since model doesn't exist yet
      if (data.length === 0) {
        setRequests([
          {
            id: 'REQ-AD-101',
            merchant: { name: 'DevStudio Indonesia' },
            package: { name: 'Sidebar Spotlight', price: 250000, durationDays: 7 },
            bannerUrl: 'https://placehold.co/300x250/1e293b/06b6d4?text=Promo+Website',
            targetUrl: 'https://devstudio.id/promo',
            status: 'PENDING',
            requestedAt: new Date(Date.now() - 3600000 * 2)
          }
        ]);
      } else {
        setRequests(data);
      }
    } catch (error) {
      addNotification('Gagal memuat data pengajuan iklan', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleModerationAction = async () => {
    if (!actionModal) return;
    
    if (actionModal.action === 'REJECTED' && !actionModal.notes.trim()) {
      addNotification('Alasan penolakan iklan wajib diisi', 'error');
      return;
    }

    try {
      await api.moderateAdRequest(actionModal.adId, actionModal.action, actionModal.notes);
      addNotification(`Iklan berhasil di${actionModal.action === 'APPROVED' ? 'setujui' : 'tolak'}`, 'success');
      
      setRequests(prev => prev.filter(r => r.id !== actionModal.adId));
      setActionModal(null);
      setSelectedAd(null);
    } catch (error) {
      addNotification('Terjadi kesalahan sistem', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Ad Approval</h2>
          <p className="text-slate-500 text-sm mt-1">Review materi iklan dari merchant sebelum ditayangkan.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Semua Iklan Telah Direview</h3>
          <p className="text-sm text-slate-500">Tidak ada pengajuan iklan baru di antrean.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider mb-2 inline-block">
                    Menunggu Review
                  </span>
                  <h3 className="font-bold text-lg text-navy">{req.merchant.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">Paket: <span className="font-bold">{req.package.name}</span> ({req.package.durationDays} Hari)</p>
                </div>
                <span className="text-xs text-slate-400">{new Date(req.requestedAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</span>
              </div>
              
              <div className="relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video flex items-center justify-center">
                <img src={req.bannerUrl} alt="Banner Preview" className="max-w-full max-h-full object-contain" />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                <button 
                  onClick={() => window.open(req.targetUrl, '_blank')}
                  className="flex items-center gap-2 text-blue-600 text-sm font-bold hover:underline"
                >
                  <LinkIcon className="w-4 h-4" /> Cek URL Tujuan
                </button>
                <button 
                  onClick={() => setSelectedAd(req)}
                  className="px-6 py-2 bg-navy text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedAd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedAd(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-navy flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-cyan-500" />
                Moderasi Materi Iklan
              </h3>
              <button onClick={() => setSelectedAd(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <img src={selectedAd.bannerUrl} alt="Full Banner Preview" className="w-full rounded-lg border border-slate-100 object-contain" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Informasi Paket</span>
                  <p className="font-bold text-navy">{selectedAd.package.name}</p>
                  <p className="text-sm text-slate-500">Harga: Rp{selectedAd.package.price.toLocaleString('id-ID')}</p>
                  <p className="text-sm text-slate-500">Durasi: {selectedAd.package.durationDays} Hari</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Target URL</span>
                  <a href={selectedAd.targetUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-bold break-all hover:underline text-sm">
                    {selectedAd.targetUrl}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
              <button 
                onClick={() => setActionModal({ isOpen: true, action: 'REJECTED', adId: selectedAd.id, merchantName: selectedAd.merchant.name, notes: '' })}
                className="px-6 py-2.5 bg-white text-rose-600 font-bold border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors"
              >
                Tolak Iklan
              </button>
              <button 
                onClick={() => setActionModal({ isOpen: true, action: 'APPROVED', adId: selectedAd.id, merchantName: selectedAd.merchant.name, notes: '' })}
                className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-sm transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Setujui & Tayangkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action/Reason Modal */}
      {actionModal?.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActionModal(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className={`text-lg font-black mb-2 ${actionModal.action === 'APPROVED' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {actionModal.action === 'APPROVED' ? 'Konfirmasi Tayang' : 'Tolak Materi Iklan'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {actionModal.action === 'APPROVED' 
                ? `Materi iklan dari ${actionModal.merchantName} akan segera tayang sesuai durasi paket. Lanjutkan?`
                : `Berikan alasan mengapa Anda menolak materi iklan ini (misal: gambar pecah, melanggar kebijakan).`}
            </p>

            <textarea 
              value={actionModal.notes}
              onChange={(e) => setActionModal({ ...actionModal, notes: e.target.value })}
              placeholder={actionModal.action === 'REJECTED' ? "Wajib diisi: Alasan penolakan..." : "Catatan internal (opsional)..."}
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
                onClick={handleModerationAction}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-colors shadow-sm ${
                  actionModal.action === 'APPROVED' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                {actionModal.action === 'APPROVED' ? 'Ya, Tayangkan' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
