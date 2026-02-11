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

    // UPDATED: State for multiple images and their previews
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Cleanup preview URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleChange = (e) => {
        setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
    };

    // UPDATED: Handle multiple file selection (Max 5 for "Frictionless" performance)
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert("Maximum 5 images allowed per listing.");
            e.target.value = null;
            return;
        }
        setImages(files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // UPDATED: Service call now handles the images array
            await vehicleService.createVehicle(vehicleData, images);
            navigate('/my-listings');
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Error posting vehicle. Ensure Cloudinary is configured.");
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
                            <h4 className="mb-0"><i className="bi bi-camera me-2"></i>List Your Vehicle</h4>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                {/* Basic Info Section */}
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

                                {/* Tech Specs Section */}
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

                                {/* MULTI-IMAGE SELECTOR */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold small">Vehicle Images (Select up to 5)</label>
                                    <input type="file" className="form-control shadow-none" onChange={handleImageChange} accept="image/*" multiple required />

                                    {previews.length > 0 && (
                                        <div className="mt-3 p-2 bg-light rounded d-flex flex-wrap gap-2 justify-content-center">
                                            {previews.map((src, index) => (
                                                <div key={index} className="position-relative">
                                                    <img src={src} alt="Preview" className="img-thumbnail" style={{ width: '120px', height: '90px', objectFit: 'cover' }} />
                                                    <span className="position-absolute top-0 start-0 badge rounded-pill bg-dark opacity-75 m-1 small">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold small">Description (AI will generate Pros/Cons from this)</label>
                                    <textarea name="description" className="form-control shadow-none" rows="4" onChange={handleChange} placeholder="Mention condition, extras, and service history..." required></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm" disabled={loading}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>AI Analysis & Uploading...</>
                                    ) : 'Publish Listing'}
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
