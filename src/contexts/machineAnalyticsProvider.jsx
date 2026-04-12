import React, { useState, useContext } from 'react';
import machineAnalityContext from './MachineContext';
import { getMachineTrend } from '../api/machineApi';

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
      setError('Gagal mengambil data analytics mesin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    trendData,
    loading,
    error,
    fetchTrendData
  };

  return (
    <MachineContext.Provider value={value}>
      {children}
    </MachineContext.Provider>
  );
};

// Custom hook untuk akses datanya lebih cepat
export const useMachine = () => {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error('useMachine harus digunakan di dalam MachineAnalyticsProvider');
  }
  return context;
};