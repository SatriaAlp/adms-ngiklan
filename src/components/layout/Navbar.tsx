import React, { useState } from 'react';
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
} from 'lucide-react';
import { UserRole } from '../../types';

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
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNav = (tab: string) => {
    navigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">

      {/* Main Sticky Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 group text-left focus:outline-none transition-transform hover:scale-[1.01]"
          title="ADMS - PT. Armada Digital Marketing Syariah"
        >
          <AdmsLogo size="md" />
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
        <div className="flex items-center gap-2.5">
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
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
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
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Wishlist Saya"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Toggle */}
          <button
            onClick={() => {
              setCartDrawerTab('cart');
              setIsCartOpen(true);
            }}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Dashboard Direct Button / Login Button */}
          {!isLoggedIn ? (
            <button
              onClick={() => handleNav('marketplace')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1 transition-all hidden md:flex"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
              <span>Marketplace</span>
            </button>
          ) : (
            activeTab !== 'dashboard' && (
              <button
                onClick={() => handleNav('dashboard')}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all hidden md:flex ${
                  activeRole === 'ADMIN'
                    ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                    : activeRole === 'MERCHANT'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                Dashboard
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )
          )}

          <div className="flex items-center gap-1.5">
            {activeTab !== 'dashboard' && (
              <button
                onClick={() => handleNav('pasang-iklan-gratis')}
                className="bg-navy hover:bg-navy/90 text-gold text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-[0.98]"
                title="Pasang Iklan Baris Klasifikasi Gratis"
              >
                <PlusCircle className="w-4 h-4 text-gold" />
                <span className="hidden sm:inline">Pasang Iklan Gratis</span>
                <span className="sm:hidden">Iklan Gratis</span>
              </button>
            )}

            {isLoggedIn && (activeRole === 'MERCHANT' || activeRole === 'ADMIN') && (
              <button
                onClick={() => handleNav('upload-produk')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-[0.98]"
                title="Unggah Produk Baru ke Marketplace"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Upload Produk Marketplace</span>
                <span className="sm:hidden">Jual Produk</span>
              </button>
            )}
          </div>

          {/* Logout Button */}
          {activeTab === 'dashboard' && (
            <button
              onClick={() => {
                setIsLoggedIn(false);
                handleNav('home');
              }}
              className="px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Logout</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                onClick={() => handleNav('bantuan')}
                className={`p-3 rounded-xl text-left text-xs font-bold border ${
                  activeTab === 'bantuan'
                    ? 'bg-navy border-navy text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Pusat Bantuan
              </button>
            </div>

          <div className="pt-2 flex flex-col gap-2">
            {activeTab === 'dashboard' ? (
              <button
                onClick={() => handleNav('home')}
                className="w-full py-3 rounded-xl bg-rose-600 border border-rose-600 text-center text-xs font-bold text-white flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full py-3 rounded-xl bg-navy border border-navy text-center text-xs font-bold text-white flex items-center justify-center gap-2"
              >
                Buka {activeRole === 'ADMIN' ? 'Admin' : activeRole === 'MERCHANT' ? 'Merchant' : 'User'} Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
