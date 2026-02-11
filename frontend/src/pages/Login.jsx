import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/auth-context';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            navigate('/');
        } catch {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow border-0 p-4">
                        <h2 className="text-center mb-4">Login</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" name="email" className="form-control" onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" name="password" className="form-control" onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mb-3">Sign In</button>
                            <div className="text-center small">
                                New here? <Link to="/register">Register</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
