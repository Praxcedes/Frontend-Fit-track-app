import axios from 'axios';

// Default to localhost:5555 (Flask default) or 5000 depending on backend
const API_URL = 'http://127.0.0.1:5555';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;