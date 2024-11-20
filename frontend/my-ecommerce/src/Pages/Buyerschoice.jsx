import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css"; // Import Swiper styles
import "swiper/css/pagination"; // Import Swiper pagination styles
import { Autoplay, Pagination } from "swiper/modules"; // Import Pagination module
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper and SwiperSlide
import AboutCompany from "../Components/productListcomponents/companyContent";
import axiosInstance from "./axiosInstance";

const Buyerschoice = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/api/category/get-all"
        );
        const categoriesData = response.data;

        // Fetch subcategories for each category
        const categoriesWithSubcategories = await Promise.all(
          categoriesData.map(async (category) => {
            try {
              const subcategoriesResponse = await axiosInstance.get(
                `http://localhost:5000/api/subcategory/category/${category._id}`
              );
              return {
                ...category,
                subcategories: subcategoriesResponse.data,
              };
            } catch (subError) {
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

  const handleImageClick = (subcategoryId, categoryname) => {
    navigate(`/products/${subcategoryId}`, {
      state: { categoryname: categoryname },
    });
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          Explore Our Categories
        </h1>

        {/* Categories Loop */}
        {categories.map((category, index) => (
          <div key={index} className="mb-16">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
              {category.name}
            </h3>

            {/* Swiper for Subcategories */}
            <Swiper
              autoplay={{
                delay: 3000, // Auto-slide every 3 seconds
                disableOnInteraction: false, // Allows autoplay to continue even if the user interacts
              }}
              spaceBetween={25}
              slidesPerView="auto" // Adjust how many items are visible at once
              grabCursor={true} // Allow dragging
              centeredSlides={true} // Center the active slide
              loop={true} // Loop through the slides
              modules={[Autoplay, Pagination]} // Include Autoplay and Pagination modules
              pagination={{ clickable: true }} // Enable clickable dots
            >
              {category.subcategories.map((subcategory, subIndex) => (
                <SwiperSlide
                  key={subIndex}
                  onClick={() =>
                    handleImageClick(subcategory._id, subcategory.name)
                  }
                  className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 cursor-pointer min-w-[300px] max-w-[300px] min-h-[320px] max-h-[320px]" // Fixed width for each subcategory
                >
                  {/* Subcategory Image */}
                  {subcategory.image && (
                    <img
                      src={`http://localhost:5000${subcategory.image}`}
                      alt={subcategory.name}
                      className="w-full h-56 object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
                    />
                  )}

                  <div className="p-4">
                    {/* Subcategory Name */}
                    <h3 className="text-xl font-semibold text-gray-800">
                      {subcategory.name}
                    </h3>

                    {/* Subcategory Description */}
                    <p className="text-gray-600 mt-2 text-sm">
                      {subcategory.description}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}

        {/* About Company Section */}
        <div className="mt-16">
          <AboutCompany />
        </div>
      </div>
    </div>
  );
};

export default Buyerschoice;
