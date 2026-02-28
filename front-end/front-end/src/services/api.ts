import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Request interceptor to add the token to headers
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            console.error("Forbidden error:", error.response.data);
        }
        return Promise.reject(error);
    }
);

export default api;