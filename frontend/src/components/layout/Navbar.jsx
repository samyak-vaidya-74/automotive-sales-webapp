import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth-context';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">AUTO-MARKET</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Marketplace</Link>
                        </li>
                        {/* Only show these to logged-in users */}
                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-listings">My Listings</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/favorites">Favorites</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="d-flex align-items-center">
                        {user ? (
                            <>
                                {/* Personalized Greeting */}
                                <span className="text-white me-3 fw-bold small">Hi, {user.firstName}!</span>
                                <Link className="btn btn-light btn-sm me-2 text-primary fw-bold" to="/post-vehicle">Sell a Car</Link>
                                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link className="nav-link text-white me-3" to="/login">Login</Link>
                                <Link className="btn btn-outline-light btn-sm" to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
