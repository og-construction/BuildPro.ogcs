import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
    const [carts, setCarts] = useState([]); // Handle multiple carts
    const [popupMessage, setPopupMessage] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/get-cart/${userId}`);
                setCarts([response.data]); // Wrap the single cart object in an array for consistency
            } catch (error) {
                console.error("Error fetching cart:", error);
                alert("Failed to fetch cart");
            }
        };

        fetchCart();
    }, [userId]);

    // Handle Proceed to Checkout for a specific cart
    const handleCheckout = (cartId) => {
        const cart = carts.find((cart) => cart._id === cartId);
        const sellerProduct = cart.items.find((item) => item.productId.saleType === "Sale By Seller");

        if (sellerProduct) {
            setPopupMessage("This product is sold directly by the seller. Would you like to contact the seller?");
            setSelectedSeller(sellerProduct.productId.seller);
        } else {
            navigate("/checkout");
        }
    };

    // Handle popup actions
    const handlePopupAction = async (action) => {
        if (action === "contact" && selectedSeller) {
            try {
                const response = await axios.get(`http://localhost:5000/api/seller/seller-by-id/${selectedSeller}`);
                const sellerDetails = response.data;

                if (sellerDetails.address) {
                    alert(
                        `Seller Contact Details:\nName: ${sellerDetails.name}\nCompany: ${sellerDetails.companyName}\nEmail: ${sellerDetails.email}\nMobile: ${sellerDetails.mobile}\nAddress: ${sellerDetails.address.street}, ${sellerDetails.address.city}, ${sellerDetails.address.state}, ${sellerDetails.address.country}, ${sellerDetails.address.postalCode}`
                    );
                } else {
                    alert("Address information is missing.");
                }
            } catch (error) {
                console.error("Error fetching seller details:", error);
                alert("Failed to fetch seller details.");
            }
        }

        setPopupMessage(null);
        setSelectedSeller(null);
    };

    // Remove a specific item from a cart
    const handleRemoveFromCart = async (cartId, itemId) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/cart/remove-item`, {
                cartId,
                itemId,
            });

            setCarts((prevCarts) =>
                prevCarts.map((cart) =>
                    cart._id === cartId ? { ...cart, items: response.data.cart.items } : cart
                )
            );
            alert("Item removed from cart");
        } catch (error) {
            console.error("Error removing item from cart:", error);
            alert("Failed to remove item");
        }
    };

    // Delete a specific cart
    const handleDeleteCart = async (cartId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/cart/delete/${cartId}`);
            setCarts((prevCarts) => prevCarts.filter((cart) => cart._id !== cartId));
            alert(response.data.message);
        } catch (error) {
            console.error("Error deleting cart:", error);
            alert("Failed to delete cart");
        }
    };

    if (!carts.length) {
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
        <div>
            {carts.map((cart) => (
                <div key={cart._id} className="cart-container">
                    <h1>{cart.name || "Your Shopping Cart"}</h1>
                    {cart.items.map((item) => (
                        <div key={item._id} className="cart-item">
                            <img
                                src={`http://localhost:5000${item.productId.image}`}
                                alt={item.productId.name}
                                className="cart-img"
                            />
                            <div className="cart-details">
                                <h2>{item.productId.name}</h2>
                                <p>Price: {item.productId.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Sold By: {item.productId.saleType}</p>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveFromCart(cart._id, item._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="cart-actions">
                        <button
                            onClick={() => handleCheckout(cart._id)}
                            className="btn btn-primary btn-lg"
                        >
                            Proceed to Checkout
                        </button>
                        <button
                            onClick={() => handleDeleteCart(cart._id)}
                            className="btn btn-danger btn-lg"
                        >
                            Delete Cart
                        </button>
                    </div>
                </div>
            ))}

            {popupMessage && (
                <div className="popup">
                    <p>{popupMessage}</p>
                    <div className="popup-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => handlePopupAction("contact")}
                        >
                            Contact Seller
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
