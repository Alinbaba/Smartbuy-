const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ======================================================
// SmartBuy Authentication Middleware
// ======================================================


// ======================================================
// Helper: Require JWT Secret
// ======================================================

const getJWTSecret = () => {

    const secret = process.env.JWT_SECRET;

    if (
        !secret ||
        typeof secret !== "string" ||
        secret.length < 32
    ) {

        throw new Error(
            "JWT_SECRET is missing or too weak. It must be at least 32 characters."
        );

    }

    return secret;

};


// ======================================================
// Protect Route
// ======================================================

exports.protect = async (req, res, next) => {

    try {

        const authorization =
            req.headers.authorization;


        // ------------------------------------------------
        // Authorization header required
        // ------------------------------------------------

        if (!authorization) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });

        }


        // ------------------------------------------------
        // Validate Bearer format
        // ------------------------------------------------

        if (
            !authorization.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication format."

            });

        }


        const token =
            authorization
                .slice(7)
                .trim();


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication token is required."

            });

        }


        // ------------------------------------------------
        // Verify JWT
        // ------------------------------------------------

        const decoded =
            jwt.verify(
                token,
                getJWTSecret()
            );


        // ------------------------------------------------
        // Validate JWT payload
        // ------------------------------------------------

        if (
            !decoded ||
            typeof decoded !== "object" ||
            !decoded.id ||
            typeof decoded.tokenVersion !== "number"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token."

            });

        }


        // ------------------------------------------------
        // Load current user from database
        // ------------------------------------------------

        const user =
            await User.findById(
                decoded.id
            );


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication failed."

            });

        }


        // ------------------------------------------------
        // Check token version
        // ------------------------------------------------

        if (
            user.tokenVersion !==
            decoded.tokenVersion
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication session has expired. Please log in again."

            });

        }


        // ------------------------------------------------
        // Check account status
        // ------------------------------------------------

        if (
            user.status !== "active" ||
            user.isActive !== true
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Account is not active."

            });

        }


        // ------------------------------------------------
        // User must have a role
        // ------------------------------------------------

        if (!user.role) {

            return res.status(403).json({

                success: false,

                message:
                    "User role is not configured."

            });

        }


        // ------------------------------------------------
        // Attach authenticated user
        // ------------------------------------------------

        req.user = user;


        next();

    } catch (error) {


        // ------------------------------------------------
        // Invalid / expired JWT
        // ------------------------------------------------

        if (
            error.name ===
                "TokenExpiredError" ||
            error.name ===
                "JsonWebTokenError" ||
            error.name ===
                "NotBeforeError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid or expired authentication token."

            });

        }


        // ------------------------------------------------
        // Server-side authentication error
        // ------------------------------------------------

        console.error(
            "Authentication middleware error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Authentication service error."

        });

    }

};
