const Seller = require('../models/sellerModel');
const Product = require('../models/productModel')
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const category = require('./CategoryCtrl')
//const { errorHandler } = require("../middlewares/errorHandler");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require('crypto')
const jwt = require("jsonwebtoken");
//const { text } = require("body-parser");
const sendEmail = require("./emailCtrl");
//const { create } = require('domain');
//const bcrypt = require('bcrypt'); // Ensure bcrypt is imported
const slugify = require('slugify'); // Add this line
const socket = require('../socket')
const mongoose = require('mongoose')
const Category = require('../models/CategoryModel')


const createSeller = asyncHandler(async (req, res) => {
    const { name, email, mobile, password,companyName, role } = req.body;

    if (!name || !email || !mobile || !companyName || !password || !role) {
        res.status(400);
     throw new Error("All fields are required" );
    }

    const findSeller = await Seller.findOne({email});
    if(findSeller){
        res.status(400);
        throw new Error("Seller already exists");
    }
const newSeller = new Seller({name, email, mobile,companyName, password, role})

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    newSeller.verificationOtp = otp;
    newSeller.verificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    try {
        await newSeller.save();
    } catch (error) {
        console.error("Error saving seller:", error);
        throw new Error("Could not save seller");
    }


 // send otp via email 
 const data = {
    to: email,
    subject: `Verify your email`,
    text: `Your OTP is ${otp}`,
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
};
await sendEmail(data);
// TODO: send otp via sms using your sms services provider

  // TODO: Send OTP via SMS if needed

  res.status(201).json({
    message: "User registered successfully. Please verify your email and mobile.",
    id: newSeller._id,
});
});

// otp verification function
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ message: "seller not found" });

    if (seller.verificationOtp !== otp || seller.verificationExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
   
    }

    seller.isVerified = true;
    seller.verificationOtp = undefined;
    seller.verificationExpires = undefined;
    await seller.save();

    res.status(200).json({ message: "Email verified successfully" });
});

// Login Seller
const loginSellerCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const findSeller = await Seller.findOne({email});
    if (!findSeller){
        return res.status(400).json({message: "Invalid credentials"});

    }
    const isMatch = await findSeller.isPasswordMatched(password);
    if (!isMatch){
        return res.status(400).json({message: "Invalid credentials "});

    };

    // Genrate refresh token and update seller record 
    const refreshToken = generateRefreshToken(findSeller._id);
    await Seller.findByIdAndUpdate(findSeller._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });//72 hours 


    res.status(200).json({
        message: "Login successful",
        seller: {
            id: findSeller._id,
            name: findSeller.name,
            email: findSeller.email,
            mobile: findSeller.mobile,
            companyName: findSeller,
            role: findSeller.role,
        },
            token: generateToken(findSeller._id),
            refreshToken: refreshToken
        
    });
});

// handle refreshtoken 
const handleRefreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    // Find seller by refresh token
    const seller = await Seller.findOne({ refreshToken });
    if (!seller) {
        return res.status(403).json({ message: "Refresh token not valid" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Refresh token is invalid" });
        }

        // Generate a new access token
        const newAccessToken = generateToken(seller._id);
        res.status(200).json({ accessToken: newAccessToken });
    });
});

//--------------------------------
// Get All Sellers
const getAllSellers = asyncHandler(async (req, res) => {
    const sellers = await Seller.find(); // Change User to Seller
    res.status(200).json(sellers);
});

const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Ensure this is correct
    if (!refreshToken) {
        res.clearCookie('refreshToken');
        return res.sendStatus(204); // No content
    }

    await Seller.findOneAndUpdate({ refreshToken }, { refreshToken: null }); // Clear the refresh token
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    return res.sendStatus(204);
});


// Update Seller
const updateSeller = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const { name, email, mobile } = req.body;
    const seller = await Seller.findById(id); // Change User to Seller
    if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
    }

    // Only allow updating certain fields
    seller.name = name || seller.name;
    seller.email = email || seller.email;
    seller.mobile = mobile || seller.mobile;

    const updatedSeller = await seller.save();
    res.status(200).json({
        message: "Seller updated successfully",
        seller: updatedSeller,
    });
});

// Delete Seller
const deleteSeller = asyncHandler(async (req, res) => {
    const sellerId = req.params.id; // Get seller ID from request parameters
    validateMongodbId(sellerId);
    const seller = await Seller.findById(sellerId); // Change User to Seller

    if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
    }

    await Seller.findByIdAndDelete(sellerId); // Change User to Seller
    res.status(200).json({ message: "Seller deleted successfully" });
});

