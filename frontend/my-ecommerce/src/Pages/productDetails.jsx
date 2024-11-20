import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './productDetails.css';

const ProductDetails = () => {
  const { productId } = useParams(); // Fetch productId from route params
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [error, setError] = useState('');

  const userId = localStorage.getItem("userId"); // Assume userId is stored in localStorage

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/seller/details/${productId}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
          fetchSimilarProducts(data.name); // Fetch similar products using product name
        } else {
          setError(data.message || 'Failed to fetch product details');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Error fetching product details');
      }
    };

    const fetchSimilarProducts = async (productName) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/seller/get-similar-products?name=${encodeURIComponent(
            productName
          )}`
        );
        setSimilarProducts(response.data);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleAddToWishlist = async () => {
    try {
      await axios.post(`http://localhost:5000/api/wishlist/add`, {
        userId,
        productId,
      });
      alert('Product added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist');
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post(`http://localhost:5000/api/cart/add-to-cart`, {
        userId,
        items: [{ productId, quantity: 1 }],
      });
      alert(`${product.name} added to cart`);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const generateComparison = (similarProduct) => {
    if (!product || !product.specifications?.length || !similarProduct.specifications?.length) {
      return "No detailed comparison available.";
    }

    const comparison = product.specifications.map((spec) => {
      const match = similarProduct.specifications.find((sp) => sp.key === spec.key);
      if (match) {
        if (match.value === spec.value) {
          return `${spec.key} is the same as the main product (${spec.value}).`;
        } else {
          return `${spec.key} differs: Main product (${spec.value}), Similar product (${match.value}).`;
        }
      } else {
        return `${spec.key} is not available in the similar product.`;
      }
    });

    return comparison.join(" ");
  };

  return (
    <div className="product-details-container">
      {error && <p className="error">{error}</p>}
      {product ? (
        <>
          <div className="product-details">
            <div className="details-left">
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="product-image"
              />
            </div>
            <div className="details-right">
              <h1 className="product-name">{product.name}</h1>
              <h5 className="product-price">Price: ${product.price}</h5>
              <p className="product-quantity">
                Quantity: {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
              </p>
              <p className="product-size">Size: {product.size}</p>
              <p className="product-description">{product.description}</p>
              <div className="action-buttons">
                <button className="wishlist-button" onClick={handleAddToWishlist}>
                  Add to Wishlist
                </button>
                <button className="cart-button" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="product-specifications-container">
            <h3>Specifications:</h3>
            {product.specifications?.length > 0 ? (
              <ul>
                {product.specifications.map((spec, index) => (
                  <li key={index}>
                    <strong>{spec.key}:</strong> {spec.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No specifications available.</p>
            )}
          </div>
          <div className="similar-products-container">
            <h3>Similar Products</h3>
            {similarProducts.length > 0 ? (
              <div className="similar-products-grid">
                {similarProducts.map((similarProduct) => (
                  <div key={similarProduct._id} className="similar-product-card">
                    <Link to={`/product/${similarProduct._id}`}>
                      <img
                        src={`http://localhost:5000${similarProduct.image}`}
                        alt={similarProduct.name}
                        className="similar-product-image"
                      />
                    </Link>
                    <div className="similar-product-info">
                      <Link to={`/product/${similarProduct._id}`} className="similar-product-name">
                        {similarProduct.name}
                      </Link>
                      <p className="similar-product-price">Price: ${similarProduct.price}</p>
                      <p className="similar-product-comparison">
                        {generateComparison(similarProduct)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No similar products found.</p>
            )}
          </div>
        </>
      ) : (
        !error && <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetails;
