const express = require('express');
const { countLoggedInUsers, createAdmin, loginAdmin, getAllAdmin, getaAdmin, deleteAdmin, blockAdmin, unblockAdmin, verifyOtp, updatePassword, resetPassword, handleRefreshToken, generateRefreshToken } = require('../controller/adminCtrl');
const upload = require('../middlewares/multer');

const {
    getAllUsers,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
} = require('../controller/userCtrl'); // Import the user controller functions
const {  isAdmin, authUserMiddleware, authAdminMiddleware } = require('../middlewares/authMiddleware');
const { approveProduct, deleteSeller, blockSeller, unblockSeller, getSellerDetails, getProductsBySubcategoryId, deleteProduct, updateProduct } = require('../controller/sellerCtrl');

const router = express.Router();

// Define the routes
router.get('/user/all-users', authAdminMiddleware, getAllUsers); // Get all users
router.put('/user/update/:id',authAdminMiddleware,  updateUser); // Update user
router.delete('/user/delete/:id', authAdminMiddleware,deleteUser); // Delete user
router.put('/user/block/:id', authAdminMiddleware, blockUser); // Block user
router.put('/user/unblock/:id', authAdminMiddleware, unblockUser); // Unblock user


router.get('/totalUsers', countLoggedInUsers); // Count logged-in users
router.post('/create-admin',createAdmin)//-----------create admin
router.post('/login',loginAdmin)//---------------login
router.get('/get-all-admin',getAllAdmin)
router.get('/get-admin/:id',getaAdmin)
router.put('/update-admin',updateUser)
router.delete('/delete-admin',deleteAdmin)
router.put('/block-admin/:id',blockAdmin);
router.put('/unblock-admin/:id',unblockAdmin);
router.post('/verify-otp',verifyOtp)
router.put('/update-password',updatePassword)
router.put('/reset-password',resetPassword)
router.post('/handle-refresh-token',handleRefreshToken)
router.post('/generate-refresh-token',generateRefreshToken)

//-----------seller
router.put('/update-seller/:id', authAdminMiddleware, updatePassword); // Update user route
router.delete('/delete-seller/:id', authAdminMiddleware, deleteSeller); // Delete user route
router.put("/block-seller/:id", authAdminMiddleware, blockSeller);
router.put("/unblock-seller/:id", authAdminMiddleware, unblockSeller);
router.get('/seller-details/:id', authAdminMiddleware, getSellerDetails);


//---------------Product Route-------------------
router.put('/approve-product/:id', authAdminMiddleware, approveProduct);
router.get('/subcategory/:subcategoryId',getProductsBySubcategoryId)
router.put('/update-product/:id',authAdminMiddleware,upload.single('image'),updateProduct)
router.delete('/delete-product/:id', authAdminMiddleware, deleteProduct);




module.exports = router;
