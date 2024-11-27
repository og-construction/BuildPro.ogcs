import React from 'react';
import { FaChartLine, FaEdit, FaExchangeAlt, FaHistory, FaPlus, FaReceipt } from 'react-icons/fa';
import { Menu, MenuItem, Sidebar as ProSidebar } from 'react-pro-sidebar';
import logo from '../../Images/buillogo7.png';

const Sidebar = ({ setCurrentPage, currentPage, collapsed }) => {
  return (
    <div className="h-screen  text-gray-200">
      <ProSidebar collapsed={collapsed}>
        {/* Logo Section */}
        <div className={`flex justify-center py-6 border-gray-600 bg-gray-400 ${collapsed && "hidden"}`}>
          <img src={logo} alt="Company Logo" className="w-24 h-auto" />
        </div>

        {/* Menu Items */}
        <Menu iconShape="circle" className="mt-4">
          <MenuItem
            icon={<FaChartLine />}
            className={`hover:bg-gray-600'}`}
            onClick={() => setCurrentPage('Graph')}
          >
            <span className="text-sm">Graph</span>
          </MenuItem>

          <MenuItem
            icon={<FaHistory />}
            className={`hover: ${currentPage === 'Product History' ? '' : ''
              }`}
            onClick={() => setCurrentPage('Product History')}
          >
            <span className="text-sm">Product History</span>
          </MenuItem>

          <MenuItem
            icon={<FaEdit />}
            className={`hover: ${currentPage === 'Update Product' ? '' : ''
              }`}
            onClick={() => setCurrentPage('Update Product')}
          >
            <span className="text-sm">Update Product</span>
          </MenuItem>

          <MenuItem
            icon={<FaPlus />}
            className={`hover: ${currentPage === 'Add Product' ? '' : ''
              }`}
            onClick={() => setCurrentPage('Add Product')}
          >
            <span className="text-sm">Add Product</span>
          </MenuItem>

          <MenuItem
            icon={<FaReceipt />}
            className={`hover: ${currentPage === 'Billing History' ? '' : ''
              }`}
            onClick={() => setCurrentPage('Billing History')}
          >
            <span className="text-sm">Billing History</span>
          </MenuItem>

          <MenuItem
            icon={<FaExchangeAlt />}
            className={`hover: ${currentPage === 'Transactions' ? '' : ''
              }`}
            onClick={() => setCurrentPage('Transactions')}
          >
            <span className="text-sm">Transactions</span>
          </MenuItem>
        </Menu>
      </ProSidebar>
    </div>
  );
};

export default Sidebar;
