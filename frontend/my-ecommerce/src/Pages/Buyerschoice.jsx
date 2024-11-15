import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import './Buyerschoice.css';

const Buyerschoice = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('http://localhost:5000/api/category/get-all');
                const categoriesData = response.data;

                // Fetch subcategories for each category
                const categoriesWithSubcategories = await Promise.all(
                    categoriesData.map(async (category) => {
                        try {
                            const subcategoriesResponse = await axiosInstance.get(`http://localhost:5000/api/subcategory/category/${category._id}`);
                            return {
                                ...category,
                                subcategories: subcategoriesResponse.data
                            };
                        } catch (subError) {
                          //  console.error(`Error fetching subcategories for category ${category._id}:`, subError);
                            return { ...category, subcategories: [] }; // fallback to empty array if subcategories not found
                        }
                    })
                );

                setCategories(categoriesWithSubcategories);
            } catch (error) {
                console.error("Error fetching categories and subcategories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleImageClick = (subcategoryId) => {
        navigate(`/products/${subcategoryId}`);
    };

    return (
        <div className="buyerschoice-container">
            {categories.map((category, index) => (
                <div key={index} className="category-box">
                    <h2>{category.name}</h2>
                    <div className="items-grid">
                        {category.subcategories.map((subcategory, subIndex) => (
                            <div
                                key={subIndex}
                                className="item-box"
                                onClick={() => handleImageClick(subcategory._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Display subcategory image */}
                                {subcategory.image && (
                                    <img
                                        src={`http://localhost:5000${subcategory.image}`}
                                        alt={subcategory.name}
                                        className="subcategory-image"
                                    />
                                )}
                                <p>{subcategory.name}</p>
                                <p className="item-description">{subcategory.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Buyerschoice;
