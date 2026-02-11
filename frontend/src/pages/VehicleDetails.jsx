import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import AiInsight from '../components/ai/AiInsight';
import EnquiryForm from '../components/common/EnquiryForm';

const VehicleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
            {/* Back Button */}
            <button
                className="btn btn-link text-decoration-none p-0 mb-3 text-secondary shadow-none"
                onClick={() => navigate(-1)}
            >
                <i className="bi bi-arrow-left me-2"></i>Back to Marketplace
            </button>

            <div className="row g-4">
                {/* Left Side: Vehicle Info & Image Gallery */}
                <div className="col-lg-8">

                    {/* BOOTSTRAP CAROUSEL FOR MULTI-IMAGES */}
                    <div id="vehicleImages" className="carousel slide shadow-sm rounded overflow-hidden mb-4" data-bs-ride="carousel">
                        <div className="carousel-inner bg-dark">
                            {vehicle.imageUrls && vehicle.imageUrls.length > 0 ? (
                                vehicle.imageUrls.map((url, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img
                                            src={url}
                                            className="d-block w-100"
                                            alt={`${vehicle.model} - ${index + 1}`}
                                            style={{ height: '500px', objectFit: 'contain' }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="carousel-item active">
                                    <img src="https://via.placeholder.com" className="d-block w-100" alt="Placeholder" />
                                </div>
                            )}
                        </div>
                        {vehicle.imageUrls?.length > 1 && (
                            <>
                                <button className="carousel-control-prev" type="button" data-bs-target="#vehicleImages" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#vehicleImages" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                </button>
                            </>
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h1 className="fw-bold h2 mb-1">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                            <span className="badge bg-light text-dark border">{vehicle.bodyStyle}</span>
                        </div>
                        <h2 className="text-primary fw-bold h3">${vehicle.price.toLocaleString()}</h2>
                    </div>

                    {/* Spec Grid */}
                    <div className="row g-2 mb-4 text-center">
                        <div className="col-3">
                            <div className="p-3 border rounded bg-white shadow-sm h-100">
                                <i className="bi bi-speedometer2 text-primary d-block mb-1"></i>
                                <span className="fw-bold small">{vehicle.mileage.toLocaleString()}</span>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>Miles</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="p-3 border rounded bg-white shadow-sm h-100">
                                <i className="bi bi-fuel-pump text-primary d-block mb-1"></i>
                                <span className="fw-bold small">{vehicle.fuelType}</span>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>Fuel</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="p-3 border rounded bg-white shadow-sm h-100">
                                <i className="bi bi-gear-wide-connected text-primary d-block mb-1"></i>
                                <span className="fw-bold small">{vehicle.transmission}</span>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>Gearbox</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="p-3 border rounded bg-white shadow-sm h-100">
                                <i className="bi bi-info-circle text-primary d-block mb-1"></i>
                                <span className="fw-bold small">VIN</span>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{vehicle.vin ? vehicle.vin.substring(0, 8) : 'N/A'}...</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded border shadow-sm mb-4">
                        <h5 className="fw-bold mb-3 border-bottom pb-2">Seller's Description</h5>
                        <p className="text-muted mb-0" style={{ whiteSpace: 'pre-line' }}>
                            {vehicle.description || "No description provided."}
                        </p>
                    </div>

                    {/* AI PROS & CONS SECTION */}
                    <AiInsight analysis={vehicle.aiAnalysis} />
                </div>

                {/* Right Side: Enquiry Form */}
                <div className="col-lg-4">
                    <div className="sticky-top" style={{ top: '20px' }}>
                        <EnquiryForm vehicle={vehicle} sellerEmail={vehicle.sellerEmail} />

                        <div className="card mt-3 border-0 bg-white shadow-sm">
                            <div className="card-body py-3">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary text-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="bi bi-person-badge"></i>
                                    </div>
                                    <div>
                                        <small className="text-muted d-block small" style={{ fontSize: '0.7rem' }}>Seller Identity</small>
                                        <span className="fw-bold small text-break">{vehicle.sellerEmail}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetails;
