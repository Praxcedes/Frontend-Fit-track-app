import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';
import { FaTimes, FaPencilAlt, FaCog } from 'react-icons/fa';

const TopNavbar = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    if (!user) return null;

    const handleEditProfile = () => {
        setShowModal(false);
        navigate('/settings');
    };

    return (
        <>
            <header className="top-navbar">
                <div style={{ width: '60px' }}></div>

                <div className="nav-logo-container">
                    <Link to="/dashboard" className="nav-logo">
                        ⚡ FITTRACK
                    </Link>
                </div>

                {/* Clickable Avatar Section */}
                <div
                    className="nav-avatar-section"
                    title="Profile"
                    onClick={() => setShowModal(true)}
                >
                    <div className="nav-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="nav-username">
                        {user.username}
                    </span>
                </div>
            </header>

            {/* --- PROFILE MODAL --- */}
            {showModal && (
                <div className="nav-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="nav-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="nav-modal-header">
                            <span>My Profile</span>
                            <button className="nav-close-btn" onClick={() => setShowModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-avatar-large">
                            {user.username.charAt(0).toUpperCase()}
                        </div>

                        <div className="modal-user-info">
                            <h3>{user.username}</h3>
                            <p>{user.email}</p>
                        </div>

                        <button className="btn-modal-action btn-primary" onClick={handleEditProfile}>
                            <FaPencilAlt /> Edit Profile
                        </button>

                        <button
                            className="btn-modal-action"
                            style={{ background: 'transparent', color: '#666', marginTop: '10px' }}
                            onClick={handleEditProfile}
                        >
                            <FaCog /> Settings
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default TopNavbar;