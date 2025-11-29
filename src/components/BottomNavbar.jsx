// src/components/BottomNavbar.jsx
import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';

import {
    FaHome, FaDumbbell, FaChartLine, FaUserFriends,
    FaTint, FaWeight, FaSignOutAlt, FaTimes, FaCheck
} from 'react-icons/fa';

const BottomNavbar = () => {
    const { user, logout } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    // State
    const [waterCount, setWaterCount] = useState(0);
    const [showWeightModal, setShowWeightModal] = useState(false);
    const [weightInput, setWeightInput] = useState('');

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSaveWeight = () => {
        if (weightInput) {
            // Here you would call API to save weight
            alert(`Weight logged: ${weightInput} kg`);
            setWeightInput('');
            setShowWeightModal(false);
        }
    };

    if (!user) return null;

    return (
        <>
            <nav className="bottom-navbar">

                {/* Navigation Group */}
                <div className="bottom-nav-links">
                    <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
                        <FaHome /> <span>Home</span>
                    </Link>
                    <Link to="/workouts" className={`nav-item ${isActive('/workouts')}`}>
                        <FaDumbbell /> <span>Browse</span>
                    </Link>
                    <Link to="/my-workouts" className={`nav-item ${isActive('/my-workouts')}`}>
                        <FaChartLine /> <span>Logs</span>
                    </Link>
                    <Link to="/friends" className={`nav-item ${isActive('/friends')}`}>
                        <FaUserFriends /> <span>Friends</span>
                    </Link>
                </div>

                <div className="nav-divider"></div>

                {/* Utilities Group */}
                <div className="bottom-utilities">
                    {/* Water: Quick Tap (No Modal needed for speed) */}
                    <button className="utility-btn water" onClick={() => setWaterCount(c => c + 1)} title="Log Water (+1 Cup)">
                        <FaTint />
                        {waterCount > 0 && <span className="badge-counter">{waterCount}</span>}
                    </button>

                    {/* Weight: Opens Modal */}
                    <button
                        className="utility-btn"
                        onClick={() => setShowWeightModal(true)}
                        title="Log Weight"
                    >
                        <FaWeight />
                    </button>

                    <button className="utility-btn logout" onClick={handleLogout} title="Logout">
                        <FaSignOutAlt />
                    </button>
                </div>
            </nav>

            {/* --- WEIGHT LOGGING MODAL --- */}
            {showWeightModal && (
                <div className="nav-modal-overlay" onClick={() => setShowWeightModal(false)}>
                    <div className="nav-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="nav-modal-header">
                            <span>Log Body Weight</span>
                            <button className="nav-close-btn" onClick={() => setShowWeightModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-input-group">
                            <label>Current Weight (kg)</label>
                            <input
                                type="number"
                                className="modal-input"
                                placeholder="e.g. 75.5"
                                value={weightInput}
                                onChange={(e) => setWeightInput(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <button className="btn-modal-action btn-primary" onClick={handleSaveWeight}>
                            <FaCheck /> Save Entry
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default BottomNavbar;