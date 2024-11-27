const express = require('express');
const router = express.Router();
const { createUser, loginUserCtrl, getAllUsers, updateUser, deleteUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, verifyOtp,  } = require('../controller/userCtrl');
const {  isAdmin, authUserMiddleware, authAdminMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');
//const { updateProduct, deleteProduct, approveProduct } = require('../controller/sellerCtrl');


// Define the routes
router.post("/register", createUser);
router.post("/verify-otp", verifyOtp);

router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/password', authUserMiddleware, updatePassword)
router.post("/login", loginUserCtrl);
//router.get('/all-users', authUserMiddleware, isAdmin, getAllUsers); // Require auth and admin for all users
router.get("/refresh", handleRefreshToken);
router.get("/logout",logout)
router.put('/update-user/:id', authUserMiddleware, updateUser); // Update user route
router.delete('/delete-user/:id', authAdminMiddleware, deleteUser); // Delete user route
//router.put("/block-user/:id", authUserMiddleware, isAdmin, blockUser);
//router.put("/unblock-user/:id", authUserMiddleware, isAdmin, unblockUser);
//router.put('/update-product/:id',authUserMiddleware,isAdmin,upload.single('image'),updateProduct)
//router.delete('/delete-product/:id', authUserMiddleware, deleteProduct);
//router.put('/approve-product/:id',authUserMiddleware,isAdmin,approveProduct)

module.exports = router;
