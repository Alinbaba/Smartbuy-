// ======================================================
// SmartBuy Wishlist Routes
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// Import Controller
// ======================================================

const {

    getMyWishlist,

    addToWishlist,

    removeFromWishlist,

    clearWishlist

} = require("../controllers/wishlistController");


// ======================================================
// Authentication Middleware
// ======================================================

const {

    protect

} = require("../middleware/authMiddleware");
// ======================================================
// Get My Wishlist
// ======================================================

router.get(
    "/",
    protect,
    getMyWishlist
);


// ======================================================
// Add Product To Wishlist
// ======================================================

router.post(
    "/add",
    protect,
    addToWishlist
);
// ======================================================
// Remove Product From Wishlist
// ======================================================

router.delete(
    "/remove/:productId",
    protect,
    removeFromWishlist
);


// ======================================================
// Clear Wishlist
// ======================================================

router.delete(
    "/clear",
    protect,
    clearWishlist
);
// ======================================================
// Export Router
// ======================================================

module.exports = router;