import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the wishlist items from local storage on component mount
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(storedWishlist);
  }, []);

  const addToCart = (product) => {
    // Retrieve existing cart items from local storage or initialize empty array
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    // Add the product to the cart
    cartItems.push(product);
    // Update local storage
    localStorage.setItem("cart", JSON.stringify(cartItems));
    alert(`${product.name} has been added to the cart.`);

    // Navigate to the checkout page
    navigate('/checkout');
  };

  const deleteFromWishlist = (productToDelete) => {
    // Filter out the product to delete
    const updatedWishlist = wishlistItems.filter((item) => item.name !== productToDelete.name);
    // Update state and local storage
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div className="wishlist-container">
      <h1>Wishlist</h1>
      {wishlistItems.length > 0 ? (
        wishlistItems.map((product, index) => (
          <div key={index} className="wishlist-item">
            <img src={product.src} alt={product.name} className="wishlist-item-image" />
            <div className="wishlist-item-details">
              <h2>{product.name}</h2>
              <p className="wishlist-price"><strong>Price:</strong> {product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
              <button onClick={() => deleteFromWishlist(product)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>Your wishlist is empty</p>
      )}
    </div>
  );
};

export default Wishlist;
