import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Banknote, CheckCircle2, XCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const WithdrawalsView: React.FC = () => {
  const { addNotification } = useApp();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING, APPROVED, REJECTED
  
  // Action Modal State
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    action: 'APPROVED' | 'REJECTED';
    withdrawalId: string;
    merchantName: string;
    amount: number;
    notes: string;
  } | null>(null);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const data = await api.getWithdrawals({ status: activeTab });
      
      // Mock data since model doesn't exist yet
      if (data.length === 0 && activeTab === 'PENDING') {
        setWithdrawals([
          {
            id: 'WD-2026-0012',
            merchant: { name: 'ADMS Creative Store' },
            amount: 1500000,
            bankName: 'BCA',
            accountName: 'Afifah Rizki',
            accountNumber: '8881234567',
            requestedAt: new Date(Date.now() - 3600000),
            status: 'PENDING'
          },
          {
            id: 'WD-2026-0013',
            merchant: { name: 'Citra Design Agency' },
            amount: 500000,
            bankName: 'Bank Mandiri',
            accountName: 'Citra Kirana',
            accountNumber: '131000999888',
            requestedAt: new Date(Date.now() - 7200000),
            status: 'PENDING'
          }
        ]);
      } else {
        setWithdrawals(data);
      }
    } catch (error) {
      addNotification('Gagal memuat data penarikan', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [activeTab]);

  const handleProcess = async () => {
    if (!actionModal) return;
    
    if (actionModal.action === 'REJECTED' && !actionModal.notes.trim()) {
      addNotification('Alasan penolakan wajib diisi', 'error');
      return;
    }

    try {
      await api.processWithdrawal(actionModal.withdrawalId, actionModal.action, actionModal.notes);
      addNotification(`Penarikan dana berhasil di${actionModal.action === 'APPROVED' ? 'setujui' : 'tolak'}`, 'success');
      
      // Remove from list locally for immediate feedback
      setWithdrawals(prev => prev.filter(w => w.id !== actionModal.withdrawalId));
      setActionModal(null);
    } catch (error) {
      addNotification('Terjadi kesalahan sistem', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Withdrawal Requests</h2>
          <p className="text-slate-500 text-sm mt-1">Proses permintaan penarikan dana dari merchant.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex overflow-x-auto scrollbar-none">
        {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-navy text-white shadow-md'
                : 'text-slate-500 hover:text-navy hover:bg-slate-50'
            }`}
          >
            {tab === 'PENDING' ? 'Menunggu Proses' : tab === 'APPROVED' ? 'Berhasil Ditransfer' : 'Ditolak'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="px-6 py-4">Request ID & Waktu</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Jumlah Penarikan</th>
                <th className="px-6 py-4">Informasi Rekening</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Memuat data...
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada antrean penarikan dana {activeTab.toLowerCase()}.
                  </td>
                </tr>
              ) : (
                withdrawals.map((wd) => (
                  <tr key={wd.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-navy">{wd.id}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(wd.requestedAt).toLocaleString('id-ID')}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {wd.merchant?.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-emerald-600 text-base">
                        Rp{wd.amount.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-navy">{wd.bankName}</p>
                      <p className="text-xs text-slate-600 font-mono">{wd.accountNumber}</p>
                      <p className="text-xs text-slate-500">a.n. {wd.accountName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                        wd.status === 'APPROVED' || wd.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                        wd.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {wd.status === 'PENDING' ? 'Perlu Diproses' : wd.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {wd.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setActionModal({ isOpen: true, action: 'REJECTED', withdrawalId: wd.id, merchantName: wd.merchant.name, amount: wd.amount, notes: '' })}
                            className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-bold text-xs"
                          >
                            Tolak
                          </button>
                          <button 
                            onClick={() => setActionModal({ isOpen: true, action: 'APPROVED', withdrawalId: wd.id, merchantName: wd.merchant.name, amount: wd.amount, notes: '' })}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-bold text-xs shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Tandai Selesai
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action/Reason Modal */}
      {actionModal?.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActionModal(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className={`text-lg font-black mb-2 ${actionModal.action === 'APPROVED' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {actionModal.action === 'APPROVED' ? 'Konfirmasi Transfer Selesai' : 'Tolak Penarikan Dana'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {actionModal.action === 'APPROVED' 
                ? `Anda mengonfirmasi bahwa Anda telah mentransfer Rp${actionModal.amount.toLocaleString('id-ID')} ke rekening merchant ${actionModal.merchantName}. Lanjutkan?`
                : `Anda akan menolak permintaan penarikan dana dari ${actionModal.merchantName}. Saldo mereka akan dikembalikan. Berikan alasan penolakan.`}
            </p>

            <textarea 
              value={actionModal.notes}
              onChange={(e) => setActionModal({ ...actionModal, notes: e.target.value })}
              placeholder={actionModal.action === 'REJECTED' ? "Wajib diisi: Alasan penolakan..." : "Catatan transfer (opsional, misal: no referensi bank)..."}
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
                onClick={handleProcess}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-colors shadow-sm ${
                  actionModal.action === 'APPROVED' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                {actionModal.action === 'APPROVED' ? 'Ya, Selesai' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
