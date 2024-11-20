import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UpdateProductForm = ({ products = [], handleEditProduct }) => {
  const [updatedProduct, setUpdatedProduct] = useState(products[0] || {});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (products[0]) {
      setUpdatedProduct(products[0]); // Ensure the form loads with the selected product, including _id
    }
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecifications = [...(updatedProduct.specifications || [])];
    updatedSpecifications[index][field] = value;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      specifications: updatedSpecifications,
    }));
  };

  const addSpecification = () => {
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      specifications: [...(prevProduct.specifications || []), { key: '', value: '' }],
    }));
  };

  const removeSpecification = (index) => {
    const updatedSpecifications = [...(updatedProduct.specifications || [])];
    updatedSpecifications.splice(index, 1);
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      specifications: updatedSpecifications,
    }));
  };

  const handleSave = () => {
    if (!updatedProduct._id) {
      console.error("Product ID is missing in updatedProduct.");
      return;
    }
    const formData = new FormData();
    formData.append("_id", updatedProduct._id); // Use _id consistently
    Object.entries(updatedProduct).forEach(([key, value]) => {
      if (key === 'specifications') {
        formData.append(key, JSON.stringify(value)); // Serialize specifications
      } else {
        formData.append(key, value);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }

    handleEditProduct(formData); // Pass FormData with _id
  };

  const handleCancel = () => {
    setUpdatedProduct({});
  };

  return (
    <div className="update-product-section">
      <h4>Edit Product</h4>
      <table>
        <tbody>
          <tr>
            <td><strong>Product Name:</strong></td>
            <td>
              <input
                type="text"
                name="name"
                value={updatedProduct.name || ""}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Description:</strong></td>
            <td>
              <input
                type="text"
                name="description"
                value={updatedProduct.description || ""}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Price:</strong></td>
            <td>
              <input
                type="number"
                name="price"
                value={updatedProduct.price || ""}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Size:</strong></td>
            <td>
              <input
                type="text"
                name="size"
                value={updatedProduct.size || ""}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Quantity:</strong></td>
            <td>
              <input
                type="number"
                name="quantity"
                value={updatedProduct.quantity || ""}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Specifications:</strong></td>
            <td>
              {updatedProduct.specifications && updatedProduct.specifications.map((spec, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Key"
                    value={spec.key}
                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                  />
                  <button type="button" onClick={() => removeSpecification(index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={addSpecification}>Add Specification</button>
            </td>
          </tr>
          <tr>
            <td><strong>Image:</strong></td>
            <td>
              <input type="file" name="image" onChange={handleImageChange} />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

UpdateProductForm.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.number.isRequired,
      size: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      specifications: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          value: PropTypes.string,
        })
      ),
    })
  ),
  handleEditProduct: PropTypes.func.isRequired,
};

export default UpdateProductForm;
