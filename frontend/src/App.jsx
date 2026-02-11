import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; // Added missing Register import
import PostVehicle from './pages/PostVehicle'; // FIXED: Importing the actual component
import VehicleDetails from './pages/VehicleDetails';

// Bootstrap Navbar Component
const Navbar = () => {
    const { user, logout } = useAuth();
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">AutoMarket</Link>
                <div className="navbar-nav ms-auto text-center">
                    <Link className="nav-link" to="/">Home</Link>
                    {user ? (
                        <>
                            <Link className="nav-link" to="/post-vehicle">Sell Car</Link>
                            <button className="btn btn-outline-light btn-sm ms-lg-2 mt-2 mt-lg-0" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link" to="/login">Login</Link>
                            <Link className="nav-link" to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container-fluid bg-light min-vh-100 py-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* FIXED: Replaced placeholder <div> with <PostVehicle /> */}
                        <Route
                            path="/post-vehicle"
                            element={
                                <ProtectedRoute>
                                    <PostVehicle />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/vehicle/:id" element={<VehicleDetails />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
