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

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const kpiRes = await getKPI();
        const kpiData = kpiRes?.data ?? kpiRes;
        if (kpiData) {
          setDashboardSummary({
            totalMachines: kpiData.total ?? 0,
            runningMachines: kpiData.running ?? 0,
            stoppedMachines: kpiData.stopped ?? 0,
            notifications: Array.isArray(kpiData.notifications) ? kpiData.notifications : [],
          });
        }

        // Load Initial Chart Data
        const chartRes = await getChartLine();
        if (chartRes?.success) {
          processAndSetChart(chartRes.data);
        }
      } catch (error) {
        console.error("Initial load failed:", error);
      }
    };

    initDashboard();
  }, [processAndSetChart]);

  useEffect(() => {
    console.log("Socket Status:", socket.connected ? "Connected" : "Disconnected");

    const handleKPIUpdate = (payload) => {
      console.log("📈 KPI Update Payload:", payload); // DEBUG
      const rawData = payload?.data ?? payload;
      setDashboardSummary((prev) => ({
        ...prev,
        totalMachines: rawData.total ?? prev.totalMachines,
        runningMachines: rawData.running ?? prev.runningMachines,
        stoppedMachines: rawData.stopped ?? prev.stoppedMachines,
        notifications: Array.isArray(rawData.notifications) ? rawData.notifications : prev.notifications,
      }));
    };

    const handleLineUpdate = (payload) => {
      console.group("📊 CHART UPDATE DETECTED");
      console.log("Raw Payload:", payload);

      if (payload?.success && payload?.data) {
        console.log("Chart Data Array:", payload.data.chartData);
        console.log("Last Value:", payload.data.chartData?.[payload.data.chartData.length - 1]);
        processAndSetChart(payload.data);
      } else {
        console.warn("Payload structure mismatch or success is false!");
      }
      console.groupEnd();
    };

    socket.on("dashboard_update", handleKPIUpdate);
    socket.on("line_status_update", handleLineUpdate);

    socket.on("connect", () => console.log("✅ Socket Connected!"));
    socket.on("connect_error", (err) => console.error("❌ Socket Connection Error:", err));

    return () => {
      socket.off("dashboard_update", handleKPIUpdate);
      socket.off("line_status_update", handleLineUpdate);
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [processAndSetChart]);

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

          {/* NOTIFICATION DROPDOWN */}
          <div className="relative">
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
              <div className="absolute w-full mt-2 bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-2 text-[10px] font-bold text-slate-500 bg-[#16202e] border-b border-slate-700/50">RECENT LOGS</div>
                <div className="max-h-60 overflow-y-auto">
                  {dashboardSummary.notifications.length > 0 ? (
                    dashboardSummary.notifications.map((notif, idx) => (
                      <div key={idx} className="px-4 py-3 text-sm text-slate-300 border-b border-slate-700/20 hover:bg-[#263349]">
                        <span className="text-rose-400 block text-[10px] uppercase font-bold">Alert</span>
                        {typeof notif === 'string' ? notif : (notif.message || "System Alert")}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-sm italic">No logs found</div>
                  )}
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