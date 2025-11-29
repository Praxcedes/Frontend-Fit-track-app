// src/pages/Friends.jsx
import React, { useState } from 'react';
import { FaUserPlus, FaUsers, FaTrophy, FaFire, FaCamera, FaCheck, FaTimes, FaComment } from 'react-icons/fa';
import '../styles/Dashboard.css';
import '../styles/Friends.css';
import MapComponent from '../components/MapComponent'; // <--- NEW IMPORT

// --- MOCK DATA ---
const MOCK_FRIENDS = [
    // ... (Keep existing MOCK_FRIENDS data) ...
    { id: 1, name: "Max Stone", status: 'online', streak: 7, lastActivity: "5K Run", score: 850 },
    { id: 2, name: "Griselda Jack", status: 'offline', streak: 3, lastActivity: "Upper Body", score: 620 },
    { id: 3, name: "Levi Patrick", status: 'online', streak: 12, lastActivity: "Deep Yoga", score: 980 },
    { id: 4, name: "Carly Bryan", status: 'offline', streak: 0, lastActivity: "Rest Day", score: 300 },
];

const MOCK_REQUESTS = [
    { id: 5, name: "Dana Scully" },
    { id: 6, name: "Fox Mulder" },
];

const Friends = () => {
    // ... (Keep existing state and actions like handleAccept/Decline) ...
    const [friends, setFriends] = useState(MOCK_FRIENDS);
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [leaderboardSort, setLeaderboardSort] = useState('score');

    // Sort logic for Leaderboard
    const sortedLeaderboard = [...friends].sort((a, b) => {
        if (leaderboardSort === 'score') return b.score - a.score;
        if (leaderboardSort === 'streak') return b.streak - a.streak;
        return 0;
    });

    // --- ACTIONS --- (Keep existing actions)
    const handleAccept = (id) => {
        const user = requests.find(r => r.id === id);
        if (user) {
            setFriends([...friends, { ...user, status: 'online', streak: 0, score: 100, lastActivity: "Just Joined" }]);
            setRequests(requests.filter(r => r.id !== id));
        }
    };

    const handleDecline = (id) => {
        setRequests(requests.filter(r => r.id !== id));
    };

    const handleAddFriend = () => {
        if (searchQuery.trim()) {
            alert(`Sending friend request to "${searchQuery.trim()}".`);
            setSearchQuery('');
        }
    };

    return (
        <div className="dashboard-layout">
            <main className="main-content">
                <h1 style={{ marginBottom: '3rem' }}>My Social Network</h1>

                <div className="friends-grid">

                    {/* --- LEFT PANEL: Friends List & Search --- */}
                    {/* ... (Keep existing LEFT PANEL JSX) ... */}
                    <div className="friends-list-container">

                        {/* 1. Search and Add Functionality */}
                        <div className="search-add-bar">
                            <input
                                type="text"
                                placeholder="Find users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="btn-add-friend" onClick={handleAddFriend}>
                                <FaUserPlus /> Add Friend
                            </button>
                        </div>

                        <h2>Your Connections ({friends.length})</h2>
                        <div className="friends-list">
                            {/* 3. Friends List & Status */}
                            {friends.map((friend) => (
                                <div key={friend.id} className="friend-entry">
                                    <div className="friend-details">
                                        <div className="friend-avatar">
                                            {friend.name.charAt(0)}
                                            {friend.status === 'online' && <span className="status-dot"></span>}
                                        </div>
                                        <div>
                                            <div className="leader-name">{friend.name}</div>
                                            <div style={{ color: '#888', fontSize: '0.85rem' }}>
                                                <FaFire style={{ color: 'var(--primary-orange)' }} /> {friend.streak} Day Streak
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cheer Button */}
                                    <button className="cheer-btn" onClick={() => alert(`Cheering on ${friend.name}!`)}>
                                        <FaComment /> Cheer
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- RIGHT PANEL: Sidebar --- */}
                    <div className="friends-sidebar">

                        {/* 4. Map Integration (NEW) */}
                        <div className="map-card">
                            <h3>🗺️ Friends Nearby</h3>
                            {/* Display Map Component */}
                            <MapComponent height={350} />
                        </div>

                        {/* 5. Photo/Streak Share Section */}
                        <div className="share-streak-card">
                            <FaFire style={{ fontSize: '2.5rem', color: 'var(--primary-orange)' }} />
                            <h3>Share Your Progress!</h3>
                            <p>Celebrate your current streak and push your friends!</p>
                            <button className="btn-share" onClick={() => alert('Opening camera/upload tool...')}>
                                <FaCamera /> Post Photo/Streak
                            </button>
                        </div>


                        {/* 2. Pending Requests Center */}
                        {requests.length > 0 && (
                            <div className="sidebar-card">
                                <h3>Pending Requests ({requests.length})</h3>
                                {requests.map(req => (
                                    <div key={req.id} className="request-entry">
                                        <div className="leader-name">{req.name}</div>
                                        <div className="request-actions">
                                            <button className="btn-accept" onClick={() => handleAccept(req.id)}><FaCheck /></button>
                                            <button className="btn-decline" onClick={() => handleDecline(req.id)}><FaTimes /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}


                        {/* 4. Leaderboard */}
                        <div className="sidebar-card">
                            <h3>
                                Weekly Leaderboard
                                <select
                                    value={leaderboardSort}
                                    onChange={(e) => setLeaderboardSort(e.target.value)}
                                    style={{ fontSize: '0.8rem' }}
                                >
                                    <option value="score">Score</option>
                                    <option value="streak">Streak</option>
                                </select>
                            </h3>

                            {sortedLeaderboard.map((friend, index) => (
                                <div key={friend.id} className="leaderboard-entry">
                                    <div className="rank">#{index + 1}</div>
                                    <div className="leader-name">{friend.name}</div>
                                    <div className="leader-value">
                                        {leaderboardSort === 'score' ? `${friend.score} pts` : `${friend.streak} days`}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
};

export default Friends;