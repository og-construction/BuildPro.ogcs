import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Cart.css'; // Importing a separate CSS file for custom styling

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};  // Destructure state to get the product

  if (!product) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty.</h2>
        <button onClick={() => navigate('/Buyerschoice')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinue = () => {
    navigate('/Buyerschoice');
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      <div className="cart-content">
        <div className="cart-item-image">
          <img src={product.src} alt={product.name} className="cart-img" />
        </div>
        <div className="cart-item-details">
          <h2 className="cart-item-name">{product.name}</h2>
          <p className="cart-item-price">Price: {product.price}</p>
          <p className="cart-item-description">
            This is a premium quality product. It's designed to meet all your needs and ensures a long-lasting experience.
          </p>
          <p className="cart-item-address">Delivery Address: New Mumbai</p>
          <div className="cart-actions">
            <button
              className="btn btn-primary btn-lg add-to-cart-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
            <button
              className="btn btn-secondary btn-lg continue-shopping-btn"
              onClick={handleContinue}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
