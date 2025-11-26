import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decode token payload (base64) to get user info (simplified)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ id: payload.id, role: payload.role, name: payload.name, email: payload.email });
            } catch (e) {
                console.error('Invalid token');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        const { token, user: loggedUser } = res.data.data;
        localStorage.setItem('token', token);
        setUser(loggedUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = { user, loading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
