import api from './api';

export const getKPI = async (params) => {
    try {
        const response = await api.get('/page-dashboard/summary', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching KPI data:', error);
        throw error;
    }
}
