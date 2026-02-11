import apiClient from './apiClient';

const vehicleService = {
    // Fetches listings with current filters
    getVehicles: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.make) params.append('make', filters.make);
        if (filters.fuelType) params.append('fuelType', filters.fuelType);
        if (filters.transmission) params.append('transmission', filters.transmission);
        if (filters.maxMileage) params.append('maxMileage', filters.maxMileage);

        const response = await apiClient.get(`/Vehicle?${params.toString()}`);
        return response.data;
    },

    // Fetches logged-in user's listings
    getMyListings: async () => {
        const response = await apiClient.get('/Vehicle/my-listings');
        return response.data;
    },

    getVehicleById: async (id) => {
        const response = await apiClient.get(`/Vehicle/${id}`);
        return response.data;
    },

    // FIXED: Correctly appends multiple image files to the 'images' key
    createVehicle: async (vehicleData, imageFiles) => {
        const formData = new FormData();

        // Append text fields from the DTO
        Object.keys(vehicleData).forEach(key => formData.append(key, vehicleData[key]));

        // Match the 'List<IFormFile> images' parameter in the Controller
        imageFiles.forEach((file) => {
            formData.append('images', file);
        });

        const response = await apiClient.post('/Vehicle', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    deleteVehicle: async (id) => {
        const response = await apiClient.delete(`/Vehicle/${id}`);
        return response.data;
    },

    // NEW: API call for Comparative AI on favorited cars
    getComparativeAi: async (vehicleIds) => {
        const response = await apiClient.post('/Vehicle/compare-ai', { vehicleIds });
        return response.data;
    }
};

export default vehicleService;
