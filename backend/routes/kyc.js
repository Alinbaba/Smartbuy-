// ======================================================
// SmartBuy KYC Routes
// Enterprise Multi-Vendor Marketplace
// ======================================================

const express = require("express");
const router = express.Router();

// ======================================================
// Import Controller
// ======================================================

const {

    submitKYC,
    getMyKYC,
    getKYCById,
    getAllKYC,
    reviewKYC,
    deleteKYC,
    getKYCAnalytics

} = require("../controllers/kycController");

// ======================================================
// Authentication Middleware
// ======================================================

const {

    protect,
    authorize

} = require("../middleware/authMiddleware.js");
// ======================================================
// Submit KYC
// Customer submits KYC
// ======================================================

router.post(
    "/submit",
    protect,
    submitKYC
);
