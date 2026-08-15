import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, Store, AlertCircle, Ban, CheckCircle2, ChevronLeft, ChevronRight, ShieldAlert 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const MerchantsListView: React.FC = () => {
  const { addNotification } = useApp();
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const data = await api.getMerchants({ verificationStatus: 'ALL', search });
      setMerchants(data);
    } catch (error) {
      addNotification('Gagal memuat data merchant', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [search]);

  // Aggregate stats
  const stats = {
    total: merchants.length,
    active: merchants.filter(m => m.verificationStatus === 'VERIFIED').length,
    pending: merchants.filter(m => m.verificationStatus === 'PENDING').length,
    suspended: merchants.filter(m => m.verificationStatus === 'SUSPENDED').length,
    rejected: merchants.filter(m => m.verificationStatus === 'REJECTED').length,
  };

  const handleApprove = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menyetujui pendaftaran toko "${name}"?`)) return;
    try {
      await api.updateMerchantVerification(id, 'VERIFIED');
      addNotification(`Toko "${name}" berhasil disetujui!`, 'success');
      fetchMerchants();
    } catch (error: any) {
      addNotification(error.message || 'Gagal memproses persetujuan toko', 'error');
    }
  };

  const handleReject = async (id: string, name: string) => {
    const reason = window.prompt(`Masukkan alasan penolakan untuk toko "${name}":`);
    if (reason === null) return;
    if (!reason.trim()) {
      addNotification('Alasan penolakan wajib diisi!', 'warning');
      return;
    }
    try {
      await api.updateMerchantVerification(id, 'REJECTED', reason);
      addNotification(`Toko "${name}" ditolak dengan alasan: ${reason}`, 'info');
      fetchMerchants();
    } catch (error: any) {
      addNotification(error.message || 'Gagal memproses penolakan toko', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Semua Merchant</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola data seluruh merchant dan toko yang terdaftar.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Merchant</span>
          <span className="text-2xl font-black text-navy">{stats.total}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Active</span>
          <span className="text-2xl font-black text-emerald-600">{stats.active}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending</span>
          <span className="text-2xl font-black text-orange-600">{stats.pending}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Suspended</span>
          <span className="text-2xl font-black text-rose-600">{stats.suspended}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Rejected</span>
          <span className="text-2xl font-black text-slate-600">{stats.rejected}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama toko..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter Status</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="px-6 py-4">Toko / Merchant</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Memuat data...
                  </td>
                </tr>
              ) : merchants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data merchant yang ditemukan.
                  </td>
                </tr>
              ) : (
                merchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                        <img 
                          src={merchant.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(merchant.name)}&background=e2e8f0&color=475569`} 
                          alt={merchant.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-navy flex items-center gap-1">
                            {merchant.name}
                            {merchant.verificationStatus === 'VERIFIED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                          </p>
                          <p className="text-xs text-slate-500">@{merchant.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700">{merchant.owner?.name}</p>
                      <p className="text-xs text-slate-500">{merchant.owner?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {merchant.products?.length || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                        merchant.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                        merchant.verificationStatus === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                        merchant.verificationStatus === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {merchant.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {merchant.verificationStatus === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleApprove(merchant.id, merchant.name)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-all"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleReject(merchant.id, merchant.name)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded-lg transition-all"
                            >
                              Tolak
                            </button>
                          </>
                        ) : merchant.verificationStatus === 'VERIFIED' ? (
                          <span className="text-xs text-emerald-600 font-bold">Terverifikasi</span>
                        ) : merchant.verificationStatus === 'REJECTED' ? (
                          <span className="text-xs text-rose-600 font-bold">Ditolak</span>
                        ) : (
                          <span className="text-xs text-slate-500 font-medium">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Menampilkan {merchants.length} data</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 rounded-md bg-cyan-50 text-cyan-700 font-bold text-xs border border-cyan-100">1</button>
            <button className="p-1 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
