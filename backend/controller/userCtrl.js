const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
//const { errorHandler } = require("../middlewares/errorHandler");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require('crypto')
const jwt = require("jsonwebtoken");
const { text } = require("body-parser");
const sendEmail = require("./emailCtrl");


// Create User
const createUser = asyncHandler(async (req, res) => {
    const { name, email, mobile, password, type, gstNumber } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !mobile || !password || !type) {
        res.status(400);
        throw new Error("All fields are required");
    }

    // Check for GST number if type is B2B
    if (type === 'B2B' && !gstNumber) {
        return res.status(400).json({ message: "GST number is required for B2B registration" });
    }

    const findUser = await User.findOne({ email });
    if (findUser) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Create the user with or without GST number based on type
    const newUser = new User({ name, email, mobile, password, type, gstNumber: type === 'B2B' ? gstNumber : undefined });

    // Generate OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.verificationOtp = otp;
    newUser.verificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await newUser.save();

    // Send OTP via email
    const data = {
        to: email,
        subject: "Verify your email",
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
    };
    await sendEmail(data);

    res.status(201).json({
        message: "User registered successfully. Please verify your email and mobile.",
        id: newUser._id,
    });
});

// OTP Verification Function

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.verificationOtp !== otp || user.verificationExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
   
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
});


// Login User
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const findUser = await User.findOne({ email });
    if (!findUser) {
        return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await findUser.isPasswordMatched(password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate refresh token and update user record
    const refreshToken = generateRefreshToken(findUser._id);
    await User.findByIdAndUpdate(findUser._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000 // 72 hours
    });

    res.status(200).json({
        message: "Login successful",
        user: {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            mobile: findUser.mobile,
            role: findUser.role
        },
        token: generateToken(findUser._id),
        refreshToken: refreshToken // Include the refresh token
    });
    
    
});

//handle refreshtoken 
const handleRefreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    // Find user by refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
        return res.status(403).json({ message: "Refresh token not valid" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Refresh token is invalid" });
        }

        // Generate a new access token
        const newAccessToken = generateToken(user._id);
        res.status(200).json({ accessToken: newAccessToken });
    });
});

//--------------------------------

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});
// Get a user
const getaUser = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    validateMongodbId(id);
})
//logout function
const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Ensure this is correct
    if (!refreshToken) throw new Error("No Refresh Token in Cookie");

    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', { httpOnly: true, secure: true });
        return res.sendStatus(204); // No content
    }

    await User.findByIdAndUpdate(user._id, { refreshToken: null }); // Clear the refresh token
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    return res.sendStatus(204);
});


// Update User
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const { name, email, mobile } = req.body;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Only allow updating certain fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;

    const updatedUser = await user.save();
    res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
    });
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id; 
    validateMongodbId(userId);
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ message: "User deleted successfully" });
});


//block user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const blockedUser = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        if (!blockedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User Blocked" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const unblockedUser = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        if (!unblockedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User UnBlocked" });
    } catch (error) {
        throw new Error(error);
    }
});
// ----------------password reset/update--------------------------
const updatePassword = asyncHandler(async (req, res) => { // Password reset/update
    const { _id } = req.user; // Extract user ID from request
    const { password } = req.body; // Get the new password from the request body
    validateMongodbId(_id); // Validate the MongoDB ID

    const user = await User.findById(_id); // Correctly use 'User' to find the user
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (password) {
        user.password = password; // Set the new password
        const updatedPassword = await user.save(); // Save the updated user
        res.json({ message: "Password updated successfully", user: updatedPassword });
    } else {
        res.status(400).json({ message: "Password is required" });
    }
});

const forgotPasswordToken = asyncHandler(async(req, res) =>{
    const {email} = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try{
        const token  = await user.createPasswordResetToken();
        await user.save();
        const resetURL = "Hi Please this link to reset your pass word. this link is valid till 10mins from now. <a href='http://localhost:5000/api/user/reset-password/${token}>click Here</a>"
     const data = { 
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        html: resetURL,
     }
      sendEmail(data);
      res.json(token)
    }catch (error){
        throw new Error(error) 
    }
})


const resetPassword = asyncHandler(async(req, res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires :  {$gte: Date.now()},

    })
    if(!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined
    await user.save();
    res.json(user);
})

// Get user profile with cart and wishlist
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params; // Assuming the user ID is passed as a route parameter

  try {
    // Fetch the user with populated cart and wishlist
    const user = await User.findById(userId)
      .populate({
        path: 'cart.items.productId', // Populate products in cart
        model: 'Product', // Assuming the model name is Product
      })
      .populate({
        path: 'wishlist.items.productId', // Populate products in wishlist
        model: 'Product', // Assuming the model name is Product
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch wishlist and cart separately if needed
    const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    // Combine user data with wishlist and cart
    const userProfile = {
      ...user.toObject(), // Convert Mongoose document to plain object
      wishlist: wishlist ? wishlist.items : [],
      cart: cart ? cart.items : [],
    };

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

module.exports = { createUser, verifyOtp, loginUserCtrl, getAllUsers,getaUser, updateUser, deleteUser, blockUser, unblockUser, handleRefreshToken,logout, updatePassword, forgotPasswordToken, resetPassword };
