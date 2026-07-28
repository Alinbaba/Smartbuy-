const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({

    // ==========================
    // Wallet Owner
    // ==========================

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    // ==========================
    // SmartBuy Wallet ID
    // ==========================

    walletId: {
        type: String,
        unique: true
    },

    // ==========================
    // Wallet Type
    // ==========================

    walletType: {
        type: String,
        enum: [
            "customer",
            "seller",
            "affiliate",
            "manufacturer",
            "wholesaler",
            "admin"
        ],
        required: true
    },

    // ==========================
    // Currency
    // ==========================

    currency: {
        type: String,
        default: "NGN"
    },
        // ==========================
    // Wallet Balances
    // ==========================

    availableBalance: {
        type: Number,
        default: 0
    },

    pendingBalance: {
        type: Number,
        default: 0
    },

    frozenBalance: {
        type: Number,
        default: 0
    },

    totalEarned: {
        type: Number,
        default: 0
    },

    totalSpent: {
        type: Number,
        default: 0
    },

    totalWithdrawn: {
        type: Number,
        default: 0
    },
        // ==========================
    // Rewards & Cashback
    // ==========================

    rewardPoints: {
        type: Number,
        default: 0
    },

    cashbackBalance: {
        type: Number,
        default: 0
    },

    loyaltyLevel: {
        type: String,
        enum: [
            "Bronze",
            "Silver",
            "Gold",
            "Platinum",
            "Diamond"
        ],
        default: "Bronze"
    },
        // ==========================
    // Wallet Security & Status
    // ==========================

    isActive: {
        type: Boolean,
        default: true
    },

    isLocked: {
        type: Boolean,
        default: false
    },

    lockReason: {
        type: String,
        default: ""
    },

    lastTransactionDate: {
        type: Date
    },

    lastWithdrawalDate: {
        type: Date
    },
        // ==========================
    // Enterprise Wallet Features
    // ==========================

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

    paymentMethods: [

        {
            type: String
        }

    ],

    notes: {
        type: String,
        default: ""
    },
    // ==========================
// Transaction Limits
// ==========================

dailyTransactionLimit: {
    type: Number,
    default: 500000
},

monthlyTransactionLimit: {
    type: Number,
    default: 10000000
},

maximumWalletBalance: {
    type: Number,
    default: 50000000
},

// ==========================
// KYC Information
// ==========================

kycStatus: {
    type: String,
    enum: [
        "not-submitted",
        "pending",
        "verified",
        "rejected"
    ],
    default: "not-submitted"
},

kycVerifiedAt: {
    type: Date
},

// ==========================
// Wallet PIN
// ==========================

walletPin: {
    type: String,
    default: ""
},

// ==========================
// Last Login / Device
// ==========================

lastLogin: {
    type: Date
},

lastDevice: {
    type: String,
    default: ""
},

lastIPAddress: {
    type: String,
    default: ""
},

// ==========================
// Preferred Withdrawal Method
// ==========================

preferredWithdrawalMethod: {
    type: String,
    enum: [
        "bank",
        "wallet",
        "paypal",
        "payoneer",
        "crypto"
    ],
    default: "bank"
},

// ==========================
// Multi-Currency Balances
// ==========================

balances: [
    {
        currency: {
            type: String,
            default: "NGN"
        },

        available: {
            type: Number,
            default: 0
        },

        pending: {
            type: Number,
            default: 0
        },

        frozen: {
            type: Number,
            default: 0
        }
    }
],
}, {
    timestamps: true
});

// ==========================
// Generate SmartBuy Wallet ID
// ==========================

walletSchema.pre("save", async function(next){

    if (!this.isNew || this.walletId) {

        return next();

    }

    const count = await this.constructor.countDocuments();

    this.walletId = `WAL-${String(count + 1).padStart(6, "0")}`;

    next();

});

// ==========================
// Export Wallet Model
// ==========================

module.exports = mongoose.model("Wallet", walletSchema);