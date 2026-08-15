import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Layout, Package, Tag, Edit, Trash2, ShieldCheck, Search
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const AdsManagementView: React.FC = () => {
  const { addNotification } = useApp();
  const [packages, setPackages] = useState<any[]>([]);
  const [activeAds, setActiveAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE_ADS'); // ACTIVE_ADS, PACKAGES

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pkgData, adsData] = await Promise.all([
          api.getAdPackages(),
          api.getActiveAds()
        ]);
        setPackages(pkgData);
        
        if (adsData.length === 0) {
          // Mock data for Active Ads since db model is not present yet
          setActiveAds([
            {
              id: 'AD-2026-991',
              merchant: { name: 'Citra Design Agency' },
              package: { name: 'Homepage Top Banner' },
              bannerUrl: 'https://placehold.co/800x200/2563eb/ffffff?text=Promo+Kemerdekaan',
              linkUrl: '/merchant/citra-design',
              startDate: new Date(Date.now() - 2 * 86400000),
              endDate: new Date(Date.now() + 5 * 86400000),
              clicks: 1420
            }
          ]);
        } else {
          setActiveAds(adsData);
        }
      } catch (error) {
        addNotification('Gagal memuat data advertising', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Advertising Management</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola inventaris iklan dan slot banner aktif.</p>
        </div>
        {activeTab === 'PACKAGES' && (
          <button className="px-4 py-2.5 bg-navy text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Paket Baru
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex overflow-x-auto scrollbar-none">
        {['ACTIVE_ADS', 'PACKAGES'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-navy text-white shadow-md'
                : 'text-slate-500 hover:text-navy hover:bg-slate-50'
            }`}
          >
            {tab === 'ACTIVE_ADS' ? 'Iklan Aktif (Running)' : 'Paket Iklan'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'ACTIVE_ADS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeAds.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
              <Megaphone className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">Belum ada iklan yang tayang</h3>
              <p className="text-sm text-slate-500">Iklan yang disetujui akan muncul di sini.</p>
            </div>
          ) : (
            activeAds.map((ad) => (
              <div key={ad.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <img src={ad.bannerUrl} alt="Banner" className="w-full h-32 object-cover bg-slate-100" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-md mb-2 inline-block">LIVE RUNNING</span>
                      <h3 className="font-bold text-lg text-navy">{ad.merchant.name}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">{ad.package.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl font-black text-cyan-600">{ad.clicks}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clicks</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-xs text-slate-400">Mulai</span>
                      <span className="font-bold text-slate-700">{new Date(ad.startDate).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">Berakhir</span>
                      <span className="font-bold text-slate-700">{new Date(ad.endDate).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="px-6 py-4">Nama Paket</th>
                  <th className="px-6 py-4">Tipe Slot</th>
                  <th className="px-6 py-4">Durasi</th>
                  <th className="px-6 py-4">Harga</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-navy flex items-center gap-2">
                      <Package className="w-4 h-4 text-cyan-500" /> {pkg.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{pkg.type}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {pkg.durationDays} Hari
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-600">
                      Rp{pkg.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
