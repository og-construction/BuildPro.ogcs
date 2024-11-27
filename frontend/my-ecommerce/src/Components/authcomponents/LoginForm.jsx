import axios from "axios";
import React, { useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toaster";

function LoginForm({closeLoginDialog}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // To handle form submission state

  // Handle input changes for both email and password
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate email format
  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();
    // Validate form inputs
    if (!trimmedEmail || !trimmedPassword) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      showErrorToast("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true); // Disable form while submitting

    try {
      // Send login request using axios
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email: trimmedEmail,
          password: trimmedPassword,
        }
      );

      // Check if login is successful
      if (response.status === 200) {
        const { user, token } = response.data;
        // Save userId and token in localStorage
        localStorage.setItem("userId", user._id);
        localStorage.setItem("token", token);
        closeLoginDialog()
        showSuccessToast("Login successful!");
      }
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        // Server errors (e.g., 400, 500)
        showErrorToast(error.response?.data.message || "Something went wrong, please try again.");
      } else if (error.request) {
        // Network errors
        showErrorToast("Network error. Please check your internet connection.");
      } else {
        // Other errors
        showErrorToast("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable form submission
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting} // Disable input while submitting
          className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
        />
      </div>

      {/* Password Input */}
      <div className="mt-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting} // Disable input while submitting
          className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your password"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r mt-5 from-blue-500 to-indigo-600 text-white font-medium py-2 rounded-md shadow-md hover:from-indigo-600 hover:to-blue-500 transition-transform transform hover:scale-105"
        disabled={isSubmitting} // Disable button while submitting
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}

export default LoginForm;