// Block Seller
const blockSeller = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const blockedSeller = await Seller.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        if (!blockedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        res.json({ message: "Seller Blocked" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get a Seller by ID
const getaSeler = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract seller ID from request parameters
    validateMongodbId(id); // Validate the ID

    const seller = await Seller.findById(id); // Use Seller model to find the seller
    if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(seller); // Return the found seller
});




// Unblock Seller
const unblockSeller = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const unblockedSeller = await Seller.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        if (!unblockedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        res.json({ message: "Seller UnBlocked" });
    } catch (error) {
        throw new Error(error);
    }
});

// ----------------password reset/update--------------------------
const updatePassword = asyncHandler(async (req, res) => {
    if (!req.seller) {
        return res.status(400).json({ message: "Seller not authenticated" });
    }
    const { password } = req.body; // Get the new password from the request body
    const sellerId = req.seller._id; // Extract seller ID from request
    validateMongodbId(sellerId); // Validate the MongoDB ID

    const seller = await Seller.findById(sellerId);
    if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
    }

    if (password) {
        seller.password = password; // Set the new password
        const updatedPassword = await seller.save(); // Save the updated seller
        res.json({ message: "Password updated successfully", seller: updatedPassword });
    } else {
        res.status(400).json({ message: "Password is required" });
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const seller = await Seller.findOne({ email }); // Use Seller instead of User
    if (!seller) throw new Error("Seller not found with this email");
    
    try {
        const token = await seller.createPasswordResetToken();
        await seller.save();
        const resetURL = `Hi, please use this link to reset your password. This link is valid for 10 minutes: <a href='http://localhost:5000/api/seller/reset-password/${token}'>click Here</a>`;
        
        const data = { 
            to: email,
            text: "Hey Seller",
            subject: "Forgot Password Link",
            html: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});

const resetPassword = asyncHandler(async(req, res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const seller = await Seller.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires :  {$gte: Date.now()},

    })
    if(!seller) throw new Error("Token Expired, Please try again later");
    seller.password = password;
    seller.passwordResetToken = undefined;
    seller.passwordResetExpires = undefined
    await seller.save();
    res.json(user);
})

// seller product sel logic
const processSale = async (sellerId, quantity) => {
    const seller = await Seller.findById(sellerId);
    
    if (!seller) throw new Error("Seller not found");

    // Calculate new visibility
    const newVisibility = Math.min(seller.visibility + quantity, 4); // Cap visibility at 4
    seller.visibility = newVisibility;

    await seller.save();
    return seller;
};

const approveProduct = asyncHandler(async (req, res) => {
    // Check if user is admin
    if (!req.admin || req.admin.role !== 'admin') {
        return res.status(403).json({ message: "Only admins can approve products" });
    }

    const { id } = req.params; // Product ID
    validateMongodbId(id);
    const product = await Product.findById(id);
    
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.approved = true;
    await product.save();

    res.status(200).json({ message: "Product approved successfully", product });
});


