import axios from 'axios';

const api = axios.create({
    // UPDATE: Pointing to deployed Render Backend
    baseURL: 'https://fittrack-api.onrender.com',
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