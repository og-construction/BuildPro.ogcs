const express = require('express');
const router = express.Router();
const { forgotPasswordToken, resetPassword, updatePassword, loginSellerCtrl, getAllSellers, handleRefreshToken, logout, deleteSeller, blockSeller, unblockSeller, createSeller,  verifyOtp, updateProduct, deleteProduct, getAllProducts, CreateProduct, getSellerDetails, approveProduct, getApprovedProducts, createProductWithVisibility, updateProductVisibility, getSimilarProducts, getProductsBySubcategoryId } = require('../controller/sellerCtrl');
const { isAdmin, authSellerMiddleware, authUserMiddleware, authAdminMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer')

// Sample controller function (replace this with your actual logic)
/*const createseller = (req, res) => {
    res.status(201).json({ message: "Seller created" });
}; */

// Define your role routes here
router.post("/register", createSeller);
// This sets up a POST /api/role route
router.post("/verify-otp", verifyOtp);
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/password', authSellerMiddleware, updatePassword)
router.post("/login", loginSellerCtrl);
router.get('/all-seller', authAdminMiddleware, getAllSellers); // Require auth and admin for all users
router.get("/logout",logout)
router.get("/refresh-token", handleRefreshToken);
router.put('/update-seller/:id', authSellerMiddleware, updatePassword); // Update user route
router.delete('/delete-seller/:id', authAdminMiddleware, deleteSeller); // Delete user route
router.put("/block-seller/:id", authAdminMiddleware, blockSeller);
router.put("/unblock-seller/:id", authAdminMiddleware, unblockSeller);


//------------product route---------------
// For seller-specific routes, only use authSellerMiddleware
router.post('/sell-product', authSellerMiddleware, upload.single('image'), CreateProduct);
router.get('/get-all-products', authSellerMiddleware, getAllProducts);
router.put('/update-product/:id', authSellerMiddleware, upload.single('image'), updateProduct);
router.delete('/delete-product/:id', authSellerMiddleware, deleteProduct);

// For admin/user-specific routes, use authUserMiddleware and isAdmin where needed
router.get('/all-seller', authAdminMiddleware, getAllSellers);
router.get('/seller-details/:id', authAdminMiddleware, getSellerDetails);

// Mixed routes with admin permissions and seller access
router.put('/update-seller/:id', authAdminMiddleware, updatePassword);
router.delete('/delete-seller/:id', authAdminMiddleware, deleteSeller);

// Visibility Route
router.post('/create-visibility-product', authSellerMiddleware,createProductWithVisibility);
router.put('/update--visibility-product',authSellerMiddleware,updateProductVisibility)

// visibility product logic
//router.post('/sell-product', authSellerMiddleware, upload.single('image'), createProductWithVisibility);
router.get('/get-similar-products', getSimilarProducts);
router.get('/subcategory/:subcategoryId',getProductsBySubcategoryId)


module.exports = router;
