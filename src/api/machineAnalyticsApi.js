import api from "./api";


export const machineAnalyticsApi = {
  /**
   * Mengambil data trend mesin
   * @param {Object} params 
   */
  getTrend: async (params) => {
    try {
      const response = await api.get('/docs#/Machine%20Analytics/MachineAnalyticsController_getTrend', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching machine trend:', error);
      throw error;
    }
  },

};

export default machineAnalyticsApi;