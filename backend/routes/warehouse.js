// ======================================================
// SmartBuy Enterprise Warehouse Routes
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// Import Warehouse Controller
// ======================================================

const {

    createWarehouse,

    getAllWarehouses,

    getWarehouseById,

    updateWarehouse,

    deleteWarehouse,

    updateWarehouseStatus,

    updateWarehouseCapacity

} = require("../controllers/warehouseController");


// ======================================================
// Authentication Middleware
// ======================================================

const {

    protect

} = require("../middleware/authMiddleware");
// ======================================================
// Warehouse CRUD Routes
// ======================================================

// Create Warehouse
router.post(
    "/",
    protect,
    createWarehouse
);


// Get All Warehouses
router.get(
    "/",
    protect,
    getAllWarehouses
);


// Get Single Warehouse
router.get(
    "/:id",
    protect,
    getWarehouseById
);


// Update Warehouse
router.put(
    "/:id",
    protect,
    updateWarehouse
);


// Delete Warehouse
router.delete(
    "/:id",
    protect,
    deleteWarehouse
);
// ======================================================
// Warehouse Operations Routes
// ======================================================


// Update Warehouse Status

router.put(
    "/:id/status",
    protect,
    updateWarehouseStatus
);


// Update Warehouse Capacity

router.put(
    "/:id/capacity",
    protect,
    updateWarehouseCapacity
);
// ======================================================
// Export Warehouse Router
// ======================================================

module.exports = router;