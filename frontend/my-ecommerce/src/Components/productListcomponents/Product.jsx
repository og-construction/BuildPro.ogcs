import axios from "axios";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Product({ product }) {
  let navigate = useNavigate();
  const handleNavigateToProductDetails = (productId) => {
    navigate(`/product/details/${productId}`);
  };
  const handleAddToWishlist = async (product) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        "http://localhost:5000/api/wishlist/add",
        {
          userId,
          productId: product._id,
        }
      );

      if (response.status === 200) {
        alert(`${product.name} added to your wishlist.`);
      } else {
        alert("Failed to add to wishlist.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Error adding to wishlist.");
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
        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-2">{product.description}</p>
        <p className="mt-2 text-lg font-semibold text-gray-900">
          Price: ₹{product.price}
        </p>

        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-pink-600 transition-colors duration-300"
            onClick={() => handleAddToWishlist(product)}
          >
            <FaHeart className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
