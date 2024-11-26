import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSeller } from '../api'; // Keep this line
import VerifyOtpModal from './VerifyOtpModal';

const CreateAccountForm = () => {
  // OTP Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailsent, setemailsent] = useState("");
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    companyName: '',
    street: '', // Add street
    city: '', // Add city
    state: '', // Add state
    country: '', // Add country
    postalCode: '', // Add postal code
    password: '',
    confirmPassword: '',
    role: 'Sale By Seller', // Default type
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'email') {
      setemailsent(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const data = await createSeller(formData); // Directly pass formData
      console.log(data, "data");
      localStorage.setItem("sellerId", JSON.stringify(data?.data?.id))
      if (data?.status === 201) {
        handleOpenDialog();
      }
      setFormData({
        name: '',
        email: '',
        mobile: '',
        companyName: '',
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        password: '',
        confirmPassword: '',
        role: 'Sale By Seller',
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <VerifyOtpModal open={isDialogOpen} onClose={handleCloseDialog} email={emailsent} />
      <div className="w-full max-w-7xl">
        <h2 className="text-4xl font-semibold text-center mb-6 text-gray-800">Sign up</h2>

        <form className="" onSubmit={handleSubmit}>
          {/* Name and Email Fields Side by Side */}
          <div className="flex space-x-6">
            <div className="form-group w-1/2">
              <label htmlFor="name" className="block text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group w-1/2">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Mobile and Company Name Fields Side by Side */}
          <div className="flex space-x-6">
            <div className="form-group w-1/2">
              <label htmlFor="mobile" className="block text-gray-700">Mobile</label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="Enter your mobile number"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group w-1/2">
              <label htmlFor="companyName" className="block text-gray-700">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Enter your company name"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Address Fields */}
          <div className="flex space-x-6">
            <div className="form-group w-1/2">
              <label htmlFor="street" className="block text-gray-700">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                placeholder="Enter street address"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group w-1/2">
              <label htmlFor="city" className="block text-gray-700">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="form-group w-1/2">
              <label htmlFor="state" className="block text-gray-700">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Enter state"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group w-1/2">
              <label htmlFor="country" className="block text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                placeholder="Enter country"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="form-group w-1/2">
              <label htmlFor="postalCode" className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                placeholder="Enter postal code"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group w-1/2 mt-2">
              <label htmlFor="role" className="block text-gray-700">Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Sale By Seller">Sale By Seller</option>
                <option value="Sale By OGCS">Sale By OGCS</option>
              </select>
            </div>
          </div>

          {/* Confirm Password and Password Fields */}
          <div className="flex space-x-6">
            <div className="form-group w-1/2">
              <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group w-1/2">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

          <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-all duration-300">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountForm;
