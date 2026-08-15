import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Users, Activity, Target, Clock, ArrowUpRight, ArrowDownRight, PieChart, Download
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { addNotification } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d'); // 7d, 30d, 90d

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.getAnalytics({ period });
        setData(res);
      } catch (error) {
        addNotification('Gagal memuat data analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  if (loading || !data) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Find max values for chart scaling
  const maxVisits = Math.max(...data.chartData.map((d: any) => d.visits));
  const maxConversions = Math.max(...data.chartData.map((d: any) => d.conversions));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Analytics & Traffic</h2>
          <p className="text-slate-500 text-sm mt-1">Pantau performa trafik platform, sumber pengunjung, dan tingkat konversi.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-lg p-1 shadow-sm flex items-center">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  period === p ? 'bg-navy text-white' : 'text-slate-500 hover:text-navy hover:bg-slate-50'
                }`}
              >
                {p === '7d' ? '7 Hari' : p === '30d' ? '30 Hari' : '3 Bulan'}
              </button>
            ))}
          </div>
          <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm" title="Download Report">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-2 -translate-y-2">
            <Users className="w-16 h-16 text-navy" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Total Visits</p>
          <h3 className="text-2xl font-black text-navy relative z-10">{data.totalVisits.toLocaleString('id-ID')}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-2 relative z-10 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% <span className="font-normal text-slate-400 ml-1">vs last period</span>
          </p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-2 -translate-y-2">
            <Activity className="w-16 h-16 text-navy" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Unique Visitors</p>
          <h3 className="text-2xl font-black text-navy relative z-10">{data.uniqueVisitors.toLocaleString('id-ID')}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-2 relative z-10 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +8.1% <span className="font-normal text-slate-400 ml-1">vs last period</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-2 -translate-y-2">
            <Clock className="w-16 h-16 text-navy" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Avg. Session Time</p>
          <h3 className="text-2xl font-black text-navy relative z-10">{data.avgSessionDuration}</h3>
          <p className="text-xs text-rose-500 font-bold mt-2 relative z-10 flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3" /> -2.4% <span className="font-normal text-slate-400 ml-1">vs last period</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-2 -translate-y-2">
            <Target className="w-16 h-16 text-navy" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Conversion Rate</p>
          <h3 className="text-2xl font-black text-emerald-600 relative z-10">{data.conversionRate}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-2 relative z-10 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +1.2% <span className="font-normal text-slate-400 ml-1">vs last period</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-navy flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-500" />
              Traffic & Conversions Trend
            </h3>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-200"></span> Visits</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-500"></span> Conversions</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-end gap-2 sm:gap-6 mt-4 relative h-64">
            {/* Y-Axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
              {[4, 3, 2, 1, 0].map(i => (
                <div key={i} className="w-full border-t border-slate-100 flex items-start text-[10px] text-slate-400">
                  <span className="-mt-2 -ml-8 w-6 text-right">
                    {i === 0 ? '0' : `${Math.round(((maxVisits / 4) * i) / 1000)}k`}
                  </span>
                </div>
              ))}
            </div>

            {/* Bars */}
            {data.chartData.map((item: any, i: number) => {
              const visitPct = (item.visits / maxVisits) * 100;
              // Scale conversions proportionally but make it visible (exaggerated for visual sake if needed, but we map to its own scale here)
              const convPct = (item.conversions / maxConversions) * 100 * 0.5; // Max height 50% for conversions relative to bar
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group z-10 gap-1">
                  {/* Tooltip */}
                  <div className="absolute -top-12 bg-navy text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                    {item.visits.toLocaleString('id-ID')} Visits<br/>
                    <span className="text-cyan-400">{item.conversions} Conversions</span>
                  </div>
                  
                  {/* Visual Bars Container */}
                  <div className="w-full h-full flex flex-col justify-end items-center relative">
                    {/* Visits Bar (Background) */}
                    <div 
                      className="w-full max-w-[40px] bg-slate-200 rounded-t-md hover:bg-slate-300 transition-colors absolute bottom-0 cursor-pointer"
                      style={{ height: `${visitPct}%` }}
                    ></div>
                    {/* Conversions Bar (Foreground/Overlay) */}
                    <div 
                      className="w-full max-w-[40px] bg-cyan-500 rounded-t-md absolute bottom-0 pointer-events-none"
                      style={{ height: `${convPct}%` }}
                    ></div>
                  </div>
                  
                  <span className="text-[10px] sm:text-xs font-medium text-slate-500 mt-2 rotate-45 origin-left sm:rotate-0">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1 flex flex-col">
          <h3 className="text-lg font-black text-navy mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-500" />
            Traffic Sources
          </h3>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {data.trafficSources.map((source: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>{source.name}</span>
                  <span>{source.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-cyan-500' :
                      idx === 1 ? 'bg-blue-500' :
                      idx === 2 ? 'bg-purple-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${source.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Bounce Rate</span>
              <span className="font-black text-navy">{data.bounceRate}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Persentase pengunjung yang pergi setelah melihat 1 halaman.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
