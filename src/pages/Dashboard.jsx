import { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import ProductionLine from '../components/ProductionLine';

export default function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(false);

  // Helper generate data
  const getPoint = (base) => ({ 
    time: new Date().getSeconds(), 
    value: Math.floor(Math.random() * 40) + (base - 20) 
  });

  // State untuk Lines
  const [lines, setLines] = useState([
    { id: 1, name: 'Line 1', color: 'green', hexColor: '#10b981', status: 'OK', data: Array.from({length: 20}, () => ({value: 60})) },
    { id: 2, name: 'Line 2', color: 'orange', hexColor: '#f59e0b', status: 'OK', data: Array.from({length: 20}, () => ({value: 55})) },
    { id: 3, name: 'Line 3', color: 'cyan', hexColor: '#06b6d4', status: 'OK', data: Array.from({length: 20}, () => ({value: 65})) },
    { id: 4, name: 'Line 4', color: 'purple', hexColor: '#a855f7', status: 'OK', data: Array.from({length: 20}, () => ({value: 70})) },
  ]);

  // Interval 1000ms untuk update chart (Simulasi Socket)
  useEffect(() => {
    const interval = setInterval(() => {
      setLines(prev => prev.map(line => ({
        ...line,
        data: [...line.data.slice(1), getPoint(line.data[line.data.length - 1].value)]
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* KPI Header Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard 
            title="Total Output" 
            value="12,450" 
            change="+2.5%" 
            colorClass="text-emerald-400"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
          <DashboardCard 
            title="Efficiency" 
            value="87%" 
            change="+1.2%" 
            colorClass="text-emerald-400"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <DashboardCard 
            title="Downtime" 
            value="1.5 hrs" 
            change="-0.3 hrs" 
            colorClass="text-rose-400"
            isNegative={true}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />

          {/* Notif Dropdown Card */}
          <div className="relative h-full">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full h-full bg-[#111827]/80 border border-slate-700/50 rounded-xl p-5 flex items-center justify-between hover:bg-slate-800 transition shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-amber-400 text-xl animate-pulse">🔔</span>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alerts</div>
                  <div className="text-xl font-bold uppercase tracking-tighter text-white">3 Active</div>
                </div>
              </div>
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#1e293b] border border-slate-600 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                <div className="p-3 text-[10px] font-black text-slate-500 border-b border-slate-700 uppercase">Recent System Alerts</div>
                <div className="p-3 text-[11px] hover:bg-slate-700 cursor-pointer border-b border-slate-800 italic">Line 2: Motor temperature high (85°C)</div>
                <div className="p-2 text-center text-cyan-400 text-[10px] font-bold cursor-pointer hover:underline">MARK ALL AS READ</div>
              </div>
            )}
          </div>
        </div>

        {/* Production Lines Section */}
        <div className="space-y-4">
          <div className="flex px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            <div className="md:w-44">Unit Identity</div>
            <div className="flex-1 hidden md:block">Real-time Performance Trend</div>
            <div className="md:w-64 text-right">System Status</div>
          </div>
          
          {lines.map(line => (
            <ProductionLine key={line.id} line={line} />
          ))}
        </div>

      </div>
    </div>
  );
}