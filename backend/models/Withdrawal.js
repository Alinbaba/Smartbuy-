const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  // =====================================
// SmartBuy Withdrawal ID
// =====================================

withdrawalId: {

    type: String,

    unique: true,

    index: true

},

    // =====================================
    // Withdrawal Owner
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
    // Withdrawal Amount
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
    // Withdrawal Method
    // =====================================

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


    // =====================================
    // Status
    // =====================================

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
    default: "pending"
},
// =====================================
// Bank / Payout Details
// =====================================

bankAccount: {

    accountName: {
        type: String,
        default: ""
    },

    accountNumber: {
        type: String,
        default: ""
    },

    bankName: {
        type: String,
        default: ""
    }

},


// =====================================
// External Payment Reference
// =====================================

paymentReference: {
    type: String,
    default: ""
},

// =====================================
// Related Transaction
// =====================================

transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction"
    default: null
},

  // =====================================
// Processing Fee
// =====================================

processingFee: {
    type: Number,
    default: 0,
    min: 0
},

  // =====================================
// Net Amount Received
// =====================================

netAmount: {
    type: Number,
    default: 0,
    min: 0
},

  // =====================================
// Failure Reason
// =====================================

failureReason: {
    type: String,
    default: ""
},

  // =====================================
// Retry Count
// =====================================

retryCount: {
    type: Number,
    default: 0,
    min: 0
},

  // =====================================
// Estimated Completion Time
// =====================================

estimatedCompletion: {
    type: Date,
    default: null
},

  // =====================================
// Processing Duration (Milliseconds)
// =====================================

processingDuration: {
    type: Number,
    default: 0,
    min: 0
},
  
// =====================================
// Gateway Information
// =====================================

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
// =====================================
// Approval & Security Tracking
// =====================================

requestedBy: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User"

},


approvedBy: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User"

},


approvedAt: {

    type: Date

},

completedBy: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    default: null

},

completedAt: {

    type: Date,

    default: null

},

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

    default: ""

},


// =====================================
// Audit Information
// =====================================

ipAddress: {

    type: String,

    default: ""

},


deviceInfo: {

    type: String,

    default: ""

},


notes: {

    type: String,

    default: ""

},

    // =====================================
    // Description
    // =====================================

    description: {
        type: String,
        default: ""
    }


}, {

    timestamps: true

});
// =====================================
// Generate SmartBuy Withdrawal ID
// =====================================

withdrawalSchema.pre("save", async function (next) {

    if (!this.isNew || this.withdrawalId) {

        return next();

    }


    const count = await this.constructor.countDocuments();


    this.withdrawalId = `WDL-${String(count + 1).padStart(8, "0")}`;


    next();

});


// =====================================
// Export Model
// =====================================

module.exports = mongoose.model(
    "Withdrawal",
    withdrawalSchema
);
