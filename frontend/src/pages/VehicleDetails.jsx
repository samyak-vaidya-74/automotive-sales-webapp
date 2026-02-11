import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import AiInsight from '../components/ai/AiInsight';
import EnquiryForm from '../components/common/EnquiryForm';

const VehicleDetails = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await vehicleService.getVehicleById(id);
                setVehicle(data);
            } catch (err) {
                console.error("Failed to load vehicle details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    if (!vehicle) return <div className="container mt-5"><h3>Vehicle not found.</h3></div>;

    return (
        <div className="container mt-4 mb-5">
            <div className="row">
                {/* Left Side: Vehicle Info & Image */}
                <div className="col-lg-8">
                    <img
                        src={vehicle.imageUrl || 'https://via.placeholder.com'}
                        className="img-fluid rounded shadow-sm mb-4"
                        alt={vehicle.model}
                    />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1 className="fw-bold">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                        <h2 className="text-primary fw-bold">${vehicle.price.toLocaleString()}</h2>
                    </div>

                    <div className="row mb-4 text-center">
                        <div className="col-3"><div className="p-2 border rounded bg-white"><strong>{vehicle.mileage}</strong><br /><small>Miles</small></div></div>
                        <div className="col-3"><div className="p-2 border rounded bg-white"><strong>{vehicle.fuelType}</strong><br /><small>Fuel</small></div></div>
                        <div className="col-3"><div className="p-2 border rounded bg-white"><strong>{vehicle.transmission}</strong><br /><small>Gearbox</small></div></div>
                        <div className="col-3"><div className="p-2 border rounded bg-white"><strong>{vehicle.bodyStyle}</strong><br /><small>Body</small></div></div>
                    </div>

                    <h5 className="fw-bold">Description</h5>
                    <p className="text-muted">{vehicle.description || "No description provided."}</p>

                    {/* AI Report Section */}
                    <AiInsight analysis={vehicle.aiAnalysis} />
                </div>

                {/* Right Side: Enquiry Form (EmailJS) */}
                <div className="col-lg-4">
                    <div className="sticky-top" style={{ top: '20px' }}>
                        <EnquiryForm vehicle={vehicle} sellerEmail={vehicle.sellerEmail} />

                        <div className="card mt-3 border-0 bg-light">
                            <div className="card-body">
                                <small className="text-muted d-block">Seller Identity:</small>
                                <strong>{vehicle.sellerEmail}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetails;
