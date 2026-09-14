const Role = require("../models/Role");
const Permission = require("../models/Permission");

// ======================================================
// SmartBuy System Role Permission Definition Version
// ======================================================
//
// Increase this number only when SmartBuy's built-in
// system-role permission definitions are intentionally
// changed.
//
// Existing Super Admin permission changes are preserved
// when the database role is already on the current version.
//
// ======================================================

const SYSTEM_ROLE_PERMISSION_VERSION = 1;

// ======================================================
// Seed Default SmartBuy Roles
// ======================================================

const seedRoles = async () => {
    try {
        // ===============================================
        // Load active system permissions
        // ===============================================

        const allPermissions = await Permission.find({
            isActive: true
        }).select("_id name");

        if (!allPermissions.length) {
            throw new Error(
                "No active permissions were found. Seed permissions before roles."
            );
        }

        // ===============================================
        // Build permission map
        // ===============================================

        const permissionMap = new Map();

        for (const permission of allPermissions) {
            permissionMap.set(
                permission.name,
                permission._id
            );
        }

        // ===============================================
        // Permission resolver
        // ===============================================

        const getRequiredPermissions = (roleName, permissionNames) => {
            const permissions = [];

            for (const permissionName of permissionNames) {
                const permissionId = permissionMap.get(permissionName);

                if (!permissionId) {
                    throw new Error(
                        `Required permission "${permissionName}" is missing for system role "${roleName}".`
                    );
                }

                permissions.push(permissionId);
            }

            return permissions;
        };

        // ===============================================
        // Default system roles
        // ===============================================

        const defaultRoles = [
            {
                name: "super-admin",

                description:
                    "Full system access and ultimate platform authority.",

                dashboard: "super-admin",

                isSystemRole: true,

                isActive: true,

                deletable: false,

                priority: 100,

                permissions: allPermissions.map(
                    permission => permission._id
                ),

                permissionVersion:
                    SYSTEM_ROLE_PERMISSION_VERSION
            },

            {
                name: "admin",

                description:
                    "General platform administration with controlled administrative access.",

                dashboard: "admin",

                isSystemRole: true,

                isActive: true,

                deletable: false,

                priority: 90,

                permissions: getRequiredPermissions(
                    "admin",
                    [
                        "dashboard.view",

                        "users.view",
                        "users.create",
                        "users.edit",

                        "products.view",
                        "products.create",
                        "products.edit",

                        "orders.view",
                        "orders.edit"
                    ]
                ),

                permissionVersion:
                    SYSTEM_ROLE_PERMISSION_VERSION
            },

            {
                name: "finance-admin",

                description:
                    "Finance department administration for payments, transactions, wallets and withdrawals.",

                dashboard: "finance",

                isSystemRole: true,

                isActive: true,

                deletable: false,

                priority: 80,

                permissions: getRequiredPermissions(
                    "finance-admin",
                    [
                        "dashboard.view",

                        "payments.view",

                        "transactions.view",
                        "transactions.export",
                        "transactions.manage",

                        "wallets.view",
                        "wallets.credit",
                        "wallets.debit",
                        "wallets.freeze",
                        "wallets.manage",

                        "withdrawals.view",
                        "withdrawals.approve",
                        "withdrawals.reject",
                        "withdrawals.manage"
                    ]
                ),

                permissionVersion:
                    SYSTEM_ROLE_PERMISSION_VERSION
            }
        ];

        // ===============================================
        // Create / synchronize system roles
        // ===============================================

        for (const roleDefinition of defaultRoles) {
            const existingRole = await Role.findOne({
                name: roleDefinition.name
            });

            // ===========================================
            // Create missing role
            // ===========================================

            if (!existingRole) {
                await Role.create(roleDefinition);

                console.log(
                    `✅ System role created: ${roleDefinition.name}`
                );

                continue;
            }

            // ===========================================
            // Protect system-role identity
            // ===========================================

            const updates = {};

            if (existingRole.isSystemRole !== true) {
                updates.isSystemRole = true;
            }

            if (existingRole.deletable !== false) {
                updates.deletable = false;
            }

            if (existingRole.isActive !== true) {
                updates.isActive = true;
            }

            if (
                existingRole.description !==
                roleDefinition.description
            ) {
                updates.description =
                    roleDefinition.description;
            }

            if (
                existingRole.dashboard !==
                roleDefinition.dashboard
            ) {
                updates.dashboard =
                    roleDefinition.dashboard;
            }

            if (
                existingRole.priority !==
                roleDefinition.priority
            ) {
                updates.priority =
                    roleDefinition.priority;
            }

            // ===========================================
            // Controlled permission synchronization
            // ===========================================
            //
            // Only synchronize permissions when the stored
            // role is using an older definition version.
            //
            // Once the role reaches the current version,
            // Super Admin can manage its permissions without
            // every server restart overwriting those changes.
            //
            // ===========================================

            const storedPermissionVersion =
                Number(existingRole.permissionVersion || 0);

            if (
                storedPermissionVersion <
                SYSTEM_ROLE_PERMISSION_VERSION
            ) {
                updates.permissions =
                    roleDefinition.permissions;

                updates.permissionVersion =
                    SYSTEM_ROLE_PERMISSION_VERSION;

                console.log(
                    `🔄 System role permissions synchronized: ${roleDefinition.name}`
                );
            }

            // ===========================================
            // Apply metadata / permission updates
            // ===========================================

            if (Object.keys(updates).length > 0) {
                await Role.updateOne(
                    {
                        _id: existingRole._id
                    },
                    {
                        $set: updates
                    }
                );

                console.log(
                    `✅ System role synchronized: ${roleDefinition.name}`
                );
            } else {
                console.log(
                    `✅ System role verified: ${roleDefinition.name}`
                );
            }
        }

        console.log(
            "✅ SmartBuy system roles seeded successfully."
        );
    } catch (error) {
        console.error(
            "❌ SmartBuy role seeding failed:",
            error.message
        );

        // Important:
        // Do not allow the application to start with an
        // incomplete or inconsistent security configuration.
        throw error;
    }
};

module.exports = seedRoles;
