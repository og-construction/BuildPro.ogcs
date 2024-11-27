import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductwithCompare({ product, onClickcompareProduct }) {
    const [isInWishlist, setIsInWishlist] = useState(false); // Track wishlist state
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch wishlist status for the product
        const fetchWishlistStatus = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const response = await axios.get(
                    `http://localhost:5000/api/wishlist/get-wishlist/${userId}`
                );
                const wishlistItems = response?.data?.items || [];
                const isInWishlist = wishlistItems.some(
                    (item) => item.productId._id === product._id
                );
                setIsInWishlist(isInWishlist);
            } catch (error) {
                console.error("Error fetching wishlist status:", error);
            }
        };

        fetchWishlistStatus();
    }, [product._id]);

    const handleNavigateToProductDetails = (productId) => {
        navigate(`/product/details/${productId}`);
    };

    const handleAddToWishlist = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (isInWishlist) {
                // Remove from wishlist
                await axios.post("http://localhost:5000/api/wishlist/remove", {
                    userId,
                    productId: product._id,
                });
                setIsInWishlist(false);
                alert(`${product.name} removed from your wishlist.`);
            } else {
                // Add to wishlist
                await axios.post("http://localhost:5000/api/wishlist/add", {
                    userId,
                    productId: product._id,
                });
                setIsInWishlist(true);
                alert(`${product.name} added to your wishlist.`);
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            alert("Error updating wishlist.");
        }
    };

    return (
        <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out max-w-md mx-auto"
        >
            <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="w-full h-64 object-cover cursor-pointer hover:opacity-70 transition-opacity duration-300"
                onClick={() => handleNavigateToProductDetails(product._id)}
            />
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                    <button onClick={handleAddToWishlist} className="focus:outline-none">
                        {isInWishlist ? (
                            <FaHeart className="text-red-600" size={24} />
                        ) : (
                            <FaRegHeart className="text-gray-600" size={24} />
                        )}
                    </button>
                </div>
                <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                    Price: ₹{product.price}
                </p>
                <p
                    className="mt-4 text-blue-500 cursor-pointer"
                    onClick={() => onClickcompareProduct(product)}
                >
                    Click here to download the PDF comparison
                </p>
            </div>
        </div>
    );
}

export default ProductwithCompare;
