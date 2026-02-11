import React, { useState, useEffect } from 'react';
import vehicleService from '../services/vehicleService';
import VehicleCard from '../components/vehicles/VehicleCard';
import { useAuth } from '../store/auth-context';

const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [portfolioAi, setPortfolioAi] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMyListings = async () => {
            try {
                const data = await vehicleService.getMyListings();
                setListings(data);
            } catch (err) {
                // FIXED: Use the error variable to log details
                console.error("Critical: Error fetching listings from server:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMyListings();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this listing? This action cannot be undone.")) {
            try {
                await vehicleService.deleteVehicle(id);
                setListings(listings.filter(v => v.id !== id));
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Failed to delete listing. Please try again.");
            }
        }
    };

    const handlePortfolioAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            // Simplified Portfolio Logic
            const totalValue = listings.reduce((acc, curr) => acc + curr.price, 0);
            const fuelTypes = [...new Set(listings.map(l => l.fuelType))];

            const summary = `AI Portfolio Insights for ${user.firstName}: You have ${listings.length} vehicles worth $${totalValue.toLocaleString()}. Your inventory covers ${fuelTypes.join(', ')} markets.`;
            setPortfolioAi(summary);
        } catch (err) {
            console.error("AI Analysis failed:", err);
            setPortfolioAi("Could not generate portfolio report at this time.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 text-wrap">
                <h2 className="fw-bold">My Vehicle Listings</h2>
                <button
                    className="btn btn-info text-white shadow-sm"
                    onClick={handlePortfolioAnalysis}
                    disabled={listings.length === 0 || isAnalyzing}
                >
                    <i className="bi bi-cpu me-2"></i>
                    {isAnalyzing ? "Analyzing..." : "Generate AI Portfolio Report"}
                </button>
            </div>

            {portfolioAi && (
                <div className="alert alert-info border-0 shadow-sm mb-4">
                    <h6 className="fw-bold"><i className="bi bi-graph-up-arrow me-2"></i>Inventory Insights</h6>
                    <p className="mb-0 small">{portfolioAi}</p>
                </div>
            )}

            {listings.length === 0 ? (
                <div className="text-center py-5 bg-white rounded shadow-sm border">
                    <i className="bi bi-car-front text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-3 text-muted">You haven't posted any vehicles yet.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {listings.map(car => (
                        <div key={car.id} className="col-md-6 col-lg-4 position-relative">
                            <VehicleCard vehicle={car} />
                            <div className="mt-2">
                                <button
                                    className="btn btn-danger btn-sm w-100 shadow-sm fw-bold"
                                    onClick={() => handleDelete(car.id)}
                                >
                                    <i className="bi bi-trash3 me-2"></i>Remove Listing
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListings;
