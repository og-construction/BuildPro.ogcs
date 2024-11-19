import React, { useState } from 'react';
import './CreateAccountForm.css';
import { useNavigate } from 'react-router-dom';
import { createSeller } from '../api'; // Keep this line

const CreateAccountForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    companyName:"",
    street: '', // Add street
    city: '', // Add city
    state: '', // Add state
    country: '', // Add country
    postalCode: '', // Add postal code
    password: '',
    confirmPassword: '',
    
    role: 'Sale By Seller' // Default role
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
  
    try {
      await createSeller(formData); // Directly pass formData
      navigate('/verify-otp', { state: { email: formData.email } });
      setFormData({
        name: '',
        email: '',
        mobile: '',
        companyName: "",
        Address: "",
        password: '',
        confirmPassword: '',
        
        role: 'Sale By Seller',
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to create account');
    }
  };
  

  
  return (
    <div className="create-account-form-container">
      <h2>Create New Account</h2>
      <form className="create-account-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='companyName'>Company Name</label>
          <input type='text' id='companyName' name='companyName' value={formData.companyName} onChange={handleChange} required />
        </div>
        <div className="form-group">
  <label htmlFor="street">Street</label>
  <input
    type="text"
    id="street"
    name="street"
    value={formData.street}
    onChange={handleChange}
    required
  />
</div>
<div className="form-group">
  <label htmlFor="city">City</label>
  <input
    type="text"
    id="city"
    name="city"
    value={formData.city}
    onChange={handleChange}
    required
  />
</div>
<div className="form-group">
  <label htmlFor="state">State</label>
  <input
    type="text"
    id="state"
    name="state"
    value={formData.state}
    onChange={handleChange}
    required
  />
</div>
<div className="form-group">
  <label htmlFor="country">Country</label>
  <input
    type="text"
    id="country"
    name="country"
    value={formData.country}
    onChange={handleChange}
    required
  />
</div>
<div className="form-group">
  <label htmlFor="postalCode">Postal Code</label>
  <input
    type="text"
    id="postalCode"
    name="postalCode"
    value={formData.postalCode}
    onChange={handleChange}
    required
  />
</div>


        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Sale By Seller">Sale By Seller</option>
            <option value="Sale By OGCS">Sale By OGCS</option>
          </select>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="form-submit-button" >Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccountForm;