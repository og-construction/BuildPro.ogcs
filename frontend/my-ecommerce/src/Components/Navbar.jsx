import { FormControl, InputLabel, Menu, MenuItem, Select } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCartPlus, FaHeart, FaSearch, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "./Assets/buillogo6.png";
import LoginDialog from "./LoginDialog";
import PincodeToCity from "./Location";

const Navbar = () => {
  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false);
  const [isSignup, setisSignup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {

    // Get user's current location using geolocation API
    const fetchCurrentLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Use a geocoding API to get the city from coordinates
              const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
              );
              console.log(response, "response");

              const city =
                response.data.results[0].components.city || "Unknown City";
            } catch (error) {
              console.error("Error fetching geolocation:", error);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    fetchCurrentLocation();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/api/seller/get-similar-products?name=${searchTerm}`
      );
      console.log("Response from backend:", response.data);
      navigate("/similar-products", { state: { products: response.data } });
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
    setSearchTerm("");
  };

  const openWishlist = () => {
    navigate("/wishlist");
  };

  const handleAccountMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogout = () => {
    console.log("Logged out");
    handleMenuClose();
  };

  return (
    <>
      <LoginDialog
        open={isLoginDialogVisible}
        onClose={() => setIsLoginDialogVisible(false)}
        isSignup={isSignup}
        setisSignup={setisSignup}
      />
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white py-2 px-6 ">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setIsLoginDialogVisible(true)}
              className="text-sm font-semibold text-white hover:underline"
            >
              Login
            </button>
            <span>/</span>
            <button
              onClick={() => setIsLoginDialogVisible(true)}
              className="text-sm font-semibold text-white hover:underline"
            >
              Register
            </button>
          </div>
          <div>
            <span className="text-xs">
              Want to become a seller?{" "}
              <Link to="/seller" className="text-yellow-200 hover:underline">
                Sign up here
              </Link>
            </span>
          </div>
        </div>
      </div>

      <nav className="bg-white p-4 flex items-center justify-between shadow-sm">
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="h-12" />
        </Link>

        <div className="flex w-full justify-center items-center gap-10">
            <PincodeToCity />
          <form
            className="relative flex items-center w-full md:w-1/3 mt-4"
            onSubmit={handleSearch}
          >
            <div className="flex items-center w-full rounded-lg focus-within:border-blue-600 transition-all">
              <input
                type="text"
                placeholder="Search for products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 px-4 h-full rounded-l-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-3  mb-4 h-full rounded-r-lg flex items-center justify-center transition-all"
              >
                <FaSearch className="text-lg" />
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center space-x-2"
            onClick={() => navigate("/cart")}
          >
            <FaCartPlus />
          </button>
          <button
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition flex items-center space-x-2"
            onClick={openWishlist}
          >
            <FaHeart />
          </button>
          <button
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition flex items-center space-x-2"
            onClick={handleAccountMenuClick}
          >
            <FaUser />
          </button>

          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
