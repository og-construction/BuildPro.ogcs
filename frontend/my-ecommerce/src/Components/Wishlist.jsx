import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';
import axios from 'axios';



const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
        const response = await axios.get(`http://localhost:5000/api/wishlist/get-wishlist/${userId}`);
        setWishlistItems(response.data?.items || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const addToCart = async (product) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(`http://localhost:5000/api/cart/add-to-cart`, {
        userId,
        items: [{ productId: product._id, quantity: 1 }],
      });
      alert(`${product.name} has been added to the cart.`);
      navigate('/cart');
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const deleteFromWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(`http://localhost:5000/api/wishlist/delete/${userId}`, {
        userId,
        productId,
      });
      setWishlistItems(wishlistItems.filter((item) => item.productId._id !== productId));
      alert("Item removed from wishlist.");
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  return (
    <div className="wishlist-container">
      <h1>Wishlist</h1>
      {wishlistItems.length > 0 ? (
        wishlistItems.map((item, index) => (
          <div key={index} className="wishlist-item">
            <img
              src={`http://localhost:5000${item.productId.image}`}
              alt={item.productId.name}
              className="wishlist-item-image"
            />
            <div className="wishlist-item-details">
              <h2>{item.productId.name}</h2>
              <p className="wishlist-price"><strong>Price:</strong> {item.productId.price}</p>
              <button onClick={() => addToCart(item.productId)}>Add to Cart</button>
              <button onClick={() => deleteFromWishlist(item.productId._id)}>Delete</button>
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
