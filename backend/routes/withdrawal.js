const express = require("express");

const router = express.Router();

// ======================================================
// Withdrawal Controller
// ======================================================

const {

    // User operations
    createWithdrawal,
    getMyWithdrawals,
    getWithdrawalSummary,
    getWithdrawalById,
    cancelWithdrawal,

    // Admin operations
    getAllWithdrawals,
    approveWithdrawal,
    processWithdrawal,
    completeWithdrawal,
    rejectWithdrawal,
    failWithdrawal,
    retryFailedWithdrawal

} = require("../controllers/withdrawalController");


// ======================================================
// Authentication Middleware
// ======================================================

const { protect } = require("../middleware/authMiddleware");


// ======================================================
// Authorization Middleware
// ======================================================

const { authorize } = require("../middleware/authorize");


// ======================================================
// USER WITHDRAWAL ROUTES
// ======================================================


// ------------------------------------------------------
// Create Withdrawal Request
// ------------------------------------------------------
//
// POST /api/withdrawals
//
// Accessible to authenticated users only.
// ------------------------------------------------------

router.post(

    "/",

    protect,

    createWithdrawal

);


// ------------------------------------------------------
// Retrieve User Withdrawals
// ------------------------------------------------------
//
// GET /api/withdrawals/my-withdrawals
//
// Accessible to authenticated users only.
// ------------------------------------------------------

router.get(

    "/my-withdrawals",

    protect,

    getMyWithdrawals

);


// ------------------------------------------------------
// Retrieve Withdrawal Summary
// ------------------------------------------------------
//
// GET /api/withdrawals/summary
//
// Accessible to authenticated users only.
// ------------------------------------------------------

router.get(

    "/summary",

    protect,

    getWithdrawalSummary

);


// ------------------------------------------------------
// Retrieve Single Withdrawal
// ------------------------------------------------------
//
// GET /api/withdrawals/:id
//
// The controller ensures the requesting user either
// owns the withdrawal or has administrative privileges.
// ------------------------------------------------------

router.get(

    "/:id",

    protect,

    getWithdrawalById

);


// ------------------------------------------------------
// Cancel Withdrawal Request
// ------------------------------------------------------
//
// PUT /api/withdrawals/:id/cancel
//
// The controller ensures the withdrawal belongs to the
// authenticated user and is still in a pending state.
// ------------------------------------------------------

router.put(

    "/:id/cancel",

    protect,

    cancelWithdrawal

);


// ======================================================
// ADMIN WITHDRAWAL MANAGEMENT
// ======================================================


// ------------------------------------------------------
// Retrieve All Withdrawals
// ------------------------------------------------------
//
// GET /api/withdrawals
//
// Required permission:
// payments.view
// ------------------------------------------------------

router.get(

    "/",

    protect,

    authorize("payments.view"),

    getAllWithdrawals

);


// ------------------------------------------------------
// Approve Withdrawal
// ------------------------------------------------------
//
// PUT /api/withdrawals/:id/approve
//
// Required permission:
// payments.manage
//
// State transition: pending → approved
// ------------------------------------------------------

router.put(

    "/:id/approve",

    protect,

    authorize("payments.manage"),

    approveWithdrawal

);


// ------------------------------------------------------
// Process Withdrawal
// ------------------------------------------------------
//
// PUT /api/withdrawals/:id/process
//
// Required permission:
// payments.manage
//
// State transition: approved → processing
// ------------------------------------------------------

router.put(

    "/:id/process",

    protect,

    authorize("payments.manage"),

    processWithdrawal

);


// ------------------------------------------------------
// Complete Withdrawal
// ------------------------------------------------------
//
// PUT /api/withdrawals/:id/complete
//
// Required permission:
// payments.manage
//
// State transition: processing → completed
//
// This operation performs financial settlement:
// - Deducts wallet balance
// - Updates wallet totals
// - Creates a transaction record
// - Links transaction to withdrawal
// - Generates audit logs
//
// All financial operations are handled via the
// centralized financial transaction engine.
// ------------------------------------------------------

router.put(

    "/:id/complete",

    protect,

    authorize("payments.manage"),

    completeWithdrawal

);


// ------------------------------------------------------
// Reject Withdrawal
// ------------------------------------------------------
//
// PUT /api/withdrawals/:id/reject
//
// Required permission:
// payments.manage
//
// State transition: pending → rejected
// ------------------------------------------------------

router.put(

    "/:id/reject",

    protect,

    authorize("payments.manage"),

    rejectWithdrawal

);


// ------------------------------------------------------
// Mark Withdrawal as Failed
// ------------------------------------------------------
//
// PUT /api/withdrawals/:id/fail
//
// Required permission:
// payments.manage
//
// State transition: processing → failed
// ------------------------------------------------------

router.put(

    "/:id/fail",

    protect,

    authorize("payments.manage"),

    failWithdrawal

);


// ------------------------------------------------------
// Retry Failed Withdrawal
// ------------------------------------------------------
//
// PUT /api/withdrawals/:id/retry
//
// Required permission:
// payments.manage
//
// State transition: failed → processing
// ------------------------------------------------------

router.put(

    "/:id/retry",

    protect,

    authorize("payments.manage"),

    retryFailedWithdrawal

);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;
