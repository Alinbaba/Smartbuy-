const mongoose = require("mongoose");

const financeReportSchema = new mongoose.Schema({

    reportNumber: {
        type: String,
        unique: true,
        required: true
    },

    reportType: {
        type: String,
        enum: [
            "daily",
            "weekly",
            "monthly",
            "quarterly",
            "yearly",
            "custom"
        ],
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    totalSales: {
        type: Number,
        default: 0
    },

    totalOrders: {
        type: Number,
        default: 0
    },

    totalRefunds: {
        type: Number,
        default: 0
    },

    totalWithdrawals: {
        type: Number,
        default: 0
    },

    totalRevenue: {
        type: Number,
        default: 0
    },

    totalCommission: {
        type: Number,
        default: 0
    },

    currency: {
        type: String,
        default: "NGN"
    },

    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    status: {
        type: String,
        enum: [
            "draft",
            "generated",
            "approved"
        ],
        default: "generated"
    },

    notes: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("FinanceReport", financeReportSchema);
