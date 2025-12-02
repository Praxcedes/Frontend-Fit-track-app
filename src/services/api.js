import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://127.0.0.1:5555'
    : 'https://backend-fit-track-app.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;