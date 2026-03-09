import axios from 'axios';

// CHANGE THIS PART
const api = axios.create({
    // Vite uses import.meta.env for environment variables
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// In frontend/src/api/axios.js
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token'); // Kill the zombie token
            window.location.href = '/login';   // Force redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;