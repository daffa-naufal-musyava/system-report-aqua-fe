import api from './api';

export const getShiftSummary = async (shiftNumber, machineId) => {
  const res = await api.get(`shift-summary/shift/${shiftNumber}`, { params: { machineId } });
  return res.data;
};

export const getDailySummary = async (machineId) => {
  const res = await api.get(`shift-summary/daily`, { params: { machineId } });
  return res.data;
};

// PDT Services
export const getPdtList = async () => {
  const res = await api.get('pdt');
  return res.data;
};

export const createPdt = async (pdtData) => {
  const res = await api.post('pdt', pdtData);
  return res.data;
};

export const unlockPdt = async (id, unlockData) => {
  const res = await api.patch(`pdt/${id}/unlock`, unlockData);
  return res.data;
};