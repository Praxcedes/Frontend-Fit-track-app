import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Import Context
import api from '../services/api'; // Direct API access for signup

import "../styles/Login.css"; // OK


// Import Images
import heroImage from '../assets/Running.jpg';
import formBgImage from '../assets/gym.jpg';

// Validation Schemas
const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const SignupSchema = Yup.object().shape({
    username: Yup.string().min(2, 'Too Short!').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Password too short').required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
});

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [serverError, setServerError] = useState(''); // To show "Invalid Password" etc.

    const navigate = useNavigate();
    const { login, setUser } = useContext(UserContext); // 2. Get helpers from Context

    // --- LOGIN LOGIC ---
    const handleLoginSubmit = async (values, { setSubmitting }) => {
        try {
            setServerError(''); // Clear previous errors

            // ------------------------------------------------------------------
            // --- TEMP BYPASS: Simulate successful login 🚀 ---
            await new Promise(resolve => setTimeout(resolve, 500));
            setUser({ id: 1, username: 'TestUser', email: values.email });
            // ------------------------------------------------------------------

            // await login(values.email, values.password); // <-- UNCOMMENT THIS LINE FOR REAL BACKEND

            navigate('/dashboard');
        } catch (error) {
            // If backend returns 401/400, show it
            setServerError(error.response?.data?.message || "Invalid email or password");
        } finally {
            setSubmitting(false);
        }
    };

    // --- SIGNUP LOGIC ---
    const handleSignupSubmit = async (values, { setSubmitting }) => {
        try {
            setServerError('');

            // ------------------------------------------------------------------
            // --- TEMP BYPASS: Simulate successful signup 🚀 ---
            await new Promise(resolve => setTimeout(resolve, 500));
            setUser({ id: 2, username: values.username, email: values.email });
            // ------------------------------------------------------------------

            // // 1. POST to /signup (UNCOMMENT THIS BLOCK FOR REAL BACKEND)
            // const response = await api.post('/signup', {
            //     username: values.username,
            //     email: values.email,
            //     password: values.password
            // });

            // // 2. Set the user in global state (Auto-login)
            // setUser(response.data);

            // 3. Redirect to Dashboard
            navigate('/dashboard');
        } catch (error) {
            // Handle "Username taken" errors
            setServerError(error.response?.data?.message || "Signup failed. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-container">

            {/* LEFT SIDE: Hero Section */}
            <div
                className="hero-section"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${heroImage})`
                }}
            >
                <div className="hero-content">
                    <div className="brand-logo">⚡ FIT TRACK</div>
                    <h1 className="hero-headline">
                        Stop Guessing. <br />
                        <span className="highlight-text">Start Growing.</span>
                    </h1>
                    <p className="hero-subtitle">
                        The distraction-free workout tracker designed for focus.
                    </p>
                    {/* ... Features List (Same as before) ... */}
                </div>
            </div>

            {/* RIGHT SIDE: Form Section */}
            <div
                className="form-section"
                style={{
                    backgroundImage: `linear-gradient(rgba(5,5,5,0.92), rgba(5,5,5,0.95)), url(${formBgImage})`
                }}
            >
                <div className="auth-card">
                    <h2 className="auth-header">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    {/* Show Server Errors (Invalid password, etc) */}
                    {serverError && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{serverError}</div>}

                    <Formik
                        initialValues={isLogin ?
                            { email: '', password: '' } :
                            { username: '', email: '', password: '', confirmPassword: '' }
                        }
                        validationSchema={isLogin ? LoginSchema : SignupSchema}
                        onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                {!isLogin && (
                                    <div className="form-group">
                                        <label>Username</label>
                                        <Field type="text" name="username" className="custom-input" placeholder="johndoe" />
                                        <ErrorMessage name="username" component="div" className="error-msg" />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <Field type="email" name="email" className="custom-input" placeholder="name@example.com" />
                                    <ErrorMessage name="email" component="div" className="error-msg" />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <Field type="password" name="password" className="custom-input" placeholder="••••••••" />
                                    <ErrorMessage name="password" component="div" className="error-msg" />
                                </div>

                                {!isLogin && (
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <Field type="password" name="confirmPassword" className="custom-input" placeholder="••••••••" />
                                        <ErrorMessage name="confirmPassword" component="div" className="error-msg" />
                                    </div>
                                )}

                                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                    {isLogin ? 'Log In' : 'Sign Up'}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <p className="toggle-text">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <span
                            className="toggle-link"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setServerError(''); // Clear errors when toggling
                            }}
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;