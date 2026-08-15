import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, Receipt, Clock, CheckCircle2, XCircle, Eye, RefreshCcw 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const TransactionsView: React.FC = () => {
  const { addNotification } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // View Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders({ status: 'ALL', search });
      setOrders(data);
    } catch (error) {
      addNotification('Gagal memuat data transaksi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search]);

  // Aggregate stats
  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.paymentStatus === 'PAID').length,
    pending: orders.filter(o => o.paymentStatus === 'PENDING').length,
    refunded: orders.filter(o => o.paymentStatus === 'REFUNDED').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Semua Transaksi</h2>
          <p className="text-slate-500 text-sm mt-1">Pantau transaksi pesanan dan status pembayaran.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Pesanan</span>
          <span className="text-2xl font-black text-navy">{stats.total}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Paid / Berhasil</span>
          <span className="text-2xl font-black text-emerald-600">{stats.paid}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending</span>
          <span className="text-2xl font-black text-orange-600">{stats.pending}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Refunded</span>
          <span className="text-2xl font-black text-purple-600">{stats.refunded}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter Tanggal</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="px-6 py-4">Order ID & Waktu</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Metode Bayar</th>
                <th className="px-6 py-4">Total Amount</th>
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
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data transaksi yang ditemukan.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-navy">{order.id}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleString('id-ID')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700">{order.customer?.name}</p>
                      <p className="text-xs text-slate-500">{order.customer?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4 font-black text-navy">
                      Rp{Number(order.totalAmount).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                        order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                        order.paymentStatus === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                        order.paymentStatus === 'REFUNDED' ? 'bg-purple-100 text-purple-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md rounded-t-2xl z-10">
              <h3 className="text-xl font-black text-navy flex items-center gap-2">
                <Receipt className="w-5 h-5 text-cyan-500" />
                Order Detail - {selectedOrder.id}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Customer Info</span>
                  <p className="font-bold text-navy">{selectedOrder.customer?.name}</p>
                  <p className="text-sm text-slate-500">{selectedOrder.customer?.email}</p>
                  <p className="text-sm text-slate-500">{selectedOrder.customer?.phone || '-'}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Order Info</span>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Status</span>
                    <span className="font-bold text-navy">{selectedOrder.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Metode Bayar</span>
                    <span className="font-bold text-navy">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tipe Transaksi</span>
                    <span className="font-bold text-navy">{selectedOrder.transactionType}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-4">Produk</span>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold text-slate-800">{item.product?.title}</p>
                        <p className="text-xs text-slate-500">Toko: {item.product?.merchant?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-navy">Rp{Number(item.price).toLocaleString('id-ID')}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-4">Rincian Finansial</span>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">Rp{Number(selectedOrder.subtotal).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Diskon</span>
                    <span className="font-medium text-rose-600">-Rp{Number(selectedOrder.discount).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Biaya Platform / Fee</span>
                    <span className="font-medium">Rp{Number(selectedOrder.platformFee).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 font-black text-lg">
                    <span className="text-navy">Total Bayar</span>
                    <span className="text-cyan-600">Rp{Number(selectedOrder.totalAmount).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
