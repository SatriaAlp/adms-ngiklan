import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';
import { AdmsLogo } from './AdmsLogo';
import { api } from '../../services/apiClient';

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
  const [tab, setTab] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
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
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
    } else {
      setTab(loginModalDefaultTab || 'login');
      setShowPassword(false);
      setShowRegisterPassword(false);
    }
  }, [isLoginModalOpen, loginModalDefaultTab]);

  if (!isLoginModalOpen) return null;

  const handleTabChange = (newTab: 'login' | 'register' | 'forgot' | 'reset') => {
    setTab(newTab);
    setEmail('');
    setPassword('');
    setRegisterUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setForgotEmail('');
    setOtp('');
    setNewPassword('');
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let roleToSet: 'ADMIN' | 'MERCHANT' | 'USER' | null = null;
    let name = '';

    // First try database authentication
    try {
      const response = await api.loginUser({ email, password });
      if (response && response.success) {
        roleToSet = response.user.role === 'SUPER_ADMIN' ? 'ADMIN' : response.user.role;
        name = response.user.name;
        
        setActiveRole(roleToSet as any, name);
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
        return;
      }
    } catch (dbError) {
      console.warn("Database login failed, falling back to mock authentication:", dbError);
    }

    // Fallback Mock authentication
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // First try database registration
    try {
      const response = await api.registerUser({
        name: registerUsername,
        email: registerEmail,
        password: registerPassword
      });
      if (response && response.success) {
        addNotification('Pendaftaran ke database berhasil! Silakan login.', 'success');
      }
    } catch (dbError: any) {
      console.warn("Database registration failed, falling back to local mock storage:", dbError);
      if (dbError.message && dbError.message.includes('Email sudah terdaftar')) {
        addNotification(dbError.message, 'error');
        return;
      }
    }

    // Local fallback mock registry
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

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.forgotPassword({ email: forgotEmail });
      if (response && response.success) {
        addNotification('Kode OTP pemulihan password berhasil dikirim (Cek log console backend)!', 'success');
        setTab('reset');
      }
    } catch (err: any) {
      addNotification(err.message || 'Gagal mengirim OTP pemulihan password!', 'error');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.resetPassword({
        email: forgotEmail,
        otp,
        password: newPassword
      });
      if (response && response.success) {
        addNotification('Password baru Anda berhasil disimpan! Silakan login kembali.', 'success');
        setTab('login');
        setEmail(forgotEmail);
        setPassword(newPassword);
        setOtp('');
        setNewPassword('');
      }
    } catch (err: any) {
      addNotification(err.message || 'Gagal mengatur ulang password!', 'error');
    }
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
          {/* Tab Selector - Only visible on Login/Register */}
          {(tab === 'login' || tab === 'register') && (
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
          )}

          {tab === 'login' && (
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

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-900 focus:outline-none"
                >
                  Lupa Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Masuk Akun
              </button>
            </form>
          )}

          {tab === 'register' && (
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

          {tab === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Pemulihan</label>
                <input
                  type="email"
                  required
                  placeholder="masukkan email terdaftar"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Kirim Kode OTP
              </button>
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Kembali ke Login
                </button>
              </div>
            </form>
          )}

          {tab === 'reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <p className="text-[10px] text-slate-500">Kami telah mengirimkan 6 digit kode OTP ke email Anda.</p>
                <p className="text-xs font-bold text-navy mt-0.5">{forgotEmail}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kode OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-center tracking-widest focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Simpan Password Baru
              </button>
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Kirim Ulang OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
