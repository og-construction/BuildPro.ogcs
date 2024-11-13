import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import './AdminPage.css';
import myImage from './Assets/buillogo7.png';
import Notification from './notification';

const AdminPage = () => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [newProducts, setNewProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userRole = localStorage.getItem('role');

        if (!isAuthenticated || (userRole !== 'admin' && userRole !== 'seller')) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    const incrementNotificationCount = (product) => {
        if (product && product.name) {  // Only add valid products with a name property
            setNotificationCount((prevCount) => prevCount + 1);
            setNewProducts((prevProducts) => [...prevProducts, product]);
        }
    };
    

    const handleNotificationClick = () => {
        setShowModal(true);  // Show modal with new products
        setNotificationCount(0);  // Reset notification count after viewing
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className="navbar">
                <div className="logo">
                    <img src={myImage} alt="Admin Logo" className="logo-image" />
                </div>
                <div className="nav-items">
                    <ul>
                        <li>
                            <button onClick={handleNotificationClick}>
                                Manage Sellers
                                {notificationCount > 0 && (
                                    <span className="notification-badge">{notificationCount}</span>
                                )}
                            </button>
                        </li>
                        <li><button>Manage Users</button></li>
                    </ul>
                </div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>

            <div className="sidebar">
                <ul>
                    <li><Link to="/admin/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</Link></li>
                    <li><i className="fas fa-cog"></i> Settings</li>
                </ul>
            </div>

            <div className="main-content">
                <Outlet />
                <Notification incrementNotificationCount={incrementNotificationCount} />

                {/* Modal for displaying new products */}
                {showModal && (
    <div className="modal">
        <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h2>New Products</h2>
            {newProducts.length > 0 ? (
                <ul>
                    {newProducts.map((product, index) => (
                        <li key={index}>
                            <p><strong>Name:</strong> {product?.name || "N/A"}</p>
                            <p><strong>Description:</strong> {product?.description || "No description"}</p>
                            <p><strong>Price:</strong> ${product?.price !== undefined ? product.price : "N/A"}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No new product.</p>
            )}
        </div>
    </div>
)}

            </div>
        </div>
    );
};

export default AdminPage;
