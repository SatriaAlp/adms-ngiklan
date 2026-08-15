import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AdmsLogo } from '../common/AdmsLogo';
import {
  Store,
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  User,
  ShieldCheck,
  Megaphone,
  ChevronRight,
  PlusCircle,
  Sparkles,
  LogOut,
  Bell,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    navigate,
    cart,
    wishlist,
    activeRole,
    setActiveRole,
    setIsCartOpen,
    setIsCreateAdModalOpen,
    isLoggedIn,
    setIsLoggedIn,
    setIsLoginModalOpen,
    setCartDrawerTab,
    addNotification,
    setPendingPostAd,
    loginModalDefaultTab,
    setLoginModalDefaultTab,
    currentUser,
    merchants,
  } = useApp();

  const navigateReactRouter = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNav = (tab: string) => {
    navigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">

      {/* Main Sticky Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 group text-left focus:outline-none transition-transform hover:scale-[1.01]"
          title="ADMS - PT. Armada Digital Marketing Syariah"
        >
          <span className="lg:hidden flex items-center">
            <AdmsLogo size="md" variant="symbol" />
          </span>
          <span className="hidden lg:flex items-center">
            <AdmsLogo size="md" variant="full" />
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-semibold text-sm text-slate-600">
          {activeTab !== 'dashboard' && (
            <>
              <button
                onClick={() => handleNav('home')}
                className={`px-3.5 py-2 rounded-lg transition-colors ${
                  activeTab === 'home'
                    ? 'text-slate-900 bg-slate-100 font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => handleNav('iklan-gratis')}
                className={`px-3.5 py-2 rounded-lg transition-colors ${
                  activeTab === 'iklan-gratis'
                    ? 'text-slate-900 bg-slate-100 font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Iklan Gratis
              </button>
              <button
                onClick={() => handleNav('bantuan')}
                className={`px-3.5 py-2 rounded-lg transition-colors ${
                  activeTab === 'bantuan'
                    ? 'text-slate-900 bg-slate-100 font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Bantuan
              </button>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Search */}
          <button
            onClick={() => {
              if (activeTab === 'home') {
                const searchInput = document.querySelector('input[placeholder*="Cari produk"]');
                if (searchInput) {
                  (searchInput as HTMLInputElement).focus();
                  searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              } else {
                navigate('marketplace');
              }
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Cari Produk / Iklan"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => {
              setCartDrawerTab('wishlist');
              setIsCartOpen(true);
            }}
            className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Wishlist Saya"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Notification Icon */}
          <button
            className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          {/* Auth Actions (Masuk/Daftar) or Profile Dropdown */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  setLoginModalDefaultTab('login');
                  setIsLoginModalOpen(true);
                }}
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-bold text-navy border border-navy hover:bg-navy/5 rounded-xl transition-all"
              >
                Masuk
              </button>
              <button
                onClick={() => {
                  setLoginModalDefaultTab('register');
                  setIsLoginModalOpen(true);
                }}
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-bold text-white bg-navy hover:bg-navy/90 rounded-xl transition-all shadow-xs"
              >
                Daftar
              </button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1 p-0.5 sm:p-1 sm:px-2.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                title="Menu Pengguna"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-xs sm:text-sm overflow-hidden border border-slate-200">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  )}
                </div>
                <ChevronDown className="hidden sm:block w-4 h-4 text-slate-600 transition-transform duration-200" style={{ transform: profileDropdownOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Masuk sebagai</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.name || 'Customer'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[9px] uppercase tracking-wider">
                      {activeRole}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNav('dashboard');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-450" />
                    <span>Dashboard</span>
                  </button>

                  {activeRole === 'USER' && merchants.some(m => m.ownerId === currentUser.id && m.isVerified) && (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveRole('MERCHANT');
                        navigateReactRouter('/merchant/dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-indigo-700 hover:bg-indigo-50 flex items-center gap-2"
                    >
                      <Store className="w-4 h-4 text-indigo-500" />
                      <span>Toko Merchant Anda</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      const basePath = activeRole === 'ADMIN' ? '/admin/dashboard' : activeRole === 'MERCHANT' ? '/merchant/dashboard' : '/customer/dashboard';
                      navigateReactRouter(`${basePath}/profile`);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-450" />
                    <span>Profil Saya</span>
                  </button>

                  {activeRole === 'USER' && (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigateReactRouter('/customer/dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-450" />
                      <span>Pesanan Saya</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      const basePath = activeRole === 'ADMIN' ? '/admin/dashboard' : activeRole === 'MERCHANT' ? '/merchant/dashboard' : '/customer/dashboard';
                      navigateReactRouter(`${basePath}/wishlist`);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 text-slate-450" />
                    <span>Wishlist Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      const basePath = activeRole === 'ADMIN' ? '/admin/dashboard' : activeRole === 'MERCHANT' ? '/merchant/dashboard' : '/customer/dashboard';
                      navigateReactRouter(`${basePath}/settings`);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-slate-450" />
                    <span>Pengaturan Akun</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setIsLoggedIn(false);
                      handleNav('home');
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-4 border-b border-slate-200">
              <button
                onClick={() => handleNav('home')}
                className={`p-3 rounded-xl text-left text-xs font-bold border ${
                  activeTab === 'home'
                    ? 'bg-navy border-navy text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNav('marketplace')}
                className={`p-3 rounded-xl text-left text-xs font-bold border ${
                  activeTab === 'marketplace'
                    ? 'bg-navy border-navy text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => handleNav('iklan-gratis')}
                className={`p-3 rounded-xl text-left text-xs font-bold border ${
                  activeTab === 'iklan-gratis'
                    ? 'bg-navy border-navy text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Iklan Gratis
              </button>
              <button
                onClick={() => handleNav('bantuan')}
                className={`p-3 rounded-xl text-left text-xs font-bold border ${
                  activeTab === 'bantuan'
                    ? 'bg-navy border-navy text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Bantuan
              </button>
            </div>

          <div className="pt-2 flex flex-col gap-2">
            {!isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalDefaultTab('login');
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl border border-navy text-center text-xs font-bold text-navy flex items-center justify-center gap-2"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalDefaultTab('register');
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-navy border border-navy text-center text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  Daftar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNav('dashboard');
                  }}
                  className="w-full py-3 rounded-xl bg-navy border border-navy text-center text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  Buka {activeRole === 'ADMIN' ? 'Admin' : activeRole === 'MERCHANT' ? 'Merchant' : 'User'} Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoggedIn(false);
                    handleNav('home');
                  }}
                  className="w-full py-3 rounded-xl bg-rose-600 border border-rose-600 text-center text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
