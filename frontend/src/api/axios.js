import axios from 'axios';

// CHANGE THIS PART
// Ensure baseURL always ends with /api (standard for this backend)
const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return url.endsWith('/api') ? url : url.replace(/\/$/, '') + '/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
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

        // Restricted users (403 + ACCOUNT_RESTRICTED code) stay logged in — just show the error inline
        const isRestrictionBlock = error.response?.status === 403 && error.response?.data?.code === 'ACCOUNT_RESTRICTED';

        if (error.response && (error.response.status === 401 || error.response.status === 403) && !isAuthRoute && !isRestrictionBlock) {
            localStorage.removeItem('token'); 
            localStorage.removeItem('user');
            window.location.href = '/login';   
        }
        return Promise.reject(error);
    }
);

export default api;