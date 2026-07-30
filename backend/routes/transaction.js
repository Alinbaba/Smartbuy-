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

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");
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
    authorize("payments.view"),
    getAllTransactions
);

// Get Transaction Report
router.get(
    "/report",
    protect,
    authorize("payments.view"),
    getTransactionReport
);

// Update Transaction Status
router.put(
    "/:id/status",
    protect,
    authorize("payments.manage"),
    updateTransactionStatus
);

// Soft Delete Transaction
router.delete(
    "/:id",
    protect,
    authorize("payments.manage"),
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
