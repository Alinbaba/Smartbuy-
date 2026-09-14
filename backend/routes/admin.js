// ======================================================
// SmartBuy Admin Routes
// ======================================================
//
// Administrative operations requiring authentication
// and permission-based authorization.
//
// Route protection:
//
// protect()
//     ↓
// Authenticate user
//     ↓
// authorize()
//     ↓
// Verify role permission
//     ↓
// Controller
//
// ======================================================

const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

const { authorize } = require("../middleware/authorize");


// ======================================================
// Transaction Routes
// ======================================================

// ------------------------------------------------------
// Export Transactions
// ------------------------------------------------------
//
// Requires the specific transactions.export permission.
//
// ------------------------------------------------------

router.get(
    "/transactions/export",
    protect,
    authorize("transactions.export"),
    adminController.exportTransactions
);


// ======================================================
// Wallet Routes
// ======================================================
//
// IMPORTANT:
// Static routes such as /analytics and /export are defined
// BEFORE /:id so Express does not interpret them as wallet IDs.
//
// ======================================================


// ------------------------------------------------------
// Wallet Analytics
// ------------------------------------------------------

router.get(
    "/wallets/analytics",
    protect,
    authorize("wallets.view"),
    adminController.getWalletAnalytics
);


// ------------------------------------------------------
// Export Wallets
// ------------------------------------------------------
//
// There is currently no separate wallets.export permission
// in the SmartBuy permission catalogue.
//
// Therefore wallets.view controls access to this report.
//
// If SmartBuy later requires separate export restrictions,
// we can introduce wallets.export as a formal permission.
//
// ------------------------------------------------------

router.get(
    "/wallets/export",
    protect,
    authorize("wallets.view"),
    adminController.exportWallets
);


// ------------------------------------------------------
// Wallet Details
// ------------------------------------------------------

router.get(
    "/wallets/:id",
    protect,
    authorize("wallets.view"),
    adminController.getWalletById
);


// ======================================================
// Wallet Financial Operations
// ======================================================


// ------------------------------------------------------
// Credit Wallet
// ------------------------------------------------------

router.patch(
    "/wallets/:id/credit",
    protect,
    authorize("wallets.credit"),
    adminController.creditWallet
);


// ------------------------------------------------------
// Debit Wallet
// ------------------------------------------------------

router.patch(
    "/wallets/:id/debit",
    protect,
    authorize("wallets.debit"),
    adminController.debitWallet
);


// ------------------------------------------------------
// Freeze Wallet
// ------------------------------------------------------

router.patch(
    "/wallets/:id/freeze",
    protect,
    authorize("wallets.freeze"),
    adminController.freezeWallet
);


// ------------------------------------------------------
// Unfreeze Wallet
// ------------------------------------------------------
//
// Freezing and unfreezing are controlled by the same
// wallets.freeze permission.
//
// ------------------------------------------------------

router.patch(
    "/wallets/:id/unfreeze",
    protect,
    authorize("wallets.freeze"),
    adminController.unfreezeWallet
);


// ======================================================
// Withdrawal Dashboard
// ======================================================

router.get(
    "/withdrawals/dashboard",
    protect,
    authorize("withdrawals.view"),
    adminController.getWithdrawalDashboard
);


// ======================================================
// Export Router
// ======================================================

module.exports = router;
