const express = require("express");

const router = express.Router();


const {

    createWithdrawal,
    getMyWithdrawals,
    getAllWithdrawals,
    approveWithdrawal,
    completeWithdrawal,
    rejectWithdrawal,
    getWithdrawalSummary,
    getWithdrawalById

} = require("../controllers/withdrawalController");


const {

    protect,

    authorize

} = require("../middleware/authMiddleware");
// =====================================
// User Withdrawal Routes
// =====================================


// Create Withdrawal Request

router.post(

    "/",

    protect,

    createWithdrawal

);


// Get My Withdrawals

router.get(

    "/my-withdrawals",

    protect,

    getMyWithdrawals

);


// Get Withdrawal Summary

router.get(

    "/summary",

    protect,

    getWithdrawalSummary

);


// Get Single Withdrawal

router.get(

    "/:id",

    protect,

    getWithdrawalById

);
// =====================================
// Admin Withdrawal Routes
// =====================================


// Get All Withdrawals

router.get(

    "/",

    protect,

    authorize("admin"),

    getAllWithdrawals

);


// Approve Withdrawal

router.put(

    "/:id/approve",

    protect,

    authorize("admin"),

    approveWithdrawal

);


// Complete Withdrawal

router.put(

    "/:id/complete",

    protect,

    authorize("admin"),

    completeWithdrawal

);


// Reject Withdrawal

router.put(

    "/:id/reject",

    protect,

    authorize("admin"),

    rejectWithdrawal

);
// =====================================
// Export Router
// =====================================

module.exports = router;
