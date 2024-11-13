import React from 'react';
import './Sidebar.css'
import logo from '../../Images/buillogo7.png';

const Sidebar = ({ setCurrentPage, currentPage }) => {
  return (
    <div className="sidebar">
      <div className="profile">
        <img src={logo} alt="Company Logo" className="nav-logo" style={{ width: '90px', height: '60px' }} />
      </div>
      <ul className="menu">
        <li onClick={() => setCurrentPage('Graph')}>Graph</li>
        <li className={currentPage === 'Product History' ? 'active' : ''} onClick={() => setCurrentPage('Product History')}>Product History</li>
        <li onClick={() => setCurrentPage('Update Product')}>Update Product</li>
        <li onClick={() => setCurrentPage('Add Product')}>Add Product</li>
        <li className={currentPage === 'Billing History' ? 'active' : ''} onClick={() => setCurrentPage('Billing History')}>Billing History</li>
        <li onClick={() => setCurrentPage('Transactions')}>Transactions</li>
      </ul>
    </div>
  );
};

export default Sidebar;
