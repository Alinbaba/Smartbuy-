// ======================================================
// SmartBuy Payment Model
// Enterprise Multi-Vendor Marketplace
// ======================================================

const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
{
  // ==================================================
// SmartBuy Payment ID
// ==================================================

paymentId: {

    type: String,

    unique: true,

    index: true

},
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    orderNumber: {
        type: String,
        default: ""
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
        amount: {
        type: Number,
        required: true,
        default: 0
    },
// ==================================================
// Currency
// ==================================================

currency: {

    type: String,

    required: true,

    default: "NGN",

    uppercase: true,

    trim: true

},


// ==================================================
// Exchange Rate
// ==================================================

exchangeRate: {

    type: Number,

    default: 1

},


// ==================================================
// Original Currency Amount
// ==================================================

originalAmount: {

    type: Number,

    default: 0

},
    

    // ==================================================
// Payment Method
// ==================================================

paymentMethod: {

    type: String,

    enum: [

        "wallet",

        "paystack",

        "flutterwave",

        "stripe",

        "paypal",

        "payoneer",

        "wise",

        "skrill",

        "google-pay",

        "apple-pay",

        "visa",

        "mastercard",

        "verve",

        "american-express",

        "discover",

        "unionpay",

        "bank-transfer",

        "local-bank",

        "mobile-money",

        "crypto",

        "cash-on-delivery",

        "manual"

    ],

    required: true

},
    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "processing",
            "successful",
            "failed",
            "cancelled",
            "refunded"
        ],
        default: "pending"
    },
    
    paymentType: {

        type: String,
        enum: [
            "order-payment",
            "wallet-topup",
            "subscription",
            "refund",
            "other"
        ],
        default: "order-payment"
    },
        // ==================================================
    // Payment Gateway Information
    // ==================================================

    transactionReference: {
        type: String,
        default: ""
    },

    gatewayTransactionId: {
        type: String,
        default: ""
    },

    gatewayResponse: {
        type: Object,
        default: {}
    },
    // ==================================================
// Gateway Verification
// ==================================================

verificationStatus: {

    type: String,

    enum: [

        "pending",

        "verified",

        "failed"

    ],

    default: "pending"

},


verifiedByGateway: {

    type: Boolean,

    default: false

},


gatewayFee: {

    type: Number,

    default: 0

},
    
    paidAt: {
        type: Date
    },

    verifiedAt: {
        type: Date
    },
        // ==================================================
    // Marketplace Commission
    // ==================================================

    commission: {

        rate: {
            type: Number,
            default: 5
        },

        amount: {
            type: Number,
            default: 0
        }

    },

    sellerEarnings: {
        type: Number,
        default: 0
    },
    // ==================================================
    // Payment Timeline History
    // ==================================================

    timeline: [

        {

            status: {
                type: String,
                default: "pending"
            },

            message: {
                type: String,
                default: ""
            },

            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },

            updatedAt: {

                type: Date,

                default: Date.now

            }

        }

    ],
    // ==================================================
    // Refund Information
    // ==================================================

    refund: {

        amount: {

            type: Number,

            default: 0

        },

        reason: {

            type: String,

            default: ""

        },

        status: {

            type: String,

            enum: [

                "none",

                "requested",

                "processing",

                "completed",

                "failed"

            ],

            default: "none"

        },

        processedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User"

        },

        processedAt: {
            type: Date
        }
    },
// ==================================================
// Security & Audit
// ==================================================

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


// ==================================================
// Enterprise Metadata
// ==================================================

metadata: {

    type: mongoose.Schema.Types.Mixed,

    default: {}

},


// ==================================================
// Internal Notes
// ==================================================

internalNotes: {

    type: String,

    default: ""

},


// ==================================================
// Soft Delete
// ==================================================

isDeleted: {

    type: Boolean,

    default: false

},

deletedAt: {

    type: Date

}
},
{
    timestamps: true
});
// ======================================================
// Generate SmartBuy Payment ID
// ======================================================

PaymentSchema.pre("save", async function (next) {

    if (!this.isNew || this.paymentId) {

        return next();

    }

    const count = await this.constructor.countDocuments();

    this.paymentId = `PAY-${String(count + 1).padStart(8, "0")}`;

    next();

});

// ======================================================
// Export Payment Model
// ======================================================

module.exports = mongoose.model(
    "Payment",
    PaymentSchema
);
    