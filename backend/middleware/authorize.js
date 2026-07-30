const Role = require("../models/Role");

// ==================================================
// Permission-Based Authorization Middleware
// ==================================================

exports.authorize = (permissionName) => {

    return async (req, res, next) => {

        try {

            // User must already be authenticated
            if (!req.user) {

                return res.status(401).json({

                    success: false,
                    message: "Unauthorized."

                });

            }

            // Super Admin bypasses all permission checks
            if (req.user.role === "super-admin") {

                return next();

            }

            // Find the user's role and load permissions
            const role = await Role.findOne({

                name: req.user.role,
                isActive: true

            }).populate("permissions");

            if (!role) {

                return res.status(403).json({

                    success: false,
                    message: "Role not found."

                });

            }

            // Check whether the role has the required permission
            const hasPermission = role.permissions.some(

                permission => permission.name === permissionName

            );

            if (!hasPermission) {

                return res.status(403).json({

                    success: false,
                    message: "Access denied."

                });

            }

            next();

        } catch (error) {

            return res.status(500).json({

                success: false,
                message: error.message

            });

        }

    };

};
