import React, { useState } from "react";

const ProductSidebar = ({
  priceOptions,
  priceRange,
  setPriceRange,
  sizeoptions,
  selectedSizes,
  handleSizeChange,
  handleResetFilters,
}) => {
  const [showMore, setShowMore] = useState(false);

  // Show only first 5 sizes initially or all sizes if showMore is true
  const displayedSizes = showMore ? sizeoptions : sizeoptions.slice(0, 5);

  const handleShowMoreToggle = () => {
    setShowMore(!showMore); // Toggle between Show More and Show Less
  };

  return (
    <aside className="w-80  rounded-lg p-6 pt-5 space-y-6">
      {/* Filter by Price Section */}
      <div className="border-b pb-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Filter by Price</h3>
        {priceOptions.map((option, index) => (
          <div key={index} className="flex items-center mb-4">
            <input
              type="radio"
              name="priceRange"
              value={index}
              checked={priceRange[0] === option.range[0] && priceRange[1] === option.range[1]}
              onChange={() => setPriceRange(option.range)}
              className="h-5 w-5 text-blue-600 focus:ring-0 mr-3"
            />
            <label className="text-lg text-gray-600">{`₹${option.label}`}</label>
          </div>
        ))}
      </div>

      {/* Filter by Size Section */}
      <div >
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Filter by Size</h3>
        {displayedSizes.map((size, index) => (
          <div key={index} className="flex items-center mb-3">
            <input
              type="checkbox"
              value={size}
              checked={selectedSizes.includes(size)}
              onChange={() => handleSizeChange(size)}
              className="h-5 w-5 text-blue-600 focus:ring-0 mr-3"
            />
            <label className="text-lg text-gray-600">{size}</label>
          </div>
        ))}
      </div>

      {/* Show More/Less Toggle */}
      <div className="flex justify-between  border-b pb-3">
        <button
          onClick={handleShowMoreToggle}
          className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
        <button
          onClick={handleResetFilters}
          className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          Reset Filters
        </button>
      </div>

    </aside>
  );
};

export default ProductSidebar;
