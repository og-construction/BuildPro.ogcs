import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import UpdateProductForm from './UpdateProductForm';

const ProductHistory = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product for viewing/editing
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode

  useEffect(() => {
    // Fetch products from the API
    axios.get('http://localhost:5000/api/seller/get-all-products', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Show details of the clicked product
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
      })
      .catch((error) => console.error("Error deleting product:", error));
  }
};


  return (
    <div className="sales-by-product">
      <h3>Sales by Product</h3>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
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

      {/* Render product details when a product is selected */}
      {selectedProduct && (
        <div className="product-details">
          {!isEditMode ? (
            <>
              <h4>Product Details</h4>
              {/* Display product image */}
              {selectedProduct.image && (
                <img 
                  src={`http://localhost:5000${selectedProduct.image}`} 
                  alt={selectedProduct.name} 
                  style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
                />
              )}
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Sales:</strong> {selectedProduct.sales}</p>
              <p><strong>Price:</strong> {selectedProduct.price}</p>
              <p><strong>Size:</strong> {selectedProduct.size}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Subcategory:</strong> {selectedProduct.subcategory}</p>
              <button onClick={() => setIsEditMode(true)}>Update</button>
              <button onClick={() => handleDeleteProduct(selectedProduct._id)}>Delete</button>
              <button onClick={() => setSelectedProduct(null)}>Close</button>
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
