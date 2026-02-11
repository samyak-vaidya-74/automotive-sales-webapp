import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle, isFavorite, onToggleFavorite }) => {
    return (
        <div className="card h-100 shadow-sm border-0 overflow-hidden position-relative">
            <div className="position-relative">
                {/* Image Section */}
                <img
                    src={vehicle.imageUrl || 'https://via.placeholder.com'}
                    className="card-img-top"
                    alt={vehicle.model}
                    style={{ height: '200px', objectFit: 'cover' }}
                />

                {/* Price Badge */}
                <span className="position-absolute top-0 end-0 m-2 badge bg-primary shadow-sm">
                    ${vehicle.price.toLocaleString()}
                </span>

                {/* HEART BUTTON (Favorites) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleFavorite(vehicle.id);
                    }}
                    className="btn btn-light btn-sm position-absolute top-0 start-0 m-2 shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', zIndex: 10 }}
                >
                    <i className={`bi ${isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                </button>
            </div>

            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold mb-1 text-truncate">
                    {vehicle.year} {vehicle.make}
                </h5>
                <p className="card-text text-muted mb-3 text-truncate">{vehicle.model}</p>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between border-top pt-2 mb-3 small text-secondary">
                        <span><i className="bi bi-speedometer2"></i> {vehicle.mileage} mi</span>
                        <span>{vehicle.fuelType}</span>
                        <span>{vehicle.transmission}</span>
                    </div>

                    <Link to={`/vehicle/${vehicle.id}`} className="btn btn-outline-dark w-100 fw-bold">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
