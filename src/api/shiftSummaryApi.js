import api from './api';

export const getShiftSummary = async (shiftNumber, machineId) => {
  const response = await api.get(`shift-summary/shift/${shiftNumber}`, {
    params: { machineId }
  });
  return response.data;
};

export const getDailySummary = async (machineId) => {
  const response = await api.get(`shift-summary/daily`, {
    params: { machineId }
  });
  return response.data;
};