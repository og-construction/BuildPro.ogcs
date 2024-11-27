import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const monthlyData = [
    { month: 'Jan', orders: 50, users: 20 },
    { month: 'Feb', orders: 75, users: 30 },
    { month: 'Mar', orders: 100, users: 50 },
    { month: 'Apr', orders: 125, users: 70 },
    { month: 'May', orders: 90, users: 40 },
    { month: 'Jun', orders: 110, users: 60 },
    { month: 'Jul', orders: 150, users: 80 },
    { month: 'Aug', orders: 200, users: 100 },
    { month: 'Sep', orders: 180, users: 90 },
    { month: 'Oct', orders: 220, users: 120 },
    { month: 'Nov', orders: 250, users: 140 },
    { month: 'Dec', orders: 300, users: 150 },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="user-management-container">
        <Link to="/admin/users" className="user-management-card">
          <div className="user-icon-container">
            <i className="fas fa-users user-icon"></i>
          </div>
          <span className="user-text">User</span>
        </Link>
        
        <Link to="/admin/sellers" className="user-management-card">
          <div className="user-icon-container">
            <i className="fas fa-sellers user-icon"></i>
          </div>
          <span className="seller-text">Sellers</span>
        </Link>
      </div>
      
      <h3 className="chart-title">Monthly Orders and Users</h3>
      <LineChart width={800} height={300} data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="users" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
};

export default Dashboard;
