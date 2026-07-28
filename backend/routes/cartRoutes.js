// ======================================================
// SmartBuy Cart Routes
// Handles all shopping cart API endpoints
// ======================================================


// ======================================================
// Import Packages
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// Import Cart Controller
// ======================================================
const {

    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartSummary,
    verifyCartStock

} = require("../controllers/cartController");

// ======================================================
// Import Authentication Middleware
// ======================================================

const { protect } = require("../middleware/authMiddleware");
// ======================================================
// Customer Cart Routes
// ======================================================

// Add product to cart
router.post("/add", protect, addToCart);

// Get customer's cart
router.get("/", protect, getCart);

// Update product quantity
router.put("/update", protect, updateCartItem);

// Remove one product
router.delete("/remove", protect, removeCartItem);

// Clear entire cart
router.delete("/clear", protect, clearCart);

// ======================================================
// Cart Summary
// ======================================================

router.get(
    "/summary",
    protect,
    getCartSummary
);

// ======================================================
// Verify Cart Stock
// ======================================================

router.get(
    "/verify-stock",
    protect,
    verifyCartStock
);

// ======================================================
// Export Router
// ======================================================

module.exports = router;