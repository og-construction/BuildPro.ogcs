import { jsPDF } from "jspdf";
import "jspdf-autotable";  // Import the autoTable plugin
export const generatePDF = (product1, product2) => {
    console.log(product1, product2);

    // Utility function to convert image URLs to Base64
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

    // Load images as Base64
    Promise.all([
        toBase64(product1.image),
        toBase64(product2.image),
    ]).then(([product1Image, product2Image]) => {
        const doc = new jsPDF();

        // Set font and title for the PDF
        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.text("Exciting Product Showdown!", 105, 20, { align: "center" });

        // Add product images above the table
        const imageYPosition = 30; // Position of the images in the PDF
        doc.addImage(product1Image, "JPEG", 90, imageYPosition, 40, 40); // Move Product 1 image right
        doc.addImage(product2Image, "JPEG", 150, imageYPosition, 40, 40); // Product 2 image

        // Create table headers
        const headers = ["Attribute", product1.name, product2.name];

        // Add rows to the table, including specifications
        const rows = [
            ["Name", product1.name, product2.name],
            ["Description", product1.description, product2.description],
            ["Price", `Rs.${product1.price}`, `Rs.${product2.price}`],
            ["Size", product1.size, product2.size],
            ["Quantity", product1.quantity, product2.quantity],
            ["Category", product1.category, product2.category],
            ["Subcategory", product1.subcategory, product2.subcategory],
            ["Seller", product1.seller ? product1.seller : "Not Available", product2.seller ? product2.seller : "Not Available"],
            ["Total Ratings", product1.totalratings, product2.totalratings],
            ["Specifications",
                product1.specifications.length > 0 ? product1.specifications.join(", ") : "Not Available",
                product2.specifications.length > 0 ? product2.specifications.join(", ") : "Not Available"
            ],
        ];
        // Table dimensions
        const tableWidth = 180;
        const x = 20;
        const y = 80; // Start the table below the images

        // Draw the table header and body
        doc.autoTable({
            startY: y,
            head: [headers],
            body: rows,
            theme: "grid",
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 60 },
                2: { cellWidth: 60 }
            },
            margin: { top: 30, left: 20 },
            tableWidth,
            styles: { overflow: "linebreak", cellWidth: "auto" },
        });

        // Save the PDF
        doc.save("product_comparison.pdf");
    }).catch((error) => {
        console.log(error,'error');
        alert("Error loading images. Please try again.");
    });
};
