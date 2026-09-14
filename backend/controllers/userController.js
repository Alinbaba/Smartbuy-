// ======================================================
// SmartBuy User Controller
// ======================================================

const User = require("../models/User");


// ======================================================
// Helper: Check Super Admin
// ======================================================

const isSuperAdmin = (req) => {

    return req.user && req.user.role === "super-admin";

};


// ======================================================
// Helper: Remove Sensitive User Fields
// ======================================================

const sanitizeUser = (user) => {

    const userObject = user.toObject
        ? user.toObject()
        : { ...user };

    delete userObject.password;
    delete userObject.otpCode;
    delete userObject.refreshToken;
    delete userObject.passwordResetToken;
    delete userObject.resetToken;

    return userObject;

};


// ======================================================
// Protected Roles
// ======================================================

const protectedRoles = [

    "super-admin",
    "admin",
    "finance-admin",
    "security-admin",
    "ai-admin"

];


// ======================================================
// Create User
// ======================================================

exports.createUser = async (req, res) => {

    try {

        const {

            fullName,
            username,
            email,
            phone,
            country,
            password,
            role,
            isActive

        } = req.body;


        // ------------------------------------------
        // Required fields
        // ------------------------------------------

        if (!fullName || !password) {

            return res.status(400).json({

                success: false,
                message: "Full name and password are required."

            });

        }


        // ------------------------------------------
        // Only Super Admin can create privileged roles
        // ------------------------------------------

        const requestedRole = role || "customer";

        if (
            protectedRoles.includes(requestedRole) &&
            !isSuperAdmin(req)
        ) {

            return res.status(403).json({

                success: false,
                message:
                    "Only Super Admin can create users with this role."

            });

        }


        // ------------------------------------------
        // Prevent creation of another Super Admin
        // ------------------------------------------

        if (
            requestedRole === "super-admin" &&
            !isSuperAdmin(req)
        ) {

            return res.status(403).json({

                success: false,
                message:
                    "Only Super Admin can create a Super Admin."

            });

        }


        // ------------------------------------------
        // Build user using approved fields only
        // ------------------------------------------

        const userData = {

            fullName,
            username,
            email,
            phone,
            country,
            password,
            role: requestedRole

        };


        // Only Super Admin can explicitly control
        // account activation during creation
        if (
            isActive !== undefined &&
            isSuperAdmin(req)
        ) {

            userData.isActive = isActive;

        }


        const user = await User.create(userData);


        return res.status(201).json({

            success: true,

            message: "User created successfully.",

            user: sanitizeUser(user)

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
            .select(
                "-password " +
                "-otpCode " +
                "-refreshToken " +
                "-passwordResetToken " +
                "-resetToken"
            )
            .populate(
                "referredBy",
                "fullName email userId"
            )
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
            .select(
                "-password " +
                "-otpCode " +
                "-refreshToken " +
                "-passwordResetToken " +
                "-resetToken"
            )
            .populate(
                "referredBy",
                "fullName email userId"
            );


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


        // ------------------------------------------
        // Prevent an administrator from modifying
        // their own account through this admin endpoint
        // ------------------------------------------

        if (
            user._id.toString() === req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Use the appropriate account-security endpoint to modify your own account."

            });

        }


        // ------------------------------------------
        // Protected target roles
        // ------------------------------------------

        if (
            protectedRoles.includes(user.role) &&
            !isSuperAdmin(req)
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Only Super Admin can modify a protected administrator account."

            });

        }


        // ------------------------------------------
        // Role change
        // ------------------------------------------

        if (req.body.role !== undefined) {

            const newRole = req.body.role;


            // Only Super Admin can change administrator roles
            if (
                protectedRoles.includes(newRole) &&
                !isSuperAdmin(req)
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Only Super Admin can assign this administrator role."

                });

            }


            // Nobody except Super Admin can assign Super Admin
            if (
                newRole === "super-admin" &&
                !isSuperAdmin(req)
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Only Super Admin can assign the Super Admin role."

                });

            }


            user.role = newRole;

        }


        // ------------------------------------------
        // Safe editable profile fields
        // ------------------------------------------

        const allowedFields = [

            "fullName",
            "username",
            "email",
            "phone",
            "country",
            "avatar",
            "language",
            "currency",
            "gender",
            "dateOfBirth"

        ];


        allowedFields.forEach((field) => {

            if (req.body[field] !==
