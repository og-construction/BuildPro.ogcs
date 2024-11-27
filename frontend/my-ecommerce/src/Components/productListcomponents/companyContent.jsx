import React from "react";

const AboutCompany = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-900">About Us</h3>

        <div className="mt-8 space-y-2">
          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Company Name:</span>
            <span className="text-gray-600">BuildPro OGCS</span>
          </div>

          {/* <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Industry:</span>
            <span className="text-gray-600">Civil Engineering Products</span>
          </div>  */}

          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Our Mission:</span>
            <span className="text-gray-600">
                            BuildPro OGCS, we provide industry-leading manufacturers and innovaƟve sellers the plaƞorm to
                            grow their businesses, offering exposure to thousands of construction companies, contractors, and
                            engineers across India
            </span>
          </div>

          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Product Range:</span>
            <span className="text-gray-600">Construction materials, heavy machinery, and other engineering solutions.</span>
          </div>

          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Our Commitment:</span>
            <span className="text-gray-600">
              Empower contractors, builders, and engineers by providing reliable and durable products.
            </span>
          </div>

          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Customer Support:</span>
            <span className="text-gray-600">
              Our customer-first approach ensures we're always here to assist with product selection, bulk purchases, and order processing.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCompany;
