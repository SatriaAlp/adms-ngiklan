import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ShieldAlert, CheckCircle2, XCircle, FileText, ArrowRightLeft 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const RefundsView: React.FC = () => {
  const { addNotification } = useApp();
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Action Modal State
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    action: 'APPROVED' | 'REJECTED';
    refundId: string;
    notes: string;
  } | null>(null);

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const data = await api.getRefunds();
      setRefunds(data);
    } catch (error) {
      addNotification('Gagal memuat data refund', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleRefundAction = async () => {
    if (!actionModal) return;
    
    if (actionModal.action === 'REJECTED' && !actionModal.notes.trim()) {
      addNotification('Alasan penolakan wajib diisi', 'error');
      return;
    }

    try {
      await api.processRefund(actionModal.refundId, actionModal.action, actionModal.notes);
      addNotification(`Refund berhasil di${actionModal.action === 'APPROVED' ? 'setujui' : 'tolak'}`, 'success');
      setActionModal(null);
      fetchRefunds();
    } catch (error) {
      addNotification('Terjadi kesalahan sistem', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Manajemen Refund</h2>
          <p className="text-slate-500 text-sm mt-1">Proses permintaan pengembalian dana dari pelanggan.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : refunds.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ArrowRightLeft className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada pengajuan refund</h3>
          <p className="text-sm text-slate-500">Saat ini tidak ada pelanggan yang mengajukan pengembalian dana.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Real refund data would map here */}
        </div>
      )}

      {/* Action/Reason Modal */}
      {actionModal?.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActionModal(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className={`text-lg font-black mb-2 ${actionModal.action === 'APPROVED' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {actionModal.action === 'APPROVED' ? 'Setujui Refund' : 'Tolak Refund'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {actionModal.action === 'APPROVED' 
                ? `Dana akan dikembalikan ke saldo customer. Lanjutkan?`
                : `Berikan alasan mengapa permintaan refund ini ditolak.`}
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
                onClick={handleRefundAction}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-colors shadow-sm ${
                  actionModal.action === 'APPROVED' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                {actionModal.action === 'APPROVED' ? 'Ya, Proses Refund' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
