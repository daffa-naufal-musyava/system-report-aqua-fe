import api from "./api";

/**
 * Helper untuk mengambil data dashboard summary
 */
export const getDashboardSummary = async () => {
  try {
    const response = await api.get("/machine-analytics/dashboard-summary");
    return response.data;
  } catch (error) {
    console.error("API Error (getDashboardSummary):", error);
    throw error;
  }
};

/**
 * Helper untuk mengambil data trend mesin
 */
export const getMachineTrend = async (params) => {
  try {
    const response = await api.get("/machine-analytics/trend", { params });
    return response.data;
  } catch (error) {
    console.error("API Error (getMachineTrend):", error);
    throw error;
  }
};

const machineSummaryApi = {
  getDashboardSummary,
  getMachineTrend
};

export default machineSummaryApi;