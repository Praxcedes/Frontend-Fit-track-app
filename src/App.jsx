import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Import the Provider

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // <-- IMPORTED NEW COMPONENT

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
// Signup import removed since it is handled inside Login.jsx

// Styles
import "./styles/Login.css"; // OK
// import './styles/main.css'; // Global styles

// This component handles hiding the Navbar on the Login page AND Dashboard
const Layout = ({ children }) => {
    const location = useLocation();

    // Hide Navbar on the root path "/" (Login page) AND "/dashboard" (It has its own Sidebar)
    const showNavbar = location.pathname !== '/' && location.pathname !== '/dashboard';

    return (
        <>
            {showNavbar && <Navbar />}
            <div className="app-content">
                {children}
            </div>
        </>
    );
};

function App() {
    return (
        <UserProvider> {/* Wrap everything in UserProvider for Global State */}
            <Router>
                <Layout>
                    <Routes>
                        {/* Public Route (Login & Signup Toggle) */}
                        <Route path="/" element={<Login />} />

                        {/* Protected Routes (NOW SECURED BY PROTECTEDROUTE) */}
                        <Route
                            path="/dashboard"
                            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                        />
                        <Route
                            path="/workouts"
                            element={<ProtectedRoute><Workouts /></ProtectedRoute>}
                        />
                        <Route
                            path="/workouts/:id"
                            element={<ProtectedRoute><WorkoutDetail /></ProtectedRoute>}
                        />
                    </Routes>
                </Layout>
            </Router>
        </UserProvider>
    );
}

export default App;