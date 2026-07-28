const express = require("express");

const router = express.Router();

const {

    createTransaction,
    getTransaction,
    getMyTransactions,
    getAllTransactions,
    updateTransactionStatus,
    deleteTransaction,
    getTransactionSummary,
    getTransactionReport

} = require("../controllers/transactionController");

const {

    protect,
    authorize

} = require("../middleware/authMiddleware");
// =====================================
// User Routes
// =====================================

// Create Transaction
router.post("/", protect, createTransaction);

// Get My Transactions
router.get("/my-transactions", protect, getMyTransactions);

// Transaction Summary
router.get("/summary", protect, getTransactionSummary);
// =====================================
// Admin Routes
// =====================================

// Get All Transactions
router.get(
    "/",
    protect,
    authorize("admin"),
    getAllTransactions
);

// Get Transaction Report
router.get(
    "/report",
    protect,
    authorize("admin"),
    getTransactionReport
);

// Update Transaction Status
router.put(
    "/:id/status",
    protect,
    authorize("admin"),
    updateTransactionStatus
);

// Soft Delete Transaction
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteTransaction
);

// Get Transaction By ID
router.get(
    "/:id",
    protect,
    getTransaction
);
// =====================================
// Export Router
// =====================================

module.exports = router;