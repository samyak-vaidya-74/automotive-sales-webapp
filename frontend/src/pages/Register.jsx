import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            await authService.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            // Frictionless redirect to login on success
            navigate('/login');
        } catch {
            // Fix: Optional catch binding (no unused 'err' variable)
            setError('Registration failed. Email might already be in use.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-5">
                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Create Account</h2>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">First Name</label>
                                        <input type="text" name="firstName" className="form-control" onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" name="lastName" className="form-control" onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input type="email" name="email" className="form-control" onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Confirm Password</label>
                                    <input type="password" name="confirmPassword" className="form-control" onChange={handleChange} required />
                                </div>

                                <button type="submit" className="btn btn-success w-100 mb-3 py-2">
                                    Register
                                </button>

                                <div className="text-center">
                                    <span className="text-muted">Already have an account? </span>
                                    <Link to="/login" className="text-decoration-none text-primary">Login here</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
