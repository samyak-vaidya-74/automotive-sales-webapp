import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';

const PostVehicle = () => {
    const [vehicleData, setVehicleData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        fuelType: 'Petrol',
        transmission: 'Manual',
        bodyStyle: 'Sedan',
        description: '',
        vin: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Cleanup preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (e) => {
        setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await vehicleService.createVehicle(vehicleData, image);
            navigate('/');
        } catch {
            alert("Error posting vehicle. Ensure your Cloudinary credentials are correct.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow border-0">
                        <div className="card-header bg-primary text-white py-3">
                            <h4 className="mb-0"><i className="bi bi-plus-circle me-2"></i>List Your Vehicle</h4>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small">Make</label>
                                        <input type="text" name="make" className="form-control" onChange={handleChange} required placeholder="e.g. Toyota" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small">Model</label>
                                        <input type="text" name="model" className="form-control" onChange={handleChange} required placeholder="e.g. Camry" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold small">Year</label>
                                        <input type="number" name="year" className="form-control" value={vehicleData.year} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold small">Price ($)</label>
                                        <input type="number" name="price" className="form-control" onChange={handleChange} required placeholder="0.00" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold small">Mileage</label>
                                        <input type="number" name="mileage" className="form-control" onChange={handleChange} required placeholder="Total miles" />
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold small">Fuel Type</label>
                                        <select name="fuelType" className="form-select shadow-none" onChange={handleChange}>
                                            <option value="Petrol">Petrol</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="EV">EV</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold small">Transmission</label>
                                        <select name="transmission" className="form-select shadow-none" onChange={handleChange}>
                                            <option value="Manual">Manual</option>
                                            <option value="Automatic">Automatic</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold small">Body Style</label>
                                        <select name="bodyStyle" className="form-select shadow-none" onChange={handleChange}>
                                            <option value="Sedan">Sedan</option>
                                            <option value="SUV">SUV</option>
                                            <option value="Hatchback">Hatchback</option>
                                            <option value="Truck">Truck</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold small">Vehicle Image</label>
                                    <input type="file" className="form-control shadow-none" onChange={handleImageChange} accept="image/*" required />
                                    {preview && (
                                        <div className="mt-3 text-center">
                                            <img src={preview} alt="Preview" className="img-thumbnail" style={{ maxHeight: '250px' }} />
                                            <p className="text-muted small mt-1">Image selected</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold small">Description (AI will analyze this)</label>
                                    <textarea name="description" className="form-control shadow-none" rows="4" onChange={handleChange} placeholder="Tell us about the condition, upgrades, or history..."></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm" disabled={loading}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>AI is analyzing your vehicle...</>
                                    ) : 'List Vehicle Now'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostVehicle;
