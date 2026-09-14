const mongoose = require("mongoose");

// ======================================================
// SmartBuy Role Schema
// ======================================================
//
// Defines platform roles, their permissions, authority level,
// dashboard access, system-role protection, and permission
// synchronization versioning.
//
// ======================================================

const roleSchema = new mongoose.Schema(
    {
        // ==================================================
        // Role Name
        // ==================================================
        //
        // Unique identifier for the role.
        // Stored in lowercase for consistent authorization.
        //
        name: {
            type: String,
            required: [true, "Role name is required."],
            unique: true,
            trim: true,
            lowercase: true,
            maxlength: 100
        },

        // ==================================================
        // Role Description
        // ==================================================
        //
        // Explains the purpose and responsibility of the role.
        //
        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: 500
        },

        // ==================================================
        // Role Priority
        // ==================================================
        //
        // Higher number = higher authority.
        //
        // Example:
        // super-admin      = 100
        // admin            = 90
        // finance-admin    = 80
        //
        priority: {
            type: Number,
            default: 1,
            min: 0
        },

        // ==================================================
        // Permissions Assigned To This Role
        // ==================================================
        //
        // References Permission documents assigned to the role.
        //
        permissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Permission"
            }
        ],

        // ==================================================
        // Dashboard
        // ==================================================
        //
        // Determines which dashboard interface the role uses.
        //
        // Examples:
        // super-admin
        // admin
        // finance
        // logistics
        // customer-care
        //
        dashboard: {
            type: String,
            default: "default",
            trim: true,
            maxlength: 100
        },

        // ==================================================
        // User Management Authority
        // ==================================================

        canManageUsers: {
            type: Boolean,
            default: false
        },

        // ==================================================
        // Product Management Authority
        // ==================================================

        canManageProducts: {
            type: Boolean,
            default: false
        },

        // ==================================================
        // Order Management Authority
        // ==================================================

        canManageOrders: {
            type: Boolean,
            default: false
        },

        // ==================================================
        // Payment Management Authority
        // ==================================================

        canManagePayments: {
            type: Boolean,
            default: false
        },

        // ==================================================
        // Warehouse Management Authority
        // ==================================================

        canManageWarehouse: {
            type: Boolean,
            default: false
        },

        // ==================================================
        // Analytics Access
        // ==================================================

        canViewAnalytics: {
            type: Boolean,
            default: false
        },

        // ==================================================
        // AI Feature Access
        // ==================================================

        canUseAI: {
            type: Boolean,
            default: false
        },

        // ==================================================
        // System Role
        // ==================================================
        //
        // true  = built-in SmartBuy system role
        // false = custom role created by authorized admin
        //
        // Custom roles MUST NOT automatically become system
        // roles, therefore the default is false.
        //
        isSystemRole: {
            type: Boolean,
            default: false
        },

        // ==================================================
        // Role Active Status
        // ==================================================
        //
        // Inactive roles cannot be used for authorization.
        //
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },

        // ==================================================
        // Role Deletion Protection
        // ==================================================
        //
        // System roles:
        // deletable = false
        //
        // Custom roles:
        // deletable = true
        //
        // System roles are protected from deletion because
        // they are part of SmartBuy's core security structure.
        //
        deletable: {
            type: Boolean,
            default: true
        },

        // ==================================================
        // System Role Permission Version
        // ==================================================
        //
        // Used to safely synchronize built-in SmartBuy role
        // permissions.
        //
        // This prevents every server restart from overwriting
        // permission changes made by the Super Admin.
        //
        // When SmartBuy's official system-role permissions
        // are intentionally changed, the application version
        // can be increased and the seeder will synchronize
        // the role accordingly.
        //
        permissionVersion: {
            type: Number,
            default: 0,
            min: 0
        }
    },

    // ======================================================
    // Automatic CreatedAt / UpdatedAt
    // ======================================================

    {
        timestamps: true
    }
);

// ======================================================
// Role Indexes
// ======================================================

// Helps find roles by name and active status.
roleSchema.index({
    name: 1,
    isActive: 1
});

// Helps sort and identify roles by authority priority.
roleSchema.index({
    priority: -1
});

// ======================================================
// Export Role Model
// ======================================================

module.exports = mongoose.model("Role", roleSchema);
