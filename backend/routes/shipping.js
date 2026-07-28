// ======================================================
// SmartBuy Shipping Routes
// Enterprise Multi-Vendor Marketplace
// ======================================================


// ======================================================
// Import Packages
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// Import Shipping Controller
// ======================================================

const {

    createShipment,

    getCustomerShipments,

    getSellerShipments,

    getShipmentById,

    updateShippingStatus,

    updateTrackingInfo,

    getAllShipments

} = require("../controllers/shippingController");


// ======================================================
// Import Authentication Middleware
// ======================================================

const { protect } = require("../middleware/authMiddleware");
// ======================================================
// Create Shipment Route
// ======================================================

router.post(

    "/create",

    protect,

    createShipment

);


// ======================================================
// Customer Shipment Routes
// ======================================================

router.get(

    "/customer",

    protect,

    getCustomerShipments

);


// ======================================================
// Seller Shipment Routes
// ======================================================

router.get(

    "/seller",

    protect,

    getSellerShipments

);
// ======================================================
// Single Shipment Route
// ======================================================

router.get(

    "/:id",

    protect,

    getShipmentById

);


// ======================================================
// Update Shipping Status Route
// ======================================================

router.put(

    "/:id/status",

    protect,

    updateShippingStatus

);


// ======================================================
// Update Tracking Information Route
// ======================================================

router.put(

    "/:id/tracking",

    protect,

    updateTrackingInfo

);
// ======================================================
// Admin View All Shipments Route
// ======================================================

router.get(

    "/all",

    protect,

    getAllShipments

);


// ======================================================
// Export Router
// ======================================================

module.exports = router;