const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    changePassword,
    forgotPassword,
    verifyOTP,
    resetPassword,
    logoutUser
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOTP);

router.post("/reset-password", resetPassword);

router.post("/logout", protect, logoutUser);
// Protected Routes
router.get("/profile", protect, getProfile);

router.put("/change-password", protect, changePassword);

module.exports = router;