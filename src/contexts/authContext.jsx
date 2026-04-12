import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../api/auth';

const authContext = createContext();

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
            const token = data.token; 
            
            localStorage.setItem('token', token);
            setUser({ token });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Server sedang sibuk, bro!' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <authContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </authContext.Provider>
    );
};

export const useAuth = () => useContext(authContext);