import React, { useState, useEffect } from 'react';
import api from '../services/api'; // ADDED: API import for friend management
import { FaUserPlus, FaUsers, FaTrophy, FaFire, FaCamera, FaCheck, FaTimes, FaComment, FaDumbbell } from 'react-icons/fa';
import '../styles/Dashboard.css';
import '../styles/Friends.css';
import MapComponent from '../components/MapComponent';

// --- MOCK DATA (Temporary) ---
const MOCK_FRIENDS = [
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
    // --- STATE ---
    const [friends, setFriends] = useState(MOCK_FRIENDS);
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [leaderboardSort, setLeaderboardSort] = useState('score');
    const [loading, setLoading] = useState(false); // ADDED: Loading state for fetching
    const [fetchError, setFetchError] = useState(null); // ADDED: Error state

    // --- EFFECT: FETCH INITIAL DATA ---
    useEffect(() => {
        const fetchFriendData = async () => {
            setLoading(true);
            try {
                // NOTE: These API endpoints are placeholders (e.g., /friends and /requests)
                // They need to be implemented in the Flask backend for this to work.

                // const friendsResponse = await api.get('/friends');
                // const requestsResponse = await api.get('/friend-requests');

                // setFriends(friendsResponse.data.friends || []);
                // setRequests(requestsResponse.data.requests || []);

                // Keeping MOCK data for display until endpoints are implemented:
                setFriends(MOCK_FRIENDS);
                setRequests(MOCK_REQUESTS);
            } catch (error) {
                console.error("Failed to fetch social data:", error);
                setFetchError("Failed to load friends list or requests.");
                // Fallback to mock data if error occurs
                setFriends(MOCK_FRIENDS);
                setRequests(MOCK_REQUESTS);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendData();
    }, []);

    // Sort logic for Leaderboard
    const sortedLeaderboard = [...friends].sort((a, b) => {
        if (leaderboardSort === 'score') return b.score - a.score;
        if (leaderboardSort === 'streak') return b.streak - a.streak;
        return 0;
    });

    // --- ACTIONS (Now use Alerts/Console logging as placeholders for API calls) ---

    // NOTE: These functions must be updated to call the backend API (e.g., api.put('/friend-requests/accept', { id }))
    const handleAccept = (id) => {
        console.log(`API Call Placeholder: ACCEPT request ${id}`);
        const user = requests.find(r => r.id === id);
        if (user) {
            setFriends([...friends, { ...user, status: 'online', streak: 0, score: 100, lastActivity: "Just Joined" }]);
            setRequests(requests.filter(r => r.id !== id));
        }
    };

    const handleDecline = (id) => {
        console.log(`API Call Placeholder: DECLINE request ${id}`);
        setRequests(requests.filter(r => r.id !== id));
    };

    const handleAddFriend = () => {
        if (searchQuery.trim()) {
            console.log(`API Call Placeholder: SEND friend request to "${searchQuery.trim()}".`);
            alert(`Sending friend request to "${searchQuery.trim()}". (Backend call needed)`);
            setSearchQuery('');
        }
    };

    // --- LOADING/ERROR UI ---
    if (loading) {
        return <div className="loading-state" style={{ textAlign: 'center', padding: '100px', color: 'var(--primary)' }}>
            <FaDumbbell style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }} />
            <h2>Loading Social Data...</h2>
        </div>;
    }

    return (
        <div className="dashboard-layout">
            <main className="main-content">
                <h1 style={{ marginBottom: '3rem' }}>My Social Network</h1>

                {fetchError && <div style={{ color: 'red', marginBottom: '15px' }}>{fetchError}</div>}

                <div className="friends-grid">

                    {/* --- LEFT PANEL: Friends List & Search --- */}
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
                                            {/* Show status dot only if status is online */}
                                            {friend.status === 'online' && <span className="status-dot"></span>}
                                        </div>
                                        <div>
                                            <div className="leader-name">{friend.name}</div>
                                            <div style={{ color: '#888', fontSize: '0.85rem' }}>
                                                <FaFire style={{ color: 'var(--primary-orange)' }} /> {friend.streak} Day Streak
                                            </div>
                                            <div style={{ color: '#aaa', fontSize: '0.75rem' }}>
                                                Last Activity: {friend.lastActivity}
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

                        {/* 4. Leaderboard */}
                        <div className="sidebar-card">
                            <h3>
                                <FaTrophy style={{ marginRight: '5px', color: '#FFD700' }} />
                                Weekly Leaderboard
                                <select
                                    value={leaderboardSort}
                                    onChange={(e) => setLeaderboardSort(e.target.value)}
                                    style={{ fontSize: '0.8rem', marginLeft: '10px' }}
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

                        {/* 2. Pending Requests Center */}
                        {requests.length > 0 && (
                            <div className="sidebar-card">
                                <h3><FaUsers style={{ marginRight: '5px' }} /> Pending Requests ({requests.length})</h3>
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

                        {/* 5. Photo/Streak Share Section */}
                        <div className="share-streak-card">
                            <FaFire style={{ fontSize: '2.5rem', color: 'var(--primary-orange)' }} />
                            <h3>Share Your Progress!</h3>
                            <p>Celebrate your current streak and push your friends!</p>
                            <button className="btn-share" onClick={() => alert('Opening camera/upload tool...')}>
                                <FaCamera /> Post Photo/Streak
                            </button>
                        </div>

                        {/* 4. Map Integration */}
                        <div className="map-card">
                            <h3>🗺️ Friends Nearby (Static Map)</h3>
                            {/* Display Map Component */}
                            <MapComponent height={350} />
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Friends;