// ==========================================
// SmartBuy Enterprise Audit Log Helper
// ==========================================
//
// Purpose:
// Creates audit records across the SmartBuy
// system.
//
// IMPORTANT:
// This helper supports MongoDB transactions.
//
// When a session is provided, the audit record
// becomes part of the same transaction.
//
// If the audit record fails, the financial
// transaction can be rolled back.
// ==========================================

const AuditLog = require("../models/AuditLog");
const UAParser = require("ua-parser-js");


// ==========================================
// Create Audit Log
// ==========================================

const createAuditLog = async ({

    // Express request
    req,

    // User performing the action
    user = null,

    // Action
    action,

    // SmartBuy module
    module,

    // Human-readable description
    description,

    // Audit status
    status = "success",

    // Target information
    targetModel = "",
    targetId = null,
    targetName = "",

    // Before / After data
    oldValues = {},
    newValues = {},

    // Changed fields
    changes = [],

    // Error information
    errorMessage = "",
    errorStack = "",

    // Additional information
    metadata = {},

    // MongoDB transaction session
    session = null

}) => {


    // ==========================================
    // Detect Request Information
    // ==========================================

    const parser = new UAParser(
        req?.headers["user-agent"] || ""
    );


    const browser = parser.getBrowser();

    const operatingSystem = parser.getOS();

    const device = parser.getDevice();


    // ==========================================
    // Create Audit Record
    // ==========================================

    const auditData = {

        // ======================================
        // User Information
        // ======================================

        user: user?._id || null,

        userId: user?.userId || "",

        fullName: user?.fullName || "",

        role: user?.role || "",


        // ======================================
        // Action Information
        // ======================================

        action,

        module,

        description,

        status,


        // ======================================
        // Target Information
        // ======================================

        targetModel,

        targetId,

        targetName,


        // ======================================
        // Request Information
        // ======================================

        ipAddress:
            req?.ip || "",

        userAgent:
            req?.headers["user-agent"] || "",

        device:
            device.type || "desktop",

        browser:
            browser.name || "Unknown",

        operatingSystem:
            operatingSystem.name || "Unknown",

        method:
            req?.method || "",

        endpoint:
            req?.originalUrl || "",


        // ======================================
        // Change Tracking
        // ======================================

        oldValues,

        newValues,

        changes,


        // ======================================
        // Error Information
        // ======================================

        errorMessage,

        errorStack,


        // ======================================
        // Additional Information
        // ======================================

        metadata

    };


    // ==========================================
    // Create Audit Log
    // ==========================================
    //
    // If a session exists, the audit record is
    // included inside the same MongoDB transaction.
    //
    // If there is no session, it works normally.
    // ==========================================

    const auditLog = new AuditLog(auditData);


    await auditLog.save({

        session

    });


    return auditLog;

};


// ==========================================
// Export
// ==========================================

module.exports = createAuditLog;
