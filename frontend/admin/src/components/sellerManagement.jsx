import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sellerManagement.css';

const SellerList = ({ sellers, onViewDetails }) => (
    <tbody>
        {sellers.map(seller => (
            <tr key={seller._id}>
                <td>{seller.name}</td>
                <td>{seller.email}</td>
                <td>{seller.mobile}</td>
                <td>
                    <button className="action-button view" onClick={() => onViewDetails(seller._id)}>View Details</button>
                </td>
            </tr>
        ))}
    </tbody>
);

const SellerManagement = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSellers();
    }, [navigate]);

    const fetchSellers = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/seller/all-seller', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) throw new Error('Failed to fetch sellers');
            const data = await response.json();
            setSellers(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (sellerId) => {
        navigate(`/admin/sellers/${sellerId}`);
    };
    

    if (loading) return <p>Loading sellers...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Seller Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <SellerList
                    sellers={sellers}
                    onViewDetails={handleViewDetails}
                />
            </table>
        </div>
    );
};

export default SellerManagement;
