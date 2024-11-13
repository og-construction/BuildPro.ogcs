import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
    const { subcategoryId } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/seller/subcategory/${subcategoryId}`)
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [subcategoryId]);

    return (
        <div className="product-list-container">
            <h2>Products</h2>
            <div className="product-grid">
                {products.map((product, index) => (
                    <div key={index} className="product-box">
                        <h3>{product.name}</h3>
                        <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.name}
                            style={{ width: '300px', height: 'auto' }}
                        />
                        <p>{product.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
