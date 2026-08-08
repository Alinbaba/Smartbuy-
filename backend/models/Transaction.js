const mongoose = require("mongoose");

// ======================================================
// SmartBuy Enterprise Transaction Model
// ======================================================
//
// Purpose:
// This model records all financial transactions within SmartBuy.
//
// Used for:
// - Wallet deposits
// - Wallet withdrawals
// - Payments
// - Refunds
// - Commissions
// - Cashback
// - Rewards
// - Transfers
// - Purchases
// - Fees
// - Adjustments
//
// IMPORTANT:
// This model is strictly for transaction logging.
//
// All balance updates must be handled exclusively by the
// financial transaction engine within a MongoDB session.
//
// Compatible with:
// - Withdrawal model
// - Wallet model
// - financialTransaction.js
// - withdrawalController.js
// - Audit Log system
// ======================================================


// ======================================================
// TRANSACTION SCHEMA
// ======================================================

const transactionSchema = new mongoose.Schema(

    {

        // ==================================================
        // SmartBuy Transaction ID
        // ==================================================

        transactionId: {

            type: String,

            unique: true,

            index: true,

            trim: true

        },


        // ==================================================
        // User
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
        // Order
        // ==================================================

        order: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Order",

            default: null

        },


        // ==================================================
        // Payment Record
        // ==================================================

        payment: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Payment",

            default: null

        },


        // ==================================================
        // Transaction Category
        // ==================================================

        transactionType: {

            type: String,

            enum: [

                "payment",

                "deposit",

                "withdrawal",

                "refund",

                "commission",

                "cashback",

                "reward",

                "transfer",

                "purchase",

                "subscription",

                "fee",

                "adjustment",

                "bonus",

                "penalty"

            ],

            required: true,

            index: true

        },


        // ==================================================
        // Transaction Amount
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
        // Payment / Withdrawal Method
        // ==================================================
        //
        // This field is intentionally aligned with the
        // Withdrawal model for consistency.
        //
        // Example:
        //
        // withdrawalMethod: "bank-transfer"
        //
        // maps to:
        //
        // paymentMethod: "bank-transfer"
        //
        // ==================================================

        paymentMethod: {

            type: String,

            enum: [

                "wallet",

                "card",

                "bank-transfer",

                "mobile-money",

                "cash",

                "crypto",

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
        // Payment Gateway / Provider
        // ==================================================

        paymentGateway: {

            type: String,

            enum: [

                "paystack",

                "flutterwave",

                "stripe",

                "paypal",

                "payoneer",

                "wise",

                "skrill",

                "revolut",

                "google-pay",

                "apple-pay",

                "local-bank",

                "manual",

                "crypto",

                "none"

            ],

            default: "none"

        },


        // ==================================================
        // Card Network
        // ==================================================

        cardNetwork: {

            type: String,

            enum: [

                "visa",

                "mastercard",

                "verve",

                "american-express",

                "discover",

                "unionpay",

                "jcb",

                "none"

            ],

            default: "none"

        },


        // ==================================================
        // Gateway Transaction Reference
        // ==================================================

        gatewayReference: {

            type: String,

            default: "",

            trim: true,

            index: true

        },


        // ==================================================
        // Gateway Response
        // ==================================================

        gatewayResponse: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Wallet Balance Before Transaction
        // ==================================================

        balanceBefore: {

            type: Number,

            required: true,

            min: 0

        },


        // ==================================================
        // Wallet Balance After Transaction
        // ==================================================

        balanceAfter: {

            type: Number,

            required: true,

            min: 0

        },


        // ==================================================
        // Transaction Direction
        // ==================================================

        transactionDirection: {

            type: String,

            enum: [

                "credit",

                "debit"

            ],

            required: true,

            index: true

        },


        // ==================================================
        // Transaction Status
        // ==================================================

        status: {

            type: String,

            enum: [

                "pending",

                "processing",

                "successful",

                "failed",

                "cancelled",

                "reversed",

                "refunded"

            ],

            default: "pending",

            index: true

        },


        // ==================================================
        // Failure Reason
        // ==================================================

        failureReason: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Transaction Description
        // ==================================================

        description: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Sender
        // ==================================================

        sender: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },


        // ==================================================
        // Receiver
        // ==================================================

        receiver: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },


        // ==================================================
        // Sender Wallet
        // ==================================================

        senderWallet: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Wallet",

            default: null

        },


        // ==================================================
        // Receiver Wallet
        // ==================================================

        receiverWallet: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Wallet",

            default: null

        },


        // ==================================================
        // Business References
        // ==================================================

        orderNumber: {

            type: String,

            default: "",

            trim: true

        },


        invoiceNumber: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Withdrawal Reference
        // ==================================================

        withdrawalReference: {

            type: String,

            default: "",

            trim: true,

            index: true

        },


        // ==================================================
        // Payout Reference
        // ==================================================

        payoutReference: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Commission Reference
        // ==================================================

        commissionReference: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Refund Reference
        // ==================================================

        refundReference: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Additional Metadata
        // ==================================================

        metadata: {

            type: mongoose.Schema.Types.Mixed,

            default: () => ({})

        },


        // ==================================================
        // Security & Audit
        // ==================================================

        performedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },


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


        location: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Verification
        // ==================================================

        isVerified: {

            type: Boolean,

            default: false

        },


        verifiedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },


        verifiedAt: {

            type: Date,

            default: null

        },


        // ==================================================
        // Remarks
        // ==================================================

        remarks: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // Soft Delete
        // ==================================================

        isDeleted: {

            type: Boolean,

            default: false,

            index: true

        },


        deletedAt: {

            type: Date,

            default: null

        },


        // ==================================================
        // Transaction Tags
        // ==================================================

        tags: [

            {

                type: String,

                trim: true

            }

        ],


        // ==================================================
        // Internal Admin Notes
        // ==================================================

        internalNotes: {

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
// INDEXES
// ======================================================

transactionSchema.index({

    user: 1,

    createdAt: -1

});


transactionSchema.index({

    wallet: 1,

    createdAt: -1

});


transactionSchema.index({

    transactionType: 1,

    status: 1,

    createdAt: -1

});


transactionSchema.index({

    wallet: 1,

    transactionDirection: 1,

    createdAt: -1

});


// ======================================================
// GENERATE TRANSACTION ID
// ======================================================
//
// IMPORTANT:
//
// We do not use countDocuments() due to the risk of
// duplicate IDs under concurrent transaction creation.
//
// Instead, we generate a collision-resistant identifier
// using:
// - Current timestamp
// - Random hexadecimal segment
//
// MongoDB unique indexing provides an additional safety
// layer against collisions.
// ======================================================

transactionSchema.pre(

    "save",

    function (next) {

        if (

            !this.isNew ||

            this.transactionId

        ) {

            return next();

        }


        const timestamp = Date.now()

            .toString(36)

            .toUpperCase();


        const randomPart =

            new mongoose.Types.ObjectId()

                .toString()

                .slice(-8)

                .toUpperCase();


        this.transactionId =

            `TRX-${timestamp}-${randomPart}`;


        next();

    }

);


// ======================================================
// EXPORT MODEL
// ======================================================

module.exports = mongoose.model(

    "Transaction",

    transactionSchema

);
