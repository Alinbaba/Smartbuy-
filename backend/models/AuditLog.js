const mongoose = require("mongoose");
const auditLogSchema = new mongoose.Schema({
    // ==========================
    // User Information
    // ==========================

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null

    },

    userId: {

        type: String,

        default: ""

    },

    fullName: {

        type: String,

        default: ""

    },

    role: {

        type: String,

        default: ""

    },    // ==========================
    // Action Information
    // ==========================

    action: {

        type: String,

        required: true

    },

    module: {

        type: String,

        required: true,

        enum: [
    "authentication",
    "users",
    "roles",
    "permissions",
    "products",
    "categories",
    "orders",
    "wallet",
    "payments",
    "transactions",
    "kyc",
    "uploads",
    "notifications",
    "reviews",
    "coupons",
    "stores",
    "manufacturers",
    "wholesalers",
    "affiliates",
    "shipping",
    "inventory",
    "advertisements",
    "support",
    "analytics",
    "reports",
    "settings",
    "system"
]

    },

    description: {

        type: String,

        required: true

    },

    status: {

        type: String,

        enum: [

            "success",

            "failed",

            "warning"

        ],

        default: "success"

    },
        // ==========================
    // Target Information
    // ==========================

    targetModel: {

        type: String,

        default: ""

    },

    targetId: {

        type: mongoose.Schema.Types.ObjectId,

        default: null

    },

    targetName: {

        type: String,

        default: ""

    },
        // ==========================
    // Request Information
    // ==========================

    ipAddress: {

        type: String,

        default: ""

    },

    userAgent: {

        type: String,

        default: ""

    },

    device: {

        type: String,

        default: ""

    },

    browser: {

        type: String,

        default: ""

    },

    operatingSystem: {

        type: String,

        default: ""

    },

    method: {

        type: String,

        default: ""

    },

    endpoint: {

        type: String,

        default: ""

    },
        // ==========================
    // Change Tracking
    // ==========================

    oldValues: {

        type: Object,

        default: {}

    },

    newValues: {

        type: Object,

        default: {}

    },

    changes: {

        type: [String],

        default: []

    },
        // ==========================
    // Error Information
    // ==========================

    errorMessage: {

        type: String,

        default: ""

    },

    errorStack: {

        type: String,

        default: ""

    },
        // ==========================
    // Extra Metadata
    // ==========================

    metadata: {

        type: Object,

        default: {}

    }

}, {

    timestamps: true

});
// ==========================
// Database Indexes
// ==========================

auditLogSchema.index({ user: 1 });

auditLogSchema.index({ module: 1 });

auditLogSchema.index({ action: 1 });

auditLogSchema.index({ createdAt: -1 });

auditLogSchema.index({ status: 1 });
// ==========================
// Export Audit Log Model
// ==========================

module.exports = mongoose.model("AuditLog", auditLogSchema);
