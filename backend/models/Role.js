const mongoose = require("mongoose");

// ======================================================
// Role Schema
// This model stores all user roles in the SmartBuy system.
// Examples:
// - Customer
// - Seller
// - Super Admin
// - AI Admin
// - Warehouse Staff
// - Logistics Admin
// ======================================================

const roleSchema = new mongoose.Schema({

    // ==================================================
    // Role Name
    // Must be unique.
    // Example: "customer", "super-admin"
    // ==================================================
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    // ==================================================
    // Role Description
    // Short explanation of the role.
    // ==================================================
    description: {
        type: String,
        default: ""
    },

    // ==================================================
    // Department
    // Helps group administrative roles.
    // Example:
    // Finance
    // Logistics
    // Warehouse
    // AI
    // Customer Care
    // ==================================================
    department: {
        type: String,
        default: ""
    },

    // ==================================================
    // Role Level
    // Used for role hierarchy.
    // Higher number = Higher authority.
    // Example:
    // Customer = 1
    // Seller = 30
    // Admin = 80
    // Super Admin = 100
    // ==================================================
    level: {
        type: Number,
        default: 1
    },

    // ==================================================
    // Permissions
    // Stores permission names.
    // We are keeping this as String to avoid breaking the
    // current deployment. We can migrate later if needed.
    // ==================================================
    permissions: [{
        type: String
    }],

    // ==================================================
    // Active Status
    // Allows a role to be disabled without deleting it.
    // ==================================================
    isActive: {
        type: Boolean,
        default: true
    },

    // ==================================================
    // System Role
    // Prevents important roles from accidental deletion.
    // Example:
    // Super Admin
    // Customer
    // ==================================================
    isSystemRole: {
        type: Boolean,
        default: false
    },

    // ==================================================
    // Editable
    // If false, the role cannot be edited.
    // ==================================================
    editable: {
        type: Boolean,
        default: true
    }

}, {

    // Automatically create:
    // createdAt
    // updatedAt
    timestamps: true

});

// ======================================================
// Export Role Model
// ======================================================

module.exports = mongoose.model("Role", roleSchema);
