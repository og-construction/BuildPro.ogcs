import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    const fetchProductDetails = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/product/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch product details');
            const data = await response.json();
            setProduct(data);
            setFormData({
                name: data.name,
                price: data.price,
                size: data.size,
                quantity: data.quantity,
                description: data.description,
                specifications: data.specifications || '',
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);
    
    const handleApprove = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authorization token not found.");
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:5000/api/admin/approve-product/${productId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                alert("Product approved successfully");
                setProduct({ ...product, approved: true });
            } else {
                const responseData = await response.json();
                throw new Error(responseData.message || "Failed to approve product");
            }
        } catch (error) {
            setError(error.message);
            console.error("Approval error:", error);
        }
    };

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/admin/delete-product/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to delete product');
                alert("Product deleted successfully");
                navigate('/admin/sellers/');
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        const formDataToSend = new FormData();
    
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
    
        if (imageFile) {
            formDataToSend.append("image", imageFile);
        }
    
        try {
            const response = await fetch(`http://localhost:5000/api/admin/update-product/${productId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend,
            });
    
            if (!response.ok) throw new Error('Failed to update product');
            alert("Product updated successfully");
            setIsEditing(false);
            fetchProductDetails();
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>No details available for this product.</p>;

    return (
        <div className="product-details-container">
            <button onClick={() => navigate(-1)}>Go Back</button>
            <div className="product-header">
                <h3>Product Details for {product.name}</h3>
            </div>
            <div className="product-content">
                <div className="product-image">
                    {product.image && (
                        <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.name}
                            style={{ width: '300px', height: 'auto' }}
                        />
                    )}
                </div>
                <div className="product-info">
    {isEditing ? (
        <>
            <input
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product Name"
            />
            <input
                name="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Price"
            />
            <input
                name="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="Size"
            />
            <input
                name="quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Quantity"
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
            />
            <div>
                <h4>Specifications</h4>
                {formData.specifications.map((spec, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            placeholder="Key"
                            value={spec.key}
                            onChange={(e) => {
                                const newSpecs = [...formData.specifications];
                                newSpecs[index].key = e.target.value;
                                setFormData({ ...formData, specifications: newSpecs });
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Value"
                            value={spec.value}
                            onChange={(e) => {
                                const newSpecs = [...formData.specifications];
                                newSpecs[index].value = e.target.value;
                                setFormData({ ...formData, specifications: newSpecs });
                            }}
                        />
                    </div>
                ))}
            </div>
            <input type="file" name="image" onChange={(e) => setImageFile(e.target.files[0])} />
            <button onClick={handleUpdate}>Save Changes</button>
        </>
    ) : (
        <>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Price:</strong> ₹{product.price}</p>
            <p><strong>Size:</strong> {product.size}</p>
            <p><strong>Quantity:</strong> {product.quantity}</p>
            <p><strong>Specifications:</strong></p>
            <ul>
                {product.specifications.map((spec, index) => (
                    <li key={index}>{spec.key}: {spec.value}</li>
                ))}
            </ul>
            <p><strong>Added on:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
            <p><strong>Approved:</strong> {product.approved ? "Yes" : "No"}</p>

            {!product.approved && (
                <div>
                    <p>Approve this product?</p>
                    <button onClick={handleApprove} className="approve-button">Approve</button>
                </div>
            )}
        </>
    )}
</div>

            </div>
            <div className="product-actions">
                <button onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit Product'}</button>
                <button onClick={handleDelete} className="delete-button">Delete Product</button>
            </div>
        </div>
    );
};

export default ProductDetails;
