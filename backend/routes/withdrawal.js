const express = require("express");

const router = express.Router();

// =====================================
// Withdrawal Controller
// =====================================

const {

createWithdrawal,

getMyWithdrawals,

getAllWithdrawals,

getWithdrawalSummary,

getWithdrawalById,

approveWithdrawal,

processWithdrawal,

rejectWithdrawal,

cancelWithdrawal,

failWithdrawal,

retryFailedWithdrawal,

completeWithdrawal

} = require("../controllers/withdrawalController");

// =====================================
// Authentication Middleware
// =====================================

const { protect } = require("../middleware/authMiddleware");

// =====================================
// Authorization Middleware
// =====================================

const { authorize } = require("../middleware/authorize");

// ======================================================
// USER WITHDRAWAL ROUTES
// ======================================================

// =====================================
// Create Withdrawal Request
// =====================================

router.post(

"/",

protect,

createWithdrawal

);

// =====================================
// Get My Withdrawals
// =====================================

router.get(

"/my-withdrawals",

protect,

getMyWithdrawals

);

// =====================================
// Get My Withdrawal Summary
// =====================================

router.get(

"/summary",

protect,

getWithdrawalSummary

);

// =====================================
// Get Single Withdrawal
// =====================================

router.get(

"/:id",

protect,

getWithdrawalById

);

// ======================================================
// ADMIN WITHDRAWAL MANAGEMENT
// ======================================================

// =====================================
// Get All Withdrawals
// =====================================

router.get(

"/",

protect,

authorize("payments.view"),

getAllWithdrawals

);

// =====================================
// Approve Withdrawal
// =====================================

router.put(

"/:id/approve",

protect,

authorize("payments.manage"),

approveWithdrawal

);

// =====================================
// Process Withdrawal
// =====================================

router.put(

"/:id/process",

protect,

authorize("payments.manage"),

processWithdrawal

);

// =====================================
// Complete Withdrawal
// =====================================

router.put(

"/:id/complete",

protect,

authorize("payments.manage"),

completeWithdrawal

);

// =====================================
// Reject Withdrawal
// =====================================

router.put(

"/:id/reject",

protect,

authorize("payments.manage"),

rejectWithdrawal

);

// =====================================
// Cancel Withdrawal
// =====================================

router.put(

"/:id/cancel",

protect,

cancelWithdrawal

);

// =====================================
// Mark Withdrawal As Failed
// =====================================

router.put(

"/:id/fail",

protect,

authorize("payments.manage"),

failWithdrawal

);

// =====================================
// Retry Failed Withdrawal
// =====================================

router.put(

"/:id/retry",

protect,

authorize("payments.manage"),

retryFailedWithdrawal

);

// =====================================
// Export Router
// =====================================

module.exports = router;
