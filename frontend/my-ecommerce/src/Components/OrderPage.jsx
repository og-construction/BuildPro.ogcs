// src/components/OrderPage.js
import React from 'react';
import './OrderPage.css';  

const OrderPage = () => {
  
  const orders = [
    { id: 1, item: 'Product 1', quantity: 2, price: 20, status: 'Pending' },
    { id: 2, item: 'Product 2', quantity: 1, price: 15, status: 'Completed' },
    { id: 3, item: 'Product 3', quantity: 3, price: 10, status: 'Pending' },
    { id: 4, item: 'Product 4', quantity: 1, price: 25, status: 'Completed' },
  ];

  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === 'Pending');
  const completedOrders = orders.filter(order => order.status === 'Completed');

  return (
    <div className="order-page">
      <h1>Your Orders</h1>

      <h2>Pending Orders</h2>
      {pendingOrders.length === 0 ? (
        <p>No pending orders found.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.item}</td>
                <td>{order.quantity}</td>
                <td>{order.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Completed Orders</h2>
      {completedOrders.length === 0 ? (
        <p>No completed orders found.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {completedOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.item}</td>
                <td>{order.quantity}</td>
                <td>${order.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderPage;
