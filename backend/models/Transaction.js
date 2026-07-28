const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

    // =====================================
    // SmartBuy Transaction ID
    // =====================================

    transactionId: {
        type: String,
        unique: true,
        index: true
    },

    // =====================================
    // User
    // =====================================

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // =====================================
    // Wallet
    // =====================================

    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true
    },

    // =====================================
    // Order (Optional)
    // =====================================

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },

    // =====================================
    // Payment Record (Optional)
    // =====================================

    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    },

    // =====================================
    // Transaction Category
    // =====================================

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
        required: true
    },

    // =====================================
    // Amount
    // =====================================

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    // =====================================
    // Currency
    // =====================================
currency: {
    type: String,
    required: true,
    default: "NGN",
    uppercase: true,
    trim: true
},
        // =====================================
    // Payment Method
    // =====================================

    paymentMethod: {
        type: String,
        enum: [

            "wallet",

            "card",

            "bank-transfer",

            "mobile-money",

            "cash",

            "crypto"

        ],
        required: true
    },

    // =====================================
    // Payment Gateway / Provider
    // =====================================

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

    // =====================================
    // Card Network
    // =====================================

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

    // =====================================
    // Gateway Transaction Reference
    // =====================================

    gatewayReference: {
        type: String,
        default: ""
    },

    // =====================================
    // Gateway Response
    // =====================================

    gatewayResponse: {
        type: String,
        default: ""
    },
    // =====================================
    // Wallet Balance Tracking
    // =====================================

    balanceBefore: {
        type: Number,
        default: 0
    },

    balanceAfter: {
        type: Number,
        default: 0
    },

    // =====================================
    // Transaction Direction
    // =====================================

    transactionDirection: {
        type: String,
        enum: [

            "credit",

            "debit"

        ],
        required: true
    },
        // =====================================
    // Transaction Status
    // =====================================

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
        default: "pending"
    },

    // =====================================
    // Failure Reason
    // =====================================

    failureReason: {
        type: String,
        default: ""
    },

    // =====================================
    // Transaction Description
    // =====================================

    description: {
        type: String,
        default: ""
    },
    // =====================================
    // Sender
    // =====================================

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    // =====================================
    // Receiver
    // =====================================

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    // =====================================
    // Sender Wallet
    // =====================================

    senderWallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet"
    },

    // =====================================
    // Receiver Wallet
    // =====================================

    receiverWallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet"
    },
    // =====================================
    // Business References
    // =====================================

    orderNumber: {
        type: String,
        default: ""
    },

    invoiceNumber: {
        type: String,
        default: ""
    },

    withdrawalReference: {
        type: String,
        default: ""
    },

    payoutReference: {
        type: String,
        default: ""
    },

    commissionReference: {
        type: String,
        default: ""
    },

    refundReference: {
        type: String,
        default: ""
    },

    // =====================================
    // Additional Metadata
    // =====================================

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // =====================================
    // Security & Audit
    // =====================================

    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    ipAddress: {
        type: String,
        default: ""
    },

    deviceInfo: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    verifiedAt: {
        type: Date
    },

    remarks: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});
// =====================================
// Generate SmartBuy Transaction ID
// =====================================

transactionSchema.pre("save", async function (next) {

    if (!this.isNew || this.transactionId) {
        return next();
    }

    const count = await this.constructor.countDocuments();

    this.transactionId = `TRX-${String(count + 1).padStart(8, "0")}`;

    next();

});
// =====================================
// Enterprise Enhancements
// =====================================

// Soft Delete

transactionSchema.add({

    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: {
        type: Date
    },

    // ==========================
    // Transaction Tags
    // ==========================

    tags: [

        {
            type: String
        }

    ],

    // ==========================
    // Internal Admin Notes
    // ==========================

    internalNotes: {
        type: String,
        default: ""
    }

});

// =====================================
// Export Model
// =====================================

module.exports = mongoose.model("Transaction", transactionSchema);