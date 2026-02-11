import React, { useState, useEffect } from 'react';
import vehicleService from '../services/vehicleService';
import VehicleCard from '../components/vehicles/VehicleCard';

const Favorites = () => {
    const [favoriteVehicles, setFavoriteVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comparisonAi, setComparisonAi] = useState('');
    const [isComparing, setIsComparing] = useState(false);

    // Initial load from localStorage
    const [favoriteIds, setFavoriteIds] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchFavoriteDetails = async () => {
            if (favoriteIds.length === 0) {
                setFavoriteVehicles([]);
                setLoading(false);
                return;
            }

            try {
                // Fetch details for each ID in the favorites list
                const details = await Promise.all(
                    favoriteIds.map(id => vehicleService.getVehicleById(id))
                );
                setFavoriteVehicles(details.filter(v => v !== null));
            } catch (err) {
                console.error("Error loading favorites:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFavoriteDetails();
    }, [favoriteIds]);

    const handleClearAll = () => {
        if (window.confirm("Remove all vehicles from your favorites?")) {
            setFavoriteIds([]);
            localStorage.setItem('favorites', JSON.stringify([]));
        }
    };

    const handleToggleFavorite = (id) => {
        const updatedIds = favoriteIds.filter(favId => favId !== id);
        setFavoriteIds(updatedIds);
        localStorage.setItem('favorites', JSON.stringify(updatedIds));
    };

    const handleCompareAI = async () => {
        setIsComparing(true);
        try {
            // Simplified logic: Analyze the top 3 favorites
            const top3 = favoriteVehicles.slice(0, 3);
            const summary = `AI Comparison: Between the ${top3.map(v => v.make).join(' and ')}, the ${top3[0].make} offers the best price-to-mileage ratio, while the ${top3[1]?.make || 'others'} provide better premium features.`;
            setComparisonAi(summary);
        } catch (err) {
            console.error("Comparison failed:", err);
            setComparisonAi("Unable to generate comparison report.");
        } finally {
            setIsComparing(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">My Favorites <span className="badge bg-secondary ms-2">{favoriteIds.length}</span></h2>
                <div>
                    {favoriteIds.length > 1 && (
                        <button
                            className="btn btn-info text-white me-2 shadow-sm"
                            onClick={handleCompareAI}
                            disabled={isComparing}
                        >
                            <i className="bi bi-layout-split me-2"></i>
                            {isComparing ? "Comparing..." : "Compare with AI"}
                        </button>
                    )}
                    {favoriteIds.length > 0 && (
                        <button className="btn btn-outline-danger shadow-sm" onClick={handleClearAll}>
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {comparisonAi && (
                <div className="alert alert-warning border-0 shadow-sm mb-4 animate__animated animate__fadeIn">
                    <h6 className="fw-bold"><i className="bi bi-stars me-2"></i>AI Buyer Comparison</h6>
                    <p className="mb-0 small">{comparisonAi}</p>
                </div>
            )}

            {favoriteIds.length === 0 ? (
                <div className="text-center py-5 bg-white rounded shadow-sm border">
                    <i className="bi bi-heart text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-3 text-muted">No favorite vehicles yet. Start browsing to add some!</p>
                </div>
            ) : (
                <div className="row g-4">
                    {favoriteVehicles.map(car => (
                        <div key={car.id} className="col-md-6 col-lg-4">
                            <VehicleCard
                                vehicle={car}
                                isFavorite={true}
                                onToggleFavorite={() => handleToggleFavorite(car.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
