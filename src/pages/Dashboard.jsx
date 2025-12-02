import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../services/api';
import Sidebar from '../components/TopNavbar';
import MapComponent from '../components/MapComponent';
import '../styles/Dashboard.css';

import { FaBell, FaRunning, FaFire, FaTimes, FaGlassWhiskey, FaDumbbell, FaChartLine, FaArrowRight, FaWeightHanging } from 'react-icons/fa';

const calculateWorkoutDuration = (session) => {
    if (session.status === 'completed') return 30;
    if (session.status === 'quit') return 10;
    return 0;
};
const calculateCalories = (session) => {
    const duration = calculateWorkoutDuration(session);
    return duration * 5;
};
const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
};
const WATER_GOAL_ML = 3000;


const Dashboard = () => {
    const { user, loading } = useContext(UserContext);
    const [workouts, setWorkouts] = useState([]);
    const [metrics, setMetrics] = useState({
        waterIntake: 0,
        latestWeight: null,
        weightHistory: [],
        personalRecords: {},
        nextWorkout: null
    });
    const [workoutsLoading, setWorkoutsLoading] = useState(true);
    const [metricsLoading, setMetricsLoading] = useState(true);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const navigate = useNavigate();

    const fetchUserMetrics = useCallback(async () => {
        if (!user) return;
        setMetricsLoading(true);
        try {
            const response = await api.get('/metrics/summary');
            setMetrics(response.data);
        } catch (error) {
            console.error('Failed to fetch metrics summary:', error);
        } finally {
            setMetricsLoading(false);
        }
    }, [user]);

    const fetchWorkouts = useCallback(async () => {
        if (!user) return;
        setWorkoutsLoading(true);
        try {
            const response = await api.get('/workouts');
            setWorkouts(response.data.workouts || []);
        } catch (error) {
            console.error('Failed to fetch workouts:', error);
            setWorkouts([]);
        } finally {
            setWorkoutsLoading(false);
        }
    }, [user]);


    useEffect(() => {
        if (user && !loading) {
            fetchWorkouts();
            fetchUserMetrics();
        }
    }, [user, loading, fetchWorkouts, fetchUserMetrics]);

    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + calculateCalories(w), 0);
    const totalTimeMinutes = workouts.reduce((sum, w) => sum + calculateWorkoutDuration(w), 0);
    const totalTimeFormatted = formatDuration(totalTimeMinutes);

    const workoutDates = workouts
        .filter(w => w.status === 'completed')
        .map(w => new Date(w.date).toISOString().split('T')[0]);
    const uniqueCompletedDays = new Set(workoutDates).size;
    const streak = uniqueCompletedDays;

    const waterProgress = Math.min(100, (metrics.waterIntake / WATER_GOAL_ML) * 100);
    const waterTimeFormatted = formatDuration(metrics.waterIntake / 1000 * 60);


    if (loading || workoutsLoading || metricsLoading) return <div className="loading-screen" style={{ textAlign: 'center', padding: '100px', color: 'var(--primary)' }}>
        <FaDumbbell style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }} />
        <h2>Loading Dashboard...</h2>
    </div>;

    if (!user) return <div className="loading-screen">Please log in...</div>;

    const NotificationModal = () => (
        <div className="modal-overlay" onClick={() => setShowNotificationModal(false)}>
            <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Notifications</h3>
                    <FaTimes className="close-icon" onClick={() => setShowNotificationModal(false)} />
                </div>
                <div className="modal-body">
                    {/* Updated Notification to show live intake */}
                    <div className="notification-item">
                        <div className="notif-icon-circle"><FaGlassWhiskey /></div>
                        <div className="notif-text">
                            <p><strong>Time to hydrate!</strong> You've logged **{metrics.waterIntake}ml** today.</p>
                        </div>
                    </div>
                    <div className="notification-item">
                        <div className="notif-icon-circle" style={{ background: 'rgba(50, 205, 50, 0.15)' }}><FaFire style={{ color: '#32cd32' }} /></div>
                        <div className="notif-text">
                            <p><strong>Streak Alert:</strong> You are on a {streak} day streak!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderWeightTrend = () => {
        const history = metrics.weightHistory.map(log => log.weight_kg);

        if (history.length < 2) {
            const defaultPoints = "0,40 100,40";
            return <svg viewBox="0 0 100 40" className="chart-line"><polyline fill="none" stroke="#666" strokeWidth="1.5" points={defaultPoints} /></svg>;
        }

        const minWeight = Math.min(...history) - 0.5;
        const maxWeight = Math.max(...history) + 0.5;
        const range = maxWeight - minWeight;

        const points = history.map((w, i) => {
            const x = (i / (history.length - 1)) * 100;
            const y = 40 - ((w - minWeight) / range) * 40;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox="0 0 100 40" className="chart-line">
                <polyline fill="none" stroke="#20B2AA" strokeWidth="1.5" points={points} />
            </svg>
        );
    };

    const latestWeight = metrics.latestWeight;
    const isLosingWeight = metrics.weightHistory.length > 1 && latestWeight < metrics.weightHistory[0].weight_kg;
    const weightTrendMessage = latestWeight ? (isLosingWeight ? "Great momentum! Keep it up." : "Weight stable. Log your next weight!") : "No weight data logged yet.";


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
                        <div className="start-button-container">
                            <button
                                className="btn-start-workout"
                                onClick={() => navigate('/workouts')}
                            >
                                + Start Workout Now
                            </button>
                        </div>

                        <div className="icon-btn" onClick={() => setShowNotificationModal(true)}>
                            <FaBell />
                        </div>
                    </div>
                </header>

                {showNotificationModal && <NotificationModal />}

                <div className="dashboard-grid">
                    <div className="left-panel">
                        <div className="top-section">
                            <div className="dash-card overview-card large-graph">
                                <div className="card-header">
                                    <span className="card-title">Activity Overview</span>
                                    <select className="minimal-select"><option>Weekly</option></select>
                                </div>
                                <div className="chart-placeholder big-chart">
                                    {/* Activity Chart Placeholder */}
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
                                        <h3>{totalCalories.toLocaleString()}</h3>
                                    </div>
                                    <div className="stat-item">
                                        <p>Time</p>
                                        <h3>{totalTimeFormatted}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* DAILY GOAL / WATER INTAKE CARD */}
                            <div className="dash-card goal-card">
                                <div className="card-header">
                                    <span className="card-title">Hydration Goal (3L)</span>
                                    <span className="goal-value">{waterTimeFormatted} / {formatDuration(WATER_GOAL_ML / 1000 * 60)}</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${waterProgress}%` }}
                                    ></div>
                                </div>
                                <div className="cta-message">Log water using the button in the bottom navigation.</div>
                            </div>

                            {/* NEXT PLANNED WORKOUT */}
                            <div className="dash-card next-workout-card">
                                <div className="card-header">
                                    <span className="card-title">Next Session</span>
                                </div>
                                {metrics.nextWorkout ? (
                                    <>
                                        <h3>{metrics.nextWorkout.name}</h3>
                                        <p style={{ color: '#888' }}>Recommended to maintain momentum.</p>
                                        <button
                                            className="btn-quick-start"
                                            onClick={() => navigate(`/session/${metrics.nextWorkout.id}`)}
                                        >
                                            Quick Start <FaArrowRight />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3>No Next Workout Set</h3>
                                        <p style={{ color: '#888' }}>Find a new routine in the Workouts tab!</p>
                                        <button
                                            className="btn-quick-start"
                                            onClick={() => navigate('/workouts')}
                                        >
                                            Browse Workouts <FaArrowRight />
                                        </button>
                                    </>
                                )}
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
                                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>{streak} Day{streak !== 1 ? 's' : ''} 🔥</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="right-panel">
                        {/* CURRENT WEIGHT TREND CARD */}
                        <div className="dash-card weight-trend-card">
                            <div className="card-header">
                                <span className="card-title">Weight Trend (Last 7 Days)</span>
                                <h3>{metrics.latestWeight ? `${metrics.latestWeight.toFixed(1)} kg` : 'N/A'}</h3>
                            </div>
                            <div className="chart-placeholder small-chart">
                                {renderWeightTrend()}
                            </div>
                            <p className="trend-message" style={{ color: metrics.latestWeight ? (isLosingWeight ? '#32cd32' : '#FF4500') : '#888' }}>
                                {weightTrendMessage}
                            </p>
                            <div className="cta-message">Log weight using the button in the bottom navigation.</div>
                        </div>

                        {/* PERSONAL RECORDS CARD */}
                        <div className="dash-card pr-card">
                            <div className="card-header">
                                <span className="card-title">Personal Records (PRs)</span>
                            </div>
                            {Object.entries(metrics.personalRecords).length > 0 ? (
                                Object.entries(metrics.personalRecords).map(([exercise, record]) => (
                                    <div key={exercise} className="pr-item">
                                        <span className="pr-exercise">{exercise}</span>
                                        <span className="pr-value">{record.weight} lbs</span>
                                        <button className="icon-btn pr-view" onClick={() => alert(`View progress for ${exercise}`)}>
                                            <FaChartLine />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#888', textAlign: 'center' }}>Log a workout with weight to see PRs!</p>
                            )}
                        </div>

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