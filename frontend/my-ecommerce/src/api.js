import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user'; // Update with your backend URL

export const createUser = async (data) => {
  return await axios.post(`${API_URL}/register`, data);
};

export const verifyOtp = async (data) => {
  return await axios.post(`${API_URL}/verify-otp`, data);  
};

export const loginUserCtrl = async (data) => {
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
export const logout = async (data) => {
    return await axios.post(`${API_URL}/forgot-password-token`, data);
  };
  
// Add the following functions


//export const sellProduct = async (data) => {
  //const token = localStorage.getItem('token'); // Assuming you store JWT in localStorage
  //return await axios.post(`${API_URL}/sell-product`, data, {
    //headers: {
     // Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    //},
  //});
//};

//export const updateProduct = async (id, data) => {
  //return await axios.put(`${API_URL}/update-product/${id}`, data); // Adjust endpoint as needed
//};

//export const deleteProduct = async (id) => {
  //return await axios.delete(`${API_URL}/delete-product/${id}`); // Adjust endpoint as needed
//};

//export const getAllProducts = async (token) => {
  //return await axios.get(`${API_URL}/get-all-products`, {
    //headers: {
      //Authorization: `Bearer ${token}`,
    //},
  //});
//};
