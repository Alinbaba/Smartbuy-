// ======================================================
// SmartBuy Enterprise Supplier Routes
// ======================================================


const express = require("express");

const router = express.Router();


// ======================================================
// Import Supplier Controller
// ======================================================

const {

    createSupplier,

    getAllSuppliers,

    getSupplierById,

    updateSupplier,

    deleteSupplier,

    verifySupplier,

    updateSupplierStatus

} = require("../controllers/supplierController");
// ======================================================
// Authentication Middleware
// ======================================================

const {

    protect

} = require("../middleware/authMiddleware");
// ======================================================
// Create Supplier
// ======================================================

router.post(
    "/",
    protect,
    createSupplier
);


// ======================================================
// Get All Suppliers
// ======================================================

router.get(
    "/",
    protect,
    getAllSuppliers
);


// ======================================================
// Get Single Supplier
// ======================================================

router.get(
    "/:id",
    protect,
    getSupplierById
);
// ======================================================
// Update Supplier
// ======================================================

router.put(
    "/:id",
    protect,
    updateSupplier
);


// ======================================================
// Delete Supplier
// ======================================================

router.delete(
    "/:id",
    protect,
    deleteSupplier
);
// ======================================================
// Verify Supplier
// ======================================================

router.put(
    "/:id/verify",
    protect,
    verifySupplier
);
// ======================================================
// Update Supplier Status
// ======================================================

router.put(
    "/:id/status",
    protect,
    updateSupplierStatus
);
// ======================================================
// Export Supplier Router
// ======================================================

module.exports = router;
