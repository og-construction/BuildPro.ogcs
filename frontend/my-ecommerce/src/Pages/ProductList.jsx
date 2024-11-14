import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';
import {useNavigate} from 'react-router-dom';

const ProductList = () => {
    const { subcategoryId } = useParams();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); // initialize navigate hook

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/subcategory/${subcategoryId}`);
                console.log(response.data); // Add this line
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            
 
        };
        

        fetchProducts();
    }, [subcategoryId]);
    const handleCheckout = (product) => {
        navigate('/Cart', { state: { product } });
      };
    
      const handleAddToWishlist = (product) => {
        const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const updatedWishlist = [...existingWishlist, product];
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        navigate("/wishlist");
      };
    
    return (
        <div className="product-list-container">
            <h2>Products</h2>
            <div className="product-grid">
                {products.map((product, index) => (
                    <div key={index} className="product-box">
                        <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.name}
                            onClick={() => handleCheckout(product)}
                            className="clickable-image"

                        />
                        <h3>{product.name}</h3>
                        <p className="price">{product.price}</p>
                        <p className="description">{product.description}</p>
              <button className="add-to-cart" onClick={() => handleAddToWishlist(product)}>
              Add to Cart
              </button>

                    </div>
                    
                )
                )}
            </div>
        </div>
    );
};

export default ProductList;
