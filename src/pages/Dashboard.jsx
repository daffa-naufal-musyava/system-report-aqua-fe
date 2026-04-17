import { useState, useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import ProductionLine from "../components/ProductionLine";
import { useMachineAnalytics } from "../contexts/MachineAnalyticsProvider";
import { getMachineTrend } from "../api/machineAnalyticsApi";

function Dashboard() {
  const { loading, dashboardSummary, fetchDashboardSummary } =
    useMachineAnalytics();

  const [showNotifications, setShowNotifications] = useState(false);
  const [lineWithTrend, setLineWithTrend] = useState(null);

  // Ambil data summary (list mesin/line)
  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  // Fetch trend untuk satu line (pakai mesin pertama)
  useEffect(() => {
    const fetchTrend = async () => {
      if (!dashboardSummary?.machines || dashboardSummary.machines.length === 0)
        return;
      const machine = dashboardSummary.machines[0];
      try {
        // Ambil data trend dengan range dan window lebih panjang agar chart tidak hanya 1 titik
        const trend = await getMachineTrend({
          machineId: machine.machineId,
          range: "-24h",
          window: "1h",
        });
        // Transform ke format recharts: { value, time }
        const rechartsData = Array.isArray(trend)
          ? trend.map((d) => ({ value: d.value, time: d.time }))
          : [];
        setLineWithTrend({
          ...machine,
          data: rechartsData,
          id: machine.machineId,
          name: "Line 1",
          status: machine.status,
          hexColor: machine.isRunning ? "#22d3ee" : "#f43f5e",
        });
      } catch {
        setLineWithTrend({
          ...machine,
          data: [],
          id: machine.machineId,
          name: "Line 1",
          status: machine.status,
          hexColor: machine.isRunning ? "#22d3ee" : "#f43f5e",
        });
      }
    };
    fetchTrend();
  }, [dashboardSummary]);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Header Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Mesin"
            value={dashboardSummary?.lineStatus?.total ?? "-"}
            change={null}
            colorClass="text-emerald-400"
          />

          <DashboardCard
            title="Mesin Berjalan"
            value={dashboardSummary?.lineStatus?.running ?? "-"}
            change={null}
            colorClass="text-emerald-400"
          />

          <DashboardCard
            title="Mesin Berhenti"
            value={dashboardSummary?.lineStatus?.stopped ?? "-"}
            change={null}
            colorClass="text-rose-400"
            isNegative={true}
          />

          {/* Notif */}
          <div className="relative h-1/2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full h-full bg-[#111827] border border-slate-700/50 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-[#1a2332] transition-colors shadow-lg"
            >
              <span className="font-bold">Notifications</span>
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-2xl z-50">
                <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-700">
                  Recent Alerts
                </div>
                <div className="px-4 py-3 text-sm text-slate-300">
                  Line 2: Motor temperature high (85°C)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Production Line (hanya satu line/mesin) */}
        <div className="space-y-4">
          {loading && !lineWithTrend ? (
            <div className="text-center py-10 text-slate-500">
              Fetching Real-time Data...
            </div>
          ) : (
            lineWithTrend && (
              <ProductionLine
                key={lineWithTrend.id}
                line={{
                  ...lineWithTrend,
                  name: "Line 1", // Ganti judul menjadi Line 1
                  data: Array.isArray (lineWithTrend.data)
                    ? lineWithTrend.data
                    : [],
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
