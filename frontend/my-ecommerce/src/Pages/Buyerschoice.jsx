import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css"; // Import Swiper styles
import "swiper/css/pagination"; // Import Swiper pagination styles
import { Autoplay, Pagination } from "swiper/modules"; // Import Pagination module
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper and SwiperSlide
import AboutCompany from "../Components/productListcomponents/companyContent";
import axiosInstance from "./axiosInstance";
import styles from "../styles/customscrollbar.module.css"

const Buyerschoice = () => {
  const [slidercategories, setSliderCategories] = useState([]);
  const [boxcategories, setboxcategories] = useState([]);
  const navigate = useNavigate();

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
      setSliderCategories(categoriesWithSubcategories);
    } catch (error) {
      console.error("Error fetching categories and subcategories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageClick = (subcategoryId, categoryname) => {
    navigate(`/products/${subcategoryId}`, {
      state: { categoryname: categoryname },
    });
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div >
        {/* Header Section */}
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-12">
          Explore Our Categories
        </h1>
        {/* Box Code */}

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {boxcategories.map((category) => (
            <div
              key={category._id}
              className={`border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition p-4 overflow-auto min-h-[600px] max-h-[600px] ${styles['custom-scrollbar']}`}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {category.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {category.subcategories.map((subcategory) => (
                  <div
                    key={subcategory._id}
                    className="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-md transition p-3 flex flex-col items-center"
                    onClick={() => handleImageClick(subcategory._id)}
                  >
                    {subcategory.image ? (
                      <img
                        src={`http://localhost:5000${subcategory.image}`}
                        alt={subcategory.name}
                        className="w-20 h-20 object-cover rounded-full mb-2"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}

                    <p className="text-sm font-medium text-gray-700 text-center">
                      {subcategory.name}
                    </p>

                    {subcategory.description && (
                      <p className="text-xs text-gray-500 text-center mt-1">
                        {subcategory.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div> */}


        {/* Categories Loop */}
        {slidercategories.map((category, index) => (
          <div key={index} className="mb-16">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
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
                  className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 cursor-pointer min-w-[250px] max-w-[250px] min-h-[250px] max-h-[250px]" // Fixed width for each subcategory
                >
                  {/* Subcategory Image */}
                  {subcategory.image && (
                    <img
                      src={`http://localhost:5000${subcategory.image}`}
                      alt={subcategory.name}
                      className="w-full h-40 object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
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
