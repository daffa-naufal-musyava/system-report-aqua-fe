import { useState, useEffect, useRef } from "react";
import DashboardCard from "../components/DashboardCard";
import ProductionLine from "../components/ProductionLine";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Dashboard() {
  // Dummy KPI
  const [dashboardSummary, setDashboardSummary] = useState({
    lineStatus: {
      total: 10,
      running: 7,
      stopped: 3,
    },
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [lineWithTrend, setLineWithTrend] = useState(null);
  const intervalRef = useRef();

  // Dummy data generator
  useEffect(() => {
    // Initial dummy data
    let dummyData = Array.from({ length: 20 }, (_, i) => ({
      value: getRandomInt(60, 100),
      time: `${i}:00`,
    }));
    let running = true;
    let stopped = 3;
    let stopCounter = 0;
    let stopDuration = 0;

    setLineWithTrend({
      id: 1,
      name: "Line 1",
      status: "RUNNING",
      hexColor: "#22d3ee",
      data: dummyData,
    });

    intervalRef.current = setInterval(() => {
      // Geser data, tambah data baru di akhir
      dummyData = [
        ...dummyData.slice(1),
        {
          value: getRandomInt(60, 100),
          time: `${parseInt(dummyData[dummyData.length - 1].time) + 1}:00`,
        },
      ];

      // Status dinamis: STOP bertahan lebih lama
      if (!running) {
        stopCounter++;
        // STOP bertahan 4 detik (4 interval)
        if (stopCounter >= 4) {
          running = true;
          stopCounter = 0;
        }
      } else {
        // 20% kemungkinan masuk STOP
        if (Math.random() > 0.8) {
          running = false;
          stopCounter = 0;
        }
      }
      stopped = running ? 3 : 7;
      setLineWithTrend({
        id: 1,
        name: "Line 1",
        status: running ? "RUNNING" : "STOP",
        hexColor: running ? "#22d3ee" : "#f43f5e",
        data: dummyData,
      });
      setDashboardSummary({
        lineStatus: {
          total: 10,
          running: running ? 7 : 3,
          stopped: running ? 3 : 7,
        },
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Mesin"
            value={dashboardSummary?.lineStatus?.total ?? "-"}
            colorClass="text-emerald-400"
          />
          <DashboardCard
            title="Mesin Berjalan"
            value={dashboardSummary?.lineStatus?.running ?? "-"}
            colorClass="text-emerald-400"
          />
          <DashboardCard
            title="Mesin Berhenti"
            value={dashboardSummary?.lineStatus?.stopped ?? "-"}
            colorClass="text-rose-400"
            isNegative={true}
          />
          {/* Notif */}
          <div className="relative h-1/2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full h-full bg-[#111827] border border-slate-700/50 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-[#1a2332]"
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
        {/* Production Line */}
        <div className="space-y-4">
          {lineWithTrend ? (
            <ProductionLine
              key={lineWithTrend.id}
              line={{
                ...lineWithTrend,
                name: "Line 1",
                data: Array.isArray(lineWithTrend.data)
                  ? lineWithTrend.data
                  : [],
              }}
            />
          ) : (
            <div className="text-center py-10 text-slate-500">
              Loading dummy data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
