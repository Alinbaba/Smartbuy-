const Role = require("../models/Role");
const Permission = require("../models/Permission");
// ======================================
// Create Role
// ======================================

exports.createRole = async (req, res) => {

    try {

        const { name, description, permissions } = req.body;

        // Check if role already exists
        const existingRole = await Role.findOne({ name });

        if (existingRole) {

            return res.status(400).json({
                success: false,
                message: "Role already exists."
            });

        }

        const role = await Role.create({

            name,
            description,
            permissions

        });

        res.status(201).json({

            success: true,
            message: "Role created successfully.",
            role

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================
// Get All Roles
// ======================================

exports.getRoles = async (req, res) => {

    try {

        const roles = await Role.find().sort({ createdAt: -1 });

        res.status(200).json({

            success: true,
            count: roles.length,
            roles

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================
// Get Single Role
// ======================================

exports.getRole = async (req, res) => {

    try {

        const role = await Role.findById(req.params.id);

        if (!role) {

            return res.status(404).json({

                success: false,
                message: "Role not found."

            });

        }

        res.status(200).json({

            success: true,
            role

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================
// Update Role
// ======================================

exports.updateRole = async (req, res) => {

    try {

        const role = await Role.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        if (!role) {

            return res.status(404).json({

                success: false,
                message: "Role not found."

            });

        }

        res.status(200).json({

            success: true,
            message: "Role updated successfully.",
            role

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================
// Delete Role
// ======================================

exports.deleteRole = async (req, res) => {

    try {

        const role = await Role.findById(req.params.id);

        if (!role) {

            return res.status(404).json({

                success: false,
                message: "Role not found."

            });

        }

        await role.deleteOne();

        res.status(200).json({

            success: true,
            message: "Role deleted successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
// ==================================================
//>>> Assign Permissions To A Role
// ==================================================

exports.assignPermissions = async (req, res) => {

    try {

        const { permissions } = req.body;

        const role = await Role.findById(req.params.id);

        if (!role) {

            return res.status(404).json({

                success: false,
                message: "Role not found."

            });

        }

        // Validate all permission IDs

        const permissionCount = await Permission.countDocuments({

            _id: { $in: permissions }

        });

        if (permissionCount !== permissions.length) {

            return res.status(400).json({

                success: false,
                message: "One or more permission IDs are invalid."

            });

        }

        role.permissions = permissions;

        await role.save();

        const updatedRole = await Role.findById(role._id)
            .populate("permissions");

        res.status(200).json({

            success: true,
            message: "Permissions assigned successfully.",
            role: updatedRole

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ==================================================
// >>>Get Role With Permissions
// ==================================================

exports.getRolePermissions = async (req, res) => {

    try {

        const role = await Role.findById(req.params.id)
            .populate("permissions");

        if (!role) {

            return res.status(404).json({

                success: false,
                message: "Role not found."

            });

        }

        res.status(200).json({

            success: true,
            role

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ==================================================
// >>>Remove All Permissions From Role
// ==================================================

exports.clearPermissions = async (req, res) => {

    try {

        const role = await Role.findById(req.params.id);

        if (!role) {

            return res.status(404).json({

                success: false,
                message: "Role not found."

            });

        }

        role.permissions = [];

        await role.save();

        res.status(200).json({

            success: true,
            message: "All permissions removed successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
