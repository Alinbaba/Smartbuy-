// ======================================================
// SmartBuy Payment Routes
// Enterprise Multi-Vendor Marketplace
// ======================================================


// ======================================================
// Import Packages
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// Import Payment Controller
// ======================================================

const {

    createPayment,
    verifyPayment,
    getCustomerPayments,
    getSellerPayments,
    getPaymentById,
    updatePaymentStatus,
    getAllPayments,
    processRefund,
    getPaymentAnalytics

} = require("../controllers/paymentController");


// ======================================================
// Authentication Middleware
// ======================================================

const { protect, authorize } = require("../middleware/authMiddleware");
// ======================================================
// Create Payment
// Customer creates payment for an order
// ======================================================

router.post(

    "/create",

    protect,

    createPayment

);


// ======================================================
// Verify Payment
// Payment gateway confirmation
// ======================================================

router.put(

    "/verify",

    protect,

    verifyPayment

);


// ======================================================
// Get Customer Payments
// ======================================================

router.get(

    "/customer",

    protect,

    getCustomerPayments

);


// ======================================================
// Get Seller Payments
// ======================================================

router.get(

    "/seller",

    protect,

    getSellerPayments

);

// ======================================================
// Payment Analytics
// Admin Finance Statistics
// ======================================================

router.get(

    "/analytics/dashboard",
protect, authorize("admin", "super-admin"),
  getPaymentAnalytics

);
// ======================================================
// Update Payment Status
// Admin / Finance Admin
// ======================================================
router.put(
    "/:id/status",
    protect,
    authorize("admin", "super-admin"),
    updatePaymentStatus
);

// ======================================================
// Process Refund
// Admin / Finance Admin
// ======================================================

router.put(

    "/:id/refund",
  protect, authorize("admin", "super-admin"),
  processRefund

);
// ======================================================
// Get All Payments
// Admin Finance Dashboard
// ======================================================

router.get( "/",
protect, authorize("admin", "super-admin"),
 getAllPayments

);
// ======================================================
// Get Single Payment
// Customer, Seller, Admin Access
// ======================================================
router.get(
    "/:id",
    protect,
    getPaymentById
);

// ======================================================
// Export Router
// ======================================================

module.exports = router;
