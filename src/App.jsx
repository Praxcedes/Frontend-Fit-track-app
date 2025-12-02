import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

import TopNavbar from './components/TopNavbar';
import BottomNavbar from './components/BottomNavbar';
import ProtectedRoute from './components/ProtectedRoute';


import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import ActiveSession from './pages/ActiveSession';
import MyWorkouts from './pages/MyWorkouts';
import Friends from './pages/Friends';
import Settings from './pages/Settings';

import "./styles/Login.css";

const Layout = ({ children }) => {
    const location = useLocation();

    const isSession = location.pathname.startsWith('/session');
    const isLogin = location.pathname === '/';

    const showNavs = !isLogin && !isSession;

    return (
        <>
            {showNavs && <TopNavbar />}
            {/* Add 'no-padding' class if in session to remove the top/bottom spacing */}
            <div className={`app-content ${isSession ? 'no-padding' : ''}`}>
                {children}
            </div>
            {showNavs && <BottomNavbar />}
        </>
    );
};

function App() {
    return (
        <UserProvider>
            <Router>
                <Layout>
                    <Routes>
                        {/* Public Route */}
                        <Route path="/" element={<Login />} />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                        />

                        {/* Browsing Workouts */}
                        <Route
                            path="/workouts"
                            element={<ProtectedRoute><Workouts /></ProtectedRoute>}
                        />

                        {/* Fallback for the detail view if user manually types url */}
                        <Route
                            path="/workouts/:id"
                            element={<ProtectedRoute><Workouts /></ProtectedRoute>}
                        />

                        {/* NEW: ACTIVE WORKOUT SESSION */}
                        <Route
                            path="/session/:id"
                            element={<ProtectedRoute><ActiveSession /></ProtectedRoute>}
                        />

                        <Route
                            path="/my-workouts"
                            element={<ProtectedRoute><MyWorkouts /></ProtectedRoute>}
                        />

                        <Route
                            path="/friends"
                            element={<ProtectedRoute><Friends /></ProtectedRoute>}
                        />

                        <Route
                            path="/settings"
                            element={<ProtectedRoute><Settings /></ProtectedRoute>}
                        />
                    </Routes>
                </Layout>
            </Router>
        </UserProvider>
    );
}

export default App;