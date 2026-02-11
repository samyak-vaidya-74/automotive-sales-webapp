import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
    return (
        <div className="card h-100 shadow-sm border-0 overflow-hidden">
            <div className="position-relative">
                <img
                    src={vehicle.imageUrl || 'https://via.placeholder.com'}
                    className="card-img-top"
                    alt={vehicle.model}
                    style={{ height: '200px', objectFit: 'cover' }}
                />
                <span className="position-absolute top-0 end-0 m-2 badge bg-primary">
                    ${vehicle.price.toLocaleString()}
                </span>
            </div>
            <div className="card-body">
                <h5 className="card-title fw-bold mb-1">{vehicle.year} {vehicle.make}</h5>
                <p className="card-text text-muted mb-3">{vehicle.model}</p>

                <div className="d-flex justify-content-between border-top pt-2 small text-secondary">
                    <span><i className="bi bi-speedometer2"></i> {vehicle.mileage} mi</span>
                    <span>{vehicle.fuelType}</span>
                    <span>{vehicle.transmission}</span>
                </div>

                <Link to={`/vehicle/${vehicle.id}`} className="btn btn-outline-dark w-100 mt-3">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default VehicleCard;
