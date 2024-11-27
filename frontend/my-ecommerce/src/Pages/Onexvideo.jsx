import React, { useEffect, useState } from 'react';
import MoscoImage from '../Components/Assets/mascot5.png';
import OgcsVideo from '../Components/Assets/all_product';
import axiosInstance from './axiosInstance';
import { useNavigate } from "react-router-dom";

const Onexvideo = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  let navigate = useNavigate()
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:5000/api/category/get-all');
        const allCategories = response?.data || [];
        setCategories(allCategories.slice(0, 10)); // Take only the first 10 categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);


  const handleCategoryClick = async (categoryId) => {
    setSelectedCategoryId(categoryId);

    try {
      const response = await axiosInstance.get(`http://localhost:5000/api/subcategory/category/${categoryId}`);
      setSubcategories(response?.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };
  const handleImageClick = (subcategoryId, categoryname) => {
    navigate(`/products/${subcategoryId}`, {
      state: { categoryname: categoryname },
    });
  };


  return (
    <div className="bg-gray-100 p-6 pt-12">
      <h1 className="text-3xl font-bold text-center mb-8">Building Supplies at Your Fingertips</h1>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${selectedCategoryId === category._id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
              } hover:bg-blue-500 hover:text-white transition`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6 cursor-pointer">
          {subcategories.map((subcategory) => (
            <div
              key={subcategory._id}
              onClick={() =>
                handleImageClick(subcategory._id, subcategory.name)
              }
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {subcategory.image && (
                <img
                  src={`http://localhost:5000${subcategory.image}`}
                  alt={`img not foung of ${subcategory.name}`}
                  className="w-full min-h-32 max-h-32 object-cover"
                />
              )}
              <p className="p-4 text-center text-gray-800 font-medium">{subcategory.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Content Section */}
      <div className="mt-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Video */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <video controls className="w-96 h-auto">
            <source src={OgcsVideo} type="moscot5" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Mascot */}
        <div>
          <a href="https://www.bing.com/search?pglt=41&q=google">
            <img
              src={MoscoImage}
              alt="mascot"
              className="w-40 h-40 lg:w-60 lg:h-60 object-contain hover:scale-105 transition"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Onexvideo;
