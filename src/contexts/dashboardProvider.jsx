import { useState, useEffect, useRef, useCallback } from "react";
import { dashboardContext } from "./dashboardContext";
import { socket } from "../api/socket";
import { getKPI } from "../api/kpiApi";
import { getChartLine } from "../api/chartLineApi";

export const DashboardProvider = ({ children }) => {
  const [dashboardSummary, setDashboardSummary] = useState({
    totalMachines: 0,
    runningMachines: 0,
    stoppedMachines: 0,
    notifications: [],
  });
  const [lineWithTrend, setLineWithTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    const initData = async () => {
      try {
        const [kpiRes, chartRes] = await Promise.all([getKPI(), getChartLine()]);
        const kpiData = kpiRes?.data ?? kpiRes;
        
        if (kpiData) {
          setDashboardSummary({
            totalMachines: kpiData.total ?? 0,
            runningMachines: kpiData.running ?? 0,
            stoppedMachines: kpiData.stopped ?? 0,
            notifications: Array.isArray(kpiData.notifications) ? kpiData.notifications : [],
          });
        }
        if (chartRes?.success) processAndSetChart(chartRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initData();

    // Socket Handlers
    const onDashboardUpdate = (payload) => {
      const raw = payload?.data ?? payload;
      setDashboardSummary(prev => ({ ...prev, ...raw }));
    };

    const onLineUpdate = (payload) => {
      if (payload?.success) processAndSetChart(payload.data);
    };

    socket.on("dashboard_update", onDashboardUpdate);
    socket.on("line_status_update", onLineUpdate);

    return () => {
      socket.off("dashboard_update", onDashboardUpdate);
      socket.off("line_status_update", onLineUpdate);
    };
  }, [processAndSetChart]);

  return (
    <dashboardContext.Provider value={{ dashboardSummary, lineWithTrend, isLoading }}>
      {children}
    </dashboardContext.Provider>
  );
};