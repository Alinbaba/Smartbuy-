// ======================================================
// SmartBuy Enterprise Address Routes
// ======================================================

const express = require("express");

const router = express.Router();

// ======================================================
// Import Controller
// ======================================================

const {

    addAddress,

    getMyAddresses,

    getAddressById,

    updateAddress,

    setDefaultAddress,

    deleteAddress,

    getAllAddresses

} = require("../controllers/addressController");

// ======================================================
// Import Authentication Middleware
// ======================================================

const {

    protect,

    admin

} = require("../middleware/authMiddleware");
// ======================================================
// Customer Address Routes
// ======================================================

// Add new address
router.post(
    "/",
    protect,
    addAddress
);

// Get all my addresses
router.get(
    "/my-addresses",
    protect,
    getMyAddresses
);

// Get one address
router.get(
    "/:id",
    protect,
    getAddressById
);
// ======================================================
// Update Address
// ======================================================

router.put(
    "/:id",
    protect,
    updateAddress
);


// ======================================================
// Set Default Address
// ======================================================

router.put(
    "/:id/default",
    protect,
    setDefaultAddress
);


// ======================================================
// Delete Address
// ======================================================

router.delete(
    "/:id",
    protect,
    deleteAddress
);
// ======================================================
// Admin Routes
// ======================================================

// Get all addresses
router.get(
    "/admin/all",
    protect,
    admin,
    getAllAddresses
);


// ======================================================
// Export Router
// ======================================================

module.exports = router;