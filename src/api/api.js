import axios from 'axios';

const api = axios.create({
    baseURL: "https://66c10dvz-3006.asse.devtunnels.ms/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor untuk otomatis masukin token ke header setiap kali request (untuk dashboard dll)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;