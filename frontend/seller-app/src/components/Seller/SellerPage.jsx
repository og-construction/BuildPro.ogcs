import React, { useState } from 'react';
import './SellerPage.css';
import Sidebar from './Sidebar';
import Header from './Header';
import Graph from './Graph';
import ProductHistory from './ProductHistory';
import UpdateProductForm from './UpdateProductForm';
 
import ManageProducts from './ManageProducts';

const SellerPage = () => {
  const [currentPage, setCurrentPage] = useState('Graph');
  const [collapsed, setCollapsed] = useState(false);


  return (
    <div className="seller-dashboard">
      <Sidebar setCurrentPage={setCurrentPage} currentPage={currentPage} collapsed={collapsed}/>
      
      <div className="main-content">
        <Header currentPage={currentPage} setCollapsed={setCollapsed} collapsed={collapsed}/>

        {currentPage === 'Graph' && <Graph />}
        {currentPage === 'Product History' && <ProductHistory />}
        {currentPage === 'Update Product' && <UpdateProductForm />}
        {currentPage === 'Add Product' && <ManageProducts />}
      </div>
    </div>
  );
};

export default SellerPage;
