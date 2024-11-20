import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AboutCompany from "../Components/productListcomponents/companyContent";
import Cartproduct from "../Components/cartcomponents/Cartproduct";

const Cart = () => {
  const [carts, setCarts] = useState([]);
  const [popupMessage, setPopupMessage] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cart/get-cart/${userId}`
        );
        setCarts([response.data]); // Wrap the single cart object in an array for consistency
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Failed to fetch cart");
      }
    };

    fetchCart();
  }, [userId]);

  const handleCheckout = (cartId) => {

    const cart = carts.find((cart) => cart._id === cartId);
    const sellerProduct = cart.items.find(
      (item) => item.productId.saleType === "Sale By Seller"
    );

    if (sellerProduct) {
      setPopupMessage(
        "This product is sold directly by the seller. Would you like to contact the seller?"
      );
      setSelectedSeller(sellerProduct.productId.seller);
    } else {
      navigate("/checkout");
    }
  };

  const handlePopupAction = async (action) => {
    if (action === "contact" && selectedSeller) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/seller/seller-by-id/${selectedSeller}`
        );
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

  const handleRemoveFromCart = async (cartId, itemId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/cart/remove-item`,
        { cartId, itemId }
      );

      setCarts((prevCarts) =>
        prevCarts.map((cart) =>
          cart._id === cartId
            ? { ...cart, items: response.data.cart.items }
            : cart
        )
      );
      alert("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item");
    }
  };

  // Handle local quantity change
  const handleQuantityChange = (cartId, itemId, change) => {
    const updatedCarts = carts.map((cart) => {
      if (cart._id === cartId) {
        const updatedItems = cart.items.map((item) => {
          if (item._id === itemId) {
            const updatedQuantity = item.quantity + change;
            if (updatedQuantity >= 1) {
              return { ...item, quantity: updatedQuantity };
            }
          }
          return item;
        });
        return { ...cart, items: updatedItems };
      }
      return cart;
    });
    setCarts(updatedCarts);
  };

  const calculateTotal = () => {
    const totalAmount = carts.reduce((total, cart) => {
      return (
        total +
        cart.items.reduce(
          (subTotal, item) => subTotal + item.quantity * item.productId.price,
          0
        )
      );
    }, 0);

    const taxRate = 0.18; // Tax rate (18%)
    const taxes = totalAmount * taxRate;
    return {
      totalAmount,
      taxes,
      grandTotal: totalAmount + taxes,
    };
  };

  if (!carts.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <span className="text-2xl font-semibold text-gray-800 mb-4">
            Your cart is empty.
          </span>
          <button
            onClick={() => navigate("/Buyerschoice")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const { totalAmount, taxes, grandTotal } = calculateTotal();

  return (
    <div className="container mx-auto py-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        {carts.map((cart) => (
          <Cartproduct
            key={cart._id}
            cart={cart}
            handleQuantityChange={handleQuantityChange}
            handleRemoveFromCart={handleRemoveFromCart}
          />
        ))}
        <AboutCompany />
      </div>
      <div className="w-full lg:w-1/3 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg text-white min-h-fit max-h-fit">
        <h2 className="text-2xl font-semibold mb-6 text-center border-b-2 pb-3">
          Billing Details
        </h2>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-lg">Items Total:</p>
            <p className="text-2xl font-semibold">₹{totalAmount.toFixed(2)}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg">Taxes (18%):</p>
            <p className="text-2xl font-semibold">₹{taxes.toFixed(2)}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Grand Total:</p>
            <p className="text-2xl font-bold">₹{grandTotal.toFixed(2)}</p>
          </div>
        </div>

        <button
          onClick={() => handleCheckout(carts._id)}
          className="mt-8 w-full px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 transition duration-300 shadow-md"
        >
          Proceed to Checkout
        </button>

        <div className="mt-4 text-sm italic text-gray-200 text-center">
          *Shipping fees are calculated at checkout.
        </div>
      </div>

      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <span className="text-xl font-semibold text-gray-800 mb-4">
              {popupMessage}
            </span>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handlePopupAction("contact")}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Contact Seller
              </button>
              <button
                onClick={() => setPopupMessage(null)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
