import api from "./api";

// API untuk Machine Analytics
export const machineAnalyticsApi = {
  /**
   * Mengambil data trend mesin
   * @param {Object} params { machineId, range, window }
   */
  getTrend: async (params) => {
    try {
      const response = await api.get("/machine-analytics/trend", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching machine trend:", error);
      throw error;
    }
  },

  /**
   * Mengambil data dashboard summary
   */
  getDashboardSummary: async () => {
    try {
      const response = await api.get("/machine-analytics/dashboard-summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw error;
    }
  },
};

// Helper untuk context/provider
export const getMachineTrend = async (params) => {
  try {
    const response = await api.get("/machine-analytics/trend", { params });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getDashboardSummary = async () => {
  try {
    const response = await api.get("/machine-analytics/dashboard-summary");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default machineAnalyticsApi;
