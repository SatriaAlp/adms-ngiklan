import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Search, Filter, AlertTriangle, MessageSquare, Ban, CheckCircle2, UserX, Store
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const ModerationView: React.FC = () => {
  const { addNotification } = useApp();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Action Modal State
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    reportId: string;
    targetName: string;
    targetType: string;
    actionType: 'IGNORE' | 'TAKE_DOWN' | 'SUSPEND_USER';
    notes: string;
  } | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports({ status: 'PENDING' });
      setReports(data);
    } catch (error) {
      addNotification('Gagal memuat data laporan', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [search]);

  const handleProcessAction = async () => {
    if (!actionModal) return;
    
    try {
      await api.processReport(actionModal.reportId, actionModal.actionType, actionModal.notes);
      
      let successMessage = 'Laporan berhasil ditangani';
      if (actionModal.actionType === 'TAKE_DOWN') successMessage = `Konten ${actionModal.targetName} telah di-take down`;
      if (actionModal.actionType === 'SUSPEND_USER') successMessage = `Akun terlaporkan telah di-suspend`;
      if (actionModal.actionType === 'IGNORE') successMessage = `Laporan diabaikan (No Action Taken)`;

      addNotification(successMessage, 'success');
      
      setReports(prev => prev.filter(r => r.id !== actionModal.reportId));
      setActionModal(null);
    } catch (error) {
      addNotification('Terjadi kesalahan saat memproses laporan', 'error');
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'FRAUD': return 'bg-rose-100 text-rose-700';
      case 'SPAM': return 'bg-orange-100 text-orange-700';
      case 'INAPPROPRIATE': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'PRODUCT': return <Store className="w-4 h-4 text-cyan-600" />;
      case 'MERCHANT': return <Store className="w-4 h-4 text-blue-600" />;
      case 'USER': return <UserX className="w-4 h-4 text-rose-600" />;
      default: return <MessageSquare className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Moderation & Reports</h2>
          <p className="text-slate-500 text-sm mt-1">Tinjau laporan spam, penipuan, atau pelanggaran konten dari user.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari ID Laporan atau Target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter Kategori</span>
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada laporan baru</h3>
          <p className="text-sm text-slate-500">Platform dalam keadaan aman dan bersih dari laporan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">{report.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getReasonColor(report.reason)}`}>
                    {report.reason}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(report.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}
                </span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Pelaporan</h4>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="mt-0.5">{getIconForType(report.type)}</div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{report.type}</span>
                      <h3 className="font-bold text-navy">{report.targetName}</h3>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Laporan</h4>
                  <p className="text-sm text-slate-700 bg-rose-50/50 p-3 rounded-xl border border-rose-100 italic">
                    "{report.description}"
                  </p>
                </div>

                <div className="text-xs text-slate-500 mt-auto pt-4">
                  Dilaporkan oleh: <span className="font-bold text-slate-700">{report.reportedBy.name}</span> ({report.reportedBy.email})
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 grid grid-cols-3 gap-2 bg-slate-50">
                <button 
                  onClick={() => setActionModal({ isOpen: true, actionType: 'IGNORE', reportId: report.id, targetName: report.targetName, targetType: report.type, notes: '' })}
                  className="px-2 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors flex flex-col items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" /> Abaikan
                </button>
                <button 
                  onClick={() => setActionModal({ isOpen: true, actionType: 'TAKE_DOWN', reportId: report.id, targetName: report.targetName, targetType: report.type, notes: '' })}
                  className="px-2 py-2 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 rounded-lg transition-colors flex flex-col items-center gap-1"
                >
                  <AlertTriangle className="w-4 h-4" /> Take Down
                </button>
                <button 
                  onClick={() => setActionModal({ isOpen: true, actionType: 'SUSPEND_USER', reportId: report.id, targetName: report.targetName, targetType: report.type, notes: '' })}
                  className="px-2 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors flex flex-col items-center gap-1"
                >
                  <Ban className="w-4 h-4" /> Suspend Akun
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action/Reason Modal */}
      {actionModal?.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActionModal(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className={`text-lg font-black mb-2 ${
              actionModal.actionType === 'IGNORE' ? 'text-slate-700' :
              actionModal.actionType === 'TAKE_DOWN' ? 'text-orange-600' : 'text-rose-600'
            }`}>
              {actionModal.actionType === 'IGNORE' ? 'Abaikan Laporan' :
               actionModal.actionType === 'TAKE_DOWN' ? 'Take Down Konten' : 'Suspend Akun Terlapor'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {actionModal.actionType === 'IGNORE' ? `Anda akan mengabaikan laporan terhadap ${actionModal.targetName}. Laporan akan ditandai selesai tanpa tindakan.` :
               actionModal.actionType === 'TAKE_DOWN' ? `Anda akan menghapus paksa (take down) ${actionModal.targetType} "${actionModal.targetName}".` :
               `Anda akan memblokir/suspend akun pemilik ${actionModal.targetType} "${actionModal.targetName}".`}
            </p>

            <textarea 
              value={actionModal.notes}
              onChange={(e) => setActionModal({ ...actionModal, notes: e.target.value })}
              placeholder={actionModal.actionType === 'IGNORE' ? "Catatan internal (opsional)..." : "Wajib: Alasan tindakan untuk diinfokan ke pihak terlapor..."}
              className={`w-full p-3 rounded-xl border text-sm mb-6 focus:outline-none focus:ring-2 resize-none h-24 ${
                actionModal.actionType === 'IGNORE' 
                  ? 'border-slate-200 focus:ring-slate-500 bg-slate-50' 
                  : actionModal.actionType === 'TAKE_DOWN' 
                  ? 'border-orange-200 focus:ring-orange-500 bg-orange-50/50'
                  : 'border-rose-200 focus:ring-rose-500 bg-rose-50/50'
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
                onClick={handleProcessAction}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-colors shadow-sm ${
                  actionModal.actionType === 'IGNORE' ? 'bg-slate-700 hover:bg-slate-800' :
                  actionModal.actionType === 'TAKE_DOWN' ? 'bg-orange-500 hover:bg-orange-600' :
                  'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                Eksekusi Tindakan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
