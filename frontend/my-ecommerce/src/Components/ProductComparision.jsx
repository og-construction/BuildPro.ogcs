import React from "react";
import jsPDF from "jspdf";

// Sample product data
const productData = [
  {
    _id: "6735a5cb1fb5c71fbdf14022",
    image: "http://localhost:5000/uploads/images/1731569099948.jpg", // Replace with a Base64 encoded image URL
    name: "Hammer",
    category: "Tools",
    subcategory: "Hand Tools",
    description:
      "A durable and versatile hammer designed for construction, carpentry, and general-purpose use. This hammer features a 15 cm handle for a comfortable grip and a 5 cm head, providing excellent control and precision. Ideal for driving nails, breaking objects, or light demolition work, this tool is a must-have for any toolbox.",
    price: "125",
    size: "15x5cm",
    quantity: "100000",
    specifications: [{ key: "Material", value: "Steel" }],
  },
  {
    _id: "6735b7ea35a5ce5664c42e27",
    image: "http://localhost:5000/uploads/images/1731569099948.jpg", // Replace with a Base64 encoded image URL
    name: "Heavy Hammer",
    category: "Tools",
    subcategory: "Industrial Tools",
    description:
      "A heavy-duty hammer designed for industrial applications, weighing 11 kg. This hammer is perfect for tasks that require substantial force, such as breaking concrete, heavy demolition, or driving large stakes. Its robust construction ensures durability and long-lasting performance, making it suitable for professionals in construction and other heavy industries.",
    price: "1234",
    size: "11kg",
    quantity: "124312",
    specifications: [
      { key: "Material", value: "Forged Steel" },
      { key: "Handle", value: "Wooden" },
    ],
  },
];

// Function to generate the PDF
async function generatePDF(product1, product2) {
    const doc = new jsPDF();
    let yPosition = 20; // Starting Y position for content
    const pageHeight = doc.internal.pageSize.height;
  
    // Helper to add a new page if required
    const addPageIfNeeded = (requiredHeight) => {
      if (yPosition + requiredHeight > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
    };
  
    // Add header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Product Comparison Report", 105, yPosition, { align: "center" });
    yPosition += 10;
  
    // Add date
    const today = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text(`Date: ${today}`, 10, yPosition);
    yPosition += 10;
  
    // Add product images
    await addPageIfNeeded(60);
    doc.addImage(product1.image, "JPEG", 10, yPosition, 40, 40); // Product 1 image
    doc.addImage(product2.image, "JPEG", 100, yPosition, 40, 40); // Product 2 image
    yPosition += 50;
  
    // Add product descriptions
    doc.text("Description", 10, yPosition);
    doc.text(product1.description, 10, yPosition + 10);
    yPosition += 30;
    doc.text(product2.description, 10, yPosition);
    yPosition += 30;
  
    // Create table header
    const tableColumnHeaders = ["Attribute", "Product 1", "Product 2"];
    const tableRows = [
      ["Name", product1.name, product2.name],
      ["Category", product1.category, product2.category],
      ["Subcategory", product1.subcategory, product2.subcategory],
      ["Price", `$${product1.price}`, `$${product2.price}`],
      ["Size", product1.size, product2.size],
      ["Quantity", product1.quantity, product2.quantity],
    ];
  
    // Set table styles
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
  
    // Draw table headers
    const headerYPosition = yPosition + 20;
    const headerXPosition = 10;
    const colWidth = 60; // Column width for each column
    doc.rect(headerXPosition, headerYPosition, colWidth, 10); // Header box
    doc.text(tableColumnHeaders[0], headerXPosition + 5, headerYPosition + 6);
    doc.rect(headerXPosition + colWidth, headerYPosition, colWidth, 10); // Header box
    doc.text(tableColumnHeaders[1], headerXPosition + colWidth + 5, headerYPosition + 6);
    doc.rect(headerXPosition + colWidth * 2, headerYPosition, colWidth, 10); // Header box
    doc.text(tableColumnHeaders[2], headerXPosition + colWidth * 2 + 5, headerYPosition + 6);
  
    let rowHeight = 8;
    let rowYPosition = headerYPosition + 10;
  
    // Draw table rows
    tableRows.forEach((row) => {
      // Draw table cells with borders
      doc.rect(headerXPosition, rowYPosition, colWidth, rowHeight);
      doc.text(row[0], headerXPosition + 5, rowYPosition + 6);
  
      doc.rect(headerXPosition + colWidth, rowYPosition, colWidth, rowHeight);
      doc.text(row[1], headerXPosition + colWidth + 5, rowYPosition + 6);
  
      doc.rect(headerXPosition + colWidth * 2, rowYPosition, colWidth, rowHeight);
      doc.text(row[2], headerXPosition + colWidth * 2 + 5, rowYPosition + 6);
  
      rowYPosition += rowHeight;
    });
  
    // Add product specifications
    const specificationsTitleY = rowYPosition + 10;
    doc.text("Specifications", 10, specificationsTitleY);
    yPosition = specificationsTitleY + 10;
  
    // Ensure specifications are rendered as strings
    product1.specifications.forEach((spec, index) => {
      const specString = `${spec.key}: ${spec.value}`;
      doc.text(specString, 10, yPosition + (index * 10));
    });
    yPosition += product1.specifications.length * 10;
    
    product2.specifications.forEach((spec, index) => {
      const specString = `${spec.key}: ${spec.value}`;
      doc.text(specString, 10, yPosition + (index * 10));
    });
  
    // Add footer
    doc.setFontSize(10);
    doc.text("Generated by BuildPro", 105, pageHeight - 10, { align: "center" });
  
    doc.save("ProductComparison.pdf");
  }
  

// Component to render the comparison button
function ProductComparison() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Comparison</h1>
      <button
        onClick={() => generatePDF(productData[0], productData[1])}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Download PDF
      </button>
    </div>
  );
}

export default ProductComparison;
