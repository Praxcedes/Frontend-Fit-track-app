// src/pages/Settings.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Dashboard.css';
import '../styles/Settings.css';

import {
    FaUserCircle, FaLock, FaExternalLinkAlt, FaTrash,
    FaSun, FaRulerCombined, FaBell, FaGlobe,
    FaHandsHelping, FaInfoCircle, FaChevronRight, FaTimes
} from 'react-icons/fa';

const Settings = () => {
    const navigate = useNavigate();
    const { user, loading, logout } = useContext(UserContext);

    const [activeForm, setActiveForm] = useState(null);

    // Initial States
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const [isPushEnabled, setIsPushEnabled] = useState(true);
    const [units, setUnits] = useState('metric');

    const APP_VERSION = "1.0.3";

    // --- HANDLERS ---
    const handleSavePreferences = (preferenceName, value) => {
        console.log(`Setting saved: ${preferenceName} set to ${value}`);
    };

    const handleUnitsChange = (e) => {
        const newUnits = e.target.value;
        setUnits(newUnits);
        handleSavePreferences('units', newUnits);
    };

    const handleDataDeletion = () => {
        if (window.confirm("WARNING: Requesting data deletion is permanent. Are you sure?")) {
            alert("Data Deletion Request Sent. You will receive an email confirmation.");
        }
    };

    /* REMOVED: handleLogout function and usage */


    // --- Form Submission Handlers (Placeholders) ---
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        alert("Profile updated successfully! (Backend integration pending)");
        setActiveForm(null);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        alert("Password changed successfully! (Backend integration pending)");
        setActiveForm(null);
    };


    // --- INTERNAL FORM COMPONENTS ---

    // 1. Edit Profile Form
    const EditProfileForm = () => {
        const [username, setUsername] = useState(user.username);
        const [email, setEmail] = useState(user.email);

        return (
            <div className="settings-form-container">
                <div className="form-header">
                    <h3>Edit Profile Details</h3>
                    <FaTimes className="close-icon" onClick={() => setActiveForm(null)} />
                </div>
                <form onSubmit={handleProfileSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-save-form">Save Changes</button>
                </form>
            </div>
        );
    };

    // 2. Change Password Form
    const ChangePasswordForm = () => {
        const [oldPassword, setOldPassword] = useState('');
        const [newPassword, setNewPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');

        return (
            <div className="settings-form-container">
                <div className="form-header">
                    <h3>Change Password</h3>
                    <FaTimes className="close-icon" onClick={() => setActiveForm(null)} />
                </div>
                <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-save-form">Change Password</button>
                </form>
            </div>
        );
    };

    // --- Reusable Toggle Component ---
    const ToggleSwitch = ({ checked, onChange, preferenceName }) => {
        const handleChange = () => {
            const newState = !checked;
            onChange(newState);
            handleSavePreferences(preferenceName, newState);
        };
        return (
            <label className="switch">
                <input type="checkbox" checked={checked} onChange={handleChange} />
                <span className="slider"></span>
            </label>
        );
    };

    if (loading) return <div className="loading-screen">Loading Settings...</div>;
    if (!user) return <div className="loading-screen">Please log in to view settings.</div>;

    // --- Render Form Overlay if activeForm is set ---
    if (activeForm) {
        return (
            <div className="modal-overlay">
                <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
                    {activeForm === 'profile' && <EditProfileForm />}
                    {activeForm === 'password' && <ChangePasswordForm />}
                </div>
            </div>
        );
    }


    // --- Render Main Settings List ---
    return (
        <div className="dashboard-layout">
            <main className="main-content">
                <div className="settings-container">
                    <h1>Settings</h1>

                    {/* --- 1. Account Management --- */}
                    <div className="settings-section">
                        <h2>Account Management</h2>

                        {/* Profile Info Row */}
                        <div className="setting-item">
                            <div className="setting-details">
                                <FaUserCircle className="setting-icon" />
                                <div>
                                    <p style={{ margin: 0 }}>{user.username}</p>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                            <button className="btn-setting-action" onClick={() => setActiveForm('profile')}>
                                Edit <FaChevronRight style={{ fontSize: '0.8rem', marginLeft: '5px' }} />
                            </button>
                        </div>

                        {/* Security (Now opens form) */}
                        <div className="setting-item">
                            <div className="setting-details">
                                <FaLock className="setting-icon" />
                                <span>Change Password</span>
                            </div>
                            <button className="btn-setting-action" onClick={() => setActiveForm('password')}>
                                Update
                            </button>
                        </div>

                        {/* Data Deletion */}
                        <div className="setting-item">
                            <div className="setting-details">
                                <FaTrash className="setting-icon" style={{ color: '#ff4d4d' }} />
                                <span>Delete Account Data</span>
                            </div>
                            <button
                                className="btn-setting-action"
                                style={{ borderColor: '#ff4d4d', color: '#ff4d4d' }}
                                onClick={handleDataDeletion}
                            >
                                Request Deletion
                            </button>
                        </div>
                    </div>

                    {/* --- 2. App Preferences --- */}
                    <div className="settings-section">
                        <h2>App Preferences</h2>
                        {/* Theme Toggle */}
                        <div className="setting-item">
                            <div className="setting-details">
                                <FaSun className="setting-icon" />
                                <span>Dark Mode</span>
                            </div>
                            <ToggleSwitch checked={isDarkMode} onChange={setIsDarkMode} preferenceName="isDarkMode" />
                        </div>

                        {/* Units of Measurement */}
                        <div className="setting-item">
                            <div className="setting-details">
                                <FaRulerCombined className="setting-icon" />
                                <span>Units of Measurement</span>
                            </div>
                            <select
                                value={units}
                                onChange={handleUnitsChange}
                                className="btn-setting-action"
                            >
                                <option value="metric">Metric (kg, km)</option>
                                <option value="imperial">Imperial (lbs, mi)</option>
                            </select>
                        </div>

                        {/* Push Notifications */}
                        <div className="setting-item">
                            <div className="setting-details">
                                <FaBell className="setting-icon" />
                                <span>Allow Push Notifications</span>
                            </div>
                            <ToggleSwitch checked={isPushEnabled} onChange={setIsPushEnabled} preferenceName="isPushEnabled" />
                        </div>
                    </div>

                    {/* --- 3. Social & Privacy --- */}
                    <div className="settings-section">
                        <h2>Social & Privacy</h2>

                        {/* Location Sharing */}
                        <div className="setting-item">
                            <div className="setting-details">
                                <FaGlobe className="setting-icon" />
                                <span>Share Live Geolocation</span>
                            </div>
                            <ToggleSwitch checked={isSharingLocation} onChange={setIsSharingLocation} preferenceName="isSharingLocation" />
                        </div>

                        {/* Privacy Policy Link */}
                        <div className="setting-item">
                            <div className="setting-details">
                                <FaLock className="setting-icon" />
                                <span>View Privacy Policy</span>
                            </div>
                            <a href="/privacy" target="_blank" style={{ color: 'var(--primary-orange)', textDecoration: 'none' }}>
                                <FaExternalLinkAlt />
                            </a>
                        </div>
                    </div>

                    {/* --- 4. About & Support --- */}
                    <div className="settings-section">
                        <h2>Support</h2>

                        <div className="setting-item">
                            <div className="setting-details">
                                <FaHandsHelping className="setting-icon" />
                                <span>Help Center & FAQ</span>
                            </div>
                            <FaChevronRight style={{ color: 'var(--text-grey)' }} />
                        </div>

                        <div className="setting-item">
                            <div className="setting-details">
                                <FaInfoCircle className="setting-icon" />
                                <span>App Version</span>
                            </div>
                            <span style={{ color: 'var(--primary-orange)' }}>{APP_VERSION}</span>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
};

export default Settings;