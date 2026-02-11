import axios from 'axios';

// The base URL points to the Nginx gateway (Port 80)
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to automatically attach the JWT token to every request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
