// ==========================================
// SmartBuy Enterprise Audit Log Helper v2
// ==========================================
//
// Purpose:
// This utility creates audit records across
// the entire SmartBuy system.
//
// It can be used in:
// - Authentication
// - Wallet
// - KYC
// - Uploads
// - Products
// - Orders
// - Payments
// - Admin activities
//
// It automatically records:
// - User information
// - Action performed
// - Module affected
// - Device information
// - Browser
// - Operating system
// - IP address
// - API endpoint
// - Before/After changes
// ==========================================


// Audit Log database model

const AuditLog = require("../models/AuditLog");


// Package for detecting device,
// browser and operating system

const UAParser = require("ua-parser-js");



// ==========================================
// Create Audit Log Function
// ==========================================

const createAuditLog = async ({

    // Express request object
    req,


    // User who performed the action
    user = null,


    // Action name
    // Example:
    // LOGIN
    // CREATE_PRODUCT
    // CREDIT_WALLET
    action,


    // SmartBuy module
    // Example:
    // wallet
    // products
    // authentication
    module,


    // Human readable explanation
    description,


    // Result status
    // success | failed | warning
    status = "success",


    // Record affected by the action

    targetModel = "",

    targetId = null,

    targetName = "",



    // Data before update

    oldValues = {},



    // Data after update

    newValues = {},



    // Fields that changed

    changes = [],



    // Error information

    errorMessage = "",

    errorStack = "",



    // Additional information

    metadata = {}

}) => {


    try {


        // ==================================
        // Detect Device Information
        // ==================================

        const parser = new UAParser(

            req?.headers["user-agent"] || ""

        );


        const browser = parser.getBrowser();


        const operatingSystem = parser.getOS();


        const device = parser.getDevice();





        // ==================================
        // Create Audit Record
        // ==================================

        await AuditLog.create({



            // ==============================
            // User Information
            // ==============================

            user: user?._id || null,

            userId: user?.userId || "",

            fullName: user?.fullName || "",

            role: user?.role || "",





            // ==============================
            // Action Information
            // ==============================

            action,

            module,

            description,

            status,





            // ==============================
            // Target Information
            // ==============================

            targetModel,

            targetId,

            targetName,





            // ==============================
            // Request Information
            // ==============================

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





            // ==============================
            // Change Tracking
            // ==============================

            oldValues,

            newValues,

            changes,





            // ==============================
            // Error Information
            // ==============================

            errorMessage,

            errorStack,





            // ==============================
            // Extra Data
            // ==============================

            metadata


        });



    } catch (error) {


        // Audit failure should never
        // crash the main application

        console.error(

            "Audit Log Creation Failed:",

            error.message

        );


    }


};




// Export helper

module.exports = createAuditLog;
