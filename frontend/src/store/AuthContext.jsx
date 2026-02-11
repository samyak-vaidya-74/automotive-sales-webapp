import React, { useState } from 'react';
import authService from '../services/authService';
import { AuthContext } from './auth-context'; // Import the definition

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => authService.getCurrentUser());

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
