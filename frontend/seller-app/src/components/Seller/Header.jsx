import { IconButton, Menu, MenuItem } from '@mui/material'; // Importing Menu and MenuItem from MUI
import React, { useState } from 'react';
import { FaBell, FaUser } from 'react-icons/fa'; // Using icons for notifications and settings
import { RiMenu2Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '../../utils/toaster';

const Header = ({ setCollapsed, collapsed }) => {
  let navigate = useNavigate()
  // State to manage menu open/close
  const [anchorEl, setAnchorEl] = useState(null);

  // Function to open the menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };
  let handleLogout = () => {
    localStorage.clear()
    navigate("/")
    showSuccessToast("You have been logged out successfully.");
  }

  return (
    <div className="bg-gray-400 text-white p-2 px-3 flex items-center justify-between shadow-lg">
      {/* Left Section: Hamburger Icon */}
      <div onClick={() => setCollapsed(!collapsed)} className='cursor-pointer'>
        <RiMenu2Line className="text-2xl" />
      </div>

      {/* Right Section: Notifications and Settings */}
      <div className="flex items-center space-x-4">
        {/* Notifications Icon */}
        <div className="relative">
          <FaBell className="text-2xl cursor-pointer hover:text-yellow-400 " />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            11
          </span>
        </div>

        {/* User Icon with Dropdown Menu */}
        <div>
          <IconButton onClick={handleClick}>
            <FaUser className="text-2xl cursor-pointer hover:text-black text-white" />
          </IconButton>
          <Menu
            anchorEl={anchorEl} // The element to anchor the menu to
            open={Boolean(anchorEl)} // Open menu if anchorEl is not null
            onClose={handleClose} // Close the menu
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
