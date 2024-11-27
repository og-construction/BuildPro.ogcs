import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin

export const generatePDF = (...products) => {
  const toBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Enable CORS if the image is hosted externally
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
      img.src = url;
    });

  // Dynamically load product images based on the products array length
  Promise.all(products.map((product) => toBase64(product.image)))
    .then((productImages) => {
      const doc = new jsPDF({
        orientation: "landscape", // Switch to landscape
        unit: "mm",
        format: "a4", // A4 size
      });

      const pageWidth = doc.internal.pageSize.width;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Exciting Product Showdown!", pageWidth / 2, 20, {
        align: "center",
      });

      let imageYPosition = 30;
      let imageWidth = 40;
      let spacing = 85;
      let xPos = 110;
      let addspace = 60;
      let cellWidth = 70;
      // Adjust positioning based on number of products
      if (products.length === 4) {
        spacing = 15; // Smaller spacing between images
        cellWidth = 53;
      } else if (products.length === 3) {
        spacing = 35; // Medium spacing for 3 products
        cellWidth = 70;
      } else if (products.length === 2) {
        xPos = 70; // Adjust starting X position for 2 products
        spacing = 85; // Larger spacing for 2 products
        cellWidth = 105;
      } else if (products.length === 1) {
        cellWidth = "auto";
        xPos = 110; // Position for 1 product
        spacing = 85; // Larger spacing for 1 product
      }

      // Add images dynamically based on number of products
      products.forEach((product, index) => {
        xPos = addspace + index * (imageWidth + spacing); // Dynamically calculate X position
        doc.addImage(
          productImages[index],
          "JPEG",
          xPos,
          imageYPosition,
          imageWidth,
          imageWidth
        );
      });

      // Table headers
      const headers = ["Attribute", ...products.map((product) => product.name)];

      // Table rows
      const rows = [
        ["Name", ...products.map((product) => product.name)],
        ["Description", ...products.map((product) => product.description)],
        ["Price", ...products.map((product) => `Rs.${product.price}`)],
        ["Size", ...products.map((product) => product.size)],
        ["Quantity", ...products.map((product) => product.quantity)],
        ["Category", ...products.map((product) => product.category)],
        ["Subcategory", ...products.map((product) => product.subcategory)],
        [
          "Seller",
          ...products.map((product) => product.seller || "Not Available"),
        ],
        ["Total Ratings", ...products.map((product) => product.totalratings)],
        [
          "Specifications",
          ...products.map((product) =>
            product.specifications.length
              ? product.specifications
                  .map((spec) => `${spec.key}: ${spec.value}`)
                  .join("\n") // Each specification in a new line
              : "Not Available"
          ),
        ],
      ];

      // Define column width styles
      const columnStyles = {};
      columnStyles[0] = { cellWidth: "auto" }; // First column (Attribute) will be dynamic
      // For the remaining columns, set a fixed width
      for (let i = 1; i < headers.length; i++) {
        columnStyles[i] = { cellWidth: cellWidth }; // Fixed width for other columns
      }

      // Draw table and center it
      doc.autoTable({
        startY: imageYPosition + 50,
        head: [headers],
        body: rows,
        theme: "grid",
        styles: { overflow: "linebreak", halign: "left" },
        margin: {
          top: 30,
          left: (pageWidth - 240) / 2,
          right: (pageWidth - 240) / 2,
        }, // Centered table
        tableWidth: "auto",
        columnStyles, // Apply the dynamic and fixed column widths
      });

      // Save PDF
      doc.save("product_comparison.pdf");
    })
    .catch((error) => {
      console.error(error);
      alert("Error loading images. Please try again.");
    });
};
