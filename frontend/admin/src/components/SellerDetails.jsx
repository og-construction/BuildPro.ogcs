import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SellerDetails.css';

const SellerDetails = () => {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSellerDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:5000/api/admin/seller-details/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch seller details');
                const data = await response.json();
                setSeller(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSellerDetails();
    }, [id]);

    const handleDeleteSeller = async () => {
        const token = localStorage.getItem('token');
        const confirmed = window.confirm("Are you sure you want to delete this seller?");
       if (confirmed){
        try {
            const response = await fetch(`http://localhost:5000/api/admin/delete-seller/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                alert("Seller deleted successfully");
                navigate('/admin/sellers');
            } else {
                throw new Error("Failed to delete seller");
            }
        } catch (error) {
            console.error(error);
        }
    };
    }
    const handleBlockSeller = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/seller/block-seller/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                alert("Seller blocked successfully");
                setSeller({ ...seller, isBlocked: true });
            } else {
                throw new Error("Failed to block seller");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnblockSeller = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/seller/unblock-seller/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                alert("Seller unblocked successfully");
                setSeller({ ...seller, isBlocked: false });
            } else {
                throw new Error("Failed to unblock seller");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <p>Loading seller details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!seller) return <p>No details available for this seller.</p>;

    return (
        <div className="seller-details-container">
            <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
            <div className="seller-header">
                <h3>Seller Details: {seller.name}</h3>
                <p><strong>Company:</strong> {seller.companyName}</p>
            </div>
            <div className="seller-info">
                <p><strong>Email:</strong> {seller.email}</p>
                <p><strong>Mobile:</strong> {seller.mobile}</p>
                <p><strong>Role:</strong> {seller.role}</p>
                <p><strong>Joined on:</strong> {new Date(seller.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {seller.isBlocked ? "Blocked" : "Active"}</p>
            </div>

            <div className="seller-actions">
                <button onClick={handleDeleteSeller} className="delete-button">Delete Seller</button>
                {seller.isBlocked ? (
                    <button onClick={handleUnblockSeller} className="unblock-button">Unblock Seller</button>
                ) : (
                    <button onClick={handleBlockSeller} className="block-button">Block Seller</button>
                )}
            </div>

            <h4>Products:</h4>
            <ul className="product-list">
                {seller.products.map(product => (
                    <li key={product._id} className="product-item">
                        <div className="product-info">
                            <p><strong>Name:</strong> {product.name}</p>
                            <p><strong>Description:</strong> {product.description}</p>
                            <p><strong>Price:</strong>₹{product.price}</p>
                            {product.image && (
                                <div className="product-image">
                                    <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                                </div>
                            )}
                            <button onClick={() => navigate(`/admin/product/${product._id}`)} className="view-details-button">
                                View Product Details
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SellerDetails;
