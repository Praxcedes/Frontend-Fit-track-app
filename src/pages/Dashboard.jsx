// src/pages/Dashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../services/api';
import Sidebar from '../components/TopNavbar';
import MapComponent from '../components/MapComponent';
import '../styles/Dashboard.css';

// Icons
import { FaBell, FaRunning, FaFire, FaTimes, FaGlassWhiskey } from 'react-icons/fa';

const Dashboard = () => {
    const { user, loading } = useContext(UserContext);
    const [workouts, setWorkouts] = useState([]);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const navigate = useNavigate();

    // --- DATA FETCHING ---
    useEffect(() => {
        if (user) {
            api.get('/workouts')
                .then(res => setWorkouts(Array.isArray(res.data) ? res.data : []))
                .catch(err => console.error(err));
        }
    }, [user]);

    if (loading || !user) return <div className="loading-screen">Loading...</div>;

    const totalWorkouts = workouts.length;

    // --- NOTIFICATION MODAL COMPONENT (Internal) ---
    const NotificationModal = () => (
        <div className="modal-overlay" onClick={() => setShowNotificationModal(false)}>
            <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Notifications</h3>
                    <FaTimes className="close-icon" onClick={() => setShowNotificationModal(false)} />
                </div>
                <div className="modal-body">
                    <div className="notification-item">
                        <div className="notif-icon-circle"><FaGlassWhiskey /></div>
                        <div className="notif-text">
                            <p><strong>Time to hydrate!</strong> Drink some water to keep your metabolism up. (Hourly Reminder)</p>
                        </div>
                    </div>

                    {/* Placeholder for other notifications */}
                    <div className="notification-item">
                        <div className="notif-icon-circle" style={{ background: 'rgba(50, 205, 50, 0.15)' }}><FaFire style={{ color: '#32cd32' }} /></div>
                        <div className="notif-text">
                            <p><strong>Streak Alert:</strong> Max Stone just hit a 7-day streak! Send a cheer!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="main-content">
                <header className="dashboard-header">
                    <div className="header-title">
                        <h1>Dashboard</h1>
                        <p className="welcome-text">Welcome back, {user.username}!</p>
                    </div>
                    <div className="header-actions">

                        {/* 2. Centered Button Container */}
                        <div className="start-button-container">
                            <button
                                className="btn-start-workout"
                                onClick={() => navigate('/workouts')}
                            >
                                + Start Workout Now
                            </button>
                        </div>

                        {/* 3. Notification Bell */}
                        <div className="icon-btn" onClick={() => setShowNotificationModal(true)}>
                            <FaBell />
                        </div>
                    </div>
                </header>

                {showNotificationModal && <NotificationModal />}

                <div className="dashboard-grid">
                    {/* LEFT PANEL */}
                    <div className="left-panel">
                        <div className="top-section">
                            <div className="dash-card overview-card large-graph">
                                <div className="card-header">
                                    <span className="card-title">Activity Overview</span>
                                    <select className="minimal-select"><option>Weekly</option></select>
                                </div>
                                <div className="chart-placeholder big-chart">
                                    <svg viewBox="0 0 100 40" className="chart-line">
                                        <polyline
                                            fill="none"
                                            stroke="#FF4500"
                                            strokeWidth="2"
                                            points="0,40 10,35 20,20 30,25 40,10 50,15 60,5 70,20 80,10 90,25 100,20"
                                        />
                                    </svg>
                                    <div className="graph-grid-lines"></div>
                                </div>
                                <div className="overview-stats">
                                    <div className="stat-item">
                                        <p>Workouts</p>
                                        <h3>{totalWorkouts}</h3>
                                    </div>
                                    <div className="stat-item">
                                        <p>Calories</p>
                                        <h3>12,400</h3>
                                    </div>
                                    <div className="stat-item">
                                        <p>Time</p>
                                        <h3>32h 10m</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="activity-cards">
                                <div className="dash-card activity-card">
                                    <div className="act-icon"><FaRunning /></div>
                                    <div>
                                        <span className="card-title">Steps</span>
                                        <p>5,200 / 10k</p>
                                    </div>
                                </div>
                                <div className="dash-card activity-card orange">
                                    <div className="act-icon" style={{ background: 'rgba(0,0,0,0.2)' }}><FaFire /></div>
                                    <div>
                                        <span className="card-title" style={{ color: 'white' }}>Streak</span>
                                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>4 Days 🔥</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL (Map & Friends) */}
                    <div className="right-panel">
                        <div className="dash-card">
                            <div className="card-header">
                                <span className="card-title">Nearby Friends</span>
                            </div>

                            <div className="map-container">
                                <MapComponent height={300} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;