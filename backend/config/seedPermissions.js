// ==================================================
// SmartBuy Default Permission Seeder
// ==================================================

const Permission = require("../models/Permission");
const defaultPermissions = require("./defaultPermissions");


// ==================================================
// Seed Default SmartBuy Permissions
// ==================================================

const seedPermissions = async () => {

    try {

        if (
            !Array.isArray(defaultPermissions) ||
            defaultPermissions.length === 0
        ) {
            throw new Error(
                "Default permissions configuration is empty."
            );
        }


        for (const permission of defaultPermissions) {

            if (
                !permission.module ||
                !permission.action
            ) {
                throw new Error(
                    "A default permission is missing its module or action."
                );
            }


            const name =
                `${permission.module}.${permission.action}`;


            const existingPermission =
                await Permission.findOne({
                    name
                });


            if (!existingPermission) {

                await Permission.create({

                    name,

                    module:
                        permission.module,

                    action:
                        permission.action,

                    description:
                        permission.description || "",

                    isSystemPermission:
                        true,

                    isActive:
                        true

                });


                console.log(
                    `✅ Permission created: ${name}`
                );

                continue;
            }


            // ------------------------------------------------
            // System permission definitions are controlled
            // by SmartBuy's application configuration.
            //
            // Name/module/action are intentionally NOT changed
            // here because they are referenced by roles and
            // application authorization rules.
            // ------------------------------------------------

            const updates = {};

            if (
                existingPermission.description !==
                (permission.description || "")
            ) {

                updates.description =
                    permission.description || "";

            }


            if (
                existingPermission.isSystemPermission !== true
            ) {

                updates.isSystemPermission = true;

            }


            if (
                existingPermission.isActive !== true
            ) {

                updates.isActive = true;

            }


            if (
                Object.keys(updates).length > 0
            ) {

                await Permission.updateOne(

                    {
                        _id:
                            existingPermission._id
                    },

                    {
                        $set:
                            updates
                    }

                );


                console.log(
                    `🔄 Permission synchronized: ${name}`
                );

            }

        }


        console.log(
            "✅ Default SmartBuy permissions seeded successfully."
        );


    } catch (error) {

        console.error(
            "❌ Permission seeding failed:",
            error.message
        );

        // Critical:
        // Allow server.js to stop startup if permission
        // initialization fails.
        throw error;

    }

};


module.exports = seedPermissions;
