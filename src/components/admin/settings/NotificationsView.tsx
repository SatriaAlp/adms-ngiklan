import React, { useState, useEffect } from 'react';
import { 
  Bell, Send, Users, AlertCircle, Info, Megaphone, CheckCircle2 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { addNotification } = useApp();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('INBOX'); // INBOX, BROADCAST
  
  // Broadcast State
  const [broadcastData, setBroadcastData] = useState({
    title: '',
    message: '',
    target: 'ALL' // ALL, MERCHANTS, CUSTOMERS
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      if (activeTab !== 'INBOX') return;
      setLoading(true);
      try {
        const data = await api.getAdminNotifications();
        setNotifications(data);
      } catch (error) {
        addNotification('Gagal memuat notifikasi', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [activeTab]);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastData.title.trim() || !broadcastData.message.trim()) {
      addNotification('Judul dan pesan tidak boleh kosong', 'error');
      return;
    }

    setSending(true);
    try {
      await api.sendBroadcastNotification(broadcastData);
      addNotification('Notifikasi broadcast berhasil dikirim!', 'success');
      setBroadcastData({ title: '', message: '', target: 'ALL' });
      setActiveTab('INBOX'); // Switch back to see if we logged it (simulated)
    } catch (error) {
      addNotification('Gagal mengirim broadcast', 'error');
    } finally {
      setSending(false);
    }
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'WARNING': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Notifications & Broadcasts</h2>
          <p className="text-slate-500 text-sm mt-1">Pantau notifikasi sistem dan kirim pesan broadcast ke pengguna.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex overflow-x-auto scrollbar-none">
        {[
          { id: 'INBOX', label: 'System Inbox', icon: Bell },
          { id: 'BROADCAST', label: 'Send Broadcast', icon: Megaphone }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-navy text-white shadow-md'
                : 'text-slate-500 hover:text-navy hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'INBOX' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-navy flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-400" /> System Activity
            </h3>
            <button className="text-xs font-bold text-cyan-600 hover:underline">Tandai semua dibaca</button>
          </div>
          
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Tidak ada notifikasi sistem terbaru.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors ${notif.read ? 'opacity-60' : 'bg-blue-50/20'}`}>
                  <div className="mt-1 shrink-0">{getIconForType(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-navy">{notif.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 block uppercase tracking-wider">
                      {new Date(notif.createdAt).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
          
          {/* Form */}
          <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200">
            <h3 className="text-xl font-black text-navy mb-6 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-cyan-500" />
              Buat Broadcast Baru
            </h3>
            
            <form onSubmit={handleBroadcast} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Penerima</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'ALL', label: 'Semua User', icon: Users },
                    { id: 'MERCHANTS', label: 'Hanya Merchant', icon: Users },
                    { id: 'CUSTOMERS', label: 'Hanya Customer', icon: Users },
                  ].map(tgt => (
                    <div 
                      key={tgt.id}
                      onClick={() => setBroadcastData({...broadcastData, target: tgt.id})}
                      className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        broadcastData.target === tgt.id 
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700' 
                          : 'border-slate-100 hover:border-slate-300 text-slate-500'
                      }`}
                    >
                      <tgt.icon className="w-5 h-5" />
                      <span className="text-xs font-bold leading-tight">{tgt.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Judul Push Notification</label>
                <input 
                  type="text" 
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({...broadcastData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-bold text-navy"
                  placeholder="Misal: Promo Akhir Tahun Spesial!"
                  maxLength={50}
                  required
                />
                <div className="text-right text-[10px] text-slate-400 mt-1">{broadcastData.title.length}/50</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Isi Pesan Singkat</label>
                <textarea 
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData({...broadcastData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm text-slate-700 resize-none h-24"
                  placeholder="Tulis pesan yang akan muncul di HP atau dashboard pengguna..."
                  maxLength={150}
                  required
                />
                <div className="text-right text-[10px] text-slate-400 mt-1">{broadcastData.message.length}/150</div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={sending}
                  className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  {sending ? 'Mengirim...' : <><Send className="w-4 h-4" /> Kirim Sekarang</>}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="w-full md:w-80 bg-slate-50 p-6 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Preview Device</span>
            
            {/* Mock Phone Notch Area */}
            <div className="w-64 h-[400px] bg-white rounded-[2rem] border-[8px] border-slate-200 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-200 rounded-b-xl mx-auto w-1/2"></div>
              
              <div className="p-4 pt-10 h-full bg-slate-50/50">
                {/* Mock Notification Dropdown */}
                {broadcastData.title && (
                  <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-cyan-500 rounded flex items-center justify-center">
                          <span className="text-[8px] font-black text-white">ADMS</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">ADMS App</span>
                      </div>
                      <span className="text-[10px] text-slate-400">now</span>
                    </div>
                    <h4 className="text-xs font-bold text-navy truncate">{broadcastData.title || 'Judul Notifikasi'}</h4>
                    <p className="text-[10px] text-slate-600 mt-0.5 line-clamp-2 leading-snug">
                      {broadcastData.message || 'Isi pesan akan muncul di sini...'}
                    </p>
                  </div>
                )}
                
                {!broadcastData.title && !broadcastData.message && (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-[10px] text-slate-400 px-4">Ketik judul dan pesan untuk melihat preview notifikasi</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};
