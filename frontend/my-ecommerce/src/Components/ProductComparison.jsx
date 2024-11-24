import React, { useEffect, useRef, useState } from "react";
import Product from "./productListcomponents/Product";
import { generatePDF } from "../utils/productcompare";
import { showErrorToast } from "../utils/toaster";

function ProductComparison({ data }) {
  const [featureColumnWidth, setFeatureColumnWidth] = useState(0);
  const featureColumnRef = useRef(null);

  useEffect(() => {
    if (featureColumnRef.current) {
      const width = featureColumnRef.current.offsetWidth;
      setFeatureColumnWidth(width);
    }
  }, []);

  let onClickcompareProduct = (productsToCompare) => {
    if (Array.isArray(productsToCompare) && productsToCompare.length > 0) {
      const updatedProducts = productsToCompare.map((product) => {
        let updatedProduct = { ...product };
        updatedProduct.image = `http://localhost:5000${updatedProduct.image}`;
        return updatedProduct;
      });
      generatePDF(...updatedProducts);
    } else {
      showErrorToast("You must provide at least one product to compare.");
    }
  };

  const gridCols =
    data.length === 4
      ? "grid-cols-4"
      : data.length === 3
      ? "grid-cols-3"
      : data.length === 2
      ? "grid-cols-2"
      : "grid-cols-1";

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 text-center">
        <p className="text-2xl font-bold text-gray-800 mb-4">
          Compare with similar items
        </p>
      </div>

      {/* Products Section */}
      <div
        className={`grid overflow-x-auto ${gridCols} gap-8 mb-8`}
        style={{ paddingLeft: featureColumnWidth }}
      >
        {data.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>

      {/* Comparison Table Section */}
      <div
        onClick={() => onClickcompareProduct(data)}
        className="mb-3 cursor-pointer text-right text-indigo-600 hover:text-indigo-800 underline font-semibold text-sm transition duration-300 ease-in-out"
      >
        Download Comparison
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="table-auto w-full border-collapse text-left text-sm" style={{ tableLayout: "fixed" }}>
          <thead className="bg-indigo-600 text-white">
            <tr>
              {/* Fixed width for Feature column */}
              <th
                ref={featureColumnRef}
                className="border border-gray-300 px-6 py-3 font-semibold w-[150px]"
              >
                Feature
              </th>

              {/* Dynamically distribute the rest of the columns equally */}
              {data.map((product, index) => (
                <th
                  key={product._id}
                  className="border border-gray-300 px-6 py-3 font-semibold"
                  style={{ width: `${100 / data.length}%` }}
                >
                  {product.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[ 
              ["Description", ...data.map((p) => p.description)],
              ["Price", ...data.map((p) => `Rs. ${p.price}`)],
              ["Size", ...data.map((p) => p.size)],
              ["Quantity", ...data.map((p) => p.quantity)],
              ["Category", ...data.map((p) => p.category)],
              ["Subcategory", ...data.map((p) => p.subcategory)],
              ["Seller", ...data.map((p) => p.seller || "Not Available")],
              [
                "Specifications",
                ...data.map((p) =>
                  p.specifications.length
                    ? p.specifications
                        .map((spec) => `${spec.key}: ${spec.value}`)
                        .join(", ")
                    : "Not Available"
                ),
              ],
              ["Total Ratings", ...data.map((p) => p.totalratings)],
            ].map((row, index) => {
              return (
                <tr key={index} className="bg-white hover:bg-gray-50">
                  {row.map((cell, cellIndex) => {
                    return (
                      <td
                        key={cellIndex}
                        className={`border border-gray-300 px-6 py-3 ${
                          cellIndex === 0 ? "font-medium text-gray-700" : ""
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductComparison;
