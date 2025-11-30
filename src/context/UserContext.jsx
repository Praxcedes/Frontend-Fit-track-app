// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- SESSION CHECK (runs once on load) ---
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('access_token');
            console.log('Session check - Token found:', !!token); // Debug

            if (token) {
                try {
                    const res = await api.get('/auth/check_session');
                    setUser(res.data.user);
                    console.log('Session valid - User:', res.data.user.username); // Debug
                } catch (error) {
                    console.error("Session check failed:", error.response?.data || error.message);
                    localStorage.removeItem('access_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    // --- LOGIN ---
    const login = async (email, password) => {
        try {
            console.log('Login attempt for:', email); // Debug

            const response = await api.post('/auth/login', {
                username: email,
                password
            });

            const { access_token, user } = response.data;

            // Store token and update state
            localStorage.setItem('access_token', access_token);
            setUser(user);

            console.log('Login successful - User:', user.username); // Debug
            console.log('Token stored:', !!access_token); // Debug

            return { success: true };
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.errors?.join(', ') ||
                "Login failed";
            return { success: false, message: errorMessage };
        }
    };

    // --- SIGNUP ---
    const signup = async (username, email, password) => {
        try {
            console.log('Signup attempt for:', username, email); // Debug

            const response = await api.post('/auth/signup', {
                username,
                email,
                password
            });

            const { access_token, user } = response.data;

            // Store token and update state
            localStorage.setItem('access_token', access_token);
            setUser(user);

            console.log('Signup successful - User:', user.username); // Debug
            console.log('Token stored:', !!access_token); // Debug

            return { success: true };
        } catch (error) {
            console.error("Signup Error:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.errors?.join(', ') ||
                "Signup failed";
            return { success: false, message: errorMessage };
        }
    };

    // --- LOGOUT ---
    const logout = () => {
        console.log('Logging out user:', user?.username); // Debug
        localStorage.removeItem('access_token');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{
            user,
            loading,
            login,
            signup,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
};