const Role = require("../models/Role");

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
