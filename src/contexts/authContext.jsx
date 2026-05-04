import { createContext, useContext } from 'react';

export const authContext = createContext(null);

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error('useAuth must be used within an authProvider');
    }
    return context;
};