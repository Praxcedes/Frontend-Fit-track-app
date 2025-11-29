// src/pages/MyWorkouts.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import '../styles/MyWorkouts.css';

import { FaDumbbell, FaClock, FaCalendarCheck, FaChartLine, FaArrowRight, FaFilter } from 'react-icons/fa';

// --- PLACEHOLDER FOR BACKEND DATA ---
const loggedSessions = [
    // We will initialize with an empty array or fetch data here later.
    // Example structure if we had data:
    /*
    { id: 1, title: "Full Body HIIT Burn", status: "Completed", duration: 42.5, date: "2025-11-28", calories: 350 },
    { id: 2, title: "Upper Body Power Build", status: "Quit", duration: 15.0, date: "2025-11-27", calories: 120 },
    */
];

const MyWorkouts = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState(loggedSessions); // Set to empty initially
    const [filterType, setFilterType] = useState('all');

    // --- SUMMARY CALCULATIONS (Will update based on real data) ---
    const totalWorkouts = history.length;
    const completedWorkouts = history.filter(s => s.status === "Completed").length;
    const totalDurationHours = (history.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1);

    // --- UI HELPERS ---
    const formatDuration = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = Math.round(minutes % 60);
        return h > 0 ? `${h}h ${m}m` : `${m} min`;
    };

    const handleViewDetails = (id) => {
        // Placeholder for future detailed history view
        alert(`Viewing session details for ID: ${id}`);
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        // Add filtering logic here once backend integration is complete
    };

    return (
        <div className="dashboard-layout">
            <main className="main-content">

                <h1 style={{ marginBottom: '3rem' }}>My Activity Log</h1>

                {/* --- 1. SUMMARY STATS --- */}
                <div className="log-summary-grid">
                    <div className="summary-card">
                        <div className="summary-value">
                            <h3>{totalWorkouts}</h3>
                            <p>Total Workouts</p>
                        </div>
                        <FaDumbbell className="summary-icon" />
                    </div>

                    <div className="summary-card">
                        <div className="summary-value">
                            <h3>{completedWorkouts}</h3>
                            <p>Completed Sessions</p>
                        </div>
                        <FaCalendarCheck className="summary-icon" style={{ color: 'var(--log-status-complete)', background: 'rgba(50, 205, 50, 0.1)' }} />
                    </div>

                    <div className="summary-card">
                        <div className="summary-value">
                            <h3>{totalDurationHours}</h3>
                            <p>Total Time (Hours)</p>
                        </div>
                        <FaClock className="summary-icon" style={{ color: '#00bfff', background: 'rgba(0, 191, 255, 0.1)' }} />
                    </div>
                </div>

                {/* --- 2. FILTER & HEADER --- */}
                <div className="log-filter-bar">
                    <h2>Session History</h2>
                    <div className="filter-controls">
                        <FaFilter style={{ color: '#888' }} />
                        <select value={filterType} onChange={handleFilterChange}>
                            <option value="all">All Sessions</option>
                            <option value="completed">Completed</option>
                            <option value="quit">Quit</option>
                            <option value="strength">Strength</option>
                            <option value="cardio">Cardio</option>
                        </select>
                    </div>
                </div>

                {/* --- 3. ACTIVITY LIST --- */}
                {history.length > 0 ? (
                    <div className="activity-log-list">
                        {history.map(session => (
                            <div key={session.id} className="log-entry-card">
                                <div className="log-details">
                                    <FaChartLine style={{ color: '#aaa' }} />
                                    <div className="log-workout-name">
                                        <h4>{session.title}</h4>
                                        <div className="log-meta">
                                            {session.date} | {formatDuration(session.duration)}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span className={`log-status-badge status-${session.status.toLowerCase()}`}>
                                        {session.status}
                                    </span>
                                    <button
                                        onClick={() => handleViewDetails(session.id)}
                                        className="icon-btn"
                                        style={{ fontSize: '1rem', color: 'var(--primary-orange)' }}
                                    >
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // --- 4. EMPTY STATE ---
                    <div className="empty-log-state">
                        <h3 style={{ marginBottom: '15px' }}>No Workout History Found</h3>
                        <p>It looks like you haven't completed any sessions yet. Let's start moving!</p>
                        <button
                            className="btn-start-workout"
                            onClick={() => navigate('/workouts')}
                        >
                            <FaDumbbell /> Find Your First Workout
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyWorkouts;