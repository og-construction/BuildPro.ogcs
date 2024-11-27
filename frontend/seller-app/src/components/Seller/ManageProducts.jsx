import React, { useState, useEffect } from 'react';
import AddProductForm from './AddProductForm';
import axios from 'axios';

const ManageProducts = () => {
  const [specifications, setSpecifications] = useState([]);
  const [products, setProducts] = useState([{
    name: '',
    description: '',
    price: '',
    size: '',
    quantity: '',
    saleMode: 'Sale By Seller',
    category: '',
    subcategory: '',
    image: null,
    specifications: [],
  }]);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

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
    setSelectedSubcategory(''); // Reset subcategory when a new category is clicked
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
      image: null,
      specifications: [],
    }]);
  };

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    const incompleteProducts = products.filter(product => !product.quantity);
    if (incompleteProducts.length > 0) {
      alert('Please ensure all product quantities are filled.');
      return;
    }

    const productsToSubmit = products.map((product) => ({
      ...product,
      saleType: product.saleMode.trim(),
      quantity: Number(product.quantity) || 0,
      category: selectedCategory._id,
      subcategory: selectedSubcategory._id,
    }));

    Promise.all(
      productsToSubmit.map((product) => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("size", product.size);
        formData.append("quantity", product.quantity);
        formData.append("saleType", product.saleMode.trim());
        formData.append("category", selectedCategory._id);
        formData.append("subcategory", selectedSubcategory._id);
        formData.append("image", product.image);

        product.specifications.forEach((spec, index) => {
          formData.append(`specifications[${index}][key]`, spec.key);
          formData.append(`specifications[${index}][value]`, spec.value);
        });

        return axios.post('http://localhost:5000/api/seller/sell-product', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
          saleMode: 'Sale by Seller',
          category: selectedCategory._id,
          subcategory: selectedSubcategory._id,
          image: null,
          specifications: [],
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
    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 p-6">
      {/* Left Column */}
      <div className="w-full md:w-1/4 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Select Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left p-2 rounded-lg transition-colors duration-200 ${selectedCategory._id === category._id ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Select Subcategory</h3>
            <select
              value={selectedSubcategory._id || ''}
              onChange={handleSubcategoryChange}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
        {selectedCategory && selectedSubcategory && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
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
                quantity={product.quantity}
                setQuantity={(value) => {
                  const updatedProducts = [...products];
                  updatedProducts[index].quantity = value;
                  setProducts(updatedProducts);
                }}
                saleMode={product.saleMode}
                setSaleMode={(value) => {
                  const updatedProducts = [...products];
                  updatedProducts[index].saleMode = value;
                  setProducts(updatedProducts);
                }}
                image={product.image}
                setImage={(file) => {
                  const updatedProducts = [...products];
                  updatedProducts[index].image = file;
                  setProducts(updatedProducts);
                }}
                specifications={specifications}
                setSpecifications={(value) => {
                  const updatedProducts = [...products];
                  updatedProducts[index].specifications = value;
                  setSpecifications(updatedProducts);
                }}
              />
            ))}

            <button onClick={handleAddProduct} className="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Add New Product</button>
            <button onClick={handleSubmit} className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Submit All Products</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
