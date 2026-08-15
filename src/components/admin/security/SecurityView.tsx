import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Activity, Search, ShieldCheck, ShieldX, Key, Laptop, Download, Filter
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const SecurityView: React.FC = () => {
  const { addNotification } = useApp();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getSecurityLogs();
      setLogs(data);
    } catch (error) {
      addNotification('Gagal memuat log keamanan', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes('SUCCESS')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (action.includes('FAILED')) return 'text-rose-600 bg-rose-50 border-rose-200';
    if (action.includes('UPDATE')) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('SUCCESS')) return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    if (action.includes('FAILED')) return <ShieldX className="w-4 h-4 text-rose-500" />;
    if (action.includes('UPDATE')) return <Key className="w-4 h-4 text-blue-500" />;
    return <Activity className="w-4 h-4 text-slate-500" />;
  };

  const filteredLogs = logs.filter(log => 
    log.user.name.toLowerCase().includes(search.toLowerCase()) || 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.ipAddress.includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-cyan-500" /> Security & Audit Trail
          </h2>
          <p className="text-slate-500 text-sm mt-1">Lacak setiap tindakan kritis dan aktivitas login Admin platform.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
          <Download className="w-4 h-4" /> Unduh Log (.CSV)
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari User, Action, atau IP Address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors bg-white">
            <Filter className="w-4 h-4" /> Filter Waktu
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">User Agent / Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Memuat log...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Tidak ada log aktivitas yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {new Date(log.createdAt).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-navy">{log.user.name}</div>
                      <div className="text-xs text-slate-400">{log.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                        {log.action}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-2 max-w-[250px]">
                        <Laptop className="w-4 h-4 shrink-0 text-slate-400" />
                        <span className="truncate text-xs" title={log.userAgent}>{log.userAgent}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        {!loading && filteredLogs.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 font-medium text-right">
            Menampilkan {filteredLogs.length} entri terbaru
          </div>
        )}
      </div>
    </div>
  );
};
