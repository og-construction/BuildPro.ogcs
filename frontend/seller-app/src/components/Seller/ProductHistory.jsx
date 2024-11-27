import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Style from "../Style/ProductHistory.module.css";
import UpdateProductForm from './UpdateProductForm';

const ProductHistory = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product for viewing/editing
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
  const [activeProductId, setActiveProductId] = useState(null); 

  useEffect(() => {
    // Fetch products from the API
    axios.get('http://localhost:5000/api/seller/get-all-products', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        let data=response?.data||[]
        setProducts(data)
        handleProductClick(data[0])
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);  
    setActiveProductId(product._id);
    setIsEditMode(false); // Ensure edit mode is off when a product is selected
  };
  const handleEditProduct = (updatedProduct) => {
    if (!updatedProduct.get("_id")) {
        console.error("Product ID is undefined. Cannot update product.");
        return;
    }

    axios.put(`http://localhost:5000/api/seller/update-product/${updatedProduct.get("_id")}`, updatedProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((response) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => 
                product._id === response.data.product._id ? response.data.product : product
            )
        );
        setSelectedProduct(null);
        setActiveProductId(null);
    })
    .catch((error) => console.error("Error updating product:", error));
};


const handleDeleteProduct = (productId) => {
  if (window.confirm("Are you sure you want to delete this product?")) {
      axios.delete(`http://localhost:5000/api/seller/delete-product/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
          setProducts((prevProducts) =>
              prevProducts.filter((product) => product._id !== productId) // Ensure correct reference here
          );
          setSelectedProduct(null);
          setActiveProductId(null);
      })
      .catch((error) => console.error("Error deleting product:", error));
  }
};


  return (
    <div className={Style["sales-by-product-container"]}>
    <div className={Style["sales-by-product"]}>
      <h3>Product History</h3>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className={Style["product-table"]}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Sales</th>
              <th>Price</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} onClick={() => handleProductClick(product)}>
                <td>{product.name}</td>
                <td>{product.sales}</td>
                <td>{product.price}</td>
                <td>{product.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>

      {/* Render product details when a product is selected */}
      {selectedProduct && (
        <div className={Style["product-details"]}>
          {!isEditMode ? (
            <>
              <h4>Product Details</h4>
              {/* Display product image */}
              <div className={Style["product-info"]}>
             {/* // {selectedProduct.image && ( */}
                <img 
                  src={`http://localhost:5000${selectedProduct.image}`} 
                  alt={selectedProduct.name} 
                  style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
                  className={Style["product-image"]}
                />
              {/* )} */}
                <div className={Style["product-details-text"]}>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Sales:</strong> {selectedProduct.sales}</p>
              <p><strong>Price:</strong> {selectedProduct.price}</p>
              <p><strong>Size:</strong> {selectedProduct.size}</p>
              </div>
              </div>

              <div className={Style["product-details-text"]}>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Subcategory:</strong> {selectedProduct.subcategory}</p>
              </div>

              <div className={Style["product-buttons"]}>
              <button onClick={() => setIsEditMode(true)}>Update</button>
              <button onClick={() => handleDeleteProduct(selectedProduct._id)}>Delete</button>
              {/* <button onClick={() => setSelectedProduct(null)}>Close</button> */}
          </div>
            </>
          ) : (
            <UpdateProductForm
              products={[selectedProduct]}
              handleEditProduct={handleEditProduct}
              handleDeleteProduct={handleDeleteProduct}
            />
          )}
        </div>
      )}
    </div>
  );
};

ProductHistory.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      sales: PropTypes.number,
      price: PropTypes.number.isRequired,
      size: PropTypes.string.isRequired,
    })
  ),
};

export default ProductHistory;
