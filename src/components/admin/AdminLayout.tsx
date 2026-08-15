import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Users, Store, ShoppingBag, Receipt, Wallet, 
  Megaphone, Tag, ShieldAlert, LifeBuoy, BarChart, Edit, 
  Bell, Settings, ShieldCheck, UserCircle, Menu, X, ChevronDown, ChevronRight, LogOut
} from 'lucide-react';
import { AdminOverview } from './AdminOverview';
import { UsersView } from './users/UsersView';
import { MerchantsListView } from './merchants/MerchantsListView';
import { MerchantVerificationView } from './merchants/MerchantVerificationView';
import { ProductsListView } from './marketplace/ProductsListView';
import { ProductModerationView } from './marketplace/ProductModerationView';
import { CategoriesView } from './marketplace/CategoriesView';
import { TransactionsView } from './transactions/TransactionsView';
import { RefundsView } from './transactions/RefundsView';
import { FinanceRevenueView } from './finance/FinanceRevenueView';
import { MerchantBalanceView } from './finance/MerchantBalanceView';
import { WithdrawalsView } from './finance/WithdrawalsView';
import { AdsManagementView } from './advertising/AdsManagementView';
import { AdApprovalView } from './advertising/AdApprovalView';
import { PromoView } from './promo/PromoView';
import { ModerationView } from './moderation/ModerationView';
import { SupportView } from './support/SupportView';
import { AnalyticsView } from './analytics/AnalyticsView';
import { CmsView } from './cms/CmsView';
import { SettingsView } from './settings/SettingsView';
import { NotificationsView } from './settings/NotificationsView';
import { SecurityView } from './security/SecurityView';

// Placeholder components for phases
const PlaceholderView = ({ title }: { title: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
      <Settings className="w-8 h-8 text-slate-400" />
    </div>
    <h2 className="text-xl font-bold text-slate-900 mb-2">Modul {title}</h2>
    <p className="text-slate-500">Modul ini sedang dalam tahap pengembangan (Phase selanjutnya).</p>
  </div>
);

type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  subItems?: { id: string; label: string }[];
};

