const Permission = require("../models/Permission");

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

        // Generate permission name automatically
        const name = `${module}.${action}`;

        // Check if permission already exists
        const existingPermission = await Permission.findOne({ name });

        if (existingPermission) {

            return res.status(400).json({

                success: false,
                message: "Permission already exists."

            });

        }

        const permission = await Permission.create({

            name,
            module,
            action,
            description

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
            .sort({ module: 1, action: 1 });

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

        permission.module = req.body.module || permission.module;
        permission.action = req.body.action || permission.action;
        permission.description = req.body.description || permission.description;
        permission.isActive =
            req.body.isActive !== undefined
                ? req.body.isActive
                : permission.isActive;

        // Update permission name automatically
        permission.name = `${permission.module}.${permission.action}`;

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

        // Prevent deleting system permissions
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
