import React from "react";
import { generatePDF } from "../utils/productcompare";

const ProductComparison = () => {
  // Hardcoded products (These would typically come from a data source or API)
  const product1 = {
    "_id": "67342bb2bcf758db25551d5d",
    "name": "hammer",
    "description": "Hammer is a tool used for driving nails, fitting parts, forging metal, and breaking up objects.",
    "price": 12,
    "size": "12",
    "quantity": 12,
    "category": "6720b343ab1e075b95501b26",
    "subcategory": "6721cd78a38df1a2e8e5f03d",
    "seller": null,
    "image": "http://localhost:5000/uploads/images/1730886431406.jpg",
    "visibilityLevel": "1X",
    "videoPriority": false,
    "slug": "hammer",
    "specifications": [],
    "approved": true,
    "totalratings": 0,
    "ratings": [],
    "createdAt": "2024-11-13T04:31:46.875Z",
    "__v": 0
  };

  const product2 = {
    "_id": "67342bb2bcf758db25551d5e",
    "name": "drill",
    "description": "A drill is a tool used for making round holes or driving fasteners, typically equipped with a rotating bit.",
    "price": 45,
    "size": "Medium",
    "quantity": 5,
    "category": "6720b343ab1e075b95501b26",
    "subcategory": "6721cd78a38df1a2e8e5f03d",
    "seller": "Tool Master",
    "image": "http://localhost:5000/uploads/images/1730886431406.jpg",
    "visibilityLevel": "1X",
    "videoPriority": true,
    "slug": "drill",
    "specifications": [
      "Power: 800W",
      "Speed: 1500 rpm",
      "Weight: 2kg"
    ],
    "approved": true,
    "totalratings": 10,
    "ratings": [
      { "rating": 4, "comment": "Great power and performance" },
      { "rating": 5, "comment": "Very durable, perfect for heavy-duty work" }
    ],
    "createdAt": "2024-11-20T06:45:00.000Z",
    "__v": 0
  };

  return (
    <div>
      <button
        onClick={() => generatePDF({ product1, product2 })}
        className="px-6 py-2 bg-blue-500 text-white rounded"
      >
        Download PDF
      </button>
    </div>
  );
};

export default ProductComparison;
