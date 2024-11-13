import React, { useState } from 'react';
import './SignInForm.css';
import { useNavigate } from 'react-router-dom';
import { loginSeller } from '../api'; // Adjust the path as necessary

const SignInForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await loginSeller(credentials);
      console.log(response); // Check entire response structure here
      
      if (response.status === 200) { // Ensure it's a successful status code
        const token = response.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          console.log("Token stored in localStorage:", token);
          navigate('/seller'); // Navigate only on success
        } else {
          throw new Error("Token not provided in response");
        }
      } else {
        throw new Error("Login failed with non-200 response status");
      }
    } catch (error) {
      console.error("Login failed:", error.message || error.response?.data?.message);
      alert(error.message || error.response?.data?.message || 'Login failed'); // Display error message
    }
  };
  
  
  
  const handleCreateAccount = () => {
    navigate('/create-account');
  };

  return (
    <div className="sign-in-form-container">
      <h2>Log In</h2>
      <form className="sign-in-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={credentials.email}
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
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="form-submit-button">Sign In</button>
      </form>

      <div className="create-account">
        <p>Don't have an account?</p>
        <button className="create-account-button" onClick={handleCreateAccount}>
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
