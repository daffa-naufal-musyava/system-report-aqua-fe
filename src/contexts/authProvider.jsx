import { useState, useEffect } from 'react';
import { authContext } from './AuthContext';
import { loginUser } from '../api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const data = await loginUser(username, password);
            const token = data.access_token;

            localStorage.setItem('token', token);
            setUser({ token });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Username/Password salah atau server error.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        confirm("Apakah Anda yakin ingin logout?", () => {
            setUser(null);
        });
    };

    return (
        <authContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </authContext.Provider>
    );
};