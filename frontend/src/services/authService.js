import apiClient from './apiClient';

const authService = {
    // Registers a new user - now expects { token, user } from backend
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Logs in the user and stores the data
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // This ensures we save the nested 'user' object from our new backend response
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
        const userStr = localStorage.getItem('user');

        // FIXED: Added safety check for null, empty, or the literal string "undefined"
        if (!userStr || userStr === "undefined") {
            return null;
        }

        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("AuthService: Failed to parse user data", error);
            localStorage.removeItem('user'); // Clean up corrupt data
            return null;
        }
    }
};

export default authService;
