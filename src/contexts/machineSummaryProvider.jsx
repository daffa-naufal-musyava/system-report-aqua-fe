import React, { useState, useContext, useCallback, useEffect } from "react";
import MachineSummaryContext from "./machineSummaryContext";
import {
  getDashboardSummary,
  getMachineTrend,
} from "../api/machineSummaryApi";

export const MachineSummaryProvider = ({ children }) => {
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ambil data dashboard summary (Status mesin, line status, dll)
  const fetchDashboardSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardSummary();
      setDashboardSummary(data);
    } catch (err) {
      setError("Gagal mengambil dashboard summary.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil data trend mesin
  const fetchTrendData = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMachineTrend(params);
      setTrendData(data);
    } catch (err) {
      setError("Gagal mengambil data trend mesin.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efek untuk auto-refresh data dashboard setiap 5 detik (Opsional)
  useEffect(() => {
    fetchDashboardSummary();
    const interval = setInterval(fetchDashboardSummary, 5000);
    return () => clearInterval(interval);
  }, [fetchDashboardSummary]);

  const value = {
    dashboardSummary,
    machines: dashboardSummary?.machines || [],
    lineStatus: dashboardSummary?.lineStatus || { total: 0, running: 0, stopped: 0 },
    trendData,
    loading,
    error,
    fetchDashboardSummary,
    fetchTrendData,
  };

  return (
    <MachineSummaryContext.Provider value={value}>
      {children}
    </MachineSummaryContext.Provider>
  );
};

// Custom Hook untuk mempermudah pemanggilan di komponen
export const useMachineSummary = () => {
  const context = useContext(MachineSummaryContext);
  if (!context) {
    throw new Error(
      "useMachineSummary harus digunakan di dalam MachineSummaryProvider",
    );
  }
  return context;
};