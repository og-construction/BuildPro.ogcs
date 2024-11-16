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
  quantity, // Updated to quantity
  setQuantity, // Updated to setQuantity
  saleMode,
  setSaleMode,
  image, // Accept image prop
  setImage, // Function to handle image setting
  selectedCategory,
  selectedSubcategory,
  //setImage // New function to handle image upload
}) => {
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
        value={quantity} // Updated to quantity
        onChange={(e) => setQuantity(e.target.value)} // Updated to setQuantity
        placeholder="Enter quantity"
      />
      <select value={saleMode} onChange={(e) => setSaleMode(e.target.value)}>
        <option value="Sale By Seller">Sale By Seller</option>
        <option value="Sale By OGCS">Sale By OGCS</option>
      </select>
     {/* Image upload input */}
     <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])} // Pass the file to the parent
      />



      <div>
        <p>Category: {selectedCategory?._id}</p>
        <p>Subcategory: {selectedSubcategory?._id}</p>
      </div>
    </div>
  );
};

export default AddProductForm;
