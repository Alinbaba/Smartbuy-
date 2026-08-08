const mongoose = require("mongoose");

// ======================================================
// SmartBuy Enterprise Wallet Model
// ======================================================
//
// Purpose:
// This model represents the central financial wallet
// for SmartBuy users.
//
// It manages:
// - Available balance
// - Pending balance
// - Frozen balance
// - Earnings
// - Spending
// - Withdrawals
// - Rewards
// - Cashback
// - Wallet security
// - KYC status
// - Transaction limits
// - Bank/payout information
// - Multi-currency balances
//
// IMPORTANT:
// This model is strictly responsible for storing wallet state.
//
// All financial balance updates must be executed exclusively
// through the SmartBuy financial transaction engine using
// a MongoDB transaction session.
//
// This model does NOT perform or authorize financial operations.
// ======================================================


// ======================================================
// WALLET SCHEMA
// ======================================================

const walletSchema = new mongoose.Schema(

    {

        // ==================================================
        // Wallet Owner
        // ==================================================

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            unique: true,

            index: true

        },


        // ==================================================
        // SmartBuy Wallet ID
        // ==================================================

        walletId: {

            type: String,

            unique: true,

            index: true,

            trim: true

        },


        // ==================================================
        // Wallet Type
        // ==================================================

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

            required: true,

            index: true

        },


        // ==================================================
        // Primary Wallet Currency
        // ==================================================

        currency: {

            type: String,

            default: "NGN",

            required: true,

            uppercase: true,

            trim: true,

            maxlength: 10

        },


        // ==================================================
        // AVAILABLE BALANCE
        // ==================================================
        //
        // Funds currently available for spending or withdrawal.
        // Successful withdrawals are deducted from this field.
        //
        // ==================================================

        availableBalance: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // PENDING BALANCE
        // ==================================================

        pendingBalance: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // FROZEN BALANCE
        // ==================================================

        frozenBalance: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // TOTAL EARNED
        // ==================================================

        totalEarned: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // TOTAL SPENT
        // ==================================================

        totalSpent: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // TOTAL WITHDRAWN
        // ==================================================

        totalWithdrawn: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // REWARD POINTS
        // ==================================================

        rewardPoints: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // CASHBACK BALANCE
        // ==================================================

        cashbackBalance: {

            type: Number,

            default: 0,

            min: 0

        },


        // ==================================================
        // LOYALTY LEVEL
        // ==================================================

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


        // ==================================================
        // WALLET STATUS
        // ==================================================

        isActive: {

            type: Boolean,

            default: true,

            index: true

        },


        // ==================================================
        // WALLET LOCK STATUS
        // ==================================================

        isLocked: {

            type: Boolean,

            default: false,

            index: true

        },


        lockReason: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // LAST TRANSACTION
        // ==================================================

        lastTransactionDate: {

            type: Date,

            default: null

        },


        // ==================================================
        // LAST WITHDRAWAL
        // ==================================================

        lastWithdrawalDate: {

            type: Date,

            default: null

        },


        // ==================================================
        // PRIMARY BANK ACCOUNT
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
        // AVAILABLE PAYMENT METHODS
        // ==================================================

        paymentMethods: [

            {

                type: String,

                trim: true

            }

        ],


        // ==================================================
        // INTERNAL WALLET NOTES
        // ==================================================

        notes: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // TRANSACTION LIMITS
        // ==================================================

        dailyTransactionLimit: {

            type: Number,

            default: 500000,

            min: 0

        },


        monthlyTransactionLimit: {

            type: Number,

            default: 10000000,

            min: 0

        },


        maximumWalletBalance: {

            type: Number,

            default: 50000000,

            min: 0

        },


        // ==================================================
        // KYC STATUS
        // ==================================================

        kycStatus: {

            type: String,

            enum: [

                "not-submitted",

                "pending",

                "verified",

                "rejected"

            ],

            default: "not-submitted",

            index: true

        },


        kycVerifiedAt: {

            type: Date,

            default: null

        },


        // ==================================================
        // WALLET PIN
        // ==================================================
        //
        // IMPORTANT:
        // This field must store a securely HASHED PIN.
        //
        // The service/controller responsible for setting
        // the PIN must hash it prior to persistence.
        //
        // ==================================================

        walletPin: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // LAST LOGIN / DEVICE INFORMATION
        // ==================================================

        lastLogin: {

            type: Date,

            default: null

        },


        lastDevice: {

            type: String,

            default: "",

            trim: true

        },


        lastIPAddress: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // PREFERRED WITHDRAWAL METHOD
        // ==================================================
        //
        // "bank-transfer" is used instead of "bank" to
        // maintain consistency with Withdrawal.withdrawalMethod.
        //
        // ==================================================

        preferredWithdrawalMethod: {

            type: String,

            enum: [

                "bank-transfer",

                "wallet",

                "paypal",

                "payoneer",

                "stripe",

                "flutterwave",

                "paystack",

                "crypto",

                "manual"

            ],

            default: "bank-transfer"

        },


        // ==================================================
        // MULTI-CURRENCY BALANCES
        // ==================================================
        //
        // The primary NGN balance remains fully compatible
        // with the existing withdrawal system.
        //
        // This structure enables future support for
        // additional currencies.
        //
        // ==================================================

        balances: [

            {

                currency: {

                    type: String,

                    required: true,

                    uppercase: true,

                    trim: true,

                    maxlength: 10

                },


                available: {

                    type: Number,

                    default: 0,

                    min: 0

                },


                pending: {

                    type: Number,

                    default: 0,

                    min: 0

                },


                frozen: {

                    type: Number,

                    default: 0,

                    min: 0

                }

            }

        ]

    },

    {

        timestamps: true

    }

);


// ======================================================
// WALLET INDEXES
// ======================================================

walletSchema.index({

    walletType: 1,

    isActive: 1

});


walletSchema.index({

    kycStatus: 1,

    isLocked: 1

});


walletSchema.index({

    createdAt: -1

});


// ======================================================
// GENERATE SMARTBUY WALLET ID
// ======================================================
//
// IMPORTANT:
//
// The system intentionally avoids using countDocuments()
// to prevent race conditions.
//
// Example of unsafe approach:
//
//     WAL-000001
//     WAL-000002
//
// Concurrent executions could generate duplicate IDs.
//
// Instead, a timestamp combined with an ObjectId segment
// is used to ensure uniqueness.
//
// MongoDB unique index provides an additional safeguard
// against collisions.
// ======================================================

walletSchema.pre(

    "save",

    function (next) {

        if (

            !this.isNew ||

            this.walletId

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


        this.walletId =

            `WAL-${timestamp}-${randomPart}`;


        next();

    }

);


// ======================================================
// EXPORT MODEL
// ======================================================

module.exports = mongoose.model(

    "Wallet",

    walletSchema

);
