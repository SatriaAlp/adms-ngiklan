import React, { createContext, useContext, useState } from 'react';
import {
  User,
  UserRole,
  Product,
  Merchant,
  Category,
  Advertisement,
  AdPackage,
  CartItem,
  Order,
  PlatformSettings,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_MERCHANTS,
  INITIAL_PRODUCTS,
  INITIAL_AD_PACKAGES,
  INITIAL_ADVERTISEMENTS,
  INITIAL_ORDERS,
  INITIAL_PLATFORM_SETTINGS,
} from '../data/mockData';
import { paymentService } from '../services/paymentService';
import { evaluateAdContent } from '../utils/moderationEngine';
import { api } from '../services/apiClient';

interface NavigationParams {
  productId?: string;
  merchantId?: string;
  adId?: string;
  category?: string;
}

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: User;
  activeRole: UserRole;
  setActiveRole: (role: UserRole, name?: string) => void;
  activeTab: string;
  navigate: (tab: string, params?: NavigationParams, forceAccess?: boolean) => void;
  selectedProductId: string | null;
  selectedMerchantId: string | null;
  selectedAdId: string | null;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dashboardSubTab: string;
  setDashboardSubTab: (subTab: string) => void;
  activeSearchTypeTab: 'semua' | 'produk' | 'iklan' | 'merchant';
  setActiveSearchTypeTab: (tab: 'semua' | 'produk' | 'iklan' | 'merchant') => void;

  products: Product[];
  categories: Category[];
  merchants: Merchant[];
  ads: Advertisement[];
  adPackages: AdPackage[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  platformSettings: PlatformSettings;
  notifications: ToastNotification[];

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;

  createProduct: (productData: Partial<Product>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  createAd: (adData: Partial<Advertisement>) => void;
  updateAd: (id: string, adData: Partial<Advertisement>) => void;
  deleteAd: (id: string) => void;
  approveAd: (id: string) => void;
  rejectAd: (id: string) => void;

  updateAdPackage: (id: string, packageData: Partial<AdPackage>) => void;
  updatePlatformSettings: (settingsData: Partial<PlatformSettings>) => void;

  placeOrder: (orderInfo: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: any;
    items: CartItem[];
  }) => Promise<Order>;

  addNotification: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeNotification: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isCreateAdModalOpen: boolean;
  setIsCreateAdModalOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  cartDrawerTab: 'cart' | 'wishlist';
  setCartDrawerTab: (tab: 'cart' | 'wishlist') => void;
  pendingPostAd: boolean;
  setPendingPostAd: (pending: boolean) => void;
  pendingAdPublishPayload: any | null;
  setPendingAdPublishPayload: (payload: any | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<UserRole>('USER');
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-1001',
    name: 'Afifah Rizki',
    email: 'afifahrizki25@gmail.com',
    phone: '081234567890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'USER',
    merchantId: 'm-1',
    createdAt: '2026-01-01',
  });

  const setActiveRole = (role: UserRole, name?: string) => {
    setActiveRoleState(role);
    setCurrentUser((prev) => ({
      ...prev,
      role,
      name: name || (role === 'ADMIN' ? 'Administrator' : role === 'MERCHANT' ? 'Merchant Partner' : 'Customer Umum'),
    }));
  };

  const [activeTab, setActiveTab] = useState<string>('home');
  const [dashboardSubTab, setDashboardSubTabState] = useState<string>('overview');

  const setDashboardSubTab = (subTab: string) => {
    setDashboardSubTabState(subTab);
    let subSegment = subTab;
    if (subTab === 'ads-catalog') subSegment = 'ads';
    else if (subTab === 'merchants-catalog') subSegment = 'merchants';
    else if (subTab === 'pricing-catalog') subSegment = 'pricing';
    
    let path = '/dashboard';
    if (subSegment !== 'overview') {
      path = `/dashboard/${subSegment}`;
    }
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchTypeTab, setActiveSearchTypeTab] = useState<'semua' | 'produk' | 'iklan' | 'merchant'>('semua');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [merchants, setMerchants] = useState<Merchant[]>(INITIAL_MERCHANTS);
  const [ads, setAds] = useState<Advertisement[]>(INITIAL_ADVERTISEMENTS);
  const [adPackages, setAdPackages] = useState<AdPackage[]>(INITIAL_AD_PACKAGES);

  const fetchProducts = async () => {
    try {
      const backendProducts = await api.getPublicProducts();
      if (backendProducts && backendProducts.length > 0) {
        const mappedProducts: Product[] = backendProducts.map(bp => ({
          id: bp.id,
          title: bp.title,
          slug: bp.slug,
          category: (bp.category?.slug || 'lainnya') as any,
          categoryName: bp.category?.name || 'Lainnya',
          merchantId: bp.merchant?.id || '',
          merchantName: bp.merchant?.name || '',
          merchantLogo: bp.merchant?.logo || '',
          priceType: bp.priceType || 'FIXED',
          price: Number(bp.price) || 0,
          discountPrice: bp.discountPrice ? Number(bp.discountPrice) : undefined,
          rating: 0,
          reviewCount: 0,
          salesCount: 0,
          thumbnail: bp.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
          images: [bp.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'],
          shortDescription: bp.shortDescription || '',
          fullDescription: bp.fullDescription || '',
          features: ['Lisensi Penggunaan', 'Akses Seumur Hidup'],
          specifications: { Format: 'ZIP / PDF' },
          status: bp.status === 'ACTIVE' || bp.status === 'APPROVED' ? 'published' : 'pending',
          packages: bp.packages ? bp.packages.map((pkg: any) => ({
            id: pkg.id,
            name: pkg.name,
            price: Number(pkg.price) || 0,
            description: pkg.description,
            features: pkg.features ? JSON.parse(pkg.features) : [],
            deliveryTime: pkg.deliveryTime
          })) : [],
          createdAt: bp.createdAt
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch public products', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const backendCategories = await api.getCategories();
      if (backendCategories && backendCategories.length > 0) {
        const mappedCats = backendCategories.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          iconName: c.iconName || 'Layout',
          description: c.description || '',
          productCount: c._count?.products || 0
        }));
        setCategories(mappedCats);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  React.useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1']);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(INITIAL_PLATFORM_SETTINGS);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [cartDrawerTab, setCartDrawerTab] = useState<'cart' | 'wishlist'>('cart');
  const [pendingPostAd, setPendingPostAd] = useState<boolean>(false);
  const [pendingAdPublishPayload, setPendingAdPublishPayload] = useState<any | null>(null);

  const addNotification = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = `notif-${Date.now()}-${Math.random().toString().slice(2, 6)}`;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const navigate = (tab: string, params?: NavigationParams, forceAccess: boolean = false) => {
    const isDashboardAccess = ['dashboard', 'marketplace', 'ads', 'merchants', 'pricing'].includes(tab);
    if (isDashboardAccess && !isLoggedIn && !forceAccess) {
      addNotification('Silakan masuk (login) terlebih dahulu untuk mengakses area Dashboard.', 'warning');
      setIsLoginModalOpen(true);
      return;
    }
    if (tab === 'pasang-iklan-gratis' && !isLoggedIn && !forceAccess) {
      addNotification('Silakan login terlebih dahulu untuk memasang iklan gratis.', 'warning');
      setPendingPostAd(true);
      setIsLoginModalOpen(true);
      return;
    }

    let subTabName = '';
    if (tab === 'marketplace' || tab === 'ads' || tab === 'merchants' || tab === 'pricing') {
      setActiveTab('dashboard');
      const resolvedSubTab = 
        tab === 'ads' ? 'ads-catalog' : 
        tab === 'merchants' ? 'merchants-catalog' : 
        tab === 'pricing' ? 'pricing-catalog' : 
        tab;
      setDashboardSubTabState(resolvedSubTab);
      subTabName = tab;
    } else {
      setActiveTab(tab);
    }
    if (params) {
      if (params.productId) setSelectedProductId(params.productId);
      if (params.merchantId) setSelectedMerchantId(params.merchantId);
      if (params.adId) setSelectedAdId(params.adId);
      if (params.category !== undefined) setSelectedCategory(params.category);
    }

    let path = '/';
    if (['iklan-gratis', 'pasang-iklan-gratis', 'upload-produk', 'daftar-merchant', 'bantuan'].includes(tab)) {
      path = `/${tab}`;
    } else if (tab === 'dashboard') {
      path = '/dashboard';
    } else if (subTabName) {
      path = `/dashboard/${subTabName}`;
    }
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '/home') {
        setActiveTab('home');
      } else if (path === '/iklan-gratis') {
        setActiveTab('iklan-gratis');
      } else if (path === '/pasang-iklan-gratis') {
        if (!isLoggedIn) {
          setActiveTab('home');
          window.history.replaceState(null, '', '/');
          setIsLoginModalOpen(true);
          setPendingPostAd(true);
          addNotification('Silakan login terlebih dahulu untuk memasang iklan gratis.', 'warning');
        } else {
          setActiveTab('pasang-iklan-gratis');
        }
      } else if (path === '/upload-produk') {
        setActiveTab('upload-produk');
      } else if (path === '/daftar-merchant') {
        setActiveTab('daftar-merchant');
      } else if (path === '/bantuan') {
        setActiveTab('bantuan');
      } else if (path.startsWith('/dashboard')) {
        setActiveTab('dashboard');
        const segments = path.split('/');
        if (segments[2]) {
          const sub = segments[2];
          setDashboardSubTabState(
            sub === 'ads' ? 'ads-catalog' : 
            sub === 'merchants' ? 'merchants-catalog' : 
            sub === 'pricing' ? 'pricing-catalog' : 
            sub
          );
        } else {
          setDashboardSubTabState('overview');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isLoggedIn]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        addNotification(`Jumlah ${product.title} di keranjang bertambah!`, 'success');
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      addNotification(`${product.title} telah ditambahkan ke keranjang!`, 'success');
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addNotification('Produk dihapus dari keranjang', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        addNotification('Dihapus dari Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addNotification('Ditambahkan ke Wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const createProduct = async (productData: Partial<Product>) => {
    try {
      addNotification('Memproses penambahan produk...', 'info');
      await api.createMerchantProduct({
        title: productData.title,
        price: productData.price,
        discountPrice: productData.discountPrice,
        shortDescription: productData.shortDescription,
        fullDescription: productData.fullDescription,
        categoryId: null, // Let backend fallback to default category if not exact ID
      });
      addNotification('Produk berhasil dikirim dan menunggu verifikasi Admin!', 'success');
      await fetchProducts(); // Refresh the list
    } catch (error) {
      addNotification('Gagal membuat produk ke server', 'error');
    }
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
    addNotification('Data produk berhasil diperbarui', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addNotification('Produk berhasil dihapus', 'info');
  };

  const createAd = (adData: Partial<Advertisement>) => {
    const moderation = evaluateAdContent(
      adData.title || '',
      adData.description || '',
      adData.category || ''
    );

    if (moderation.recommendedAction === 'REJECT') {
      addNotification('Iklan ditolak: ' + moderation.reason, 'error');
      return;
    }

    const newAd: Advertisement = {
      id: `ad-${Date.now()}`,
      title: adData.title || 'Iklan Promosi Baru',
      category: adData.category || 'jasa',
      subcategory: adData.subcategory,
      description: adData.description || 'Deskripsi promosi iklan di ADMS.',
      price: adData.price || 0,
      images: adData.images || ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'],
      location: adData.location || 'Indonesia',
      contactName: adData.contactName || currentUser.name,
      whatsapp: adData.whatsapp || currentUser.phone || '081234567890',
      websiteUrl: adData.websiteUrl,
      condition: adData.condition || 'jasa',
      tags: adData.tags || ['iklan', 'promosi'],
      durationDays: adData.durationDays || 7,
      type: adData.type || 'free',
      status: moderation.recommendedAction === 'PENDING' ? 'pending' : 'published',
      merchantName: currentUser.name,
      viewsCount: 0,
      clicksCount: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (adData.durationDays || 7) * 86400000).toISOString(),
      packageName: adData.type === 'free' ? 'Iklan Gratis' : 'Paket Promosi',
    };
    setAds((prev) => [newAd, ...prev]);
    
    if (moderation.recommendedAction === 'PENDING') {
      addNotification('Iklan ditahan: ' + moderation.reason, 'warning');
    } else {
      addNotification('Iklan berhasil dibuat dan telah ditayangkan secara publik!', 'success');
    }
  };

  const approveAd = (id: string) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'published' } : a)));
    addNotification('Iklan berhasil disetujui dan ditayangkan', 'success');
  };

  const rejectAd = (id: string) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
    addNotification('Iklan telah ditolak secara permanen', 'error');
  };

  const updateAd = (id: string, adData: Partial<Advertisement>) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, ...adData } : a)));
    addNotification('Data iklan berhasil diperbarui', 'success');
  };

  const deleteAd = (id: string) => {
    setAds((prev) => prev.filter((a) => a.id !== id));
    addNotification('Iklan berhasil dihapus', 'info');
  };

  const updateAdPackage = (id: string, packageData: Partial<AdPackage>) => {
    setAdPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, ...packageData } : pkg))
    );
    addNotification('Paket iklan berhasil diperbarui', 'success');
  };

  const updatePlatformSettings = (settingsData: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => ({ ...prev, ...settingsData }));
    addNotification('Konfigurasi biaya platform berhasil disimpan', 'success');
  };

  const placeOrder = async (orderInfo: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: any;
    items: CartItem[];
  }): Promise<Order> => {
    const subtotal = orderInfo.items.reduce(
      (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
      0
    );
    const platformFee = Math.round((subtotal * platformSettings.transactionFeePercent) / 100);
    const totalAmount = subtotal + platformFee;

    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Call Payment Abstraction Layer
    const paymentResult = await paymentService.processPayment({
      orderId,
      amount: totalAmount,
      customer: {
        name: orderInfo.customerName,
        email: orderInfo.customerEmail,
        phone: orderInfo.customerPhone,
      },
      paymentMethod: orderInfo.paymentMethod,
      transactionType: 'product_purchase',
    });

    const newOrder: Order = {
      id: orderId,
      customerName: orderInfo.customerName,
      customerEmail: orderInfo.customerEmail,
      customerPhone: orderInfo.customerPhone,
      items: orderInfo.items.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        productThumbnail: item.product.thumbnail,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
        downloadUrl: item.product.downloadUrl || `/api/download/${orderId}/${item.product.id}`,
      })),
      subtotal,
      discount: 0,
      platformFee,
      totalAmount,
      paymentMethod: orderInfo.paymentMethod,
      paymentStatus: paymentResult.status,
      transactionType: 'product_purchase',
      createdAt: new Date().toISOString(),
      paidAt: paymentResult.status === 'paid' ? new Date().toISOString() : undefined,
      downloadKey: `KEY-${orderId}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Increment sales count for purchased products
    setProducts((prev) =>
      prev.map((p) => {
        const item = orderInfo.items.find((i) => i.product.id === p.id);
        return item ? { ...p, salesCount: p.salesCount + item.quantity } : p;
      })
    );

    addNotification('Pembayaran berhasil! Produk digital siap diunduh.', 'success');
    return newOrder;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        setActiveRole,
        activeTab,
        navigate,
        dashboardSubTab,
        setDashboardSubTab,
        selectedProductId,
        selectedMerchantId,
        selectedAdId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeSearchTypeTab,
        setActiveSearchTypeTab,

        products,
        categories,
        merchants,
        ads,
        adPackages,
        cart,
        wishlist,
        orders,
        platformSettings,
        notifications,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,

        createProduct,
        updateProduct,
        deleteProduct,

        createAd,
        updateAd,
        deleteAd,

        updateAdPackage,
        updatePlatformSettings,
        placeOrder,

        addNotification,
        removeNotification,

        isCartOpen,
        setIsCartOpen,
        isChatOpen,
        setIsChatOpen,
        isCreateAdModalOpen,
        setIsCreateAdModalOpen,
        isLoggedIn,
        setIsLoggedIn,
        isLoginModalOpen,
        setIsLoginModalOpen,
        cartDrawerTab,
        setCartDrawerTab,
        pendingPostAd,
        setPendingPostAd,
        pendingAdPublishPayload,
        setPendingAdPublishPayload,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
