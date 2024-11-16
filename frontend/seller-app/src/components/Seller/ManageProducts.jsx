import React, { useState, useEffect } from 'react';
import AddProductForm from './AddProductForm';
import axios from 'axios';
import Style from "../Style/ManageProducts.module.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([{
    name: '',
    description: '',
    price: '',
    size: '',
    quantity: '',
    saleMode: 'Sale By Seller',
    category: '',
    subcategory: '',
    image: null, // New field to store the selected image file
  }]);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubcategoryOption, setSelectedSubcategoryOption] = useState('');
  // const [isPopupOpen, setIsPopupOpen] = useState(false); 

  useEffect(() => {
    axios.get('http://localhost:5000/api/category/get-all')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    axios.get(`http://localhost:5000/api/subcategory/category/${category._id}`)
      .then(response => {
        setSubcategories(response.data);
      })
      .catch(error => {
        console.error("Error fetching subcategories:", error);
      });
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
    setSelectedSubcategoryOption(''); // Reset radio button selection
  };


  const handleAddProduct = () => {
    if (!selectedCategory || !selectedSubcategory) {
      alert('Please select both a category and subcategory.');
      return;
    }

    setProducts([...products, {
      name: '',
      description: '',
      price: '',
      size: '',
      quantity: '',
      saleMode: 'Sale By Seller',
      category: selectedCategory._id,
      subcategory: selectedSubcategory._id,
      image: null, // Initialize image field
    }]);

  };

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    const incompleteProducts = products.filter(product => !product.quantity);
    if (incompleteProducts.length > 0) {
      alert('Please ensure all product quantities are filled.');
      return;
    }

    // Map through products to ensure each has the category and subcategory ID before submission
    const productsToSubmit = products.map((product) => ({
      ...product,
      quantity: Number(product.quantity) || 0, // Converts quantity to a number, defaults to 0 if empty

      category: selectedCategory._id, // Ensure category ID is assigned
      subcategory: selectedSubcategory._id // Ensure subcategory ID is assigned
    }));

    Promise.all(
      productsToSubmit.map((product) => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("size", product.size);
        formData.append("quantity", product.quantity);
        formData.append("saleMode", product.saleMode);
        formData.append("category", selectedCategory._id);
        formData.append("subcategory", selectedSubcategory._id);
        formData.append("image", product.image); // Append the file
        console.log("Submitting Product Data:", product);

        return axios.post('http://localhost:5000/api/seller/sell-product', product, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",// Set content type
          },
        });
      })
    )
      .then((responses) => {
        console.log('All products stored successfully:', responses);
        alert('All products stored successfully');
        setProducts([{
          name: '',
          description: '',
          price: '',
          size: '',
          quantity: '',
          saleMode: 'Sale By Seller',
          category: selectedCategory._id,
          subcategory: selectedSubcategory._id,
          image: null, // Reset the image field
        }]);
      })
      .catch(async (error) => {
        console.error('Error storing products:', error);
        if (error.response && error.response.status === 401) {
          try {
            const refreshResponse = await axios.get('http://localhost:5000/api/seller/refresh-token', {
              withCredentials: true,
            });
            const newAccessToken = refreshResponse.data.accessToken;
            localStorage.setItem("token", newAccessToken);
            return handleSubmit();
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            alert("Session expired. Please log in again.");
          }
        } else {
          alert('Failed to store all products');
        }
      });
  };

  return (
    <div className={Style['manage-products-container']}>
      <h2>Add Products</h2>

      <div className={Style['category-list']}>
        <h3>Select Category</h3>

        {categories.map((category) => (
          <button key={category._id}
            className={selectedCategory._id === category._id ? 'selected' : ''}
            onClick={() => handleCategoryClick(category)}>

            {category.name}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className={Style['subcategory-list']}>
          <h3>Select Subcategory</h3>
          <select value={selectedSubcategory._id || ''} onChange={handleSubcategoryChange}>
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Radio Buttons for Subcategory Option */}
      {selectedSubcategory && (
        <div className={Style['radio-buttons']}>
          <h3>Choose Option</h3>
          {subcategories.map((subcategory) => (
            <div key={subcategory._id}>
              <input
                type="radio"
                id={subcategory._id}
                name="subcategory"
                value={subcategory._id}
                checked={selectedSubcategoryOption === subcategory._id}
                onChange={() => setSelectedSubcategoryOption(subcategory._id)}
              />
              <label htmlFor={subcategory._id}>{subcategory.name}</label>
            </div>
          ))}
        </div>
      )}


      {selectedCategory && selectedSubcategory && (
        <div className={Style["AddProduct"]}>
          <h3>Add New Product</h3>
          {products.map((product, index) => (
            <AddProductForm
              key={index}
              productName={product.name}
              setProductName={(value) => {
                const updatedProducts = [...products];
                updatedProducts[index].name = value;
                setProducts(updatedProducts);
              }}
              productDescription={product.description}
              setProductDescription={(value) => {
                const updatedProducts = [...products];
                updatedProducts[index].description = value;
                setProducts(updatedProducts);
              }}
              productPrice={product.price}
              setProductPrice={(value) => {
                const updatedProducts = [...products];
                updatedProducts[index].price = value;
                setProducts(updatedProducts);
              }}
              productSize={product.size}
              setProductSize={(value) => {
                const updatedProducts = [...products];
                updatedProducts[index].size = value;
                setProducts(updatedProducts);
              }}
              quantity={product.quantity} // Correct field name here
              setQuantity={(value) => {
                const updatedProducts = [...products];
                updatedProducts[index].quantity = value; // Update correctly
                setProducts(updatedProducts);
              }}

              saleMode={product.saleMode}
              setSaleMode={(value) => {
                const updatedProducts = [...products];
                updatedProducts[index].saleMode = value;
                setProducts(updatedProducts);
              }}
              image={product.image} // Pass image state
              setImage={(file) => { // Pass a function to handle image setting
                const updatedProducts = [...products];
                updatedProducts[index].image = file;
                setProducts(updatedProducts);
              }}
              selectedCategory={selectedCategory._id}
              selectedSubcategory={selectedSubcategory._id}


            />

          ))}

          <button onClick={handleAddProduct} className={Style['add-product-btn']}>Add New Product</button>

          {/* Product Form Popup */}
          {/* {isPopupOpen && (
        <div className={Style.overlay}>
          <div className={Style['product-form-popup']}>
            <h3>Add Product</h3>
            <AddProductForm 
              product={products[products.length - 1]}
              setProduct={setProducts}
            />
            <button onClick={() => setIsPopupOpen(false)} className="close-btn">Close</button>
          </div>
        </div>
      )}  */}

          <button onClick={handleSubmit} className={Style['add-product-btn']}>Submit All Products</button>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;