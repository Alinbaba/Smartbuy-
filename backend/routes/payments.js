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

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");
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
protect, authorize("payments.view"),
  getPaymentAnalytics

);
// ======================================================
// Update Payment Status
// Admin / Finance Admin
// ======================================================
router.put(
    "/:id/status",
    protect,
    authorize("payments.approve"),
    updatePaymentStatus
);

// ======================================================
// Process Refund
// Admin / Finance Admin
// ======================================================

router.put(

    "/:id/refund",
  protect, authorize("payments.approve"),
  processRefund

);
// ======================================================
// Get All Payments
// Admin Finance Dashboard
// ======================================================

router.get( "/",
protect, authorize("payments.view"),
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
