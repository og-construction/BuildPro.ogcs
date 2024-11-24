import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin

export const generatePDF = (product1, product2, product3, product4) => {
    console.log(product1, product2, product3, product4);

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

    Promise.all([
        toBase64(product1.image),
        toBase64(product2.image),
        toBase64(product3.image),
        toBase64(product4.image),
    ]).then(([product1Image, product2Image, product3Image, product4Image]) => {
        // Create a wider PDF (e.g., A4 landscape orientation)
        const doc = new jsPDF({
            orientation: "landscape", // Switch to landscape
            unit: "mm", // Measurement unit
            format: "a4", // A4 size
        });

        // Set font and title for the PDF
        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.text("Exciting Product Showdown!", 148.5, 20, { align: "center" }); // Centered on landscape A4

        // Add product images above the table
        const imageYPosition = 30; // Position of the images in the PDF
        doc.addImage(product1Image, "JPEG", 60, imageYPosition, 40, 40); // Product 1
        doc.addImage(product2Image, "JPEG", 110, imageYPosition, 40, 40); // Product 2
        doc.addImage(product3Image, "JPEG", 160, imageYPosition, 40, 40); // Product 3
        doc.addImage(product4Image, "JPEG", 220, imageYPosition, 40, 40); // Product 4

        // Create table headers
        const headers = ["Attribute", product1.name, product2.name, product3.name, product4.name];

        // Add rows to the table, including specifications
        const rows = [
            ["Name", product1.name, product2.name, product3.name, product4.name],
            ["Description", product1.description, product2.description, product3.description, product4.description],
            ["Price", `Rs.${product1.price}`, `Rs.${product2.price}`, `Rs.${product3.price}`, `Rs.${product4.price}`],
            ["Size", product1.size, product2.size, product3.size, product4.size],
            ["Quantity", product1.quantity, product2.quantity, product3.quantity, product4.quantity],
            ["Category", product1.category, product2.category, product3.category, product4.category],
            ["Subcategory", product1.subcategory, product2.subcategory, product3.subcategory, product4.subcategory],
            ["Seller", 
                product1.seller ? product1.seller : "Not Available", 
                product2.seller ? product2.seller : "Not Available",
                product3.seller ? product3.seller : "Not Available",
                product4.seller ? product4.seller : "Not Available"],
            ["Total Ratings", product1.totalratings, product2.totalratings, product3.totalratings, product4.totalratings],
            ["Specifications",
                product1.specifications.length > 0 ? product1.specifications.join(", ") : "Not Available",
                product2.specifications.length > 0 ? product2.specifications.join(", ") : "Not Available",
                product3.specifications.length > 0 ? product3.specifications.join(", ") : "Not Available",
                product4.specifications.length > 0 ? product4.specifications.join(", ") : "Not Available",
            ],
        ];

        // Draw the table
        doc.autoTable({
            startY: 80,
            head: [headers],
            body: rows,
            theme: "grid",
            columnStyles: {
                0: { cellWidth: 50 }, // Adjust column width for wider layout
                1: { cellWidth: 50 },
                2: { cellWidth: 50 },
                3: { cellWidth: 50 },
                4: { cellWidth: 50 },
            },
            margin: { top: 30, left: 10 },
            styles: { overflow: "linebreak", cellWidth: "auto" },
        });

        // Save the PDF
        doc.save("product_comparison.pdf");
    }).catch((error) => {
        console.log(error, 'error');
        alert("Error loading images. Please try again.");
    });
};
