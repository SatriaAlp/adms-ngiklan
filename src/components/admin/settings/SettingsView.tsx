import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Globe, CreditCard, Mail, Shield, Save
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { addNotification } = useApp();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('GENERAL'); // GENERAL, PAYMENT, EMAIL, SECURITY

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (error) {
        addNotification('Gagal memuat pengaturan', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(settings);
      addNotification('Pengaturan berhasil disimpan', 'success');
    } catch (error) {
      addNotification('Gagal menyimpan pengaturan', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">System Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Konfigurasi utama platform ADMS Marketplace.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {[
            { id: 'GENERAL', label: 'General Info', icon: Globe },
            { id: 'PAYMENT', label: 'Payment Gateway', icon: CreditCard },
            { id: 'EMAIL', label: 'SMTP Email', icon: Mail },
            { id: 'SECURITY', label: 'Security & Maintenance', icon: Shield },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                activeTab === tab.id 
                  ? 'bg-navy text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSave} className="flex flex-col h-full min-h-[500px]">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
              <SettingsIcon className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-black text-navy">
                {activeTab === 'GENERAL' ? 'Pengaturan Umum' : 
                 activeTab === 'PAYMENT' ? 'Konfigurasi Pembayaran' : 
                 activeTab === 'EMAIL' ? 'Konfigurasi Email Server' : 'Keamanan Platform'}
              </h3>
            </div>

            <div className="p-6 flex-1 space-y-6">
              {activeTab === 'GENERAL' && (
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Website</label>
                    <input 
                      type="text" 
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Utama (Support)</label>
                    <input 
                      type="email" 
                      value={settings.siteEmail}
                      onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-medium"
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform Fee (Komisi %)</label>
                    <input 
                      type="number" 
                      min="0" max="100"
                      value={settings.platformFeePercent}
                      onChange={(e) => setSettings({...settings, platformFeePercent: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-medium"
                    />
                    <p className="text-xs text-slate-400 mt-1">Potongan komisi untuk setiap penjualan yang sukses.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Minimal Penarikan (Rp)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={settings.minWithdrawal}
                      onChange={(e) => setSettings({...settings, minWithdrawal: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-medium"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'PAYMENT' && (
                <div className="space-y-4 max-w-xl">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                    <h4 className="font-bold text-blue-800 text-sm mb-1 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Midtrans Integration
                    </h4>
                    <p className="text-xs text-blue-600">Pastikan menggunakan kredensial Sandbox untuk testing, dan Production saat rilis.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Midtrans Client Key</label>
                    <input 
                      type="text" 
                      value={settings.midtransClientKey}
                      onChange={(e) => setSettings({...settings, midtransClientKey: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Midtrans Server Key</label>
                    <input 
                      type="password" 
                      value={settings.midtransServerKey}
                      onChange={(e) => setSettings({...settings, midtransServerKey: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono text-slate-600"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'EMAIL' && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Mail className="w-16 h-16 text-slate-200 mb-4" />
                  <h3 className="text-lg font-bold text-slate-800">Konfigurasi SMTP Email</h3>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm">Fitur ini akan diaktifkan setelah integrasi pihak ketiga (seperti SendGrid atau AWS SES) diselesaikan di fase production.</p>
                </div>
              )}

              {activeTab === 'SECURITY' && (
                <div className="space-y-6 max-w-xl">
                  <div className="p-4 border border-orange-200 bg-orange-50 rounded-xl flex items-start gap-4">
                    <Shield className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-orange-800 mb-1">Maintenance Mode</h4>
                      <p className="text-xs text-orange-600 mb-3">Mengaktifkan mode ini akan menutup akses platform bagi seluruh pengguna kecuali Admin. Gunakan saat melakukan update besar.</p>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={settings.maintenanceMode}
                          onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        <span className="ml-3 text-sm font-bold text-slate-700">
                          {settings.maintenanceMode ? 'Aktif (Akses Ditutup)' : 'Nonaktif (Normal)'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                type="submit" 
                disabled={saving}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
              >
                {saving ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Pengaturan</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
