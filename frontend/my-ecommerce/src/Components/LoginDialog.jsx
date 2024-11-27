import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import logo from "./Assets/buillogo7.png";
import LoginForm from "./authcomponents/LoginForm";
import RegisterForm from "./authcomponents/RegisterForm";

const LoginDialog = ({ open, onClose, isSignup, setisSignup }) => {
  const [showotpcomponent, setshowotpcomponent] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      classes={{ paper: "rounded-xl shadow-lg" }}
    >
      {/* Content */}
      <div className="flex flex-col md:flex-row">
        {/* Left Column */}
        <div className="w-full md:w-1/2 bg-gray-200 flex flex-col items-center justify-center p-6">
          <img src={logo} alt="BuildPro Logo" className="h-20 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 text-center">
            Welcome to BuildPro OGCS
          </h3>
          <p className="text-gray-600 text-center mt-2">
            Build better. Build smarter.
          </p>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 bg-white p-6">
          {/* Flex container for header and cross icon */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {isSignup ? "Create an Account" : "Sign In"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
          {/* Conditionally render LoginForm or RegisterForm */}
          {isSignup ? (
            <RegisterForm
              closeLoginDialog={onClose}
              setshowotpcomponent={setshowotpcomponent}
              showotpcomponent={showotpcomponent}
            />
          ) : (
            <LoginForm closeLoginDialog={onClose} />
          )}

          {!showotpcomponent && (
            <div className="flex flex-col items-center space-y-2 mt-4">
              {isSignup ? (
                <>
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-blue-500 font-medium hover:underline"
                      onClick={() => setisSignup(false)}
                    >
                      Sign In
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Forgot Password?
                  </button>
                  <p className="text-gray-600 text-sm">
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      className="text-blue-500 font-medium hover:underline"
                      onClick={() => setisSignup(true)}
                    >
                      Sign Up
                    </button>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default LoginDialog;
