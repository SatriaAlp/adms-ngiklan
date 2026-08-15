import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';
import { AdmsLogo } from './AdmsLogo';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginModalDefaultTab,
    setIsLoggedIn,
    addNotification,
    pendingPostAd,
    setPendingPostAd,
    navigate,
    setIsCreateAdModalOpen,
    pendingAdPublishPayload,
    setPendingAdPublishPayload,
    createAd,
    activeTab,
    setActiveRole
  } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Store newly registered accounts in memory during this session
  const [registeredAccounts, setRegisteredAccounts] = useState<{username: string, email: string, password: string}[]>(() => {
    const saved = localStorage.getItem('adms_registered_accounts');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Clear states when modal closes or opens
  React.useEffect(() => {
    if (!isLoginModalOpen) {
      setEmail('');
      setPassword('');
      setRegisterUsername('');
      setRegisterEmail('');
      setRegisterPassword('');
    } else {
      setTab(loginModalDefaultTab || 'login');
      setShowPassword(false);
      setShowRegisterPassword(false);
    }
  }, [isLoginModalOpen, loginModalDefaultTab]);

  if (!isLoginModalOpen) return null;

  const handleTabChange = (newTab: 'login' | 'register') => {
    setTab(newTab);
    setEmail('');
    setPassword('');
    setRegisterUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setShowPassword(false);
    setShowRegisterPassword(false);
  };

  const checkPendingPostAd = () => {
    if (pendingAdPublishPayload) {
      createAd(pendingAdPublishPayload);
      setPendingAdPublishPayload(null);
      setIsCreateAdModalOpen(false);
      
      addNotification('Login berhasil! Iklan Anda telah dipublikasikan dan status sedang ditinjau.', 'success');
      
      if (activeTab === 'buat-iklan-gratis') {
        // Do not redirect, let PostFreeAdView show the success step
      } else {
        setTimeout(() => {
          navigate('dashboard');
        }, 100);
      }
      return;
    }

    if (pendingPostAd) {
      navigate('buat-iklan-gratis');
      setPendingPostAd(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let roleToSet: 'ADMIN' | 'MERCHANT' | 'USER' | null = null;
    let name = '';

    const foundRegistered = registeredAccounts.find(acc => 
      (acc.username === email || acc.email === email) && acc.password === password
    );

    if (email === 'admin' && password === 'admin123') {
      roleToSet = 'ADMIN';
      name = 'Administrator';
    } else if (email === 'merchant' && password === 'merchant123') {
      roleToSet = 'MERCHANT';
      name = 'Merchant Partner';
    } else if (email === 'user' && password === 'user123') {
      roleToSet = 'USER';
      name = 'Customer Umum';
    } else if (foundRegistered) {
      roleToSet = 'USER'; // Default new registrations to USER
      name = foundRegistered.username;
    } else {
      addNotification('Username atau Password salah! (Atau akun belum terdaftar)', 'error');
      return;
    }

    // Set role and login state
    setActiveRole(roleToSet, name);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);

    addNotification(`Login berhasil! Selamat datang kembali, ${name}.`, 'success');
    
    if (pendingAdPublishPayload || pendingPostAd) {
      checkPendingPostAd();
    } else {
      setTimeout(() => {
        navigate('dashboard', undefined, true);
      }, 100);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAccounts = [...registeredAccounts, { 
      username: registerUsername, 
      email: registerEmail, 
      password: registerPassword 
    }];

    // Save to memory and localStorage
    setRegisteredAccounts(newAccounts);
    localStorage.setItem('adms_registered_accounts', JSON.stringify(newAccounts));

    // Switch to login tab
    setTab('login');
    
    // Auto-fill login credentials so they don't have to retype
    setEmail(registerUsername);
    setPassword(registerPassword);

    addNotification('Pendaftaran berhasil! Silakan klik Masuk Akun untuk login.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-8 transform transition-all animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <AdmsLogo variant="symbol" size="sm" />
            <div>
              <h3 className="font-bold text-base text-white">Autentikasi ADMS</h3>
              <p className="text-[10px] text-slate-400 font-medium">Masuk untuk melanjutkan transaksi & dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${tab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Masuk Akun
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${tab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Daftar Baru
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Masuk Akun
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="email anda"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Daftar & Buat Akun
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