const MENU_ITEMS: MenuItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { 
    id: 'users', label: 'Users', icon: Users,
    subItems: [
      { id: 'users-all', label: 'Semua User' },
      { id: 'users-customer', label: 'Customer' },
      { id: 'users-merchant', label: 'Merchant' },
      { id: 'users-admin', label: 'Admin' },
    ]
  },
  { 
    id: 'merchants', label: 'Merchant', icon: Store,
    subItems: [
      { id: 'merchants-all', label: 'Semua Merchant' },
      { id: 'merchants-verification', label: 'Verification' },
    ]
  },
  { 
    id: 'marketplace', label: 'Marketplace', icon: ShoppingBag,
    subItems: [
      { id: 'marketplace-products', label: 'Produk' },
      { id: 'marketplace-moderation', label: 'Moderation' },
      { id: 'marketplace-categories', label: 'Kategori' },
    ]
  },
  { 
    id: 'transactions', label: 'Transactions', icon: Receipt,
    subItems: [
      { id: 'transactions-orders', label: 'Pesanan' },
      { id: 'transactions-refunds', label: 'Refunds' },
    ]
  },
  { 
    id: 'finance', label: 'Finance', icon: Wallet,
    subItems: [
      { id: 'finance-revenue', label: 'Revenue & Komisi' },
      { id: 'finance-balance', label: 'Merchant Balance' },
      { id: 'finance-withdrawal', label: 'Withdrawal' },
    ]
  },
  { 
    id: 'advertising', label: 'Advertising', icon: Megaphone,
    subItems: [
      { id: 'advertising-manage', label: 'Manage Ads' },
      { id: 'advertising-approval', label: 'Ad Approval' },
    ]
  },
  { id: 'promo', label: 'Promo', icon: Tag },
  { id: 'moderation', label: 'Moderation', icon: ShieldAlert },
  { id: 'support', label: 'Support', icon: LifeBuoy },
  { id: 'analytics', label: 'Analytics', icon: BarChart },
  { id: 'cms', label: 'CMS', icon: Edit },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export const AdminLayout: React.FC = () => {
  const { currentUser, navigate, setIsLoggedIn } = useApp();
  const [activeModule, setActiveModule] = useState('overview');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['users', 'merchants', 'marketplace']);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleExpand = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const handleMenuClick = (moduleId: string) => {
    setActiveModule(moduleId);
    setIsMobileSidebarOpen(false);
  };

  const renderContent = () => {
    if (activeModule === 'overview') return <AdminOverview onNavigate={handleMenuClick} />;
    if (activeModule.startsWith('users')) return <UsersView />;
    if (activeModule === 'merchants-all') return <MerchantsListView />;
    if (activeModule === 'merchants-verification') return <MerchantVerificationView />;
    if (activeModule === 'marketplace-products') return <ProductsListView />;
    if (activeModule === 'marketplace-moderation') return <ProductModerationView />;
    if (activeModule === 'marketplace-categories') return <CategoriesView />;
    if (activeModule === 'transactions-orders' || activeModule === 'transactions') return <TransactionsView />;
    if (activeModule === 'transactions-refunds') return <RefundsView />;
    if (activeModule === 'finance-revenue' || activeModule === 'finance') return <FinanceRevenueView />;
    if (activeModule === 'finance-balance') return <MerchantBalanceView />;
    if (activeModule === 'finance-withdrawal') return <WithdrawalsView />;
    if (activeModule === 'advertising-manage' || activeModule === 'advertising') return <AdsManagementView />;
    if (activeModule === 'advertising-approval') return <AdApprovalView />;
    if (activeModule === 'promo') return <PromoView />;
    if (activeModule === 'moderation') return <ModerationView />;
    if (activeModule === 'support') return <SupportView />;
    if (activeModule === 'analytics') return <AnalyticsView />;
    if (activeModule === 'cms') return <CmsView />;
    if (activeModule === 'settings') return <SettingsView />;
    if (activeModule === 'notifications') return <NotificationsView />;
    if (activeModule === 'security') return <SecurityView />;
    return <PlaceholderView title={activeModule.replace('-', ' ').toUpperCase()} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header & Overlay */}
      <div className="md:hidden bg-navy text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <span className="font-black text-lg">ADMS Admin</span>
        </div>
        <button onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}>
          {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-64 bg-navy text-slate-300 flex flex-col shadow-xl z-50 transition-transform duration-300
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10 hidden md:flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="font-black text-white text-lg leading-tight">ADMS</h1>
            <p className="text-[10px] font-bold text-cyan-400 tracking-wider">BACK-OFFICE</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-4 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">Main Menu</div>
          
          {MENU_ITEMS.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => item.subItems ? toggleExpand(item.id) : handleMenuClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeModule === item.id || (!item.subItems && activeModule.startsWith(item.id))
                    ? 'bg-cyan-500/10 text-cyan-400' 
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.subItems && (
                  expandedMenus.includes(item.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {item.subItems && expandedMenus.includes(item.id) && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleMenuClick(subItem.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        activeModule === subItem.id 
                          ? 'bg-cyan-500/10 text-cyan-400 font-bold' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 w-full p-2 hover:bg-white/5 rounded-lg transition-colors text-left">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-bold text-white truncate">{currentUser?.name || 'Admin'}</p>
              <p className="text-[10px] text-cyan-400">{currentUser?.role || 'ADMIN'}</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar Desktop */}
        <header className="hidden md:flex bg-white h-16 border-b border-slate-200 items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {activeModule.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleMenuClick('notifications')}
              className="relative p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                navigate('home');
              }}
              className="flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-500 px-4 py-2 rounded-lg transition-colors border border-rose-200 hover:border-rose-500 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
