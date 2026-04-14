import { useState, useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import ProductionLine from "../components/ProductionLine";
import { useMachineAnalytics } from "../contexts/MachineAnalyticsProvider";

  const { trendData, loading, fetchTrendData, dashboardSummary, fetchDashboardSummary } = useMachineAnalytics();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchTrendData();
    fetchDashboardSummary();

    const interval = setInterval(() => {
      fetchTrendData();
      fetchDashboardSummary();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchTrendData, fetchDashboardSummary]);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Header Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Mesin"
            value={dashboardSummary?.lineStatus?.total ?? '-'}
            change={null}
            colorClass="text-emerald-400"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            }
          />
          <DashboardCard
            title="Mesin Berjalan"
            value={dashboardSummary?.lineStatus?.running ?? '-'}
            change={null}
            colorClass="text-emerald-400"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <DashboardCard
            title="Mesin Berhenti"
            value={dashboardSummary?.lineStatus?.stopped ?? '-'}
            change={null}
            colorClass="text-rose-400"
            isNegative={true}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            }
          />

          {/* Notif Section */}
          <div className="relative h-1/2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full h-full bg-[#111827] border border-slate-700/50 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-[#1a2332] transition-colors shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 3C14 3 8 6 8 14V20H20V14C20 6 14 3 14 3Z"
                      stroke="#f97316"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      d="M11 20C11 21.657 12.343 23 14 23C15.657 23 17 21.657 17 20"
                      stroke="#f97316"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>
                <span className="text-white font-bold text-base tracking-wide">
                  Notifications
                </span>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className={`text-slate-400 transition-transform ${showNotifications ? "rotate-180" : ""}`}
              >
                <path
                  d="M3 5L7 9L11 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-2.5 text-[10px] font-black text-slate-500 border-b border-slate-700/50 uppercase tracking-widest">
                  Recent Alerts
                </div>
                <div className="px-4 py-3 text-[11px] text-slate-300 hover:bg-slate-700/40 cursor-pointer italic">
                  Line 2: Motor temperature high (85°C)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Production Lines Section */}
        <div className="space-y-4">
          <div className="flex px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            <div className="md:w-44">Unit Identity</div>
            <div className="flex-1 hidden md:block">
              Real-time Performance Trend
            </div>
            <div className="md:w-64 text-right">System Status</div>
          </div>

          {loading && trendData.length === 0 ? (
            <div className="text-center py-10 text-slate-500 animate-pulse">
              Fetching Real-time Data...
            </div>
          ) : (
            trendData.map((line) => (
              <ProductionLine key={line.id} line={line} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
