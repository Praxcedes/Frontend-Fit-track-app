import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';
import '../styles/Workouts.css';

import { FaSearch, FaClock, FaFire, FaChevronLeft, FaChevronRight, FaTimes, FaPlay, FaDumbbell, FaSort } from 'react-icons/fa';

const MOCK_WORKOUTS = [

];

const CATEGORIES = ["All", "Strength", "Legs", "Shoulders", "Bodyweight", "Arms", "Core", "Cardio"];

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


    const [originalWorkouts, setOriginalWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const getInitialState = (key, defaultValue) => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    };

    const [searchQuery, setSearchQuery] = useState(getInitialState('workoutSearch', ''));
    const [activeCategory, setActiveCategory] = useState(getInitialState('workoutCategory', 'All'));
    const [sortCriteria, setSortCriteria] = useState(getInitialState('workoutSort', 'title-asc'));
    const [suggestions, setSuggestions] = useState([]);

    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const swiperRefs = useRef({});
    const [activeSlides, setActiveSlides] = useState({});

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await api.get('/exercises/');

                const exercisesData = response.data.exercises || response.data;

                if (!Array.isArray(exercisesData)) {
                    throw new Error("Invalid data format received from server.");
                }

                const mappedExercises = exercisesData.map(ex => ({
                    id: ex.id,
                    title: ex.title,
                    category: ex.category,
                    level: ex.level,
                    duration: ex.duration,
                    desc: ex.instructions,
                    images: ex.images,
                }));

                setOriginalWorkouts(mappedExercises);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch workouts:", error);
                setFetchError("Could not load exercises. Check server connection or backend data structure.");
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    useEffect(() => {
        const storedSearch = localStorage.getItem('workoutSearch');
        const storedCategory = localStorage.getItem('workoutCategory');
        const storedSort = localStorage.getItem('workoutSort');

        if (storedSearch !== null) setSearchQuery(JSON.parse(storedSearch));
        if (storedCategory !== null) setActiveCategory(JSON.parse(storedCategory));
        if (storedSort !== null) setSortCriteria(JSON.parse(storedSort));
    }, []);

    useEffect(() => {
        localStorage.setItem('workoutSearch', JSON.stringify(searchQuery));
        localStorage.setItem('workoutCategory', JSON.stringify(activeCategory));
        localStorage.setItem('workoutSort', JSON.stringify(sortCriteria));
    }, [searchQuery, activeCategory, sortCriteria]);


    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 1) {
            const matches = originalWorkouts.filter(w =>
                w && w.title && w.title.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    let filteredWorkouts = originalWorkouts.filter(workout => {
        if (!workout || !workout.title) return false;

        const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || workout.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const [key, direction] = sortCriteria.split('-');
    filteredWorkouts.sort((a, b) => {
        if (!a || !b) return 0;

        let valA, valB;
        if (key === 'duration') {
            valA = parseDuration(a.duration);
            valB = parseDuration(b.duration);
        } else if (key === 'level') {
            valA = parseLevel(a.level);
            valB = parseLevel(b.level);
        } else {
            valA = a.title ? a.title.toLowerCase() : '';
            valB = b.title ? b.title.toLowerCase() : '';
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const displayedWorkouts = filteredWorkouts;

    const getIndicatorCount = (id) => {
        const workout = originalWorkouts.find(w => w.id === id);
        return workout && workout.images ? workout.images.length : 0;
    }

    const handleScroll = (id) => {
        const container = swiperRefs.current[id];
        if (container) {
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.offsetWidth;
            const activeIndex = Math.round(scrollLeft / cardWidth);
            setActiveSlides(prev => ({ ...prev, [id]: activeIndex }));
        }
    };

    const scrollSwiper = (e, direction, id) => {
        const container = swiperRefs.current[id];
        if (container) {
            const scrollAmount = container.offsetWidth;
            container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const openModal = (workout) => {
        setSelectedWorkout(workout);
        setSuggestions([]);
    };

    if (loading) {
        return <div className="loading-state" style={{ textAlign: 'center', padding: '100px', color: 'var(--primary)' }}>
            <FaDumbbell style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }} />
            <h2>Loading Exercises...</h2>
        </div>;
    }

    if (fetchError) {
        return <div className="error-state" style={{ textAlign: 'center', padding: '100px', color: 'red' }}>
            <h3>Error Loading Data</h3>
            <p>{fetchError}</p>
        </div>;
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
                                        {/* FIX: Use item.images[0] from FETCHED data */}
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
                                {workout.images && workout.images.length > 1 && (
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
                                    {workout.images && workout.images.map((img, index) => (
                                        <div key={index} className="swiper-slide">
                                            <img src={img} alt={workout.title} className="swiper-img" />
                                        </div>
                                    ))}
                                </div>

                                {/* Swiper Indicators (NEW) */}
                                {workout.images && workout.images.length > 1 && (
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

                {displayedWorkouts.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <h3>No workouts found.</h3>
                        <p>Try changing filters or search terms.</p>
                    </div>
                )}

            </main>

            {/* WORKOUT DETAIL MODAL */}
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
                                <p style={{ color: '#888' }}>• Barbell<br />• Dumbbell<br />• Your focus</p>
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