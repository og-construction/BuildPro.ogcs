import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SimilarImages.css';
import OgcsVideo from '../Components/Assets/ogcs.mp4';

const SimilarImages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize the products data to prevent re-render issues
  const products = useMemo(() => location.state?.products || [], [location.state?.products]);

  useEffect(() => {
    console.log('Products from backend:', products);
  }, [products]);

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
    <div className="similar-images-container">
      <h2>Similar Products</h2>

      <div className="video-grid-section">
        <div className="video-grid">
          <div className="video-box">
            <video controls>
              <source src={OgcsVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      <div className="similar-images-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="similar-image-box">
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
          ))
        ) : (
          <p>No similar products found.</p>
        )}
      </div>
    </div>
  );
};

export default SimilarImages;
