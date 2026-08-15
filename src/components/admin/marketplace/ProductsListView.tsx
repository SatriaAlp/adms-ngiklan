import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, Package, AlertCircle, Ban, CheckCircle2, ChevronLeft, ChevronRight, Eye, Edit, Trash 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const ProductsListView: React.FC = () => {
  const { addNotification } = useApp();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({ status: 'ALL', search });
      setProducts(data);
    } catch (error) {
      addNotification('Gagal memuat data produk', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  // Aggregate stats
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'ACTIVE').length,
    pending: products.filter(p => p.status === 'PENDING_REVIEW').length,
    rejected: products.filter(p => p.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Marketplace Produk</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola seluruh produk digital yang tersedia di platform.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Produk</span>
          <span className="text-2xl font-black text-navy">{stats.total}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Published / Active</span>
          <span className="text-2xl font-black text-emerald-600">{stats.active}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending Review</span>
          <span className="text-2xl font-black text-orange-600">{stats.pending}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Rejected</span>
          <span className="text-2xl font-black text-rose-600">{stats.rejected}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama produk..."
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
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data produk yang ditemukan.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <img 
                          src={product.thumbnailUrl || `https://placehold.co/100x100/e2e8f0/475569?text=P`} 
                          alt={product.title} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 max-w-[250px]">
                          <p className="font-bold text-navy truncate" title={product.title}>{product.title}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">Oleh: {product.merchant?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 font-bold text-navy">
                      Rp{product.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                        product.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        product.status === 'PENDING_REVIEW' ? 'bg-orange-100 text-orange-700' :
                        product.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {product.status === 'ACTIVE' ? 'PUBLISHED' : product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Detail">
                          <Eye className="w-4 h-4" />
                        </button>
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
          <span className="text-xs text-slate-500 font-medium">Menampilkan {products.length} data</span>
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
