const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getJWTSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret || typeof secret !== "string" || secret.length < 32) {
        throw new Error(
            "JWT_SECRET is missing or too weak. It must be at least 32 characters."
        );
    }

    return secret;
};

exports.protect = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (!authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication format."
            });
        }

        const token = authorization.slice(7).trim();

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required."
            });
        }

        const decoded = jwt.verify(
            token,
            getJWTSecret()
        );

        if (
            !decoded ||
            typeof decoded !== "object" ||
            !decoded.id
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token."
            });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed."
            });
        }

        /*
         * The database is the source of truth for the
         * user's current account status and role.
         */

        if (
            user.status !== "active" ||
            user.isActive !== true
        ) {
            return res.status(403).json({
                success: false,
                message: "Account is not active."
            });
        }

        if (!user.role) {
            return res.status(403).json({
                success: false,
                message: "User role is not configured."
            });
        }

        req.user = user;

        next();

    } catch (error) {

        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authentication token."
            });
        }

        console.error(
            "Authentication middleware error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Authentication service error."
        });
    }
};
