import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../services/api';
import '../styles/Navbar.css';

import {
    FaHome, FaDumbbell, FaChartLine, FaUserFriends,
    FaTint, FaWeight, FaSignOutAlt, FaTimes, FaCheck,
    FaSpinner
} from 'react-icons/fa';

const BottomNavbar = () => {
    const { user, logout } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [waterCount, setWaterCount] = useState(0);
    const [showWeightModal, setShowWeightModal] = useState(false);
    const [weightInput, setWeightInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleLogWater = async () => {
        if (isSaving) return;

        const amount = 250;

        try {
            setIsSaving(true);
            const response = await api.post('/metrics/log_water', { amount_ml: amount });

            setWaterCount(c => c + 1);
            console.log("Water logged successfully:", response.data.log);

        } catch (error) {
            console.error("Failed to log water:", error.response?.data || error);
            alert("Error logging water. Please check your network.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveWeight = async () => {
        const weightValue = parseFloat(weightInput);
        if (isNaN(weightValue) || weightValue <= 0) {
            alert("Please enter a valid positive number for weight.");
            return;
        }

        if (isSaving) return;

        try {
            setIsSaving(true);
            const today = new Date().toISOString().split('T')[0];

            const response = await api.post('/metrics/log_weight', {
                weight_kg: weightValue,
                date: today
            });

            alert(`Weight logged: ${weightValue} kg`);
            console.log("Weight logged successfully:", response.data.log);

            setWeightInput('');
            setShowWeightModal(false);

        } catch (error) {
            console.error("Failed to save weight:", error.response?.data || error);
            alert("Error saving weight. Check console for details.");
        } finally {
            setIsSaving(false);
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
                    {/* Water: Quick Tap */}
                    <button
                        className="utility-btn water"
                        onClick={handleLogWater}
                        title="Log Water (+250ml)"
                        disabled={isSaving}
                    >
                        {isSaving ? <FaSpinner className="spin" /> : <FaTint />}
                        {waterCount > 0 && <span className="badge-counter">{waterCount}</span>}
                    </button>

                    {/* Weight: Opens Modal */}
                    <button
                        className="utility-btn"
                        onClick={() => setShowWeightModal(true)}
                        title="Log Weight"
                        disabled={isSaving}
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
                                disabled={isSaving}
                            />
                        </div>

                        <button
                            className="btn-modal-action btn-primary"
                            onClick={handleSaveWeight}
                            disabled={isSaving}
                        >
                            {isSaving ? <><FaSpinner className="spin" /> Saving...</> : <><FaCheck /> Save Entry</>}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default BottomNavbar;