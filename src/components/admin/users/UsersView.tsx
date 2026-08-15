import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, Shield, ShieldAlert, ShieldCheck, 
  UserCircle, AlertCircle, Ban, CheckCircle2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const UsersView: React.FC = () => {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, CUSTOMER, MERCHANT, ADMIN
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    action: 'SUSPEND' | 'BAN' | 'ACTIVATE';
  } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Map tabs to backend roles
      let roleQuery = activeTab;
      if (activeTab === 'CUSTOMER') roleQuery = 'USER';
      
      const data = await api.getUsers({ role: roleQuery, search });
      setUsers(data);
    } catch (error) {
      addNotification('Gagal memuat data pengguna', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab, search]);

  const handleAction = async () => {
    if (!confirmModal) return;
    
    try {
      const newStatus = confirmModal.action === 'ACTIVATE' ? 'ACTIVE' : confirmModal.action === 'SUSPEND' ? 'SUSPENDED' : 'BANNED';
      await api.updateUserStatus(confirmModal.userId, newStatus);
      
      addNotification(`Berhasil mengubah status ${confirmModal.userName}`, 'success');
      setConfirmModal(null);
      fetchUsers();
    } catch (error) {
      addNotification('Gagal mengubah status pengguna', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">User Management</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola data pelanggan, merchant, dan administrator.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex overflow-x-auto scrollbar-none">
        {['ALL', 'CUSTOMER', 'MERCHANT', 'ADMIN'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-navy text-white shadow-md'
                : 'text-slate-500 hover:text-navy hover:bg-slate-50'
            }`}
          >
            {tab === 'ALL' ? 'Semua User' : tab === 'CUSTOMER' ? 'Customer' : tab === 'MERCHANT' ? 'Merchant' : 'Admin'}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data pengguna yang ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e2e8f0&color=475569`} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-navy">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'MERCHANT' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
                        {user.role === 'MERCHANT' && <Shield className="w-3.5 h-3.5" />}
                        {user.role === 'USER' && <UserCircle className="w-3.5 h-3.5" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                        user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        user.status === 'SUSPENDED' ? 'bg-orange-100 text-orange-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {user.status === 'ACTIVE' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {user.status === 'SUSPENDED' && <AlertCircle className="w-3.5 h-3.5" />}
                        {user.status === 'BANNED' && <Ban className="w-3.5 h-3.5" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status !== 'ACTIVE' ? (
                          <button 
                            onClick={() => setConfirmModal({ isOpen: true, userId: user.id, userName: user.name, action: 'ACTIVATE' })}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Activate"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => setConfirmModal({ isOpen: true, userId: user.id, userName: user.name, action: 'SUSPEND' })}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md transition-colors" title="Suspend"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        )}
                        {user.status !== 'BANNED' && (
                          <button 
                            onClick={() => setConfirmModal({ isOpen: true, userId: user.id, userName: user.name, action: 'BAN' })}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Ban"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-50 rounded-md transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
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
          <span className="text-xs text-slate-500 font-medium">Menampilkan {users.length} data</span>
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

      {/* Confirmation Modal */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirmModal(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${
              confirmModal.action === 'ACTIVATE' ? 'bg-emerald-100 text-emerald-600' :
              confirmModal.action === 'SUSPEND' ? 'bg-orange-100 text-orange-600' :
              'bg-rose-100 text-rose-600'
            }`}>
              {confirmModal.action === 'ACTIVATE' ? <CheckCircle2 className="w-6 h-6" /> :
               confirmModal.action === 'SUSPEND' ? <AlertCircle className="w-6 h-6" /> :
               <Ban className="w-6 h-6" />}
            </div>
            
            <h3 className="text-lg font-black text-navy mb-2">Konfirmasi Tindakan</h3>
            <p className="text-sm text-slate-600 mb-6">
              Apakah Anda yakin ingin melakukan tindakan <strong className="uppercase">{confirmModal.action}</strong> pada user <strong>{confirmModal.userName}</strong>?
            </p>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleAction}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-colors shadow-sm ${
                  confirmModal.action === 'ACTIVATE' ? 'bg-emerald-500 hover:bg-emerald-600' :
                  confirmModal.action === 'SUSPEND' ? 'bg-orange-500 hover:bg-orange-600' :
                  'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
