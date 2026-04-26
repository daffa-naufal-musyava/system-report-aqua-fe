import { useState, useEffect, useRef, useCallback } from "react";
import DashboardCard from "../components/DashboardCard";
import ProductionLine from "../components/ProductionLine";
import { socket } from "../api/socket";
import { getKPI } from "../api/kpiApi";

function Dashboard() {
  // 1. Initial State yang Konsisten
  const [dashboardSummary, setDashboardSummary] = useState({
    totalMachines: 0,
    runningMachines: 0,
    stoppedMachines: 0,
    notifications: [],
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [lineWithTrend, setLineWithTrend] = useState(null);
  
  const summaryRef = useRef(dashboardSummary);
  const intervalRef = useRef(null);

  // Sync ref agar logika di dalam interval selalu dapat data terbaru tanpa re-render
  useEffect(() => {
    summaryRef.current = dashboardSummary;
  }, [dashboardSummary]);

  // 2. Fungsi Helper untuk Generate Dummy Data (Opsional, untuk simulasi)
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // 3. Lifecycle Management
  useEffect(() => {
    // Fungsi untuk ambil data awal dari API (Pastikan token auth ada di kpiApi)
    const fetchInitialData = async () => {
      try {
        const res = await getKPI();
        // Asumsi response: { total: 10, running: 8, stopped: 2 }
        if (res) {
          setDashboardSummary(prev => ({
            ...prev,
            totalMachines: res.total || 0,
            runningMachines: res.running || 0,
            stoppedMachines: res.stopped || 0,
          }));
        }
      } catch (error) {
        console.error("Gagal mengambil data KPI (Cek Auth/Token):", error);
      }
    };

    fetchInitialData();

    // 4. Simulasi Data Real-time (Interval dipindah ke dalam useEffect)
    let dummyChartData = Array.from({ length: 10 }, (_, i) => ({
      time: `${10 + i}:00`,
      value: getRandomInt(70, 95)
    }));

    intervalRef.current = setInterval(() => {
      const isRunning = Math.random() > 0.2;
      const currentTotal = 10;
      const currentStopped = isRunning ? 0 : 7;
      const currentRunning = currentTotal - currentStopped;

      // Update Chart Data
      dummyChartData = [
        ...dummyChartData.slice(1),
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          value: isRunning ? getRandomInt(80, 100) : getRandomInt(0, 10)
        }
      ];

      // Update State Summary
      setDashboardSummary(prev => ({
        ...prev,
        runningMachines: currentRunning,
        stoppedMachines: currentStopped,
      }));

      // Update State Chart
      setLineWithTrend({
        id: "1",
        name: "Line 1",
        status: isRunning ? "RUNNING" : "STOPPED",
        hexColor: isRunning ? "#22d3ee" : "#f43f5e",
        data: [...dummyChartData],
      });
    }, 3000); // Update setiap 3 detik

    // Cleanup saat pindah halaman
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      socket.off("telemetryUpdate");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* KPI SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Mesin"
            value={dashboardSummary.totalMachines}
            colorClass="text-emerald-400"
          />
          <DashboardCard
            title="Mesin Berjalan"
            value={dashboardSummary.runningMachines}
            colorClass="text-emerald-400"
          />
          <DashboardCard
            title="Mesin Berhenti"
            value={dashboardSummary.stoppedMachines}
            colorClass="text-rose-400"
            isNegative
          />
          
          {/* NOTIFICATION BUTTON */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full bg-[#111827] border border-slate-700/50 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-[#1a2332] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-200">Notification</span>
                {dashboardSummary.notifications.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold animate-pulse">
                    {dashboardSummary.notifications.length}
                  </span>
                )}
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${showNotifications ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-2 text-[10px] text-slate-400 border-b border-slate-700 uppercase font-bold tracking-widest">
                  Recent Alerts
                </div>
                <div className="px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 cursor-default">
                  Line 1: System heartbeat detected.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="bg-[#111827]/50 p-2 rounded-2xl border border-slate-800/50">
          {lineWithTrend ? (
            <div className="relative">
              <ProductionLine key={lineWithTrend.id} line={lineWithTrend} />
              <div className="px-6 pb-4 flex justify-between items-center text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full animate-ping ${lineWithTrend.status === 'RUNNING' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  Live Telemetry Active
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-slate-600">
              <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p className="animate-pulse">Connecting to machine stream...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;