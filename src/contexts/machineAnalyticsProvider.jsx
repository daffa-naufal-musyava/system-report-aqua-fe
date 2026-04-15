import React, { useState, useContext, useCallback } from "react";
import MachineAnalyticsContext from "./MachineAnalyticsContext";
import {
  getMachineTrend,
  getDashboardSummary,
} from "../api/machineAnalyticsApi";

export const MachineAnalyticsProvider = ({ children }) => {
  const [trendData, setTrendData] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ambil data trend mesin
  const fetchTrendData = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMachineTrend(params);
      setTrendData(data);
    } catch (err) {
      setError("Gagal mengambil data analytics mesin.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil data dashboard summary
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

  const value = {
    trendData,
    dashboardSummary,
    loading,
    error,
    fetchTrendData,
    fetchDashboardSummary,
  };

  return (
    <MachineAnalyticsContext.Provider value={value}>
      {children}
    </MachineAnalyticsContext.Provider>
  );
};

export const useMachineAnalytics = () => {
  const context = useContext(MachineAnalyticsContext);
  if (!context) {
    throw new Error(
      "useMachineAnalytics harus digunakan di dalam MachineAnalyticsProvider",
    );
  }
  return context;
};
