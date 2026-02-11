import apiClient from './apiClient';

const authService = {
    // Registers a new user and returns the user data
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    // Logs in the user and stores the token in localStorage
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Removes the token and user data from storage
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Helper to check if a user is currently logged in
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;
