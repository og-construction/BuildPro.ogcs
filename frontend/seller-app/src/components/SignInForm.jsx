import React, { useState } from 'react'
import { loginSeller } from '../api';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '../utils/toaster';

function SignInForm() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginSeller(credentials);
            console.log(response);

            if (response.status === 200) {
                const token = response.data?.token;
                if (token) {
                    localStorage.setItem('token', token);
                    console.log("Token stored in localStorage:", token);
                    showSuccessToast("Login successful! Redirecting to your dashboard...");
                    setTimeout(() => {
                        navigate('/seller');
                    }, 1000);
                } else {
                    throw new Error("Token not provided in response");
                }
            } else {
                throw new Error("Login failed with non-200 response status");
            }
        } catch (error) {
            console.error("Login failed:", error.message || error.response?.data?.message);
            alert(error.message || error.response?.data?.message || 'Login failed');
        }
    };
    return (
        <>
            <h2 className="text-3xl font-semibold text-center mb-4">Sign In</h2>
            <p className="text-lg text-center text-gray-600 mb-6">Welcome back! Enter your details below to sign in.</p>

            <form className="flex flex-col justify-center items-center w-full" onSubmit={handleSubmit}>
                <div className="form-group w-full">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="form-group w-full">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">Sign In</button>
            </form>
        </>
    )
}

export default SignInForm