// Example of how to call the processSale function after a product sale
const CreateProduct = asyncHandler(async (req, res) => {
    const { name, description = '', price, size, quantity, specifications = [], category, subcategory } = req.body;
    const sellerId = req.seller?._id;

    if (!name || !price || !size || !quantity || !category || !sellerId) {
     //   console.error("Invalid product details or unauthorized request.");
        return res.status(400).json({ message: "Invalid product details or unauthorized request." });
    }

    try {
        const image = req.file ? `/uploads/images/${req.file.filename}` : '';
        if (!image) {
          //  console.error("Image file is required");
            return res.status(400).json({ message: "Image file is required" });
        }

        // Correctly defining and saving `newProduct`
        const newProduct = new Product({
            name,
            description,
            price,
            size,
            quantity,
            seller: sellerId,
            category,
            subcategory: subcategory || null,
            specifications,
            image,
            slug: slugify(name)
        });

        await newProduct.save();
        console.log("Product saved to database:", newProduct);

        // Double-check by querying the saved product
        const savedProduct = await Product.findById(newProduct._id);
        if (!savedProduct) {
            console.error("Product not found in the database after saving.");
        } else {
            console.log("Product found in database:", savedProduct);
        }

        // Emit notification to all connected clients
        const io = socket.getIO();
        if (io) {
            io.emit('newProduct', { message: `New product created: ${name}`, productId: newProduct._id });
        } else {
            console.error("Socket.io is not initialized.");
        }

        res.status(201).json({
            message: "Product created successfully. Waiting for admin approval.",
            product: newProduct,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    const sellerId = req.seller._id; // Assuming seller ID is available in req.seller

    const products = await Product.find({ seller: sellerId, approved: true }); // Only approved products
    res.status(200).json(products);
});
/*

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        // Step 1: Fetch approved products with required fields
        const products = await Product.aggregate([
            { $match: { approved: true } },
            { $project: { name: 1, visibilityLevel: 1, createdAt: 1, image: 1 } }
        ]);

        if (!products.length) {
            return res.status(200).json({ message: "No approved products found", products: [] });
        }

        // Step 2: Group products by visibility level
        const groupedProducts = products.reduce((acc, product) => {
            const level = (product.visibilityLevel || '1X').toUpperCase();
            if (!acc[level]) acc[level] = [];
            acc[level].push(product);
            return acc;
        }, { '1X': [], '2X': [], '3X': [], '4X': [] });

        // Step 3: Define the display count percentages for each visibility level
        const displayCounts = {
            '1X': Math.ceil(products.length * 0.1),
            '2X': Math.ceil(products.length * 0.2),
            '3X': Math.ceil(products.length * 0.3),
            '4X': Math.ceil(products.length * 0.4)
        };

        // Step 4: Function to repeat products by their visibility count and prevent null entries
        const repeatProducts = (productArray, times) => {
            if (!productArray.length) return []; // Return empty array if no products for that level
            const result = [];
            let i = 0;
            while (result.length < times) {
                result.push(productArray[i % productArray.length]);
                i++;
            }
            return result;
        };

        // Step 5: Construct the final display list based on visibility order and repetition
        const finalDisplayList = [
            ...repeatProducts(groupedProducts['4X'], displayCounts['4X']),
            ...repeatProducts(groupedProducts['3X'], displayCounts['3X']),
            ...repeatProducts(groupedProducts['2X'], displayCounts['2X']),
            ...repeatProducts(groupedProducts['1X'], displayCounts['1X'])
        ];

        res.status(200).json(finalDisplayList);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

*/


//---------------------Update Product--------------------------------------------------------
/*const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const seller = req.seller; // Ensure only the product owner or admin can update

    validateMongodbId(id);

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Ensure only the product owner (seller) or an admin can update the product
    if (!product.seller.equals(seller._id)) {
        return res.status(403).json({ message: "Not authorized to update this product" });
    }

    // Update fields if they are provided in the request
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.size = req.body.size || product.size;
    product.quantity = req.body.quantity || product.quantity;
    product.specifications = req.body.specifications || product.specifications;

    // Update the image if a new one is provided
    if (req.file) {
        product.image = `/uploads/images/${req.file.filename}`;
    }

    // Save updated product
    const updatedProduct = await product.save();
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
});

*/




const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Ensure either the admin or the seller (product owner) can update the product
    const isAdmin = req.user && req.user.role === 'admin'; // Check if request is from an admin
    const isOwner = req.seller && product.seller.equals(req.seller._id); // Check if request is from the product owner (seller)

    if (!isAdmin && !isOwner) {
        return res.status(403).json({ message: "Not authorized to update this product" });
    }

    // Update fields if provided in the request
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.size = req.body.size || product.size;
    product.quantity = req.body.quantity || product.quantity;
    product.specifications = req.body.specifications || product.specifications;

    // Check if an image file was provided
    if (req.file) {
        product.image = `/uploads/images/${req.file.filename}`;
    } else if (!product.image) {
        // If no new image was provided and product has no image, return an error
        return res.status(400).json({ message: "Image is required" });
    }

    // If the update is from a seller, mark it as needing admin approval
    if (!isAdmin) {
        product.approved = false;
    }

    const updatedProduct = await product.save();
    res.status(200).json({ 
        message: isAdmin ? "Product updated successfully" : "Product updated successfully and is pending admin approval", 
        product: updatedProduct 
    });
});



//--------------------------------visibility Logic----------------
const calculateVisibility = (level) => {
    // Define visibility percentages for each level
    const visibilityPercentages = {
        '1X': 10,
        '2X': 20,
        '3X': 30,
        '4X': 40
    };
  // Normalize level to uppercase to handle case mismatches
  const normalizedLevel = level.toUpperCase();
    // Check if level is valid
    if (!visibilityPercentages[level]) {
        throw new Error("Invalid visibility level. Choose from '1X', '2X', '3X', or '4X'.");
    }

    // Calculate visibility score based on the level
    return visibilityPercentages[level];
};
const createProductWithVisibility = asyncHandler(async (req, res) => {
    const { name, description, price, size,specifications = [],  quantity, category, subcategory,visibilityLevel = '1X', videoPriority = false } = req.body;
    const sellerId = req.seller?._id;

    if (!name || !price || !size || !quantity || !category|| !subcategory || !sellerId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const image = req.file ? `/uploads/images/${req.file.filename}` : req.body.image;
        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            size,
            quantity,
            seller: sellerId,
            category,
            subcategory, // Store subcategory ID
            specifications,
            visibilityLevel: visibilityLevel.toUpperCase(),
            //videoPriority: visibilityLevel === '3X' && videoPriority, // Set video priority only if 3X is selected
            image,
        });

        await newProduct.save();
        res.status(201).json({
            message: "Product created successfully with visibility level",
            product: newProduct
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// Update Product Visibility
const updateProductVisibility = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { visibilityLevel } = req.body;

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    try {
        // Calculate new visibility score
        const visibilityScore = calculateVisibility(visibilityLevel);
        product.visibilityLevel = visibilityLevel;
        product.visibilityScore = visibilityScore;

        const updatedProduct = await product.save();
        res.status(200).json({
            message: "Product visibility updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating visibility:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/*
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get product ID from request parameters
    validateMongodbId(id); // Validate the ID

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
});
*/

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get product ID from request parameters

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const isAdmin = req.user && req.user.role === 'admin';
    const isOwner = req.seller && product.seller.equals(req.seller._id);

    // Ensure only the product owner (seller) or an admin can delete the product
    if (!isAdmin && !isOwner) {
        return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
});


// visibility logic
// Fetch full seller details by ID
const getSellerDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id); // Ensure the ID is valid

    try {
        const seller = await Seller.findById(id)
            .select('name email mobile companyName role createdAt') // Include all required seller fields
            .populate({
                path: 'products', // Populate products related to the seller
                select: 'name description price size quantity category image createdAt' // Include the image and any other fields you need
            });

        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        res.status(200).json(seller); // Send seller details, including products with images
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve seller details", error: error.message });
    }
});

const getProductDetails = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Assuming `req.user` is populated with role info (you need an auth middleware for this)
    const isAdmin = req.user && req.user.role === 'admin';

    res.status(200).json({
        ...product.toObject(),
        isAdmin
    });
});



