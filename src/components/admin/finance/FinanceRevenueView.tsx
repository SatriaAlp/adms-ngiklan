import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, CreditCard, DollarSign, Activity, PieChart, Calendar
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const FinanceRevenueView: React.FC = () => {
  const { addNotification } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const res = await api.getFinanceOverview();
        setData(res);
      } catch (error) {
        addNotification('Gagal memuat data revenue', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [timeRange]);

  if (loading || !data) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate chart max for CSS percentages
  const maxChartValue = Math.max(...data.chartData.map((d: any) => d.value));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Revenue Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Laporan pendapatan platform, GMV, dan komisi.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm font-bold text-navy bg-transparent border-none focus:ring-0 cursor-pointer pr-4"
          >
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari</option>
            <option value="3m">3 Bulan</option>
            <option value="1y">1 Tahun</option>
          </select>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-navy p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-24 h-24 text-white" />
          </div>
          <p className="text-cyan-200 text-sm font-bold uppercase tracking-wider mb-2 relative z-10">Net Platform Revenue</p>
          <h3 className="text-3xl font-black text-white relative z-10">Rp{data.netRevenue.toLocaleString('id-ID')}</h3>
          <p className="text-cyan-100/70 text-xs mt-2 relative z-10 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">+12.5%</span> dari periode sebelumnya
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Gross Merchandise Value (GMV)</p>
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Rp{data.gmv.toLocaleString('id-ID')}</h3>
          <p className="text-slate-400 text-xs mt-2">Total perputaran uang di seluruh transaksi</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Merchant Payouts</p>
            <CreditCard className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Rp{data.merchantPayout.toLocaleString('id-ID')}</h3>
          <p className="text-slate-400 text-xs mt-2">Total dana yang dibayarkan ke merchant</p>
        </div>
      </div>

      {/* Revenue Breakdown & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Breakdown List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
          <h3 className="text-lg font-black text-navy mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-500" />
            Revenue Breakdown
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-700 text-sm">Platform Fee (Komisi)</p>
                  <p className="text-xs text-slate-500">Potongan transaksi marketplace</p>
                </div>
              </div>
              <span className="font-bold text-navy">Rp{data.platformFee.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-700 text-sm">Payment Fee</p>
                  <p className="text-xs text-slate-500">Biaya gateway pembayaran</p>
                </div>
              </div>
              <span className="font-bold text-navy">Rp{data.paymentFee.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-rose-600 rotate-180" />
                </div>
                <div>
                  <p className="font-bold text-slate-700 text-sm">Refunds</p>
                  <p className="text-xs text-slate-500">Pengembalian dana pelanggan</p>
                </div>
              </div>
              <span className="font-bold text-rose-600">-Rp{data.refunds.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-black text-navy mb-6">Pertumbuhan Revenue</h3>
          
          <div className="flex-1 flex items-end gap-2 sm:gap-4 mt-8 relative h-64">
            {/* Y-Axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[4, 3, 2, 1, 0].map(i => (
                <div key={i} className="w-full border-t border-slate-100 flex items-start text-[10px] text-slate-400">
                  <span className="-mt-2 -ml-8 w-6 text-right">
                    {i === 0 ? '0' : `${((maxChartValue / 4) * i / 1000000).toFixed(1)}M`}
                  </span>
                </div>
              ))}
            </div>

            {/* Bars */}
            {data.chartData.map((item: any, i: number) => {
              const heightPct = (item.value / maxChartValue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group z-10">
                  {/* Tooltip */}
                  <div className="absolute -top-12 bg-navy text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Rp{item.value.toLocaleString('id-ID')}
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full max-w-[40px] bg-cyan-500 rounded-t-md hover:bg-cyan-400 transition-colors cursor-pointer"
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <span className="text-[10px] sm:text-xs font-medium text-slate-500 mt-2 rotate-45 origin-left sm:rotate-0">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
