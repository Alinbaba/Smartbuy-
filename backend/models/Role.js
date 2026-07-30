const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({

    // ======================================
    // Role Name
    // ======================================
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    // ======================================
    // Description
    // ======================================
    description: {
        type: String,
        default: ""
    },

    // ==================================================
// Role Priority
// Higher number = higher authority
// ==================================================

   priority: {
      type: Number,
      default: 1
},

    // ======================================
    // Permissions
    // ======================================
    permissions: [{
        type: String,
        trim: true
    }],

    // ======================================
    // Dashboard this role uses
    // ======================================
    dashboard: {
        type: String,
        default: "default"
    },

    // ======================================
    // Can this role manage users?
    // ======================================
    canManageUsers: {
        type: Boolean,
        default: false
    },

    // ======================================
    // Can this role manage products?
    // ======================================
    canManageProducts: {
        type: Boolean,
        default: false
    },

    // ======================================
    // Can this role manage orders?
    // ======================================
    canManageOrders: {
        type: Boolean,
        default: false
    },

    // ======================================
    // Can this role manage payments?
    // ======================================
    canManagePayments: {
        type: Boolean,
        default: false
    },

    // ======================================
    // Can this role manage warehouses?
    // ======================================
    canManageWarehouse: {
        type: Boolean,
        default: false
    },

    // ======================================
    // Can this role view analytics?
    // ======================================
    canViewAnalytics: {
        type: Boolean,
        default: false
    },

    // ======================================
    // Can this role use AI features?
    // ======================================
    canUseAI: {
        type: Boolean,
        default: false
    },

// ==================================================
// System Role
// Prevents important roles from being deleted
// ==================================================

    isSystemRole: {
       type: Boolean,
       default: false
},
    
    // ======================================
    // Is role active?
    // ======================================
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Role", roleSchema);
