import React, { useState, useEffect } from 'react';
import vehicleService from '../services/vehicleService';
import VehicleCard from '../components/vehicles/VehicleCard'; // Import the dedicated component

const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filters, setFilters] = useState({ make: '', fuelType: '', transmission: '', maxMileage: '' });

    useEffect(() => {
        const fetchVehicles = async () => {
            const data = await vehicleService.getVehicles(filters);
            setVehicles(data);
        };
        fetchVehicles();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar Filter */}
                <div className="col-md-3">
                    <div className="card shadow-sm p-3 sticky-top" style={{ top: '20px' }}>
                        <h5 className="card-title mb-3 border-bottom pb-2">Filters</h5>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">Make</label>
                            <select name="make" className="form-select shadow-none" onChange={handleFilterChange}>
                                <option value="">All Makes</option>
                                <option value="Toyota">Toyota</option>
                                <option value="BMW">BMW</option>
                                <option value="Tesla">Tesla</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">Fuel Type</label>
                            <select name="fuelType" className="form-select shadow-none" onChange={handleFilterChange}>
                                <option value="">Any</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="EV">EV</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">Transmission</label>
                            <select name="transmission" className="form-select shadow-none" onChange={handleFilterChange}>
                                <option value="">Any</option>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">Max Mileage: {filters.maxMileage || 'Any'}</label>
                            <input type="range" name="maxMileage" className="form-range" min="0" max="200000" step="5000" onChange={handleFilterChange} />
                        </div>

                        <button className="btn btn-outline-secondary btn-sm w-100 mt-2" onClick={() => setFilters({ make: '', fuelType: '', transmission: '', maxMileage: '' })}>
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Vehicle Grid using VehicleCard Component */}
                <div className="col-md-9">
                    <div className="row g-4">
                        {vehicles.map(car => (
                            <div key={car.id} className="col-sm-6 col-lg-4">
                                <VehicleCard vehicle={car} />
                            </div>
                        ))}
                        {vehicles.length === 0 && (
                            <div className="text-center mt-5 py-5 text-muted">
                                <i className="bi bi-search mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                                <p>No vehicles found matching these filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
