const mongoose = require("mongoose");

// ======================================================
// SmartBuy Enterprise Withdrawal Model
// ======================================================
//
// Handles:
// - Withdrawal requests
// - Approval
// - Processing
// - Completion
// - Rejection
// - Cancellation
// - Failure
// - Retry
// - Transaction linking
// - Payout information
// - Security/audit information
//
// IMPORTANT:
// Financial balance changes are NOT performed here.
// They are handled by the financial transaction engine.
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
        // Wallet
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
        // Estimated Completion
        // ==================================================

        estimatedCompletion: {

            type: Date,

            default: null

        },


        // ==================================================
        // Processing Duration
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
        // Audit / Security Information
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
// IMPORTANT:
// We deliberately do NOT use countDocuments() here.
//
// countDocuments() is unsafe for generating sequential
// financial identifiers because two simultaneous requests
// can receive the same count.
//
// A proper enterprise implementation should use a dedicated
// atomic counter or another collision-safe identifier
// strategy.
//
// For now, we generate a unique time/random-based ID.
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
