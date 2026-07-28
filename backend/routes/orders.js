const express = require("express");

const router = express.Router();


// ======================================================
// Import Order Controller
// ======================================================

const {

    createOrder,
    getCustomerOrders,
    getSellerOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    returnOrder,
    refundOrder,
    updatePaymentStatus,
    addTracking,
    generateInvoice,
    getOrderAnalytics

} = require("../controllers/orderController");


// ======================================================
// Authentication Middleware
// ======================================================

const { protect, authorize } = require("../middleware/authMiddleware");

// ======================================================
// Order Routes
// ======================================================


// Create new order
router.post(
    "/",
    protect,
    createOrder
);


// Customer orders
router.get(
    "/customer",
    protect,
    getCustomerOrders
);


// Seller orders
router.get(
    "/seller",
    protect,
    getSellerOrders
);

// Order analytics
router.get(
    "/analytics/dashboard",
    protect,
    authorize("admin", "super-admin"),
    getOrderAnalytics
);


// Get single order
router.get(
    "/:id",
    protect,
    getOrderById
);


// Admin get all orders
router.get(
    "/",
    protect,
    authorize("admin", "super-admin"),
    getAllOrders
);


// Update order status
router.put(
    "/:id/status",
    protect,
    updateOrderStatus
);


// Cancel order
router.put(
    "/:id/cancel",
    protect,
    cancelOrder
);


// Return order
router.put(
    "/:id/return",
    protect,
    returnOrder
);


// Refund order
router.put(
    "/:id/refund",
    protect,
    refundOrder
);


// Update payment status
router.put(
    "/:id/payment",
    protect,
    updatePaymentStatus
);


// Add tracking
router.put(
    "/:id/tracking",
    protect,
    addTracking
);


// Generate invoice
router.get(
    "/:id/invoice",
    protect,
    generateInvoice
);

module.exports = router;
