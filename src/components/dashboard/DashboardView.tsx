import React, { useState, useRef } from 'react';
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
  Bell,
  History,
  FileText,
  Wallet,
  Send,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  Camera,
  Info,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    currentUser,
    setIsLoggedIn,
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
    toggleWishlist,
    addToCart,
  } = useApp();

  const formatRupiahInput = (val: string) => {
    const numberString = val.replace(/[^0-9]/g, '');
    if (!numberString) return '';
    return new Intl.NumberFormat('id-ID').format(Number(numberString));
  };

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // User features states
  const [userBalance, setUserBalance] = useState(250000);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  
  // Custom request state
  const [isAddRequestModalOpen, setIsAddRequestModalOpen] = useState(false);
  const [customRequests, setCustomRequests] = useState(() => {
    const saved = localStorage.getItem('adms_custom_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'req-1',
        title: 'Butuh Script E-commerce PHP Native',
        category: 'Source Code',
        budget: 350000,
        desc: 'Dicari script simple e-commerce php native untuk bahan tugas kuliah.',
        status: 'OPEN',
        date: '2026-08-14'
      }
    ];
  });
  const [newReqTitle, setNewReqTitle] = useState('');
  const [newReqCategory, setNewReqCategory] = useState('Source Code');
  const [newReqBudget, setNewReqBudget] = useState('');
  const [newReqDesc, setNewReqDesc] = useState('');

  // Settings state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');
  const [profilePassword, setProfilePassword] = useState('********');
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(() => localStorage.getItem('adms_profile_image') || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Discord-like Cropper state variables
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [rawImageForCrop, setRawImageForCrop] = useState<string>('');
  const [cropperScale, setCropperScale] = useState(1);
  const [cropperOffset, setCropperOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCropper, setIsDraggingCropper] = useState(false);
  const cropperDragStart = useRef({ x: 0, y: 0 });

  // Notifications state
  const [userNotifications, setUserNotifications] = useState([
    {
      id: 'notif-dashboard-1',
      title: 'Pembayaran Sukses',
      message: 'Pembayaran order #ORD-2026-8801 sebesar Rp157.500 telah diverifikasi.',
      date: '30 menit yang lalu',
      read: false
    },
    {
      id: 'notif-dashboard-2',
      title: 'Selamat Datang',
      message: 'Selamat bergabung di platform ADMS! Temukan produk digital terbaik Anda.',
      date: '1 hari yang lalu',
      read: true
    }
  ]);

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
          <div className="w-12 h-12 rounded-xl bg-cyan-500 text-slate-950 font-black text-xl flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              activeRole === 'ADMIN' ? <ShieldCheck className="w-6 h-6" /> : activeRole === 'MERCHANT' ? <Store className="w-6 h-6" /> : <User className="w-6 h-6" />
            )}
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
          {activeRole === 'USER' && merchants.some(m => m.ownerId === currentUser.id && m.isVerified) && (
            <button
              onClick={() => {
                setIsLoggedIn(true);
                setActiveRole('MERCHANT');
                setDashboardSubTab('overview');
                addNotification('Beralih ke Dashboard Merchant', 'info');
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
              title="Masuk ke Dashboard Merchant Anda"
            >
              <Store className="w-4 h-4 text-indigo-200" />
              <span>Masuk Dashboard Merchant</span>
            </button>
          )}

          {activeRole === 'MERCHANT' && (
            <button
              onClick={() => {
                setIsLoggedIn(true);
                setActiveRole('USER');
                setDashboardSubTab('overview');
                addNotification('Beralih ke Dashboard Customer', 'info');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all active:scale-[0.98]"
              title="Ganti ke Mode Customer"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>Mode Customer</span>
            </button>
          )}

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

      {/* Dashboard Workspace */}
      <div className="flex flex-col gap-6">
        {/* Top Navigation Menu (Horizontal) */}
        <div className="relative">
          <div
            className="flex flex-row gap-1.5 p-2 bg-white border border-slate-200 rounded-2xl shadow-xs w-full overflow-x-auto scrollbar-none"
            onScroll={(e) => {
              const el = e.currentTarget;
              const fadeEl = el.nextElementSibling as HTMLElement | null;
              if (fadeEl) {
                const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
                fadeEl.style.opacity = isAtEnd ? '0' : '1';
              }
            }}
          >
          {/* Common Overview Tab */}
          <button
            onClick={() => setDashboardSubTab('overview')}
            className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
              dashboardSubTab === 'overview'
                ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </button>
          
           {/* Customer & Merchant Shared Tabs */}
          {(activeRole === 'USER' || activeRole === 'MERCHANT') && (
            <>
              {activeRole === 'USER' && (
                <button
                  onClick={() => setDashboardSubTab('marketplace')}
                  className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                    dashboardSubTab === 'marketplace'
                      ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Marketplace</span>
                </button>
              )}

              <button
                onClick={() => setDashboardSubTab('ads-catalog')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'ads-catalog'
                    ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>Iklan (Classified)</span>
              </button>

              {activeRole === 'USER' && (
                <button
                  onClick={() => setDashboardSubTab('merchants-catalog')}
                  className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                    dashboardSubTab === 'merchants-catalog'
                      ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Daftar Merchant</span>
                </button>
              )}

              <button
                onClick={() => setDashboardSubTab('pricing-catalog')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'pricing-catalog'
                    ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Paket Iklan</span>
              </button>
            </>
          )}

          {/* User Specific Tabs */}
          {activeRole === 'USER' && (
            <>
              <button
                onClick={() => setDashboardSubTab('requests')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'requests'
                    ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 text-cyan-500" />
                <span>Permintaan</span>
              </button>

              <button
                onClick={() => setDashboardSubTab('wishlist-tab')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'wishlist-tab'
                    ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Wishlist</span>
              </button>

              <button
                onClick={() => setDashboardSubTab('payments')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'payments'
                    ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-500" />
                <span>Pembayaran</span>
              </button>

              <button
                onClick={() => setDashboardSubTab('history-tab')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'history-tab'
                    ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <History className="w-4 h-4 text-indigo-500" />
                <span>Riwayat</span>
              </button>

              <button
                onClick={() => setDashboardSubTab('user-settings')}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                  dashboardSubTab === 'user-settings'
                    ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Pengaturan</span>
              </button>
            </>
          )}

          {/* Merchant Tabs */}
          {activeRole === 'MERCHANT' && (
            <button
              onClick={() => setDashboardSubTab('products')}
              className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shrink-0 ${
                dashboardSubTab === 'products'
                  ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
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
                    ? 'bg-navy/10 text-navy border border-navy/10 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Setelan Gateway</span>
              </button>
            </>
          )}
          </div>
          {/* Right fade scroll indicator */}
          <div
            className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none rounded-r-2xl transition-opacity duration-300"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.95) 70%)' }}
          />
        </div>

        {/* Content Panel */}
        <div className="space-y-6 w-full">
          {dashboardSubTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* User Overview */}
              {activeRole === 'USER' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Saldo Dompet ADMS</p>
                        <p className="text-2xl font-black text-cyan-600 mt-1">Rp{userBalance.toLocaleString('id-ID')}</p>
                      </div>
                      <button
                        onClick={() => setIsTopUpModalOpen(true)}
                        className="mt-2 w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Top Up Saldo</span>
                      </button>
                    </div>
                  </div>

                  {/* Buka Toko / Become Merchant CTA Card */}
                  {!merchants.some(m => m.ownerId === currentUser.id) && (
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
                  )}

                  {/* Pending Verification Banner */}
                  {merchants.some(m => m.ownerId === currentUser.id && !m.isVerified) && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-2xl shadow-sm flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Toko Anda Sedang Ditinjau</h4>
                        <p className="text-xs mt-0.5 opacity-90">Pendaftaran merchant Anda sedang dalam proses peninjauan oleh admin. Mohon ditunggu.</p>
                      </div>
                    </div>
                  )}

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
              {activeRole === 'USER' ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8 max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-navy/5 text-navy rounded-full flex items-center justify-center mx-auto mb-4">
                      <Store className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-navy">Daftar Menjadi Merchant Partner</h3>
                    <p className="text-sm text-slate-500 max-w-lg mx-auto">Mulai jualan produk digital Anda sendiri dan kembangkan bisnis bersama PT. Armada Digital Marketing Syariah.</p>
                  </div>

                  {/* Benefits Grid */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Benefit Menjadi Merchant</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-navy">Komisi Rendah</h5>
                          <p className="text-xs text-slate-500 mt-1">Kami menawarkan potongan komisi yang sangat bersahabat bagi setiap penjualan produk digital Anda.</p>
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-navy">Pasar Luas & Terarget</h5>
                          <p className="text-xs text-slate-500 mt-1">Produk Anda akan langsung diakses oleh ribuan pembeli aktif yang membutuhkan aset digital profesional.</p>
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-navy">Manajemen Produk Instan</h5>
                          <p className="text-xs text-slate-500 mt-1">Unggah, edit, dan kelola file produk digital Anda dengan dashboard toko merchant yang canggih.</p>
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-navy">Keamanan Syariah</h5>
                          <p className="text-xs text-slate-500 mt-1">Transaksi yang transparan, adil, aman, dan mematuhi nilai-nilai syariah untuk ketenangan berbisnis.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                    <h4 className="font-bold text-sm text-amber-800 flex items-center gap-1.5">
                      <Info className="w-4 h-4" />
                      Syarat & Ketentuan Merchant
                    </h4>
                    <ul className="list-disc list-inside text-xs text-amber-900/80 space-y-1.5 pl-1">
                      <li>Produk harus merupakan karya asli atau memiliki hak lisensi distribusi yang sah (dilarang menjual produk bajakan).</li>
                      <li>Kategori produk mencakup Template Web, Source Code, Grafis/Desain Canva, E-book, Jasa IT, dan Layanan bisnis digital lainnya.</li>
                      <li>Wajib menyediakan support/bantuan perbaikan jika file digital yang diunduh mengalami kerusakan/error.</li>
                      <li>Mengisi informasi toko secara lengkap, jujur, dan dapat dihubungi melalui WhatsApp aktif.</li>
                    </ul>
                  </div>

                  {/* Call to Action */}
                  <div className="text-center pt-2">
                    <button
                      onClick={() => navigate('daftar-merchant')}
                      className="px-8 py-3.5 bg-navy hover:bg-navy/90 text-gold font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
                    >
                      Mulai Daftar Toko Merchant Sekarang
                    </button>
                  </div>
                </div>
              ) : (
                <MerchantsView />
              )}
            </div>
          )}
          {dashboardSubTab === 'pricing-catalog' && (
            <div className="animate-in fade-in duration-200">
              <PricingView />
            </div>
          )}

          {/* User: Permintaan Custom */}
          {dashboardSubTab === 'requests' && activeRole === 'USER' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Daftar Permintaan Custom Saya</h3>
                  <p className="text-xs text-slate-500">Ajukan kebutuhan script, template, atau jasa khusus kepada para Merchant partner kami.</p>
                </div>
                <button
                  onClick={() => setIsAddRequestModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <PlusCircle className="w-4 h-4 text-cyan-400" />
                  <span>Ajukan Permintaan</span>
                </button>
              </div>

              <div className="space-y-4">
                {customRequests.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">Belum ada permintaan custom yang diajukan.</p>
                ) : (
                  customRequests.map((req) => (
                    <div key={req.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <div>
                          <span className="px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase mr-2">{req.category}</span>
                          <span className="text-xs text-slate-400 font-mono">#{req.id}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {req.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm">{req.title}</h4>
                        <p className="text-xs text-slate-600">{req.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-500 font-medium">Diajukan pada: {req.date}</span>
                        <span className="font-black text-slate-900">Budget: Rp{req.budget.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* User: Wishlist */}
          {dashboardSubTab === 'wishlist-tab' && activeRole === 'USER' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs animate-in fade-in duration-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Wishlist Saya</h3>
                <p className="text-xs text-slate-500">Daftar produk digital yang Anda simpan untuk dibeli nanti.</p>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">Wishlist Anda kosong.</p>
                  <button onClick={() => setDashboardSubTab('marketplace')} className="text-xs font-bold text-cyan-600 hover:underline">
                    Jelajahi Marketplace
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products
                    .filter((p) => wishlist.includes(p.id) || wishlist.includes(p.slug))
                    .map((p) => (
                      <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3 items-center">
                        <img src={p.thumbnail} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-950 text-xs truncate">{p.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">{p.categoryName}</p>
                          <p className="font-black text-slate-900 text-xs mt-1">Rp{p.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => addToCart(p)}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-colors shrink-0"
                          >
                            Beli
                          </button>
                          <button
                            onClick={() => {
                              toggleWishlist(p.id);
                              addNotification('Dihapus dari Wishlist', 'info');
                            }}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px] rounded-lg transition-colors shrink-0"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* User: Pembayaran / Invoice History */}
          {dashboardSubTab === 'payments' && activeRole === 'USER' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs animate-in fade-in duration-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Riwayat Pembayaran & Invoice</h3>
                <p className="text-xs text-slate-500">Pantau transaksi dan unduh invoice resmi pembelian Anda.</p>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">Belum ada transaksi pembayaran.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-bold text-slate-900">Invoice #{order.id}</span>
                          <span className="text-slate-500 ml-2">{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="space-y-1">
                          <p className="text-slate-600 font-medium">Metode: <strong className="text-slate-900 uppercase">{order.paymentMethod}</strong></p>
                          <p className="text-slate-600 font-medium">Subtotal: Rp{order.subtotal.toLocaleString('id-ID')}</p>
                          <p className="text-slate-600 font-medium">Platform Fee: Rp{order.platformFee.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-500">Total Dibayar</p>
                          <p className="font-black text-slate-900 text-base">Rp{order.totalAmount.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* User: Riwayat */}
          {dashboardSubTab === 'history-tab' && activeRole === 'USER' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Riwayat & Pemberitahuan</h3>
                  <p className="text-xs text-slate-500">Informasi terbaru mengenai aktivitas akun dan transaksi Anda.</p>
                </div>
                <button
                  onClick={() => {
                    setUserNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                    addNotification('Semua riwayat ditandai telah dibaca', 'info');
                  }}
                  className="text-xs font-bold text-cyan-600 hover:underline"
                >
                  Tandai semua dibaca
                </button>
              </div>

              <div className="space-y-3">
                {userNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-xl border flex gap-3 items-start transition-colors ${
                      n.read ? 'bg-white border-slate-100' : 'bg-cyan-50/30 border-cyan-100'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${n.read ? 'bg-slate-100 text-slate-500' : 'bg-cyan-100 text-cyan-600'}`}>
                      <History className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-xs">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User: Pengaturan Profil */}
          {dashboardSubTab === 'user-settings' && activeRole === 'USER' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs animate-in fade-in duration-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Pengaturan Akun & Profil</h3>
                <p className="text-xs text-slate-500">Perbarui informasi pribadi dan atur keamanan akun Anda.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                {/* Left Card: Avatar & Stats Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center space-y-4 shadow-xs">
                  <div className="relative group">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setRawImageForCrop(event.target.result as string);
                              setCropperScale(1);
                              setCropperOffset({ x: 0, y: 0 });
                              setIsCropperOpen(true);
                            }
                          };
                          reader.readAsDataURL(e.target.files[0] as Blob);
                        }
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-full bg-gradient-to-tr from-navy to-navy-light text-white font-extrabold text-3xl flex items-center justify-center shadow-md overflow-hidden cursor-pointer relative"
                    >
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        profileName ? profileName.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() : 'U'
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full border-2 border-white flex items-center justify-center shadow-md transition-colors"
                      title="Ubah Foto Profil"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm">{profileName || 'Nama Pengguna'}</h4>
                    <p className="text-xs text-slate-500">{profileEmail}</p>
                  </div>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy/10 text-navy text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> Customer ADMS
                  </div>

                  <div className="w-full pt-4 border-t border-slate-200 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <span className="block font-black text-slate-900">Aktif</span>
                      <span className="text-[10px] text-slate-400">Status Akun</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <span className="block font-black text-slate-900">2026</span>
                      <span className="text-[10px] text-slate-400">Tahun Gabung</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Settings Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addNotification('Informasi profil berhasil disimpan!', 'success');
                  }}
                  className="lg:col-span-2 space-y-6"
                >
                  {/* Section 1: Informasi Pribadi */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-500" /> Informasi Pribadi
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                            placeholder="Nama Lengkap Anda"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                            placeholder="Alamat Email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor WhatsApp</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                            placeholder="Nomor WhatsApp"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showProfilePassword ? "text" : "password"}
                            value={profilePassword}
                            onChange={(e) => setProfilePassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                            placeholder="Keamanan Akun"
                          />
                          <button
                            type="button"
                            onClick={() => setShowProfilePassword(!showProfilePassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                          >
                            {showProfilePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-navy hover:bg-navy/90 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-98"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
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
      {/* Modal: Top Up Saldo */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-500" />
                <span>Top Up Saldo Dompet ADMS</span>
              </h3>
              <button onClick={() => setIsTopUpModalOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amt = parseFloat(topUpAmount);
                if (amt > 0) {
                  setUserBalance((prev) => prev + amt);
                  addNotification(`Top up berhasil! Saldo bertambah Rp${amt.toLocaleString('id-ID')}`, 'success');
                  setIsTopUpModalOpen(false);
                  setTopUpAmount('');
                } else {
                  addNotification('Masukkan nominal top up yang valid', 'error');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nominal Top Up (Rp)</label>
                <input
                  type="number"
                  required
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Contoh: 100000"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[50000, 100000, 250000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTopUpAmount(val.toString())}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors"
                  >
                    Rp{val.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTopUpModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Proses Top Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ajukan Permintaan Custom */}
      {isAddRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Ajukan Permintaan Custom</h3>
              <button onClick={() => setIsAddRequestModalOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newReqTitle || !newReqBudget) {
                  addNotification('Mohon lengkapi judul dan budget permintaan', 'error');
                  return;
                }
                const newReq = {
                  id: `req-${Date.now()}`,
                  title: newReqTitle,
                  category: newReqCategory,
                  budget: parseFloat(newReqBudget.replace(/\./g, '')) || 0,
                  desc: newReqDesc,
                  status: 'OPEN',
                  date: new Date().toISOString().split('T')[0]
                };
                setCustomRequests((prev) => {
                  const updated = [newReq, ...prev];
                  localStorage.setItem('adms_custom_requests', JSON.stringify(updated));
                  return updated;
                });
                addNotification('Permintaan custom berhasil diajukan ke Merchant!', 'success');
                setIsAddRequestModalOpen(false);
                setNewReqTitle('');
                setNewReqBudget('');
                setNewReqDesc('');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Permintaan</label>
                <input
                  type="text"
                  required
                  value={newReqTitle}
                  onChange={(e) => setNewReqTitle(e.target.value)}
                  placeholder="Contoh: Butuh Landing Page Undangan Digital"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newReqCategory}
                    onChange={(e) => setNewReqCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-white"
                  >
                    <option value="Source Code">Source Code</option>
                    <option value="Template & Design">Template & Design</option>
                    <option value="Jasa Pembuatan">Jasa Pembuatan</option>
                    <option value="Ebook / Dokumentasi">Ebook / Dokumentasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Budget Kisaran (Rp)</label>
                  <input
                    type="text"
                    required
                    value={newReqBudget}
                    onChange={(e) => setNewReqBudget(formatRupiahInput(e.target.value))}
                    placeholder="250.000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Kebutuhan Lengkap <span className="text-slate-400 font-normal">(Opsional)</span></label>
                <textarea
                  rows={3}
                  value={newReqDesc}
                  onChange={(e) => setNewReqDesc(e.target.value)}
                  placeholder="Jelaskan secara detail spesifikasi script atau template yang Anda butuhkan..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRequestModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Kirim Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discord-like Circular Avatar Cropper Modal */}
      {isCropperOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-white">Sesuaikan Foto Profil</h3>
              <p className="text-[11px] text-slate-400">Geser dan perbesar foto Anda agar pas dengan lingkaran.</p>
            </div>

            {/* Crop Area Container */}
            <div className="flex justify-center">
              <div 
                className="w-[320px] h-[320px] bg-slate-950 rounded-2xl relative overflow-hidden select-none cursor-move touch-none"
                onMouseDown={(e) => {
                  setIsDraggingCropper(true);
                  cropperDragStart.current = {
                    x: e.clientX - cropperOffset.x,
                    y: e.clientY - cropperOffset.y
                  };
                }}
                onMouseMove={(e) => {
                  if (!isDraggingCropper) return;
                  setCropperOffset({
                    x: e.clientX - cropperDragStart.current.x,
                    y: e.clientY - cropperDragStart.current.y
                  });
                }}
                onMouseUp={() => setIsDraggingCropper(false)}
                onMouseLeave={() => setIsDraggingCropper(false)}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    setIsDraggingCropper(true);
                    cropperDragStart.current = {
                      x: e.touches[0].clientX - cropperOffset.x,
                      y: e.touches[0].clientY - cropperOffset.y
                    };
                  }
                }}
                onTouchMove={(e) => {
                  if (!isDraggingCropper || e.touches.length !== 1) return;
                  setCropperOffset({
                    x: e.touches[0].clientX - cropperDragStart.current.x,
                    y: e.touches[0].clientY - cropperDragStart.current.y
                  });
                }}
                onTouchEnd={() => setIsDraggingCropper(false)}
              >
                {/* Scaled/Panned Image */}
                <img
                  src={rawImageForCrop}
                  alt="Raw Preview"
                  draggable={false}
                  className="absolute pointer-events-none origin-center transition-transform duration-75 select-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${cropperOffset.x}px, ${cropperOffset.y}px) scale(${cropperScale})`,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    width: '320px',
                    height: 'auto'
                  }}
                />

                {/* Circular Mask Overlay */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full" viewBox="0 0 320 320">
                  <defs>
                    <mask id="crop-mask-circle">
                      <rect width="320" height="320" fill="white" />
                      <circle cx="160" cy="160" r="100" fill="black" />
                    </mask>
                  </defs>
                  <rect width="320" height="320" fill="rgba(15, 23, 42, 0.75)" mask="url(#crop-mask-circle)" />
                  <circle cx="160" cy="160" r="100" stroke="#00c853" strokeWidth="2" strokeDasharray="4" fill="none" />
                </svg>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Perbesar / Perkecil</span>
                <span>{(cropperScale * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={cropperScale}
                onChange={(e) => setCropperScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCropperOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-400 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const canvas = document.createElement('canvas');
                  canvas.width = 200;
                  canvas.height = 200;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    const img = new Image();
                    img.onload = () => {
                      ctx.clearRect(0, 0, 200, 200);
                      // Draw circular path clip
                      ctx.beginPath();
                      ctx.arc(100, 100, 100, 0, Math.PI * 2);
                      ctx.clip();
                      
                      // Save state
                      ctx.save();
                      ctx.translate(100, 100);
                      ctx.scale(cropperScale, cropperScale);
                      
                      // Calculate image aspect ratio scale
                      let drawW = 320;
                      let drawH = 320;
                      const imgAspect = img.width / img.height;
                      if (imgAspect > 1) {
                        drawH = 320;
                        drawW = 320 * imgAspect;
                      } else {
                        drawW = 320;
                        drawH = 320 / imgAspect;
                      }

                      ctx.translate(cropperOffset.x / cropperScale, cropperOffset.y / cropperScale);
                      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
                      ctx.restore();

                      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9);
                      setProfileImage(croppedBase64);
                      localStorage.setItem('adms_profile_image', croppedBase64);
                      addNotification('Foto profil berhasil dipotong & disimpan!', 'success');
                      setIsCropperOpen(false);
                    };
                    img.src = rawImageForCrop;
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
