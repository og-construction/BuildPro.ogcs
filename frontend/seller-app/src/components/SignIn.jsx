import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSeller } from '../api'; // Adjust the path as necessary
import logo from '../Images/buillogo7.png'; // Path to your logo
import OGGSlogo from '../Images/OGGS_Logo.png'; // Path to your logo
import SignInForm from './SignInForm';
import CreateAccountForm from './CreateAccountForm';

const SignIn = () => {
  const [showsignup, setshowsignup] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    setshowsignup(true);
  };

  const handleSignIn = () => {
    setshowsignup(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl rounded-xl shadow-lg overflow-hidden">
        {/* Left Column */}
        <div className="flex flex-col justify-center items-center p-8 bg-white">
          {/* Logo at the top */}
          <div className="logo mb-6 text-center">
            <img src={logo} alt="Logo" className="w-32 h-auto mx-auto" />
          </div>

          {/* Show either SignInForm or CreateAccountForm based on state */}
          {showsignup ? <CreateAccountForm /> : <SignInForm />}

          {/* Toggle text for sign up/sign in */}
          <div className="create-account mt-4 text-center flex gap-3">
            {showsignup ? (
              <>
                <p className="text-gray-600">Already have an account?</p>
                <div className="text-blue-500 cursor-pointer" onClick={handleSignIn}>
                  Sign In
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600">Don't have an account?</p>
                <div className="text-blue-500 cursor-pointer" onClick={handleCreateAccount}>
                  Sign Up
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center tems-center p-8 bg-blue-100">
          <div className="gif-container text-center">
            <img
              src={OGGSlogo}
              alt="loading"
              className="w-full max-w-xs mx-auto"
            />
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-center">Welcome back! Please {showsignup ? "Sign up" : "sign in"} to your account</h2>
          <p className="text-lg mb-4 text-center">To continue, please sign in with your credentials. Once signed in, you’ll be able to access your account.</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
