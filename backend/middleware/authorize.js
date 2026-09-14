const Role = require("../models/Role");

// ======================================================
// Permission-Based Authorization Middleware
// ======================================================
//
// Usage:
//
// router.get(
//     "/example",
//     protect,
//     authorize("products.view"),
//     controller
// );
//
// Authorization flow:
//
// Authentication
//      ↓
// req.user
//      ↓
// Active role
//      ↓
// Active permission
//      ↓
// Controller
//
// ======================================================

exports.authorize = (permissionName) => {

    return async (req, res, next) => {

        try {

            // ==================================================
            // Validate Permission Configuration
            // ==================================================

            if (
                typeof permissionName !== "string" ||
                permissionName.trim() === ""
            ) {

                return res.status(500).json({

                    success: false,
                    message: "Authorization configuration error."

                });

            }

            const requiredPermission = permissionName.trim();

            // ==================================================
            // Authentication Check
            // ==================================================

            if (!req.user) {

                return res.status(401).json({

                    success: false,
                    message: "Unauthorized."

                });

            }

            // ==================================================
            // Validate User Role
            // ==================================================

            if (
                typeof req.user.role !== "string" ||
                req.user.role.trim() === ""
            ) {

                return res.status(403).json({

                    success: false,
                    message: "User role is not assigned."

                });

            }

            const userRole = req.user.role.trim().toLowerCase();

            // ==================================================
            // Super Admin
            // ==================================================
            //
            // Super Admin has platform-level authority and does
            // not require individual permission checks.
            //
            // Authentication middleware must already have verified
            // that this is an active, authenticated account.
            //
            if (userRole === "super-admin") {

                return next();

            }

            // ==================================================
            // Load Active Role
            // ==================================================

            const role = await Role.findOne({

                name: userRole,
                isActive: true

            }).populate({

                path: "permissions",

                match: {
                    isActive: true
                },

                select: "name module action isActive"

            });

            // ==================================================
            // Role Not Found
            // ==================================================

            if (!role) {

                return res.status(403).json({

                    success: false,
                    message: "User role is not authorized."

                });

            }

            // ==================================================
            // Verify Role Is Active
            // ==================================================

            if (role.isActive !== true) {

                return res.status(403).json({

                    success: false,
                    message: "User role is inactive."

                });

            }

            // ==================================================
            // Permission Check
            // ==================================================
            //
            // Because populate() uses:
            //
            // match: { isActive: true }
            //
            // inactive permissions are automatically excluded.
            //
            const hasPermission = role.permissions.some(

                permission =>
                    permission &&
                    permission.isActive === true &&
                    permission.name === requiredPermission

            );

            // ==================================================
            // Access Denied
            // ==================================================

            if (!hasPermission) {

                return res.status(403).json({

                    success: false,
                    message: "You do not have permission to perform this action."

                });

            }

            // ==================================================
            // Authorization Successful
            // ==================================================

            return next();

        } catch (error) {

            // ==================================================
            // Internal Authorization Error
            // ==================================================
            //
            // Do not expose internal database or application
            // error details to the client.
            //
            console.error(
                "Authorization middleware error:",
                error
            );

            return res.status(500).json({

                success: false,
                message: "Authorization service error."

            });

        }

    };

};
