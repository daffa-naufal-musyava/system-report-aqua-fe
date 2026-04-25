import { useState, useEffect, useRef, useCallback } from "react";
import DashboardCard from "../components/DashboardCard";
import ProductionLine from "../components/ProductionLine";
import { socket } from "../api/socket";
import { getKPI } from "../api/kpiApi";
import { getChartLine } from "../api/chartLineApi";

function Dashboard() {
  const [dashboardSummary, setDashboardSummary] = useState({
    totalMachines: 0,
    runningMachines: 0,
    stoppedMachines: 0,
    notifications: [],
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [lineWithTrend, setLineWithTrend] = useState(null);

  const summaryRef = useRef(dashboardSummary);
  useEffect(() => {
    summaryRef.current = dashboardSummary;
  }, [dashboardSummary]);

  const processAndSetChart = useCallback((payloadData) => {
    if (!payloadData || !payloadData.chartData) return;

    const { chartData, lineId } = payloadData;
    const currentStopped = Number(summaryRef.current.stoppedMachines) || 0;

    const formattedData = chartData.map((item) => ({
      time: new Date(item.time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      value: item.value,
    }));

    setLineWithTrend({
      id: lineId || "1",
      name: `Line ${lineId || "1"}`,
      status: currentStopped > 0 ? "STOPPED" : "RUNNING",
      hexColor: currentStopped > 0 ? "#f43f5e" : "#22d3ee",
      data: [...formattedData], 
    });
  }, []);

    intervalRef.current = setInterval(() => {
      // Geser data, tambah data baru di akhir
      dummyData = [
        ...dummyData.slice(1),
        {
          value: getRandomInt(60, 100),
          time: `${parseInt(dummyData[dummyData.length - 1].time) + 1}:00`,
        },
      ];

      if (!running) {
        stopCounter++;
        if (stopCounter >= 4) {
          running = true;
          stopCounter = 0;
        }
      } else {
        if (Math.random() > 0.8) {
          running = false;
          stopCounter = 0;
        }
      } catch (error) {
        console.error("Initial load failed:", error);
      }
      const total = 10;
      stopped = running ? 0 : 7;
      const runningCount = running ? total : total - stopped;
      setLineWithTrend({
        id: 1,
        name: "Line 1",
        status: running ? "RUNNING" : "STOP",
        hexColor: running ? "#22d3ee" : "#f43f5e",
        data: dummyData,
      });
      setDashboardSummary({
        lineStatus: {
          total,
          running: runningCount,
          stopped,
        },
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
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
          <div className="relative h-1/2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full bg-[#111827] border border-slate-700/50 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-[#1a2332] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-200">Notifications</span>
                {dashboardSummary.notifications.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold animate-pulse">
                    {dashboardSummary.notifications.length}
                  </span>
                )}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showNotifications ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-2xl z-50">
                <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-700">
                  Recent Alerts
                </div>
                <div className="px-4 py-3 text-sm text-slate-300">
                  Line 1: Motor temperature high (85°C)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="bg-[#111827]/50 p-1 rounded-2xl border border-slate-800/50">
          {lineWithTrend ? (
            <>
              <ProductionLine key={lineWithTrend.id} line={lineWithTrend} />
              <div className="px-6 pb-4 flex justify-between items-center text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync Active
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-slate-600">
              <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p>Fetching machine telemetry...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;