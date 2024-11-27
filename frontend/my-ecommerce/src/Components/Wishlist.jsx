import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/api/wishlist/get-wishlist/${userId}`
        );
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
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const deleteFromWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(
        `http://localhost:5000/api/wishlist/delete/${userId}`,
        { userId, productId }
      );
      setWishlistItems(wishlistItems.filter((item) => item.productId._id !== productId));
      alert("Item removed from wishlist.");
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Your Wishlist
      </h1>
      {wishlistItems.length > 0 ? (
        <div className="flex flex-col gap-6 w-full max-w-2xl">
          {wishlistItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="flex">
                <img
                  src={`http://localhost:5000${item.productId.image}`}
                  alt={item.productId.name}
                  className="w-32 h-32 object-cover"
                />
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">
                      {item.productId.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      <strong>Price:</strong> ${item.productId.price}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => addToCart(item.productId)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => deleteFromWishlist(item.productId._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center text-lg mt-20">
          Your wishlist is empty.
        </p>
      )}
    </div>
  );
};

export default Wishlist;
