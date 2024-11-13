import React from 'react';

const Header = ({ currentPage }) => (
  <div className="header">
    <h2>{currentPage}</h2>
    <input type="search" placeholder="Search here" />
    <div className="icons">
      <span className="notifications">11</span>
      <i className="settings-icon"></i>
    </div>
  </div>
);

export default Header;
