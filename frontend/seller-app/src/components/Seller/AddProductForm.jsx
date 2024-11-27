import React from 'react';
import Style from "../Style/AddProductForm.module.css";


const AddProductForm = ({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  productPrice,
  setProductPrice,
  productSize,
  setProductSize,
  quantity,
  setQuantity,
  saleMode,
  setSaleMode,
  image,
  setImage,
  selectedCategory,
  selectedSubcategory,
  specifications = [], // Default to empty array
  setSpecifications,
}) => {
   // Add function to handle adding a new specification field
   const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  
  // Add function to handle updating a specification key or value
  const updateSpecification = (index, field, value) => {
    const updatedSpecifications = specifications.map((spec, idx) =>
      idx === index ? { ...spec, [field]: value } : spec
    );
    setSpecifications(updatedSpecifications);
  };

  // Add function to remove a specification field
  const removeSpecification = (index) => {
    const updatedSpecifications = specifications.filter((_, idx) => idx !== index);
    setSpecifications(updatedSpecifications);
  };

  return (
    <div className={Style.addProductForm}>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Enter product name"
      />
      <input
        type="text"
        value={productDescription}
        onChange={(e) => setProductDescription(e.target.value)}
        placeholder="Enter description"
      />
      <input
        type="number"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        placeholder="Enter price"
      />
      <input
        type="text"
        value={productSize}
        onChange={(e) => setProductSize(e.target.value)}
        placeholder="Enter size"
      />
      <input
        type="text"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Enter quantity"
      />
     <select value={saleMode} onChange={(e) => setSaleMode(e.target.value)}>
  <option value="Sale By Seller">Sale by Seller</option>
  <option value="Sale By OGCS">Sale by OGCS</option>
</select>

      {/* Image upload input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <div>
        <p>Category: {selectedCategory?._id}</p>
        <p>Subcategory: {selectedSubcategory?._id}</p>
      </div>

      <h4>Specifications</h4>
      {specifications.map((spec, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Key"
            value={spec.key}
            onChange={(e) => updateSpecification(index, 'key', e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={spec.value}
            onChange={(e) => updateSpecification(index, 'value', e.target.value)}
          />
          <button type="button" onClick={() => removeSpecification(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addSpecification}>
        Add Specification
      </button>
    </div>
  );
};

export default AddProductForm;