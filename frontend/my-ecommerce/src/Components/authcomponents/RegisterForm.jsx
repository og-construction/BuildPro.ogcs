import axios from "axios";
import React, { useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toaster";
import Verifyotp from "./Verifyotp";

function RegisterForm({showotpcomponent,setshowotpcomponent,closeLoginDialog}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    userType: "B2B", // Default user type
    gstNumber: "", // Add gstNumber to state
  });

  // Handle input changes for all fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically set the value for the respective field
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          type: formData.userType,
          gstNumber:
            formData.userType === "B2B" ? formData.gstNumber : undefined, // Only send GST Number if B2B
        }
      );
      setshowotpcomponent(true)
      showSuccessToast("Registration successful! Welcome to our platform.");
    } catch (error) {
      console.log("Error during registration:", error);
      showErrorToast(
        error.response?.data.message || "Registration failed. Please try again."
      )
    }
  };

  return (
    <div>
      {showotpcomponent ? (
        <Verifyotp email={formData.email} closeLoginDialog={closeLoginDialog} setshowotpcomponent={setshowotpcomponent}/>
      ) : (
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Mobile Input */}
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your mobile number"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* User Type Radio Buttons (B2B or B2C) */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              User Type
            </label>
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="b2b"
                  name="userType"
                  value="B2B"
                  checked={formData.userType === "B2B"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="b2b" className="ml-2 text-sm text-gray-700">
                  B2B
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="b2c"
                  name="userType"
                  value="B2C"
                  checked={formData.userType === "B2C"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="b2c" className="ml-2 text-sm text-gray-700">
                  B2C
                </label>
              </div>
            </div>
          </div>

          {/* GST Number Input - Only show if userType is B2B */}
          {formData.userType === "B2B" && (
            <div className="mt-2">
              <label
                htmlFor="gstNumber"
                className="block text-sm font-medium text-gray-700"
              >
                GST Number
              </label>
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your GST number"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r mt-5 from-blue-500 to-indigo-600 text-white font-medium py-2 rounded-md shadow-md hover:from-indigo-600 hover:to-blue-500 transition-transform transform hover:scale-105"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
}

export default RegisterForm;
