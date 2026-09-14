const Role = require("../models/Role");
const Permission = require("../models/Permission");

// ======================================
// Helper: Check Super Admin
// ======================================

const isSuperAdmin = (req) => {
    return req.user && req.user.role === "super-admin";
};


// ======================================
// Create Role
// ======================================

exports.createRole = async (req, res) => {

    try {

        const {
            name,
            description,
            permissions
        } = req.body;

        // Basic validation
        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Role name is required."
            });

        }

        // Prevent ordinary admins from creating Super Admin
        if (
            name.trim().toLowerCase() === "super-admin" &&
            !isSuperAdmin(req)
        ) {

            return res.status(403).json({
                success: false,
                message: "Only Super Admin can create the Super Admin role."
            });

        }

        // Check if role already exists
        const existingRole = await Role.findOne({
            name: name.trim()
        });

        if (existingRole) {

            return res.status(400).json({
                success: false,
                message: "Role already exists."
            });

        }

        // Validate permissions if supplied
        let validPermissions = [];

        if (permissions !== undefined) {

            if (!Array.isArray(permissions)) {

                return res.status(400).json({
                    success: false,
                    message: "Permissions must be an array."
                });

            }

            const uniquePermissions = [
                ...new Set(permissions.map(String))
            ];

            const permissionCount = await Permission.countDocuments({
                _id: { $in: uniquePermissions }
            });

            if (permissionCount !== uniquePermissions.length) {

                return res.status(400).json({
                    success: false,
                    message: "One or more permission IDs are invalid."
                });

            }

            validPermissions = uniquePermissions;
        }

        const role = await Role.create({

            name: name.trim(),
            description: description || "",
            permissions: validPermissions

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

        const roles = await Role.find()
            .populate("permissions")
            .sort({ createdAt: -1 });

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

exports.getRoleById = async (req, res) => {

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


// ======================================
// Update Role
// ======================================

exports.updateRole = async (req, res) => {

    try {

        const role = await Role.findById(req.params.id);

        if (!role) {

            return res.status(404).json({

                success: false,
                message: "Role not found."

            });

        }

        // Protected system roles can only be modified by Super Admin
        if (role.isSystemRole && !isSuperAdmin(req)) {

            return res.status(403).json({

                success: false,
                message: "Only Super Admin can modify a system role."

            });

        }

        // Only allow safe fields to be updated
        const allowedFields = [
            "name",
            "description",
            "priority",
            "dashboard",
            "isActive"
        ];

        allowedFields.forEach(field => {

            if (req.body[field] !== undefined) {

                role[field] = req.body[field];

            }

        });

        // Prevent changing a role into Super Admin
        if (
            role.name.trim().toLowerCase() === "super-admin" &&
            !isSuperAdmin(req)
        ) {

            return res.status(403).json({

                success: false,
                message: "Only Super Admin can manage the Super Admin role."

            });

        }

        await role.save();

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

        // System roles are protected
        if (role.isSystemRole) {

            return res.status(403).json({

                success: false,
                message: "System roles cannot be deleted."

            });

        }

        // Role must explicitly be marked deletable
        if (!role.deletable) {

            return res.status(403).json({

                success: false,
                message: "This role is not marked as deletable."

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


// ======================================
// Assign Permissions To A Role
// ======================================

exports.assignPermissions = async (req, res) => {

    try {

        const { permissions } = req.body;

        if (!Array.isArray(permissions)) {

            return res.status(400).json({

                success: false,
                message: "Permissions must be an array."

            });

        }

        const role = await Role.findById(req.params.id);

        if (!role) {

            return res.status(404).json({

                success: false,
                message: "Role not found."

            });

        }

        // Only Super Admin can modify system roles
        if (role.isSystemRole && !isSuperAdmin(req)) {

            return res.status(403).json({

                success: false,
                message: "Only Super Admin can modify permissions of a system role."

            });

        }

        // Remove duplicate permission IDs
        const uniquePermissions = [
            ...new Set(permissions.map(String))
        ];

        // Validate all permission IDs
        const permissionCount = await Permission.countDocuments({

            _id: { $in: uniquePermissions }

        });

        if (permissionCount !== uniquePermissions.length) {

            return res.status(400).json({

                success: false,
                message: "One or more permission IDs are invalid."

            });

        }

        role.permissions = uniquePermissions;

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


// ======================================
// Get Role With Permissions
// ======================================

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


// ======================================
// Remove All Permissions From Role
// ======================================

exports.clearPermissions = async (req, res) => {

    try {

        const role = await Role.findById(req.params.id);

        if (!role) {

            return res.status(404).json({

                success: false,
                message: "Role not found."

            });

        }

        // Only Super Admin can modify system roles
        if (role.isSystemRole && !isSuperAdmin(req)) {

            return res.status(403).json({

                success: false,
                message: "Only Super Admin can modify permissions of a system role."

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