// Fetch all approved products
const getApprovedProducts = asyncHandler(async (req, res) => {
    try {
        const approvedProducts = await Product.find({ approved: true });
        res.status(200).json(approvedProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching approved products", error: error.message });
    }
});

// get all visible products
// Fetch similar products based on category and visibility levels
const getSimilarProducts = asyncHandler(async (req, res) => {
    const { name } = req.query;

    try {
        if (!name) {
            return res.status(400).json({ message: "Product name is required" });
        }

        const products = await Product.find({ approved: true, name: new RegExp(name, 'i') });
        console.log('product is',products)
    
        if (!products.length) {
            return res.status(200).json({ message: "No similar products found", products: [] });
        }

        // Separate products into visibility groups
        const visibilityGroups = { '1X': [], '2X': [], '3X': [], '4X': [] };
        products.forEach(product => {
            const level = product.visibilityLevel ? product.visibilityLevel.toUpperCase() : '1X';
            visibilityGroups[level].push(product);

        });
       // console.log('visibility is',visibilityGroups)

        // Define total products and percentage allocations//here need to apply total visitors
        const totalProducts = products.length;
        const displayCounts = {
            '4X': Math.ceil(totalProducts * 0.4),
            '3X': Math.ceil(totalProducts * 0.3),
            '2X': Math.ceil(totalProducts * 0.2),
            '1X': Math.ceil(totalProducts * 0.1)
        };
//console.log('product is',displayCounts)
        // Fetch products without doubling unnecessarily
        const getProductsForLevel = (productArray, count) => {
            const result = [];
            let i = 0;
            while (result.length < count) {
                if (productArray.length === 0) break;
                result.push(productArray[i % productArray.length]);
                i++;
            }
            return result;
        };

        // Build the final list by fetching products per visibility level with reduced repetition
        const finalProductList = [
            ...getProductsForLevel(visibilityGroups['4X'], displayCounts['4X']),
            ...getProductsForLevel(visibilityGroups['3X'], displayCounts['3X']),
            ...getProductsForLevel(visibilityGroups['2X'], displayCounts['2X']),
            ...getProductsForLevel(visibilityGroups['1X'], displayCounts['1X']),
        ];

        // Shuffle to randomize product distribution within the final list
        for (let i = finalProductList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [finalProductList[i], finalProductList[j]] = [finalProductList[j], finalProductList[i]];
        }
console.log('final product', finalProductList)
        res.status(200).json(finalProductList);
    } catch (error) {
        console.error("Error fetching similar products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// Get Products by Subcategory ID
const getProductsBySubcategoryId = asyncHandler(async (req, res) => {
    const { subcategoryId } = req.params;

    validateMongodbId(subcategoryId); // Validate MongoDB ID format

    try {
        const products = await Product.find({ subcategory: subcategoryId, approved: true }); // Find approved products in the subcategory
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this subcategory" });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by subcategory:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = {createSeller,resetPassword, 
    forgotPasswordToken, 
    updatePassword,blockSeller,
    unblockSeller,updateSeller,
    deleteSeller,getAllSellers,
    getaSeler,logout,loginSellerCtrl,
    handleRefreshToken, CreateProduct,
     verifyOtp, updateProduct,
     getAllProducts,deleteProduct,getSellerDetails,
     getProductDetails,approveProduct,getApprovedProducts
    ,createProductWithVisibility
, updateProductVisibility, getSimilarProducts
,getProductsBySubcategoryId}