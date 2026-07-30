const express = require("express");

const router = express.Router();

const {

    createWallet,
    getWallet,
    getMyWallet,
    creditWallet,
    debitWallet,
    freezeWallet,
    unfreezeWallet,
    updateBankAccount,
    getWalletSummary,
    getWalletHistory,
    setWalletPin
} = require("../controllers/walletController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");
// =====================================
// User Wallet Routes
// =====================================


// Get My Wallet

router.get(

    "/my-wallet",

    protect,

    getMyWallet

);


// Get Wallet By ID

router.get(

    "/:id",

    protect,

    getWallet

);


// Wallet Summary

router.get(

    "/:id/summary",

    protect,

    getWalletSummary

);


// Wallet History

router.get(

    "/:id/history",

    protect,

    getWalletHistory

);
// =====================================
// Wallet Balance Operations
// =====================================


// Credit Wallet

router.put(

    "/:id/credit",

    protect,

    authorize("admin"),

    creditWallet

);


// Debit Wallet

router.put(

    "/:id/debit",

    protect,

    authorize("admin"),

    debitWallet

);
// =====================================
// Wallet Security Routes
// =====================================


// Freeze Wallet

router.put(

    "/:id/freeze",

    protect,

    authorize("admin"),

    freezeWallet

);


// Unfreeze Wallet

router.put(

    "/:id/unfreeze",

    protect,

    authorize("admin"),

    unfreezeWallet

);
// =====================================
// Bank Account Route
// =====================================


// Update Bank Account

router.put(

    "/:id/bank-account",

    protect,

    updateBankAccount

);
// =====================================
// Set Wallet PIN
// =====================================

router.put(
    "/pin",
    protect,
    setWalletPin
);
// =====================================
// Export Router
// =====================================

module.exports = router;
