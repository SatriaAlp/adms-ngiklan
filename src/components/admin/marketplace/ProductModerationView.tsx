import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Search, ShieldCheck, Eye, Package, ExternalLink, Link as LinkIcon 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const ProductModerationView: React.FC = () => {
  const { addNotification } = useApp();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  // Action Modal State
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    action: 'ACTIVE' | 'REJECTED';
    productId: string;
    productTitle: string;
    notes: string;
  } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({ status: 'PENDING_REVIEW' });
      setProducts(data);
    } catch (error) {
      addNotification('Gagal memuat data moderasi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleModerationAction = async () => {
    if (!actionModal) return;
    
    if (actionModal.action === 'REJECTED' && !actionModal.notes.trim()) {
      addNotification('Alasan penolakan produk wajib diisi', 'error');
      return;
    }

    try {
      await api.moderateProduct(actionModal.productId, actionModal.action, actionModal.notes);
      addNotification(`Produk berhasil di${actionModal.action === 'ACTIVE' ? 'setujui' : 'tolak'}`, 'success');
      setActionModal(null);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      addNotification('Terjadi kesalahan sistem', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Product Moderation</h2>
          <p className="text-slate-500 text-sm mt-1">Tinjau dan kurasi produk baru sebelum tampil di Marketplace.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Antrean Moderasi Kosong</h3>
          <p className="text-sm text-slate-500">Semua produk yang diajukan sudah Anda periksa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6">
              
              <div className="w-full sm:w-1/3 shrink-0">
                <img 
                  src={product.thumbnailUrl || `https://placehold.co/400x400/e2e8f0/475569?text=P`} 
                  alt={product.title} 
                  className="w-full aspect-square rounded-xl object-cover border border-slate-200"
                />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider mb-2 inline-block">
                    Menunggu Review
                  </span>
                  <h3 className="font-bold text-lg text-navy leading-tight mb-1">{product.title}</h3>
                  <p className="text-sm text-slate-500">Oleh: <span className="font-bold">{product.merchant?.name}</span></p>
                </div>
                
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Kategori</span>
                    <span className="font-bold text-slate-700">{product.category?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Harga</span>
                    <span className="font-bold text-navy">Rp{product.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Mulai Moderasi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Review Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md rounded-t-2xl z-10">
              <h3 className="text-xl font-black text-navy flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-500" />
                Moderasi Produk
              </h3>
              <button onClick={() => setSelectedProduct(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-6">
                <img 
                  src={selectedProduct.thumbnailUrl || `https://placehold.co/400x400/e2e8f0/475569?text=P`} 
                  alt={selectedProduct.title} 
                  className="w-full md:w-48 aspect-square rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h2 className="text-2xl font-black text-navy mb-2">{selectedProduct.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <span>Merchant: <strong>{selectedProduct.merchant?.name}</strong></span>
                    <span>Kategori: <strong>{selectedProduct.category?.name}</strong></span>
                  </div>
                  <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 font-black rounded-lg text-lg border border-emerald-100">
                    Rp{selectedProduct.price.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Deskripsi Singkat</h4>
                <p className="text-slate-700 text-sm leading-relaxed">{selectedProduct.shortDescription || '-'}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Deskripsi Lengkap</h4>
                <div className="prose prose-sm prose-slate max-w-none">
                  {selectedProduct.fullDescription ? (
                    <p className="whitespace-pre-wrap">{selectedProduct.fullDescription}</p>
                  ) : '-'}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">File / Akses Digital</h4>
                {selectedProduct.demoUrl ? (
                  <a href={selectedProduct.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-bold text-sm hover:bg-blue-100 transition-colors w-max">
                    <LinkIcon className="w-4 h-4" />
                    Cek Demo URL
                  </a>
                ) : (
                  <p className="text-sm text-slate-500 italic">Tidak ada tautan demo disertakan.</p>
                )}
              </div>

            </div>

            {/* Action Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between rounded-b-2xl">
              <span className="text-xs text-slate-500">*Pastikan produk tidak melanggar hak cipta</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActionModal({ isOpen: true, action: 'REJECTED', productId: selectedProduct.id, productTitle: selectedProduct.title, notes: '' })}
                  className="px-6 py-2.5 bg-white text-rose-600 font-bold border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  Tolak
                </button>
                <button 
                  onClick={() => setActionModal({ isOpen: true, action: 'ACTIVE', productId: selectedProduct.id, productTitle: selectedProduct.title, notes: '' })}
                  className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-sm transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Setujui Produk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action/Reason Modal */}
      {actionModal?.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActionModal(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className={`text-lg font-black mb-2 ${actionModal.action === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {actionModal.action === 'ACTIVE' ? 'Setujui Publikasi Produk' : 'Tolak Produk'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {actionModal.action === 'ACTIVE' 
                ? `Produk "${actionModal.productTitle}" akan langsung live di Marketplace.`
                : `Berikan alasan mengapa Anda menolak "${actionModal.productTitle}".`}
            </p>

            <textarea 
              value={actionModal.notes}
              onChange={(e) => setActionModal({ ...actionModal, notes: e.target.value })}
              placeholder={actionModal.action === 'REJECTED' ? "Wajib diisi: Alasan penolakan (misal: melanggar hak cipta, deskripsi tidak jelas)..." : "Catatan internal (opsional)..."}
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
                  actionModal.action === 'ACTIVE' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                {actionModal.action === 'ACTIVE' ? 'Ya, Publikasikan' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
