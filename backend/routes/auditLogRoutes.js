const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { authorize } = require("../middleware/roleMiddleware");

const {

    createAuditLog,

    getAllAuditLogs,

    getAuditLogById,

    getMyAuditLogs,

    getAuditLogsByModule,

    getAuditLogsByUser,

    getAuditLogsByDateRange,

    getFailedAuditLogs,

    getAuditStatistics

} = require("../controllers/auditLogController");
// ======================================
// Get All Audit Logs
// ======================================

router.get(

    "/",

    protect,

    authorize("super-admin", "admin"),

    getAllAuditLogs

);

// ======================================
// Get Audit Log By ID
// ======================================

router.get(

    "/:id",

    protect,

    authorize("super-admin", "admin"),

    getAuditLogById

);

// ======================================
// Get Audit Logs by Module
// ======================================

router.get(

    "/module/:module",

    protect,

    authorize("super-admin", "admin"),

    getAuditLogsByModule

);

// ======================================
// Get Audit Logs by User
// ======================================

router.get(

    "/user/:userId",

    protect,

    authorize("super-admin", "admin"),

    getAuditLogsByUser

);

// ======================================
// Get Audit Logs by Date Range
// ======================================

router.get(

    "/date-range/search",

    protect,

    authorize("super-admin", "admin"),

    getAuditLogsByDateRange

);

// ======================================
// Get Failed Audit Logs
// ======================================

router.get(

    "/failed/logs",

    protect,

    authorize("super-admin", "admin"),

    getFailedAuditLogs

);

// ======================================
// Export Router
// ======================================

module.exports = router;
