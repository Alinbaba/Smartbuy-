// ======================================================
// SmartBuy Inventory Routes
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// Import Inventory Controller
// ======================================================

const {

    createInventory,

    getAllInventory,

    getInventoryById,

    updateInventory,

    deleteInventory,

    restockInventory,

    reduceStock,

    reserveStock,

    releaseReservedStock

} = require("../controllers/inventoryController");


// ======================================================
// Authentication Middleware
// ======================================================

const {

    protect

} = require("../middleware/authMiddleware");
// ======================================================
// Inventory CRUD Routes
// ======================================================

// Create Inventory
router.post(
    "/",
    protect,
    createInventory
);

// Get All Inventory
router.get(
    "/",
    protect,
    getAllInventory
);

// Get Single Inventory
router.get(
    "/:id",
    protect,
    getInventoryById
);

// Update Inventory
router.put(
    "/:id",
    protect,
    updateInventory
);

// Delete Inventory
router.delete(
    "/:id",
    protect,
    deleteInventory
);
// ======================================================
// Inventory Operations
// ======================================================

// Restock Inventory
router.put(
    "/:id/restock",
    protect,
    restockInventory
);

// Reduce Stock After Order
router.put(
    "/:id/reduce",
    protect,
    reduceStock
);

// Reserve Stock
router.put(
    "/:id/reserve",
    protect,
    reserveStock
);

// Release Reserved Stock
router.put(
    "/:id/release",
    protect,
    releaseReservedStock
);


// ======================================================
// Export Router
// ======================================================

module.exports = router;