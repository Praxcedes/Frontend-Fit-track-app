// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        // Return a simple loading screen while checking session
        return <h1 style={{ color: 'white', textAlign: 'center', paddingTop: '50vh' }}>Loading Session...</h1>;
    }

    if (!user) {
        // User is not authenticated, redirect to the login page
        return <Navigate to="/" replace />;
    }

    // User is logged in, render the child route content
    return children;
};

export default ProtectedRoute;