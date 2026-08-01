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
module.exports = router;
