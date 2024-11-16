import React from 'react';
//import './Sidebar.css'
import Style from "../Style/Sidebar.module.css";
import logo from '../../Images/buillogo7.png';

const Sidebar = ({ setCurrentPage, currentPage }) => {
  return (
    <div className={Style.sidebar}>
      <div className={Style.profile}>
      <img src={logo} alt="Company Logo" className={Style["nav_logo"]} style={{ width: '90px', height: '60px' }} />
      </div>
      <ul className={Style.menu}>
        <li onClick={() => setCurrentPage('Graph')}>Graph</li>
        <li className={currentPage === 'Product History' ? 'active' : ''} onClick={() => setCurrentPage('Product History')}>Product History</li>
        <li onClick={() => setCurrentPage('Add Product')}>Add Product</li>
        <li className={currentPage === 'Billing History' ? 'active' : ''} onClick={() => setCurrentPage('Billing History')}>Billing History</li>
        <li onClick={() => setCurrentPage('Transactions')}>Transactions</li>
      </ul>
    </div>
  );
};

export default Sidebar;
