const Permission = require("../models/Permission");

// ==================================================
// Helper: Check Super Admin
// ==================================================

const isSuperAdmin = (req) => {
    return req.user && req.user.role === "super-admin";
};


// ==================================================
// Create Permission
// ==================================================

exports.createPermission = async (req, res) => {

    try {

        const {
            module,
            action,
            description
        } = req.body;

        // Validate required fields
        if (!module || !action) {

            return res.status(400).json({

                success: false,
                message: "Module and action are required."

            });

        }

        const cleanModule = module.trim();
        const cleanAction = action.trim();

        const name = `${cleanModule}.${cleanAction}`;

        // Check if permission already exists
        const existingPermission = await Permission.findOne({
            name
        });

        if (existingPermission) {

            return res.status(400).json({

                success: false,
                message: "Permission already exists."

            });

        }

        const permission = await Permission.create({

            name,
            module: cleanModule,
            action: cleanAction,
            description: description || "",
            isSystemPermission: false,
            isActive: true

        });

        res.status(201).json({

            success: true,
            message: "Permission created successfully.",
            permission

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// ==================================================
// Get All Permissions
// ==================================================

exports.getPermissions = async (req, res) => {

    try {

        const permissions = await Permission.find()
            .sort({
                module: 1,
                action: 1
            });

        res.status(200).json({

            success: true,
            count: permissions.length,
            permissions

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// ==================================================
// Get Permission By ID
// ==================================================

exports.getPermissionById = async (req, res) => {

    try {

        const permission = await Permission.findById(req.params.id);

        if (!permission) {

            return res.status(404).json({

                success: false,
                message: "Permission not found."

            });

        }

        res.status(200).json({

            success: true,
            permission

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// ==================================================
// Update Permission
// ==================================================

exports.updatePermission = async (req, res) => {

    try {

        const permission = await Permission.findById(req.params.id);

        if (!permission) {

            return res.status(404).json({

                success: false,
                message: "Permission not found."

            });

        }

        // System permissions are protected
        if (
            permission.isSystemPermission &&
            !isSuperAdmin(req)
        ) {

            return res.status(403).json({

                success: false,
                message: "Only Super Admin can modify a system permission."

            });

        }

        /*
         * IMPORTANT:
         *
         * We do not allow normal administrators to rename
         * system permissions because roles depend on
         * permission names.
         */

        if (
            permission.isSystemPermission &&
            !isSuperAdmin(req)
        ) {

            return res.status(403).json({

                success: false,
                message: "System permission structure is protected."

            });

        }

        // Update module
        if (req.body.module !== undefined) {

            if (
                typeof req.body.module !== "string" ||
                !req.body.module.trim()
            ) {

                return res.status(400).json({

                    success: false,
                    message: "Module must be a valid string."

                });

            }

            permission.module = req.body.module.trim();

        }

        // Update action
        if (req.body.action !== undefined) {

            if (
                typeof req.body.action !== "string" ||
                !req.body.action.trim()
            ) {

                return res.status(400).json({

                    success: false,
                    message: "Action must be a valid string."

                });

            }

            permission.action = req.body.action.trim();

        }

        // Update description
        if (req.body.description !== undefined) {

            permission.description = req.body.description;

        }

        // Update active state
        if (req.body.isActive !== undefined) {

            if (typeof req.body.isActive !== "boolean") {

                return res.status(400).json({

                    success: false,
                    message: "isActive must be true or false."

                });

            }

            permission.isActive = req.body.isActive;

        }

        // Generate new name
        const newName = `${permission.module}.${permission.action}`;

        // Check duplicate name
        const duplicate = await Permission.findOne({

            name: newName,
            _id: { $ne: permission._id }

        });

        if (duplicate) {

            return res.status(400).json({

                success: false,
                message: "Another permission with this name already exists."

            });

        }

        permission.name = newName;

        await permission.save();

        res.status(200).json({

            success: true,
            message: "Permission updated successfully.",
            permission

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// ==================================================
// Delete Permission
// ==================================================

exports.deletePermission = async (req, res) => {

    try {

        const permission = await Permission.findById(req.params.id);

        if (!permission) {

            return res.status(404).json({

                success: false,
                message: "Permission not found."

            });

        }

        // System permissions cannot be deleted
        if (permission.isSystemPermission) {

            return res.status(403).json({

                success: false,
                message: "System permissions cannot be deleted."

            });

        }

        await permission.deleteOne();

        res.status(200).json({

            success: true,
            message: "Permission deleted successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
