import axios from 'axios';

const api = axios.create({
    baseURL: 'https://66c10dvz-3006.asse.devtunnels.ms/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Otomatis menyelipkan token di setiap request (untuk dashboard/data fetching)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;