import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Store, CreditCard, ChevronLeft, ChevronRight, Activity 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const MerchantBalanceView: React.FC = () => {
  const { addNotification } = useApp();
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const data = await api.getMerchantBalances();
      // Since it's returning empty array right now, mock it locally for demo purposes
      if (data.length === 0) {
        setBalances([
          {
            id: 'merch-1001',
            name: 'ADMS Creative Store',
            slug: 'adms-creative-store',
            availableBalance: 2500000,
            pendingBalance: 500000,
            totalSales: 15000000,
            totalWithdrawal: 12000000,
            lastPayout: new Date(Date.now() - 3 * 86400000), // 3 days ago
          },
          {
            id: 'merch-1002',
            name: 'Citra Design Agency',
            slug: 'citra-design',
            availableBalance: 750000,
            pendingBalance: 150000,
            totalSales: 3500000,
            totalWithdrawal: 2600000,
            lastPayout: new Date(Date.now() - 10 * 86400000),
          }
        ]);
      } else {
        setBalances(data);
      }
    } catch (error) {
      addNotification('Gagal memuat saldo merchant', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Merchant Balance</h2>
          <p className="text-slate-500 text-sm mt-1">Pantau saldo, penjualan, dan riwayat penarikan dana merchant.</p>
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
            <span>Sort by Balance</span>
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
                <th className="px-6 py-4 text-right">Available Balance</th>
                <th className="px-6 py-4 text-right">Pending Balance</th>
                <th className="px-6 py-4 text-right">Total Sales</th>
                <th className="px-6 py-4 text-right">Total Withdrawal</th>
                <th className="px-6 py-4">Last Payout</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Memuat data...
                  </td>
                </tr>
              ) : balances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data saldo merchant.
                  </td>
                </tr>
              ) : (
                balances.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-cyan-500" />
                        <div>
                          <p className="font-bold text-navy">{merchant.name}</p>
                          <p className="text-xs text-slate-500">@{merchant.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600">
                      Rp{merchant.availableBalance.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-orange-500">
                      Rp{merchant.pendingBalance.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-navy">
                      Rp{merchant.totalSales.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-600">
                      Rp{merchant.totalWithdrawal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(merchant.lastPayout).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                        <Activity className="w-3.5 h-3.5" /> History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Menampilkan {balances.length} data</span>
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
