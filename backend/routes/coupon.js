// ======================================================
// SmartBuy Coupon Routes
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// Import Coupon Controller
// ======================================================

const {

    createCoupon,

    getAllCoupons,

    getCouponById,

    updateCoupon,

    deleteCoupon,

    validateCoupon,

    applyCoupon

} = require("../controllers/couponController");


// ======================================================
// Authentication Middleware
// ======================================================

const {

    protect

} = require("../middleware/authMiddleware");
// ======================================================
// Create Coupon
// ======================================================

router.post(
    "/",
    protect,
    createCoupon
);


// ======================================================
// Get All Coupons
// ======================================================

router.get(
    "/",
    protect,
    getAllCoupons
);


// ======================================================
// Get Single Coupon
// ======================================================

router.get(
    "/:id",
    protect,
    getCouponById
);
// ======================================================
// Update Coupon
// ======================================================

router.put(
    "/:id",
    protect,
    updateCoupon
);


// ======================================================
// Delete Coupon
// ======================================================

router.delete(
    "/:id",
    protect,
    deleteCoupon
);


// ======================================================
// Validate Coupon
// ======================================================

router.post(
    "/validate",
    protect,
    validateCoupon
);


// ======================================================
// Apply Coupon
// ======================================================

router.post(
    "/apply",
    protect,
    applyCoupon
);


// ======================================================
// Export Router
// ======================================================

module.exports = router;