const Role = require("../models/Role");
const Permission = require("../models/Permission");

// ======================================================
// Seed Default SmartBuy Roles
// ======================================================

// ======================================================
// Seed Default SmartBuy Roles
// ======================================================

const seedRoles = async () => {

    try {

        // ===============================================
        // Load all permissions
        // ===============================================

        const allPermissions = await Permission.find();

        const permissionMap = {};

        allPermissions.forEach(permission => {

            permissionMap[permission.name] = permission._id;

        });

        // ===============================================
        // Default Roles
        // ===============================================

        const defaultRoles = [

            {
                name: "super-admin",
                description: "Full system access.",
                dashboard: "super-admin",
                isSystemRole: true,
                priority: 100,
                permissions: allPermissions.map(p => p._id)
            },

            {
                name: "admin",
                description: "General administration.",
                dashboard: "admin",
                isSystemRole: true,
                priority: 90,
                permissions: [

                    permissionMap["dashboard.view"],

                    permissionMap["users.view"],
                    permissionMap["users.create"],
                    permissionMap["users.edit"],

                    permissionMap["products.view"],
                    permissionMap["products.create"],
                    permissionMap["products.edit"],

                    permissionMap["orders.view"],
                    permissionMap["orders.edit"]

                ].filter(Boolean)
            },

            {
                name: "finance-admin",
                description: "Finance department.",
                dashboard: "finance",
                isSystemRole: true,
                priority: 80,
                permissions: [

                    permissionMap["payments.view"],

                    permissionMap["transactions.view"],
                    permissionMap["transactions.export"],
                    permissionMap["transactions.manage"],

                    permissionMap["wallets.view"],
                    permissionMap["wallets.credit"],
                    permissionMap["wallets.debit"],
                    permissionMap["wallets.freeze"],
                    permissionMap["wallets.manage"],

                    permissionMap["withdrawals.view"],
                    permissionMap["withdrawals.approve"],
                    permissionMap["withdrawals.reject"],
                    permissionMap["withdrawals.manage"]

                ].filter(Boolean)
            }

        ];

        // ===============================================
        // Create Roles
        // ===============================================

        for (const role of defaultRoles) {

            const exists = await Role.findOne({

                name: role.name

            });

            if (!exists) {

                await Role.create(role);

                console.log(`✅ Role created: ${role.name}`);

            } else {

                await Role.updateOne(

                    { _id: exists._id },

                    {

                        $set: {

                            permissions: role.permissions

                        }

                    }

                );

                console.log(`✅ Role updated: ${role.name}`);

            }

        }

        console.log("✅ SmartBuy roles seeded successfully.");

    } catch (error) {

        console.error(error);

    }

};

module.exports = seedRoles;
