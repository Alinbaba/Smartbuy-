// ======================================================
// SmartBuy User Controller
// ======================================================

const User = require("../models/User");


// ======================================================
// Create User
// ======================================================

exports.createUser = async (req, res) => {

    try {

        const user = await User.create(req.body);

        return res.status(201).json({

            success: true,

            message: "User created successfully.",

            user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get All Users
// ======================================================

exports.getAllUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password -otpCode")
            .populate("referredBy", "fullName email userId")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: users.length,

            users

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Single User
// ======================================================

exports.getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password -otpCode")
            .populate("referredBy", "fullName email userId");

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        return res.status(200).json({

            success: true,

            user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update User
// ======================================================

exports.updateUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        Object.assign(user, req.body);

        await user.save();

        return res.status(200).json({

            success: true,

            message: "User updated successfully.",

            user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Delete User
// ======================================================

exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        await user.deleteOne();

        return res.status(200).json({

            success: true,

            message: "User deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};