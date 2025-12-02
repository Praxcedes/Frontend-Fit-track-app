import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

import "../styles/Login.css";

import heroImage from '../assets/Running.jpg';
import formBgImage from '../assets/gym.jpg';

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username/Email is required'),
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
    const [serverError, setServerError] = useState('');

    const navigate = useNavigate();
    const { login, signup } = useContext(UserContext);

    const handleLoginSubmit = async (values, { setSubmitting }) => {
        try {
            setServerError('');
            const result = await login(values.username, values.password);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setServerError(result.message);
            }
        } catch (error) {
            setServerError("An unexpected error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSignupSubmit = async (values, { setSubmitting }) => {
        try {
            setServerError('');
            const result = await signup(values.username, values.email, values.password);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setServerError(result.message);
            }
        } catch (error) {
            setServerError("Signup failed. Please check your connection.");
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

                    {serverError && <div style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '5px' }}>{serverError}</div>}

                    <Formik
                        initialValues={{
                            username: '',
                            email: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={isLogin ? LoginSchema : SignupSchema}
                        onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                {/* SIGNUP Username Field */}
                                {!isLogin && (
                                    <div className="form-group">
                                        <label>Username</label>
                                        <Field type="text" name="username" className="custom-input" placeholder="johndoe" />
                                        <ErrorMessage name="username" component="div" className="error-msg" />
                                    </div>
                                )}

                                {/* LOGIN/SIGNUP IDENTIFIER FIELD */}
                                <div className="form-group">
                                    {/* Updated Label */}
                                    <label>{isLogin ? 'Username / Email' : 'Email Address'}</label>
                                    <Field
                                        type={isLogin ? 'text' : 'email'}
                                        name={isLogin ? 'username' : 'email'}
                                        className="custom-input"
                                        placeholder={isLogin ? 'username or email address' : 'name@example.com'}
                                    />
                                    <ErrorMessage name={isLogin ? 'username' : 'email'} component="div" className="error-msg" />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <Field type="password" name="password" className="custom-input" placeholder="••••••••" />
                                    <ErrorMessage name="password" component="div" className="error-msg" />
                                </div>

                                {/* CONFIRM PASSWORD FIELD */}
                                {!isLogin && (
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <Field type="password" name="confirmPassword" className="custom-input" placeholder="••••••••" />
                                        <ErrorMessage name="confirmPassword" component="div" className="error-msg" />
                                    </div>
                                )}

                                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
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
                                setServerError('');
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