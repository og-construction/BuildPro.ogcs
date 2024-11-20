import React, { useState } from "react";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/toaster";

function Verifyotp({ open, onClose, email ,closeLoginDialog,setshowotpcomponent}) {
  console.log('otp component load');
  
  const [otp, setOtp] = useState(""); // To store OTP entered by the user
  const [errorMessage, setErrorMessage] = useState(""); // To display error message if OTP is invalid

  const handleChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSubmit = async () => {
    if (otp === "") {
      setErrorMessage("OTP cannot be empty.");
      return;
    }
    try {
      const user = await axios.post(
        "http://localhost:5000/api/user/verify-otp",
        { email, otp }
      );
      setshowotpcomponent(false)
      closeLoginDialog();
      showSuccessToast("OTP verified successfully!");
    } catch (error) {
      showErrorToast(error.response?.data.message || "OTP verification failed");
    }
    setErrorMessage("");
  };

  const handleResendOtp = () => {
    console.log("Resending OTP...");
    setErrorMessage(""); // Clear any error message
  };


  return (
    <section className="p-5 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-center text-indigo-600 mb-4">
        Verify OTP
      </h3>
      <p className="text-center text-gray-600 mb-2">
        Please enter the OTP sent to your email address:
      </p>
      <p className="text-center font-bold text-black mb-6">{email}</p>

      <div className="mb-4">
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errorMessage && (
          <p className="text-red-600 text-sm text-center mt-2">{errorMessage}</p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Verify OTP
        </button>

        <p className="text-sm text-center text-gray-600">
          Didn’t receive the OTP?{" "}
          <button
            onClick={handleResendOtp}
            className="text-indigo-600 font-medium hover:underline focus:outline-none"
          >
            Resend
          </button>
        </p>
      </div>
    </section>
  );
}

export default Verifyotp;
