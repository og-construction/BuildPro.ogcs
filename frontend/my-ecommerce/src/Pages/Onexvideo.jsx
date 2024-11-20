import React,{useEffect,useState}from 'react';
import './Onexvideo.css';
import MoscoImage from '../Components/Assets/mascot5.png';
import OgcsVideo from '../Components/Assets/all_product';
import axiosInstance from './axiosInstance';

const Onexvideo = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:5000/api/category/get-all');
        setCategories(response.data);
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
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };




  return (
    <div className='building-materials'>
      <h1 className='section-title'>Bulding  supplies at your fingertips</h1>
      <div className="onexvideo-container">
      <div className="categories-row">
        {categories.map((category) => (
          <div
            key={category._id}
            className={`category-item ${selectedCategoryId === category._id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category._id)}
          >
            {category.name}
          </div>
        ))}
      </div>

      {subcategories.length > 0 && (
        <div className="subcategories-grid">
          {subcategories.map((subcategory) => (
            <div key={subcategory._id} className="subcategory-item">
              {subcategory.image && (
                <img
                  src={`http://localhost:5000${subcategory.image}`}
                  alt={subcategory.name}
                  className="subcategory-image"
                />
              )}
              <p>{subcategory.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>

      <div className='content-container'>

        <div className='video-box'>
          <video controls>
            <source src={OgcsVideo} type="moscot5" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className='mascot-box'>
          <a href="https://www.bing.com/search?pglt=41&q=google">
            <img src={MoscoImage} alt="mascot" className='mascot-image' />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Onexvideo;
