import apiClient from './apiClient';

const vehicleService = {
    // Fetches vehicles with optional filters for the "Frictionless" Sidebar
    getVehicles: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.make) params.append('make', filters.make);
        if (filters.fuelType) params.append('fuelType', filters.fuelType);
        if (filters.transmission) params.append('transmission', filters.transmission);
        if (filters.maxMileage) params.append('maxMileage', filters.maxMileage);

        const response = await apiClient.get(`/Vehicle?${params.toString()}`);
        return response.data;
    },

    getVehicleById: async (id) => {
        const response = await apiClient.get(`/Vehicle/${id}`);
        return response.data;
    },

    // Handles Multipart/Form-Data for Image + JSON Data
    createVehicle: async (vehicleData, imageFile) => {
        const formData = new FormData();

        // Append all text fields from the DTO
        Object.keys(vehicleData).forEach(key => {
            formData.append(key, vehicleData[key]);
        });

        // Append the physical image file
        formData.append('image', imageFile);

        const response = await apiClient.post('/Vehicle', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};

export default vehicleService;
