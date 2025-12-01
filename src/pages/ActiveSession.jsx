import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/ActiveSession.css';
import { FaPause, FaPlay, FaCheck, FaTimes, FaForward, FaDumbbell } from 'react-icons/fa';


const WORKOUT_ROUTINES = {
    1: [{ name: "Bench Press", sets: 3, defaultReps: 10, defaultWeight: 135, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&fit=crop", instructions: "Lie on bench, grip barbell slightly wider than shoulder width, lower to chest, press up" }],
    2: [{ name: "Squat", sets: 4, defaultReps: 8, defaultWeight: 185, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&fit=crop", instructions: "Bar on upper back, feet shoulder width, descend until thighs parallel, drive up" }],
    3: [{ name: "Deadlift", sets: 3, defaultReps: 5, defaultWeight: 225, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop", instructions: "Feet under bar, bend knees, grip bar, lift with straight back until standing" }],
    4: [{ name: "Overhead Press", sets: 3, defaultReps: 10, defaultWeight: 65, image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&fit=crop", instructions: "Bar at shoulder level, press overhead until arms extended, lower with control" }],
    5: [{ name: "Pull-up", sets: 4, defaultReps: 8, defaultWeight: 0, image: "https://images.unsplash.com/photo-1590239926044-29b7351e3a66?w=800&fit=crop", instructions: "Grip bar wider than shoulders, pull body up until chin over bar, lower with control" }],
    6: [{ name: "Push-up", sets: 4, defaultReps: 15, defaultWeight: 0, image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&fit=crop", instructions: "Plank position, hands under shoulders, lower chest to floor, push back up" }],
    7: [{ name: "Bicep Curl", sets: 3, defaultReps: 12, defaultWeight: 25, image: "https://images.unsplash.com/photo-1616279967983-ec413476e824?w=800&fit=crop", instructions: "Stand holding dumbbells, curl weights toward shoulders, lower with control" }],
    8: [{ name: "Tricep Extension", sets: 3, defaultReps: 12, defaultWeight: 40, image: "https://images.unsplash.com/photo-1591741531460-2336d8033346?w=800&fit=crop", instructions: "Grip cable attachment overhead, extend arms downward, return to start" }],
    9: [{ name: "Lunges", sets: 4, defaultReps: 10, defaultWeight: 0, image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&fit=crop", instructions: "Step forward, lower until both knees bent 90 degrees, push back to start" }],
    10: [{ name: "Plank", sets: 5, defaultReps: 0, defaultWeight: 0, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&fit=crop", instructions: "Forearms and toes on ground, keep body straight, hold position" }]
};

const EXERCISE_DURATION = 30;
const REST_DURATION = 30;

const ActiveSession = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const routineId = parseInt(id);

    const sessionExercises = WORKOUT_ROUTINES[routineId] || WORKOUT_ROUTINES[1];

    const [currentExIndex, setCurrentExIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    const [recordedSets, setRecordedSets] = useState([]);
    const [saveStatus, setSaveStatus] = useState(null);

    const [time, setTime] = useState(EXERCISE_DURATION);
    const [restTime, setRestTime] = useState(REST_DURATION);
    const [isActive, setIsActive] = useState(true);

    const currentExercise = sessionExercises[currentExIndex];
    const defaultReps = currentExercise.defaultReps || 10;
    const defaultWeight = currentExercise.defaultWeight || 0;


    useEffect(() => {
        let interval = null;

        if (isActive && !isResting && !showCelebration && time > 0) {
            interval = setInterval(() => {
                setTime((prev) => prev - 1);
            }, 1000);
        }

        else if (isActive && !isResting && time === 0) {
            handleSetCompletion();
        }

        else if (isResting && restTime > 0) {
            interval = setInterval(() => {
                setRestTime((prev) => prev - 1);
            }, 1000);
        }

        else if (isResting && restTime === 0) {
            handleSkipRest();
        }

        return () => clearInterval(interval);
    }, [isActive, isResting, restTime, time, showCelebration]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const logSet = () => {
        setRecordedSets(prev => [
            ...prev,
            {
                exercise_id: routineId,
                sets: currentSet,
                reps: defaultReps,
                weight_lifted: defaultWeight
            }
        ]);
        console.log(`Logged Set ${currentSet} of ${currentExercise.name}`);
    };

    const handleSetCompletion = () => {
        logSet();

        if (currentSet < currentExercise.sets) {
            setIsResting(true);
            setRestTime(REST_DURATION);
        } else {
            handleNextExercise();
        }
    };

    const handleManualAdvance = () => {
        if (isResting) {
            handleSkipRest();
        } else {
            handleSetCompletion();
        }
        setIsActive(true);
    };

    const handleNextExercise = () => {
        if (currentExIndex < sessionExercises.length - 1) {
            setIsResting(true);
            setRestTime(45);
            setCurrentExIndex(prev => prev + 1);
            setCurrentSet(1);
        } else {
            setShowCelebration(true);
            setIsActive(false);
        }
    };

    const handleSkipRest = () => {
        setIsResting(false);
        setTime(EXERCISE_DURATION);

        if (currentSet < currentExercise.sets) {
            setCurrentSet(prev => prev + 1);
        } else if (restTime === 0 && currentExIndex < sessionExercises.length - 1) {
            setCurrentSet(1);
        }
    };

    const handleFinishWorkout = async (status) => {
        setSaveStatus('saving');


        const setsCompleted = recordedSets.length;

        const workoutData = {
            name: currentExercise.name,
            date: new Date().toISOString().split('T')[0],
            status: status,
            workout_exercises: [
                {
                    exercise_id: routineId,
                    sets: setsCompleted,
                    reps: defaultReps,
                    weight_lifted: defaultWeight
                }
            ]
        };

        try {
            const response = await api.post('/workouts', workoutData);
            setSaveStatus('success');
            console.log("Workout saved:", response.data);
            navigate('/workouts');
        } catch (error) {
            setSaveStatus('error');
            console.error("Failed to save workout:", error.response?.data || error);
            alert("Failed to save workout. Please try again.");
        }
    };

    const handleQuit = () => {
        if (window.confirm("Quit current session? Progress will be recorded as incomplete.")) {
            handleFinishWorkout('quit');
        }
    };

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
                <span className="session-title">Session: {currentExercise.name}</span>
                <button className="btn-quit" onClick={handleQuit} disabled={saveStatus === 'saving'}>
                    <FaTimes /> Quit
                </button>
            </div>

            {/* --- CELEBRATION OVERLAY --- */}
            {showCelebration && (
                <div className="celebration-overlay">
                    <Confetti />
                    <div className="hurray-text">Hurray!</div>
                    <p className="hurray-sub">You crushed your goals today!</p>

                    {/* CALL API FUNCTION HERE */}
                    <button
                        className="btn-finish-home"
                        onClick={() => handleFinishWorkout('completed')}
                        disabled={saveStatus === 'saving'}
                    >
                        {saveStatus === 'saving' ? 'Saving...' : <>Finish & Close <FaCheck /></>}
                    </button>
                    {saveStatus === 'error' && <p style={{ color: 'red' }}>Save failed. Check console.</p>}
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
                                <h4>How To Perform ({defaultReps} reps @ {defaultWeight} lbs)</h4>
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