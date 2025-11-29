// src/pages/ActiveSession.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ActiveSession.css';
import { FaPause, FaPlay, FaCheck, FaTimes, FaForward, FaDumbbell } from 'react-icons/fa';

// --- WORKOUT DATA (Reusable) ---
const WORKOUT_ROUTINES = {
    // 1: Full Body HIIT Burn
    1: [
        {
            name: "Burpees",
            sets: 3,
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&fit=crop",
            instructions: "Start standing. Drop into a squat, kick your feet back into a plank, do a push-up, jump your feet forward, and explode upwards with a jump."
        },
        {
            name: "Mountain Climbers",
            sets: 3,
            image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&fit=crop",
            instructions: "Start in a plank position. Drive your right knee towards your chest, then quickly switch legs, keeping your hips down and core tight."
        },
        {
            name: "High Knees Sprint",
            sets: 4,
            image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&fit=crop",
            instructions: "Run in place, driving your knees up as high as possible towards your chest. Pump your arms vigorously."
        }
    ],
    // 2: Upper Body Power Build (Using 30s as Time Under Tension duration)
    2: [
        {
            name: "Dumbbell Bench Press",
            sets: 3,
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&fit=crop",
            instructions: "Lie on a flat bench. Focus on slow, controlled movement for maximum time under tension (TUT) during the 30 seconds."
        },
        {
            name: "Bent Over Rows",
            sets: 3,
            image: "https://images.unsplash.com/photo-1590239926044-29b7351e3a66?w=800&fit=crop",
            instructions: "Hinge forward at the hips. Keep your back flat and squeeze your shoulder blades together throughout the 30-second set."
        },
        {
            name: "Overhead Shoulder Press",
            sets: 3,
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop",
            instructions: "Press the weights directly overhead. Maintain core tension for the full 30 seconds."
        }
    ],
    // 3: Deep Yoga Flow & Stretch (Using 30s as hold time)
    3: [
        { name: "Downward Facing Dog", sets: 2, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&fit=crop", instructions: "Hold the pose for 30 seconds. Focus on deepening the stretch in your hamstrings and shoulders." },
        { name: "Warrior II (Left Side)", sets: 2, image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&fit=crop", instructions: "Hold the pose for 30 seconds per set/side. Extend arms and gaze over the front hand." },
        { name: "Child's Pose", sets: 1, image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&fit=crop", instructions: "Use this 30-second period for deep rest and recovery before the next section." }
    ],
    // 4: Abs & Core Crusher (Timed intervals)
    4: [
        { name: "Plank Hold", sets: 3, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&fit=crop", instructions: "Maintain a straight line from head to heel for the full 30 seconds. Do not let your hips sag." },
        { name: "Russian Twists", sets: 3, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&fit=crop", instructions: "Keep your feet elevated and rotate your core quickly for 30 seconds." },
        { name: "Leg Raises", sets: 3, image: "https://images.unsplash.com/photo-1517931524326-bdd55a541177?w=800&fit=crop", instructions: "Slowly raise and lower your legs for the entire 30-second interval, focusing on your lower abs." }
    ]
};

const EXERCISE_DURATION = 30; // 30 seconds per exercise/set

const ActiveSession = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const sessionExercises = WORKOUT_ROUTINES[id] || WORKOUT_ROUTINES[1];

    // Session State
    const [currentExIndex, setCurrentExIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    // Timer State
    const [time, setTime] = useState(EXERCISE_DURATION); // Countdown timer
    const [restTime, setRestTime] = useState(30);
    const [isActive, setIsActive] = useState(true);

    const currentExercise = sessionExercises[currentExIndex];

    // --- TIMER LOGIC ---
    useEffect(() => {
        let interval = null;

        // 1. ACTIVE WORKOUT TIMER (Count Down)
        if (isActive && !isResting && !showCelebration && time > 0) {
            interval = setInterval(() => {
                setTime((prev) => prev - 1); // DECREMENT
            }, 1000);
        }
        // 2. EXERCISE COMPLETE (Time = 0) -> AUTOMATIC ADVANCE
        else if (isActive && !isResting && time === 0) {
            handleSetCompletion();
        }
        // 3. REST TIMER (Count Down)
        else if (isResting && restTime > 0) {
            interval = setInterval(() => {
                setRestTime((prev) => prev - 1);
            }, 1000);
        }
        // 4. REST FINISHED -> AUTOMATIC ADVANCE
        else if (isResting && restTime === 0) {
            handleSkipRest();
        }

        return () => clearInterval(interval);
    }, [isActive, isResting, restTime, time, showCelebration]);

    // --- FORMAT TIME (MM:SS) ---
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // NEW: Handles auto-advance when timer hits zero OR manual advance
    const handleSetCompletion = () => {
        if (currentSet < currentExercise.sets) {
            // More sets? Go to Rest
            setIsResting(true);
            setRestTime(30);
        } else {
            // Last set? Move to next exercise
            handleNextExercise();
        }
    };

    // Logic for handling the main advance button (replaces Log Set)
    const handleManualAdvance = () => {
        if (isResting) {
            handleSkipRest();
        } else {
            // Skip the current exercise time and advance the set
            handleSetCompletion();
        }
        setIsActive(true); // Ensure session resumes after manual skip
    };

    const handleNextExercise = () => {
        if (currentExIndex < sessionExercises.length - 1) {
            setIsResting(true);
            setRestTime(45); // Longer rest between exercises
            setCurrentExIndex(prev => prev + 1);
            setCurrentSet(1);
        } else {
            // WORKOUT FINISHED
            setShowCelebration(true);
        }
    };

    const handleSkipRest = () => {
        setIsResting(false);
        setTime(EXERCISE_DURATION); // Reset to 30s for the new set

        // Increment the set counter when moving from rest to work
        if (currentSet < currentExercise.sets) {
            setCurrentSet(prev => prev + 1);
        } else if (restTime === 0 && currentExIndex < sessionExercises.length - 1) {
            // This handles auto advance to the next exercise set 1/3
            setCurrentSet(1);
        }
    };

    const handleQuit = () => {
        if (window.confirm("Quit current session? Progress will be lost.")) {
            navigate('/workouts');
        }
    };

    // --- CONFETTI COMPONENT ---
    const Confetti = () => {
        const particles = Array.from({ length: 30 }).map((_, i) => {
            const style = {
                left: `${Math.random() * 100}%`,
                animationDuration: `${2 + Math.random() * 2}s`,
                animationDelay: `${Math.random()}s`
            };
            const classes = ['c-red', 'c-blue', 'c-yellow', 'c-green', 'c-pink'];
            const randomClass = classes[Math.floor(Math.random() * classes.length)];
            return <div key={i} className={`confetti ${randomClass}`} style={style}></div>
        });
        return <>{particles}</>;
    };

    return (
        <div className="session-container">

            {/* --- HEADER --- */}
            <div className="session-header">
                <span className="session-title">Session: Workout #{id || 1}</span>
                <button className="btn-quit" onClick={handleQuit}>
                    <FaTimes /> Quit
                </button>
            </div>

            {/* --- CELEBRATION OVERLAY --- */}
            {showCelebration && (
                <div className="celebration-overlay">
                    <Confetti />
                    <div className="hurray-text">Hurray!</div>
                    <p className="hurray-sub">You crushed your goals today!</p>

                    <button className="btn-finish-home" onClick={() => navigate('/workouts')}>
                        Finish & Close <FaCheck />
                    </button>
                </div>
            )}

            {/* --- REST OVERLAY --- */}
            {isResting && !showCelebration && (
                <div className="rest-overlay">
                    <span className="rest-title">Rest & Recover</span>
                    <div className="rest-timer">{restTime}</div>
                    <p style={{ color: '#666' }}>
                        Up Next: Set {currentSet < currentExercise.sets ? currentSet + 1 : 1} of {currentExercise.name}
                    </p>
                    <button className="btn-skip-rest" onClick={handleSkipRest}>
                        Skip Rest <FaForward />
                    </button>
                </div>
            )}

            {/* --- MAIN CONTENT --- */}
            {!showCelebration && (
                <>
                    <div className="session-body">

                        <div className="media-container">
                            <div className="exercise-image-wrapper">
                                <img
                                    src={currentExercise.image}
                                    alt="Exercise"
                                    className="exercise-img"
                                />
                            </div>

                            {/* INSTRUCTION BOX */}
                            <div className="instruction-box">
                                <h4>How To Perform</h4>
                                <p>{currentExercise.instructions}</p>
                            </div>
                        </div>

                        <div className="set-badge">
                            Set {currentSet} of {currentExercise.sets}
                        </div>

                        <h2 className="exercise-name">{currentExercise.name}</h2>

                        <div className="timer-display">
                            {formatTime(time)}
                        </div>
                        <span className="timer-label">Time Remaining</span>
                    </div>

                    {/* --- CONTROLS --- */}
                    <div className="session-controls">
                        <button
                            className="btn-control btn-toggle"
                            onClick={() => setIsActive(!isActive)}
                        >
                            {isActive ? <FaPause /> : <FaPlay />}
                        </button>

                        {/* ADVANCE BUTTON (Replaces Log Set) */}
                        <button
                            className="btn-control btn-complete"
                            onClick={handleManualAdvance}
                        >
                            <FaForward />
                            {currentSet === currentExercise.sets ? "Finish Exercise" : "Advance"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ActiveSession;