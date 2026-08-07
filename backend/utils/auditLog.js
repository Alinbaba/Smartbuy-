// ==========================================
// SmartBuy Enterprise Audit Log Helper v3
// ==========================================
//
// Purpose:
// Creates audit records across the SmartBuy
// system while supporting MongoDB transactions.
//
// IMPORTANT:
// When a MongoDB session is supplied, the
// audit record is written inside that same
// transaction.
//
// This allows:
//
// Wallet update
//      ↓
// Transaction record
//      ↓
// Withdrawal update
//      ↓
// Audit log
//
// to succeed or fail together.
// ==========================================


// ==========================================
// Audit Log Model
// ==========================================

const AuditLog = require("../models/AuditLog");


// ==========================================
// User-Agent Parser
// ==========================================

const UAParser = require("ua-parser-js");


// ==========================================
// Create Audit Log
// ==========================================

const createAuditLog = async ({

    // ======================================
    // Express request
    // ======================================

    req,


    // ======================================
    // User performing the action
    // ======================================

    user = null,


    // ======================================
    // Action
    // ======================================

    action,


    // ======================================
    // SmartBuy module
    // ======================================

    module,


    // ======================================
    // Human-readable description
    // ======================================

    description,


    // ======================================
    // Result status
    // ======================================

    status = "success",


    // ======================================
    // Target information
    // ======================================

    targetModel = "",

    targetId = null,

    targetName = "",


    // ======================================
    // Before values
    // ======================================

    oldValues = {},


    // ======================================
    // After values
    // ======================================

    newValues = {},


    // ======================================
    // Changed fields
    // ======================================

    changes = [],


    // ======================================
    // Error information
    // ======================================

    errorMessage = "",

    errorStack = "",


    // ======================================
    // Additional information
    // ======================================

    metadata = {},


    // ======================================
    // MongoDB transaction session
    // ======================================
    //
    // When provided, AuditLog.create()
    // participates in the same transaction.
    //
    // ======================================

    session = null

}) => {


    try {


        // ==================================
        // Parse User-Agent
        // ==================================

        const parser = new UAParser(

            req?.headers?.["user-agent"] || ""

        );


        const browser =
            parser.getBrowser();


        const operatingSystem =
            parser.getOS();


        const device =
            parser.getDevice();


        // ==================================
        // Prepare Audit Record
        // ==================================

        const auditData = {

            // ==================================
            // User information
            // ==================================

            user:
                user?._id || null,

            userId:
                user?.userId || "",

            fullName:
                user?.fullName || "",

            role:
                user?.role || "",


            // ==================================
            // Action information
            // ==================================

            action,

            module,

            description,

            status,


            // ==================================
            // Target information
            // ==================================

            targetModel,

            targetId,

            targetName,


            // ==================================
            // Request information
            // ==================================

            ipAddress:
                req?.ip || "",

            userAgent:
                req?.headers?.["user-agent"] || "",


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


            // ==================================
            // Change tracking
            // ==================================

            oldValues,

            newValues,

            changes,


            // ==================================
            // Error information
            // ==================================

            errorMessage,

            errorStack,


            // ==================================
            // Additional metadata
            // ==================================

            metadata

        };


        // ==================================
        // CREATE AUDIT LOG
        // ==================================
        //
        // If a session exists:
        //
        //     AuditLog.create([data], {
        //         session
        //     })
        //
        // If no session exists:
        //
        //     AuditLog.create(data)
        //
        // ==================================

        let auditLog;


        if (session) {


            const records =
                await AuditLog.create(

                    [auditData],

                    {
                        session
                    }

                );


            auditLog =
                records[0];


        } else {


            auditLog =
                await AuditLog.create(
                    auditData
                );

        }


        // ==================================
        // Return created audit record
        // ==================================

        return auditLog;


    } catch (error) {


        // ==================================
        // IMPORTANT
        // ==================================
        //
        // If this audit operation is running
        // inside a financial transaction,
        // we MUST NOT silently swallow the
        // error.
        //
        // Otherwise the financial transaction
        // could commit without its audit log.
        //
        // ==================================

        if (session) {

            throw error;

        }


        // ==================================
        // For non-transactional operations,
        // log the error without crashing
        // the main application.
        // ==================================

        console.error(

            "Audit Log Creation Failed:",

            error.message

        );


        return null;

    }

};


// ==========================================
// Export
// ==========================================

module.exports = createAuditLog;
