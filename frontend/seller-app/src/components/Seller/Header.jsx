import React from 'react';
import { FaBell, FaCog } from 'react-icons/fa';
import Style from "../Style/Header.module.css";
//import '../Style/Header.module.css'

const Header = ({ currentPage }) => (
  <div className={Style.headerbody}>
    <h2>{currentPage}</h2>
    <input type="search" placeholder="Search here" />
    <div className={Style.icons}>
      <span className={Style.notifications}> 
      <FaBell /> 
      </span>
      <i className={Style["settings-icon"]}>
      <FaCog /> 
      </i>
    </div>
  </div>
);

export default Header;
