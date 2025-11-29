// src/pages/Workouts.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import '../styles/Workouts.css';

import { FaSearch, FaClock, FaFire, FaChevronLeft, FaChevronRight, FaTimes, FaPlay, FaDumbbell, FaSort } from 'react-icons/fa';

// --- MOCK DATA --- (Must match the structure you provided)
const MOCK_WORKOUTS = [
    {
        id: 1,
        title: "Full Body HIIT Burn",
        duration: "45 min",
        level: "High",
        category: "Cardio",
        desc: "A high-energy interval session designed to torch calories and boost endurance. Includes burpees, mountain climbers, and sprint intervals.",
        images: [
            "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&fit=crop",
            "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=600&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&fit=crop",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&fit=crop",
            "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&fit=crop"
        ]
    },
    {
        id: 2,
        title: "Upper Body Power Build",
        duration: "60 min",
        level: "Medium",
        category: "Strength",
        desc: "Focus on hypertrophy for chest, back, and arms. Controlled movements with emphasis on time-under-tension.",
        images: [
            "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&fit=crop",
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&fit=crop",
            "https://images.unsplash.com/photo-1590239926044-29b7351e3a66?w=600&fit=crop",
            "https://images.unsplash.com/photo-1616279967983-ec413476e824?w=600&fit=crop",
            "https://images.unsplash.com/photo-1591741531460-2336d8033346?w=600&fit=crop"
        ]
    },
    {
        id: 3,
        title: "Deep Yoga Flow & Stretch",
        duration: "30 min",
        level: "Low",
        category: "Flexibility",
        desc: "Relax and recover. This flow targets tight hips and hamstrings, perfect for recovery days.",
        images: [
            "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&fit=crop",
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&fit=crop",
            "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&fit=crop",
            "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=600&fit=crop",
            "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&fit=crop"
        ]
    },
    {
        id: 4,
        title: "Abs & Core Crusher",
        duration: "20 min",
        level: "High",
        category: "Strength",
        desc: "Quick but brutal core session. Planks, leg raises, and russian twists to build stability.",
        images: [
            "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&fit=crop",
            "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&fit=crop",
            "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&fit=crop",
            "https://images.unsplash.com/photo-1608215543217-2529005fb37c?w=600&fit=crop",
            "https://images.unsplash.com/photo-1517931524326-bdd55a541177?w=600&fit=crop"
        ]
    }
];

const CATEGORIES = ["All", "Strength", "Cardio", "Flexibility", "HIIT"];

// Helper function to convert duration strings to minutes for sorting
const parseDuration = (duration) => parseInt(duration.split(' ')[0], 10);
const parseLevel = (level) => {
    switch (level) {
        case 'Low': return 1;
        case 'Medium': return 2;
        case 'High': return 3;
        default: return 0;
    }
};

