const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({

    // ==================================================
    // Permission Name (Unique)
    // Example: users.create
    // ==================================================
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    // ==================================================
    // Module
    // Example: users, products, orders
    // ==================================================
    module: {
        type: String,
        required: true,
        trim: true
    },

    // ==================================================
    // Action
    // Example: create, edit, delete
    // ==================================================
    action: {
        type: String,
        required: true,
        trim: true
    },

    // ==================================================
    // Description
    // ==================================================
    description: {
        type: String,
        default: ""
    },

    // ==================================================
    // System Permission
    // Prevent accidental deletion
    // ==================================================
    isSystemPermission: {
        type: Boolean,
        default: true
    },

    // ==================================================
    // Status
    // ==================================================
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Permission", permissionSchema);
