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

module.exports = router;
