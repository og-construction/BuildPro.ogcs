// ProductList.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Product from "../Components/productListcomponents/Product";
import ProductSidebar from "../Components/productListcomponents/ProductSidebar";
import { showErrorToast } from "../utils/toaster";
import ProductcategoryDrawer from "../Components/productListcomponents/ProductcategoryDrawer";

const ProductList = () => {
  const { subcategoryId } = useParams();
  const location = useLocation();
  const { categoryname } = location.state || {};
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sizeoptions, setsizeoptions] = useState([]);

  const priceOptions = [
    { label: "0 to 500", range: [0, 500] },
    { label: "500 to 1500", range: [500, 1500] },
    { label: "1500 to 3000", range: [1500, 3000] },
    { label: "3000 to 5000", range: [3000, 5000] },
    { label: "5000 and above", range: [5000, 1000000] },
  ];

  const fetchProducts = async () => {
    setProducts([]);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/subcategory/${subcategoryId}`
      );
      let data = response?.data || [];
      setProducts(data);
      let sizearray = data.map((p) => p.size);
      setsizeoptions(sizearray);
      setFilteredProducts(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again later.";
      showErrorToast(errorMessage);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [subcategoryId]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSize =
        selectedSizes.length === 0 || selectedSizes.includes(product.size);
      return matchesPrice && matchesSize;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [priceRange, selectedSizes, products]);

  const handleResetFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSelectedSizes) =>
      prevSelectedSizes.includes(size)
        ? prevSelectedSizes.filter((s) => s !== size)
        : [...prevSelectedSizes, size]
    );
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mx-auto px-1 py-6">
      <ProductcategoryDrawer />
      {/* Show product count */}

      <div className="flex gap-5">
        {/* Sidebar */}
        <ProductSidebar
          priceOptions={priceOptions}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sizeoptions={sizeoptions}
          selectedSizes={selectedSizes}
          handleSizeChange={handleSizeChange}
          handleResetFilters={handleResetFilters}
        />

        {/* Product List */}
        <div className="w-3/4">
          <p className="text-gray-600 text-sm mb-4 text-left">
            {`Showing ${indexOfFirstProduct + 1}–${Math.min(
              indexOfLastProduct,
              filteredProducts.length
            )} of ${filteredProducts.length} results for ${categoryname}`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6">
            <button
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-6 py-2 text-lg text-gray-700 bg-gray-100 rounded-md">
              {`${currentPage} of ${totalPages}`}
            </span>
            <button
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
