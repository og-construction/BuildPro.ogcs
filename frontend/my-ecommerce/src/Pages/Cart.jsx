import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/get-cart/${userId}`);
                setCart(response.data);
            } catch (error) {
                console.error("Error fetching cart:", error);
                alert("Failed to fetch cart");
            }
        };

        fetchCart();
    }, [userId]);

    // Remove a specific product from the cart
    const handleRemoveFromCart = async (productId) => {
        try {
            const updatedItems = cart.items.filter(item => item.productId._id !== productId);

            await axios.post(`http://localhost:5000/api/cart/add-to-cart`, {
                userId,
                items: updatedItems,
            });

            setCart(prevCart => ({
                ...prevCart,
                items: updatedItems,
            }));
            alert("Item removed from cart");
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    // Delete the entire cart
    const handleDeleteCart = async () => {
      try {
          const response = await axios.delete(`http://localhost:5000/api/cart/delete/${userId}`);
          setCart(null); // Clear the cart state
          alert(response.data.message); // Display success message
      } catch (error) {
          console.error("Error deleting cart:", error);
          alert(error.response?.data?.message || "Failed to delete cart");
      }
  };
  
    if (!cart) {
        return (
            <div className="cart-empty">
                <h2>Your cart is empty.</h2>
                <button
                    onClick={() => navigate("/Buyerschoice")}
                    className="btn btn-primary"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1 className="cart-title">Your Shopping Cart</h1>
            {cart.items.map((item, index) => (
                <div key={index} className="cart-item">
                    <img
                        src={`http://localhost:5000${item.productId.image}`}
                        alt={item.productId.name}
                        className="cart-img"
                    />
                    <div className="cart-details">
                        <h2>{item.productId.name}</h2>
                        <p>Price: {item.productId.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleRemoveFromCart(item.productId._id)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <div className="cart-actions">
                <button
                    onClick={() => navigate("/checkout")}
                    className="btn btn-primary btn-lg"
                >
                    Proceed to Checkout
                </button>
                <button
                    onClick={handleDeleteCart}
                    className="btn btn-danger btn-lg"
                >
                    Delete Cart
                </button>
            </div>
        </div>
    );
};

export default Cart;
