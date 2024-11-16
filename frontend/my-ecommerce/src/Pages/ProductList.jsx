import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const ProductList = () => {
    const { subcategoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [sellerDetails, setSellerDetails] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/subcategory/${subcategoryId}`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [subcategoryId]);

    const handleNavigateToProductDetails = (productId) => {
        navigate(`/product/details/${productId}`); // Ensure this path matches your route configuration
    };
    

    const handleProceedCheckout = (product) => {
        if (product.saleType === "Sale By Seller") {
            const confirmMessage = "This product is sold directly by the seller. Do you wish to proceed to view seller details?";
            const userConfirmed = window.confirm(confirmMessage); // Display confirmation message
            if (userConfirmed) {
                setSellerDetails(product.seller); // Set the seller details
                setIsModalVisible(true); // Show modal with seller details
            } else {
                // User canceled, do nothing
                return;
            }
        } else if (product.saleType === "Sale By OGCS") {
            navigate('/cart', { state: { product } }); // Navigate to checkout for Sale By OGCS
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSellerDetails(null);
    };

    const handleAddToWishlist = async (product) => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await axios.post('http://localhost:5000/api/wishlist/add', {
                userId,
                productId: product._id,
            });

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
        <div className="product-list-container">
            <h2>Products</h2>
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product._id} className="product-box">
                        <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.name}
                            className="clickable-image"
                            onClick={() => handleNavigateToProductDetails(product._id)} // Navigate to product details on image click
                        />
                        <h3>{product.name}</h3>
                        <p className="price">Price: {product.price}</p>
                        <p className="description">{product.description}</p>
                        <button
                            className="add-to-wishlist"
                            onClick={() => handleAddToWishlist(product)}
                        >
                            <FontAwesomeIcon icon={faHeart} /> Add to Wishlist
                        </button>
                        <button
                            className="proceed-checkout"
                            onClick={() => handleProceedCheckout(product)} // Trigger modal on "Proceed to Checkout"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                ))}
            </div>

            {isModalVisible && sellerDetails && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Seller Information</h2>
                        <p><strong>Name:</strong> {sellerDetails.name}</p>
                        <p><strong>Company:</strong> {sellerDetails.companyName}</p>
                        <p><strong>Mobile:</strong> {sellerDetails.mobile}</p>
                        <p><strong>Address:</strong> {sellerDetails.address}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
