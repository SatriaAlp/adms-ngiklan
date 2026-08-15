import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceView } from '../marketplace/MarketplaceView';
import { AdsView } from '../ads/AdsView';
import { MerchantsView } from '../merchants/MerchantsView';
import { PricingView } from '../pricing/PricingView';
import {
  User,
  Store,
  ShieldCheck,
  ShoppingBag,
  Download,
  Package,
  Megaphone,
  PlusCircle,
  TrendingUp,
  CreditCard,
  Settings,
  DollarSign,
  Users,
  CheckCircle2,
  Trash2,
  Edit,
  ExternalLink,
  Sparkles,
  Heart,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    activeRole,
    currentUser,
    orders,
    products,
    ads,
    wishlist,
    merchants,
    platformSettings,
    updatePlatformSettings,
    createProduct,
    deleteProduct,
    deleteAd,
    setIsCreateAdModalOpen,
    addNotification,
    dashboardSubTab,
    setDashboardSubTab,
    navigate,
  } = useApp();

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Template & Design');
  const [newDescription, setNewDescription] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Payment gateway settings state
  const [gatewayEnabled, setGatewayEnabled] = useState(
    platformSettings.paymentGatewayConfig?.enabled ?? true
  );
  const [apiKey, setApiKey] = useState(
    platformSettings.paymentGatewayConfig?.apiKey ?? 'afifah_gateway_sec_9921820381'
  );

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      addNotification('Mohon lengkapi judul dan harga produk', 'error');
      return;
    }

    createProduct({
      title: newTitle,
      price: parseFloat(newPrice) || 0,
      category: newCategory,
      description: newDescription,
      fileUrl: newFileUrl || 'https://example.com/download-link.zip',
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      merchantId: 'm-1',
      rating: 5.0,
      salesCount: 0,
      downloadCount: 0,
    });

    addNotification('Produk digital berhasil diterbitkan!', 'success');
    setIsAddProductModalOpen(false);

    // Reset
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
  };

  const handleSavePlatformSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      paymentGatewayConfig: {
        environment: 'production',
        ...(platformSettings.paymentGatewayConfig || {}),
        enabled: gatewayEnabled,
        apiKey: apiKey,
      },
    });
    addNotification('Pengaturan Custom Payment Gateway berhasil diperbarui!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500 text-slate-950 font-black text-xl flex items-center justify-center">
            {activeRole === 'ADMIN' ? <ShieldCheck className="w-6 h-6" /> : activeRole === 'MERCHANT' ? <Store className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Dashboard {activeRole === 'ADMIN' ? 'Administrator' : activeRole === 'MERCHANT' ? 'Merchant' : 'Customer'}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-bold text-[10px] border border-slate-700 uppercase">
                {activeRole}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Selamat datang kembali, {currentUser.name}</p>
          </div>
        </div>

        {/* Dashboard Actions */}
        <div className="flex items-center gap-2">
          {activeRole === 'MERCHANT' && (
            <button
              onClick={() => navigate('upload-produk')}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Produk Digital</span>
            </button>
          )}

          {activeRole === 'MERCHANT' && (
            <button
              onClick={() => setIsCreateAdModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Megaphone className="w-4 h-4 text-cyan-400" />
              <span>Pasang Iklan</span>
            </button>
          )}
        </div>
      </div>

      {/* Dashboard Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar (Desktop) / Top Switcher (Mobile) */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 p-2 bg-white border border-slate-200 rounded-2xl shrink-0 scrollbar-none shadow-xs">
          {/* Common Overview Tab */}
          <button
            onClick={() => setDashboardSubTab('overview')}
            className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
              dashboardSubTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </button>
          
          {/* Customer & Merchant Shared Tabs */}
          {(activeRole === 'USER' || activeRole === 'MERCHANT') && (
            <>
              <button
                onClick={() => setDashboardSubTab('marketplace')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'marketplace'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Marketplace</span>
              </button>

              <button
                onClick={() => setDashboardSubTab('ads-catalog')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'ads-catalog'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>Iklan (Classified)</span>
              </button>

              <button
                onClick={() => setDashboardSubTab('merchants-catalog')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'merchants-catalog'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Daftar Merchant</span>
              </button>

              <button
                onClick={() => setDashboardSubTab('pricing-catalog')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'pricing-catalog'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Paket Iklan</span>
              </button>
            </>
          )}

          {/* Merchant Tabs */}
          {activeRole === 'MERCHANT' && (
            <button
              onClick={() => setDashboardSubTab('products')}
              className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                dashboardSubTab === 'products'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Kelola Produk Saya</span>
            </button>
          )}

          {/* Admin Tabs */}
          {activeRole === 'ADMIN' && (
            <>
              <button
                onClick={() => setDashboardSubTab('merchants-catalog')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'merchants-catalog'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Daftar Merchant</span>
              </button>

              <button
                onClick={() => setDashboardSubTab('settings')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'settings'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Setelan Gateway</span>
              </button>
            </>
          )}
        </div>

        {/* Right Content Panel */}
        <div className="lg:col-span-9 space-y-6">
          {dashboardSubTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* User Overview */}
              {activeRole === 'USER' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <p className="text-xs font-bold text-slate-500 uppercase">Total Pesanan</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <p className="text-xs font-bold text-slate-500 uppercase">Item di Wishlist</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">{wishlist.length}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <p className="text-xs font-bold text-slate-500 uppercase">Status Akun</p>
                      <p className="text-2xl font-black text-emerald-600 mt-1">Verified Member</p>
                    </div>
                  </div>

                  {/* Buka Toko / Become Merchant CTA Card */}
                  <div className="bg-gradient-to-r from-slate-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="font-bold text-base flex items-center justify-center sm:justify-start gap-1.5 text-gold">
                        <Sparkles className="w-5 h-5 text-gold animate-bounce" />
                        Buka Toko & Jual Produk Digital Anda!
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xl">
                        Daftar menjadi Merchant Partner PT. Armada Digital Marketing Syariah secara gratis. Jual template website, desain grafis, e-book, source code, dan lainnya dengan komisi bersahabat!
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('daftar-merchant')}
                      className="px-5 py-2.5 bg-gold hover:bg-gold/90 text-navy font-bold text-xs rounded-xl shadow-xs transition-all transform active:scale-95 shrink-0"
                    >
                      Buka Toko / Daftar Merchant
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                    <h3 className="font-bold text-lg text-slate-900">Riwayat Pembelian & Download File</h3>
                    <div className="space-y-3">
                      {orders.length === 0 ? (
                        <p className="text-xs text-slate-500">Belum ada riwayat pembelian.</p>
                      ) : (
                        orders.map((order) => (
                          <div key={order.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                              <span>ID Order: #{order.id}</span>
                              <span className="text-slate-500 font-normal">{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                {order.paymentStatus}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.productId} className="flex items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-slate-400" />
                                    <span className="font-bold text-slate-900">{item.productTitle}</span>
                                  </div>
                                  <a
                                    href={item.downloadUrl || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                                  >
                                    <Download className="w-3.5 h-3.5 text-cyan-400" /> Download File
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Merchant Overview */}
              {activeRole === 'MERCHANT' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Produk Saya</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{products.length}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Penjualan</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">128 Transaksi</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase">Pendapatan Bersih</p>
                    <p className="text-2xl font-black text-cyan-600 mt-1">Rp14.850.000</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase">Rating Toko</p>
                    <p className="text-2xl font-black text-amber-500 mt-1">⭐ 4.9 / 5.0</p>
                  </div>
                </div>
              )}

              {/* Admin Overview */}
              {activeRole === 'ADMIN' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Merchant</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{merchants.length}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Iklan Tayang</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{ads.length}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase">Komisi Platform (Fee)</p>
                    <p className="text-2xl font-black text-cyan-600 mt-1">{platformSettings.transactionFeePercent}%</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase">Custom Payment Gateway</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">Status: Active</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nested catalogs */}
          {dashboardSubTab === 'marketplace' && (
            <div className="animate-in fade-in duration-200">
              <MarketplaceView />
            </div>
          )}
          {dashboardSubTab === 'ads-catalog' && (
            <div className="animate-in fade-in duration-200">
              <AdsView />
            </div>
          )}
          {dashboardSubTab === 'merchants-catalog' && (
            <div className="animate-in fade-in duration-200">
              <MerchantsView />
            </div>
          )}
          {dashboardSubTab === 'pricing-catalog' && (
            <div className="animate-in fade-in duration-200">
              <PricingView />
            </div>
          )}

          {/* Manage Products (Merchant only) */}
          {dashboardSubTab === 'products' && activeRole === 'MERCHANT' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900">Kelola Produk Digital Saya</h3>
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-cyan-400" /> Tambah Produk
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
                    <tr>
                      <th className="p-3">Produk</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Harga</th>
                      <th className="p-3">Terjual</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                          <img src={p.thumbnail || p.images?.[0] || p.imageUrl} alt={p.title} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="truncate max-w-xs">{p.title}</span>
                        </td>
                        <td className="p-3">{p.category}</td>
                        <td className="p-3 font-bold text-slate-900">Rp{p.price.toLocaleString('id-ID')}</td>
                        <td className="p-3">{p.salesCount} x</td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              deleteProduct(p.id);
                              addNotification('Produk berhasil dihapus', 'info');
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Setelan Gateway (Admin only) */}
          {dashboardSubTab === 'settings' && activeRole === 'ADMIN' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-bold text-lg text-slate-900">Pengaturan Custom Payment Gateway (by Afifah)</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs">
                  System Integration
                </span>
              </div>

              <form onSubmit={handleSavePlatformSettings} className="space-y-4 max-w-xl">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="gatewayCheck"
                    checked={gatewayEnabled}
                    onChange={(e) => setGatewayEnabled(e.target.checked)}
                    className="w-4 h-4 accent-slate-900 rounded"
                  />
                  <label htmlFor="gatewayCheck" className="text-xs font-bold text-slate-800">
                    Aktifkan Integrasi Custom Payment Gateway Otomatis
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gateway Secret API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  Simpan Konfigurasi Gateway
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Tambah Produk Digital Baru</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Produk Digital</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Source Code Aplikasi Kasir Express + React"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="99000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
                >
                  Terbit Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