const Workouts = () => {
    const navigate = useNavigate();

    // --- STATE INITIALIZATION & PERSISTENCE ---
    const getInitialState = (key, defaultValue) => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    };

    const [searchQuery, setSearchQuery] = useState(getInitialState('workoutSearch', ''));
    const [activeCategory, setActiveCategory] = useState(getInitialState('workoutCategory', 'All'));
    const [sortCriteria, setSortCriteria] = useState(getInitialState('workoutSort', 'title-asc'));
    const [suggestions, setSuggestions] = useState([]);

    // MODAL & SWIPER STATE
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const swiperRefs = useRef({}); // To hold refs for each card's carousel
    const [activeSlides, setActiveSlides] = useState({}); // To track current slide index per card

    // Effect to load initial state from localStorage (runs once)
    useEffect(() => {
        const storedSearch = localStorage.getItem('workoutSearch');
        const storedCategory = localStorage.getItem('workoutCategory');
        const storedSort = localStorage.getItem('workoutSort');

        if (storedSearch !== null) setSearchQuery(JSON.parse(storedSearch));
        if (storedCategory !== null) setActiveCategory(JSON.parse(storedCategory));
        if (storedSort !== null) setSortCriteria(JSON.parse(storedSort));
    }, []);

    // Effect to save state to localStorage on every change
    useEffect(() => {
        localStorage.setItem('workoutSearch', JSON.stringify(searchQuery));
        localStorage.setItem('workoutCategory', JSON.stringify(activeCategory));
        localStorage.setItem('workoutSort', JSON.stringify(sortCriteria));
    }, [searchQuery, activeCategory, sortCriteria]);

    // --- FILTER & SORT LOGIC ---
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 1) {
            const matches = MOCK_WORKOUTS.filter(w =>
                w.title.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    // 1. Filtering
    let filteredWorkouts = MOCK_WORKOUTS.filter(workout => {
        const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || workout.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // 2. Sorting
    const [key, direction] = sortCriteria.split('-');
    filteredWorkouts.sort((a, b) => {
        let valA, valB;
        if (key === 'duration') {
            valA = parseDuration(a.duration);
            valB = parseDuration(b.duration);
        } else if (key === 'level') {
            valA = parseLevel(a.level);
            valB = parseLevel(b.level);
        } else { // title
            valA = a.title.toLowerCase();
            valB = b.title.toLowerCase();
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const displayedWorkouts = filteredWorkouts;

    // --- UI HELPERS ---

    // Handler for updating the active dot when user scrolls the carousel
    const handleScroll = (id) => {
        const container = swiperRefs.current[id];
        if (container) {
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.offsetWidth;
            // Determine which slide is most visible
            const activeIndex = Math.round(scrollLeft / cardWidth);
            setActiveSlides(prev => ({ ...prev, [id]: activeIndex }));
        }
    };

    // Handler for arrow click
    const scrollSwiper = (e, direction, id) => {
        const container = swiperRefs.current[id];
        if (container) {
            const scrollAmount = container.offsetWidth;
            container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
            // Scroll event will automatically update setActiveSlides via the listener
        }
    };

    const openModal = (workout) => {
        setSelectedWorkout(workout);
        setSuggestions([]); // Clear suggestions if open
    };

    // Helper to get the correct number of dots
    const getIndicatorCount = (id) => {
        const workout = MOCK_WORKOUTS.find(w => w.id === id);
        return workout ? workout.images.length : 0;
    }


    return (
        <div className="dashboard-layout">

            <main className="main-content">

                <div className="workouts-header">
                    <h1>Explore Workouts</h1>
                    <p style={{ color: 'var(--text-grey)' }}>Find the perfect routine for your goals.</p>

                    <div className="search-container">
                        <input
                            type="text"
                            className="big-search-input"
                            placeholder="Search workouts..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <FaSearch className="search-icon-inside" />

                        {suggestions.length > 0 && (
                            <div className="suggestions-dropdown">
                                {suggestions.map(item => (
                                    <div key={item.id} className="suggestion-item" onClick={() => openModal(item)}>
                                        <img src={item.images[0]} alt="" className="suggestion-thumb" />
                                        <span>{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="filter-sort-row">
                        {/* CATEGORY FILTER PILLS */}
                        <div className="category-filters">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* SORTING CONTROLS (NEW) */}
                        <div className="sort-controls">
                            <FaSort />
                            <span>Sort by:</span>
                            <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
                                <option value="title-asc">Name (A-Z)</option>
                                <option value="duration-desc">Duration (Longest)</option>
                                <option value="duration-asc">Duration (Shortest)</option>
                                <option value="level-desc">Intensity (High)</option>
                                <option value="level-asc">Intensity (Low)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* GRID */}
                <div className="workouts-grid">
                    {displayedWorkouts.map((workout) => (
                        <div key={workout.id} className="workout-card">

                            <div className="card-image-swiper-container">
                                {workout.images.length > 1 && (
                                    <>
                                        <button className="swiper-arrow left" onClick={(e) => scrollSwiper(e, 'left', workout.id)}><FaChevronLeft /></button>
                                        <button className="swiper-arrow right" onClick={(e) => scrollSwiper(e, 'right', workout.id)}><FaChevronRight /></button>
                                    </>
                                )}

                                {/* Image Carousel */}
                                <div
                                    className="card-image-swiper"
                                    ref={el => swiperRefs.current[workout.id] = el}
                                    onScroll={() => handleScroll(workout.id)}
                                >
                                    {workout.images.map((img, index) => (
                                        <div key={index} className="swiper-slide">
                                            <img src={img} alt={workout.title} className="swiper-img" />
                                        </div>
                                    ))}
                                </div>

                                {/* Swiper Indicators (NEW) */}
                                {workout.images.length > 1 && (
                                    <div className="swiper-indicators">
                                        {[...Array(getIndicatorCount(workout.id))].map((_, index) => (
                                            <div
                                                key={index}
                                                className={`indicator-dot ${activeSlides[workout.id] === index ? 'active' : ''}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="card-info">
                                <h3 className="workout-title">{workout.title}</h3>
                                <div className="workout-tags">
                                    <span className="tag">{workout.category}</span>
                                    <span className="tag intensity"><FaFire /> {workout.level}</span>
                                    <span className="tag"><FaClock /> {workout.duration}</span>
                                </div>
                                <button className="btn-start" onClick={() => openModal(workout)}>
                                    View & Start
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {displayedWorkouts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <h3>No workouts found.</h3>
                        <p>Try changing filters or search terms.</p>
                    </div>
                )}

            </main>

            {/* --- WORKOUT DETAIL MODAL --- */}
            {selectedWorkout && (
                <div className="workout-modal-overlay" onClick={() => setSelectedWorkout(null)}>
                    <div className="workout-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-abs" onClick={() => setSelectedWorkout(null)}>
                            <FaTimes />
                        </button>

                        <img src={selectedWorkout.images[0]} alt="Header" className="wm-header-image" />

                        <div className="wm-body">
                            <div className="wm-title-row">
                                <h2>{selectedWorkout.title}</h2>
                            </div>

                            <div className="wm-stats-row">
                                <div className="wm-stat"><FaClock /> {selectedWorkout.duration}</div>
                                <div className="wm-stat"><FaFire /> {selectedWorkout.level} Intensity</div>
                                <div className="wm-stat"><FaDumbbell /> {selectedWorkout.category}</div>
                            </div>

                            <div className="wm-description">
                                <h4>Description</h4>
                                <p>{selectedWorkout.desc}</p>

                                <h4>What you'll need</h4>
                                <p style={{ color: '#888' }}>• Yoga Mat<br />• Water Bottle<br />• Towel</p>
                            </div>
                        </div>

                        <div className="wm-footer">
                            <button
                                className="btn-launch-workout"
                                onClick={() => navigate(`/session/${selectedWorkout.id}`)}
                            >
                                <FaPlay style={{ marginRight: '10px' }} /> Start Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Workouts;