import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                throw new Error('Unexpected response format');
            }

            console.log(data); // Log the response data here

            if (response.ok) {
                // Check if the user role is included in the response
                if (data.admin && data.admin.role !== 'admin') {
                    setError('Only admin users can log in.');
                    return;
                }

                // Store token and refresh token
                if (data.token && data.refreshToken) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    localStorage.setItem('isAuthenticated', true);
                    localStorage.setItem('role', data.admin.role); // Corrected to access data.user.role

                    navigate('/admin/dashboard');
                } else {
                    setError('Login response did not contain tokens.');
                }
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            setError("Login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Admin Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form className="login-form" onSubmit={handleLogin}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
