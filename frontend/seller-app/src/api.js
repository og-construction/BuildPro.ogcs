import axios from 'axios';
const API_URL = 'http://localhost:5000/api/seller'; // Update with your backend URL

export const createSeller = async (data) => {
  return await axios.post(`${API_URL}/register`, data);
};

export const verifyOtp = async (data) => {
  return await axios.post(`${API_URL}/verify-otp`, data);  
};

export const loginSeller = async (data) => {
  return await axios.post(`${API_URL}/login`, data);
};

export const forgotPassword = async (data) => {
  return await axios.post(`${API_URL}/forgot-password-token`, data);
};

export const resetPassword = async (token, data) => {
  return await axios.put(`${API_URL}/reset-password/${token}`, data);
};

export const updatePassword = async (data, token) => {
  return await axios.put(`${API_URL}/password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Add the following functions

export const createProduct = async (data) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No authorization token available");

  return await axios.post(`${API_URL}/sell-product`, data, {
    headers: { Authorization: `Bearer ${token}` }, // Ensure this format
  });
};



export const updateProduct = async (id, data) => {
  return await axios.put(`${API_URL}/update-product/${id}`, data); // Adjust endpoint as needed
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/delete-product/${id}`); // Adjust endpoint as needed
};

export const getAllProducts = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No authorization token available");

  return await axios.get(`${API_URL}/get-all-products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
