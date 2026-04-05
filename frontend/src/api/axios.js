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
        // Only force redirect if NOT an auth route (prevents UI error message flickering on login)
        const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');

        if (error.response && error.response.status === 401 && !isAuthRoute) {
            localStorage.removeItem('token'); 
            localStorage.removeItem('user');
            window.location.href = '/login';   
        }
        return Promise.reject(error);
    }
);

export default api;