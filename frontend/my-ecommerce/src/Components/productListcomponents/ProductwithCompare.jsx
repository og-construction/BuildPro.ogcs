import axios from 'axios';
import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function ProductwithCompare({ product, onClickcompareProduct }) {
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
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                    <button
                        className="bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-pink-600 transition-colors duration-300"
                        onClick={() => handleAddToWishlist(product)}
                    >
                        <FaHeart className="text-white" />
                    </button>
                </div>
                <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                    Price: ₹{product.price}
                </p>

                {/* Added text for comparison and PDF download */}
                <p className="mt-4 text-blue-500 cursor-pointer" onClick={() => onClickcompareProduct(product)}>
                    Click here to download the PDF comparison
                </p>
            </div>
        </div>
    );
}

export default ProductwithCompare;
