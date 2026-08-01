// ======================================================
// SmartBuy Admin Routes
// ======================================================

const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");
// ======================================================
// Transaction Export
// ======================================================

router.get(
    "/transactions/export",
    adminController.exportTransactions
);

router.get(
    "/wallets/:id",
    protect,
    authorize("wallets.view"),
    adminController.getWalletById
);

router.patch(
    "/wallets/:id/credit",
    protect,
    authorize("wallets.credit"),
    adminController.creditWallet
);

router.patch(
    "/wallets/:id/debit",
    protect,
    authorize("wallets.debit"),
    adminController.debitWallet
);

router.patch(
    "/wallets/:id/freeze",
    protect,
    authorize("wallets.freeze"),
    adminController.freezeWallet
);

router.patch(
    "/wallets/:id/unfreeze",
    protect,
    authorize("wallets.freeze"),
    adminController.unfreezeWallet
);

router.get(
    "/wallets/analytics",
    protect,
    authorize("wallets.view"),
    adminController.getWalletAnalytics
);

router.get(
    "/wallets/export",
    protect,
    authorize("wallets.view"),
    adminController.exportWallets
);

router.get(
    "/withdrawals/dashboard",
    protect,
    authorize("withdrawals.view"),
    adminController.getWithdrawalDashboard
);

module.exports = router;
