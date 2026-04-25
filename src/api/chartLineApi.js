import api from './api';

export const getChartLine = async () => {
    try {
        const response = await api.get('/page-line/1/chart');
        return response.data;
    } catch (error) {
        console.error('Error fetching Chart Line data:', error);
        throw error;
    }
};