import React, { useState, useContext } from "react";
import MachineAnalyticsContext from "./MachineAnalyticsContext";
import { getMachineTrend } from "../api/machineAnalyticsApi";

export const MachineAnalyticsProvider = ({ children }) => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrendData = async (params) => {
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
  };

  const value = {
    trendData,
    loading,
    error,
    fetchTrendData,
  };

  return (
    <MachineAnalyticsContext.Provider value={value}>{children}</MachineAnalyticsContext.Provider>
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
