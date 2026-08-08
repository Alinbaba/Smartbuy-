const mongoose = require("mongoose");

// ======================================================
// SmartBuy Enterprise Withdrawal Model
// ======================================================
//
// This model manages the full lifecycle of withdrawal operations, including:
// - Withdrawal request creation
// - Approval workflow
// - Processing and completion
// - Rejection and cancellation handling
// - Failure tracking and retry attempts
// - Transaction linkage
// - Payout and banking details
// - Security and audit metadata
//
// IMPORTANT:
// This model does NOT handle balance updates.
// All financial balance adjustments are managed exclusively
// by the financial transaction engine.
// ======================================================

const withdrawalSchema = new mongoose.Schema(

    {

        // ==================================================
        // SmartBuy Withdrawal ID
        // ==================================================

        withdrawalId: {

            type: String,

            unique: true,

            index: true,

            trim: true

        },


        // ==================================================
        // Withdrawal Owner
        // ==================================================

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true

        },


        // ==================================================
        // Wallet Reference
        // ==================================================

        wallet: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Wallet",

            required: true,

            index: true

        },


        // ==================================================
        // Withdrawal Amount
        // ==================================================

        amount: {

            type: Number,

            required: true,

            min: 0.01

        },


        // ==================================================
        // Currency
        // ==================================================

        currency: {

            type: String,

            required: true,

            default: "NGN",

            uppercase: true,

            trim: true,

            maxlength: 10

        },


        // ==================================================
        // Withdrawal Method
        // ==================================================

        withdrawalMethod: {

            type: String,

            enum: [

                "bank-transfer",

                "paypal",

                "payoneer",

                "stripe",

                "flutterwave",

                "paystack",

                "manual"

            ],

            required: true

        },


        // ==================================================
        // Withdrawal Status
        // ==================================================

        status: {

            type: String,

            enum: [

                "pending",

                "approved",

                "processing",

                "completed",

                "failed",

                "cancelled",

                "rejected"

            ],

            default: "pending",

            index: true

        },


        // ==================================================
        // Bank / Payout Details
        // ==================================================

        bankAccount: {

            accountName: {

                type: String,

                default: "",

                trim: true

            },

            accountNumber: {

                type: String,

                default: "",

                trim: true

            },

            bankName: {

                type: String,

                default: "",

                trim: true

            }

        },


        // ==================================================
        // External Payment Reference
        // ==================================================

        paymentReference: {

            type: String,

            default: "",

            trim: true,

            index: true

        },


        // ==================================================
        // Related Financial Transaction
        // ==================================================

        transaction: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Transaction",

            default: null,

            index: true

        },


        // ==================================================
        // Processing Fee
        // ==================================================

        processingFee: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // Net Amount Received
        // ==================================================

        netAmount: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // Failure Information
        // ==================================================

        failureReason: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Retry Information
        // ==================================================

        retryCount: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // Estimated Completion Time
        // ==================================================

        estimatedCompletion: {

            type: Date,

            default: null

        },


        // ==================================================
        // Processing Start Timestamp
        // ==================================================
        //
        // Captures the exact time the withdrawal enters
        // the processing stage.
        //
        // Used for calculating processing duration.
        // ==================================================

        processingStartedAt: {

            type: Date,

            default: null

        },


        // ==================================================
        // Processing Duration
        // ==================================================
        //
        // Stored in milliseconds.
        // ==================================================

        processingDuration: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // Payment Gateway
        // ==================================================

        paymentGateway: {

            type: String,

            enum: [

                "paystack",

                "flutterwave",

                "stripe",

                "paypal",

                "payoneer",

                "local-bank",

                "manual",

                "none"

            ],

            default: "none"

        },


        // ==================================================
        // Request Information
        // ==================================================

        requestedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },


        // ==================================================
        // Approval Information
        // ==================================================

        approvedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },


        approvedAt: {

            type: Date,

            default: null

        },


        // ==================================================
        // Completion Information
        // ==================================================

        completedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },


        completedAt: {

            type: Date,

            default: null

        },


        // ==================================================
        // Rejection Information
        // ==================================================

        rejectedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },


        rejectedAt: {

            type: Date,

            default: null

        },


        rejectionReason: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Cancellation Information
        // ==================================================

        cancelledBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },


        cancelledAt: {

            type: Date,

            default: null

        },


        cancellationReason: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Audit & Security Information
        // ==================================================

        ipAddress: {

            type: String,

            default: "",

            trim: true

        },


        deviceInfo: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Internal Notes
        // ==================================================

        notes: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Description
        // ==================================================

        description: {

            type: String,

            default: "",

            trim: true

        }

    },

    {

        timestamps: true

    }

);


// ======================================================
// Compound Indexes
// ======================================================

withdrawalSchema.index({

    user: 1,

    createdAt: -1

});


withdrawalSchema.index({

    wallet: 1,

    createdAt: -1

});


withdrawalSchema.index({

    status: 1,

    createdAt: -1

});


// ======================================================
// Generate Withdrawal ID
// ======================================================
//
// This implementation avoids countDocuments() to prevent
// race conditions that could lead to duplicate IDs under
// high concurrency.
//
// Instead, a time-based and random component is used to
// ensure uniqueness.
// ======================================================

withdrawalSchema.pre("save", async function (next) {

    if (!this.isNew || this.withdrawalId) {

        return next();

    }


    const timestamp = Date.now()
        .toString(36)
        .toUpperCase();


    const randomPart = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();


    this.withdrawalId =
        `WDL-${timestamp}-${randomPart}`;


    next();

});


// ======================================================
// Export Model
// ======================================================

module.exports = mongoose.model(

    "Withdrawal",

    withdrawalSchema

);
