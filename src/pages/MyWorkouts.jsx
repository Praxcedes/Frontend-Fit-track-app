import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';
import '../styles/MyWorkouts.css';

import { FaDumbbell, FaClock, FaCalendarCheck, FaChartLine, FaArrowRight, FaFilter, FaTrash } from 'react-icons/fa';

// --- HELPER FUNCTIONS ---

// Calculates the total duration of a single workout in minutes
const calculateSessionDuration = (session) => {
    // FIX: Use session.total_duration_minutes if the backend provides it.
    // Otherwise, use a placeholder estimate based on status.
    if (session.total_duration_minutes) {
        return session.total_duration_minutes;
    }
    return session.status === 'completed' ? 30 : 10;
};

// Formats minutes into HHh MMm
const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    // FIX: Improved formatting logic to handle cases where time is less than an hour gracefully.
    if (h > 0) {
        return `${h}h ${m}m`;
    }
    return `${m} min`;
};

// --- COMPONENT START ---

const MyWorkouts = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [filterType, setFilterType] = useState('all');

    // --- EFFECT 1: FETCH DATA ---
    const fetchHistory = async () => {
        try {
            // FIX 1: The backend GET /workouts/ endpoint returns the list directly (not wrapped in .workouts)
            const response = await api.get('/workouts/');

            // FIX 2: Check if response.data is an array or assume it's the list.
            // Since we ensured the backend returns a list directly, use response.data.
            const workoutsList = Array.isArray(response.data) ? response.data : response.data.workouts || [];

            setHistory(workoutsList);
            setLoading(false);
            setFetchError(null);
        } catch (error) {
            console.error("Failed to fetch workout history:", error);
            setFetchError("Could not load workout history.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // --- ACTION: DELETE LOG ---
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this workout session?")) {
            return;
        }

        try {
            // Call the DELETE /workouts/<id> endpoint we just implemented
            await api.delete(`/workouts/${id}`);
            alert("Workout deleted successfully!");

            // Re-fetch data to update the list immediately
            fetchHistory();
        } catch (error) {
            console.error("Failed to delete workout:", error.response?.data);
            alert("Failed to delete workout. Please try again.");
        }
    };

    // --- Filtering Logic ---
    const filteredHistory = history.filter(session => {
        if (filterType === 'all') return true;
        if (filterType === 'completed' && session.status === 'completed') return true;
        if (filterType === 'quit' && session.status === 'quit') return true;
        return false;
    });

    // --- SUMMARY CALCULATIONS ---
    const totalWorkouts = history.length;
    const completedWorkouts = history.filter(s => s.status === "completed").length;

    const totalDurationMinutes = history.reduce((sum, s) => sum + calculateSessionDuration(s), 0);
    const totalDurationHours = (totalDurationMinutes / 60).toFixed(1);

    // --- UI HELPERS ---
    const handleViewDetails = (id) => {
        // FIX: Navigate to a dedicated detail page, using the ID for the GET /workouts/<id> call
        navigate(`/workout-detail/${id}`);
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    // Handle Loading and Error states
    if (loading) {
        return <div className="loading-state" style={{ textAlign: 'center', padding: '100px', color: 'var(--primary)' }}>
            <FaDumbbell style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }} />
            <h2>Loading History...</h2>
        </div>;
    }

    if (fetchError) {
        return <div className="error-state" style={{ textAlign: 'center', padding: '100px', color: 'red' }}>
            <h3>Error Loading History</h3>
            <p>{fetchError}</p>
        </div>;
    }

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
                        </select>
                    </div>
                </div>

                {/* --- 3. ACTIVITY LIST --- */}
                {filteredHistory.length > 0 ? (
                    <div className="activity-log-list">
                        {filteredHistory.map(session => (
                            <div key={session.id} className="log-entry-card">
                                <div className="log-details">
                                    <FaChartLine style={{ color: '#aaa' }} />
                                    <div className="log-workout-name">
                                        <h4>{session.name}</h4>
                                        <div className="log-meta">
                                            {session.date} | {formatDuration(calculateSessionDuration(session))}
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
                                    <button
                                        onClick={() => handleDelete(session.id)}
                                        className="icon-btn"
                                        style={{ fontSize: '1rem', color: '#ff4d4d' }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // --- 4. EMPTY STATE ---
                    <div className="empty-log-state">
                        <h3 style={{ marginBottom: '15px' }}>
                            {history.length === 0 ? "No Workout History Found" : "No Sessions Match Filter"}
                        </h3>
                        <p>
                            {history.length === 0
                                ? "It looks like you haven't completed any sessions yet. Let's start moving!"
                                : "Try clearing your filters to see more sessions."
                            }
                        </p>
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