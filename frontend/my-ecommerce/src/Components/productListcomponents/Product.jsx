import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Product({ product }) {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleNavigateToProductDetails = (productId) => {
    navigate(`/product/details/${productId}`);
  };

  // Fetch initial wishlist status for the product
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await axios.get(
          `http://localhost:5000/api/wishlist/get-wishlist/${userId}`
        );
        const wishlistItems = response?.data?.items || [];
        const isProductInWishlist = wishlistItems.some(
          (item) => item.productId._id === product._id
        );
        setIsInWishlist(isProductInWishlist);
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      }
    };

    fetchWishlistStatus();
  }, [product._id]);

  const handleToggleWishlist = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in to manage your wishlist.");
        return;
      }

      if (isInWishlist) {
        // Remove from wishlist
        await axios.post("http://localhost:5000/api/wishlist/remove", {
          userId,
          productId: product._id,
        });
        alert(`${product.name} removed from your wishlist.`);
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        await axios.post("http://localhost:5000/api/wishlist/add", {
          userId,
          productId: product._id,
        });
        alert(`${product.name} added to your wishlist.`);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("Failed to update wishlist.");
    }
  };

  return (
    <div
      key={product._id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out"
    >
      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        className="w-full h-64 object-cover cursor-pointer hover:opacity-80 transition-opacity duration-300"
        onClick={() => handleNavigateToProductDetails(product._id)}
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
          {/* Wishlist toggle button */}
          <button
            className="text-2xl cursor-pointer"
            onClick={handleToggleWishlist}
          >
            {isInWishlist ? (
              <FaHeart className="text-red-600" />
            ) : (
              <FaRegHeart className="text-gray-600" />
            )}
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-2">{product.description}</p>
        <p className="mt-2 text-lg font-semibold text-gray-900">
          Price: ₹{product.price}
        </p>
      </div>
    </div>
  );
}

export default Product;
