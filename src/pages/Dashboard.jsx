// src/pages/Dashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../services/api';
import '../styles/Dashboard.css';

// --- ICONS (Using fake characters for MVP, replace with real icons later) ---
const Icons = {
    Home: '🏠', Activity: '📊', Workouts: '💪', Settings: '⚙️', Logout: '🚪',
    Search: '🔍', Bell: '🔔', Running: '🏃‍♂️', Cycling: '🚴‍♀️', Fire: '🔥'
};

const Dashboard = () => {
    const { user, loading, logout } = useContext(UserContext);
    const [workouts, setWorkouts] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const navigate = useNavigate();

    // --- AUTH & DATA FETCHING LOGIC (Kept from previous version) ---
    useEffect(() => {
        if (!loading && !user) navigate('/');
    }, [loading, user, navigate]);

    useEffect(() => {
        if (user) {
            api.get('/workouts')
                .then(response => {
                    setWorkouts(response.data);
                    setDataLoading(false);
                })
                .catch(error => {
                    console.error("Error", error);
                    setDataLoading(false);
                });
        }
    }, [user]);

    const handleLogout = () => { logout(); navigate('/'); };

    if (loading || !user || dataLoading) {
        return <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    // Calculate some basic stats from real data
    const totalWorkouts = workouts.length;
    const recentWorkout = workouts[0] || { name: 'No recent workouts', date: 'N/A' };

    return (
        <div className="dashboard-container">

            {/* --- SIDEBAR --- */}
            <aside className="sidebar">
                <div className="brand-icon">⚡</div>
                <ul className="menu-list">
                    <li className="menu-item active">{Icons.Home}</li>
                    <li className="menu-item">{Icons.Activity}</li>
                    <li className="menu-item" onClick={() => navigate('/workouts')}>{Icons.Workouts}</li>
                    <li className="menu-item">{Icons.Settings}</li>
                </ul>
                <div className="menu-item logout-wrapper" onClick={handleLogout}>
                    {Icons.Logout}
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="main-content">

                {/* HEADER */}
                <header className="dashboard-header">
                    <div className="header-title">
                        <h1>Dashboard</h1>
                        <p style={{ color: 'var(--text-grey)', margin: 0 }}>Welcome back, {user.username}!</p>
                    </div>
                    <div className="header-actions">
                        <div className="search-bar">
                            {Icons.Search}
                            <input type="text" placeholder="Search..." />
                        </div>
                        <div className="menu-item">{Icons.Bell}</div>
                        <div className="user-profile">
                            <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                        </div>
                    </div>
                </header>

                {/* DASHBOARD GRID */}
                <div className="dashboard-grid">

                    {/* LEFT PANEL (Main Widgets) */}
                    <div className="left-panel">

                        {/* TOP SECTION: Overview + Activity */}
                        <div className="top-section">
                            {/* Overview Chart Card */}
                            <div className="dash-card overview-card">
                                <div className="card-header">
                                    <span className="card-title">Overview</span>
                                    <select style={{ background: 'transparent', color: 'var(--text-grey)', border: 'none' }}>
                                        <option>Monthly</option>
                                    </select>
                                </div>
                                {/* Visual Placeholder for Chart */}
                                <div className="chart-placeholder">
                                    <svg className="chart-wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"><path fill="#FF4500" fill-opacity="1" d="M0,224L48,213.3C96,203,192,181,288,192C384,203,480,245,576,218.7C672,192,768,96,864,96C960,96,1056,192,1152,213.3C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
                                    <div className="chart-bar" style={{ height: '40%' }}></div>
                                    <div className="chart-bar" style={{ height: '60%' }}></div>
                                    <div className="chart-bar" style={{ height: '85%' }}></div>
                                    <div className="chart-bar" style={{ height: '50%' }}></div>
                                    <div className="chart-bar" style={{ height: '70%' }}></div>
                                    <div className="chart-bar" style={{ height: '90%' }}></div>
                                </div>
                                <div className="overview-stats">
                                    <div className="stat-item">
                                        <p>Total Workouts</p>
                                        <h3>{totalWorkouts}</h3>
                                    </div>
                                    <div className="stat-item">
                                        <p>Avg. Intensity</p>
                                        <h3>High</h3>
                                    </div>
                                    <div className="stat-item">
                                        <p>Target</p>
                                        <h3>12 / Month</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Cards */}
                            <div className="activity-cards">
                                <div className="dash-card activity-card">
                                    <div className="act-icon">{Icons.Running}</div>
                                    <div>
                                        <span className="card-title">Daily Jogging</span>
                                        <p style={{ margin: 0, color: 'var(--text-grey)' }}>1,200 steps today</p>
                                    </div>
                                </div>
                                <div className="dash-card activity-card orange">
                                    <div className="act-icon" style={{ background: 'rgba(0,0,0,0.2)' }}>{Icons.Fire}</div>
                                    <div>
                                        <span className="card-title" style={{ color: 'white' }}>My Progress</span>
                                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>On a 3 day streak!</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM SECTION: Progress Cards */}
                        <div className="bottom-section">

                            {/* Card 1: Most Recent Workout (Using REAL DATA) */}
                            <div className="dash-card progress-card">
                                <div className="prog-header">
                                    <div className="act-icon">{Icons.Workouts}</div>
                                    <div className="prog-info">
                                        <h4>{recentWorkout.name}</h4>
                                        <p>Most Recent Workout</p>
                                    </div>
                                </div>
                                <div className="progress-bar-container">
                                    <span>Progress</span>
                                    <span>100%</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: '100%' }}></div>
                                </div>
                                <div className="prog-footer">
                                    <span>Completed on: {recentWorkout.date}</span>
                                    <span className="days-left" style={{ background: '#2d4a2d', color: '#4ade4a' }}>Done</span>
                                </div>
                            </div>

                            {/* Card 2: Placeholder Goal */}
                            <div className="dash-card progress-card">
                                <div className="prog-header">
                                    <div className="act-icon">{Icons.Cycling}</div>
                                    <div className="prog-info">
                                        <h4>Cycling Goal</h4>
                                        <p>50km / month</p>
                                    </div>
                                </div>
                                <div className="progress-bar-container">
                                    <span>Progress</span>
                                    <span>45%</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: '45%' }}></div>
                                </div>
                                <div className="prog-footer">
                                    <span>22.5 / 50km</span>
                                    <span className="days-left">12 days left</span>
                                </div>
                            </div>

                            {/* Card 3: Placeholder Challenge */}
                            <div className="dash-card progress-card">
                                <div className="prog-header">
                                    <div className="act-icon">{Icons.Activity}</div>
                                    <div className="prog-info">
                                        <h4>Monthly Challenge</h4>
                                        <p>Do 15 workouts</p>
                                    </div>
                                </div>
                                <div className="progress-bar-container">
                                    <span>Progress</span>
                                    <span>{Math.min((totalWorkouts / 15) * 100, 100).toFixed(0)}%</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${Math.min((totalWorkouts / 15) * 100, 100)}%` }}></div>
                                </div>
                                <div className="prog-footer">
                                    <span>{totalWorkouts} / 15 workouts</span>
                                    <span className="days-left">End of month</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT PANEL (Friends & Map) */}
                    <div className="right-panel">
                        <div className="dash-card">
                            <div className="card-header">
                                <span className="card-title">Friends</span>
                                <span style={{ color: 'var(--text-grey)', fontSize: '0.8rem' }}>View All</span>
                            </div>
                            <div className="friends-list">
                                {['Max Stone', 'Grisha Jack', 'Levi Pat'].map(name => (
                                    <div className="friend-item" key={name}>
                                        <div className="user-avatar" style={{ width: 35, height: 35, fontSize: '0.8rem' }}>{name.charAt(0)}</div>
                                        <div className="friend-info">
                                            <h5>{name}</h5>
                                            <p>Online</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="dash-card">
                            <div className="card-header">
                                <span className="card-title">Live Map</span>
                            </div>
                            <div className="map-placeholder">
                                Map View
                                <div className="map-pin" style={{ top: '40%', left: '60%' }}>📍</div>
                                <div className="map-pin" style={{ top: '60%', left: '30%', color: 'var(--text-grey)' }}>📍</div>
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;