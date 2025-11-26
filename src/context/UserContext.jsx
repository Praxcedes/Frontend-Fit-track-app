// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Import your axios instance

// Create the Context object
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state for initial check

    // 1. Check if user is already logged in (Auto-login)
    useEffect(() => {
        // This assumes your backend has a route GET /check_session
        // If backend isn't ready, this will just fail quietly and user stays logged out
        api.get('/check_session')
            .then((response) => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false); // Not logged in
            });
    }, []);

    // 2. Login Function (Call this from Login.jsx)
    const login = async (email, password) => {
        // Replace with your actual backend login route
        const response = await api.post('/login', { email, password });
        setUser(response.data); // Store user data (e.g., { id: 1, username: 'David' })
    };

    // 3. Logout Function
    const logout = async () => {
        await api.delete('/logout');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};