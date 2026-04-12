import api from './api';

export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/auth/login', {
            username,
            password,
        });
        return response.data; // Mengembalikan data (token, user, dll)
    } catch (error) {
        throw error; // Lempar error ke context untuk ditangani
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get('/auth/me'); // Contoh jika ada endpoint cek profil
        return response.data;
    } catch (error) {
        throw error;
    }
};