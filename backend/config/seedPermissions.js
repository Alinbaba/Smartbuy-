// ==================================================
// Seed Default SmartBuy Permissions
// ==================================================

const Permission = require("../models/Permission");
const defaultPermissions = require("./defaultPermissions");

const seedPermissions = async () => {

    try {

        for (const permission of defaultPermissions) {

            const exists = await Permission.findOne({
                module: permission.module,
                action: permission.action
            });

            if (!exists) {

                await Permission.create({
    name: `${permission.module}.${permission.action}`,
    module: permission.module,
    action: permission.action,
    description: permission.description,
    isSystemPermission: true,
    isActive: true
});

                console.log(
                    `✅ Permission created: ${permission.module}.${permission.action}`
                );

            }

        }

        console.log("✅ Default SmartBuy permissions seeded successfully.");

    } catch (error) {

        console.error("❌ Permission seeding failed:", error.message);

    }

};

module.exports = seedPermissions;
