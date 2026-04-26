import { useState, useEffect } from 'react';
import { authContext } from './AuthContext';
import { loginUser } from '../api/auth';
import { jwtDecode } from 'jwt-decode'; // Install ini: npm install jwt-decode

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode token buat ambil role & username
                const decoded = jwtDecode(token);
                setUser({
                    token,
                    role: decoded.role, // Ambil role dari payload token
                    username: decoded.username
                });
            } catch (err) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const data = await loginUser(username, password);
            const token = data.access_token;

            localStorage.setItem('token', token);

            // Decode saat login sukses
            const decoded = jwtDecode(token);
            const userData = {
                token,
                role: decoded.role || data.role, // Sesuaikan dengan response API mu
                username: decoded.username || data.username
            };

            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login gagal.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <authContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </authContext.Provider>
    );
};