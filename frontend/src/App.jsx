import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/auth-context';
import { AuthProvider } from './store/AuthContext';

import Navbar from './components/layout/Navbar'; // Use our dedicated refactored Navbar
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostVehicle from './pages/PostVehicle';
import VehicleDetails from './pages/VehicleDetails';
import MyListings from './pages/MyListings'; // Upcoming
import Favorites from './pages/Favorites';   // Upcoming

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
                        <Route path="/vehicle/:id" element={<VehicleDetails />} />

                        {/* PROTECTED USER ROUTES */}
                        <Route path="/post-vehicle" element={
                            <ProtectedRoute><PostVehicle /></ProtectedRoute>
                        } />

                        <Route path="/my-listings" element={
                            <ProtectedRoute><MyListings /></ProtectedRoute>
                        } />

                        <Route path="/favorites" element={
                            <ProtectedRoute><Favorites /></ProtectedRoute>
                        } />

                        {/* Redirect unknown routes to Home */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
