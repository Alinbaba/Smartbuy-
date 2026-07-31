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

module.exports = router;
