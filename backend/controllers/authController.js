const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


// ======================================================
// SmartBuy Authentication Controller
// ======================================================


// ======================================================
// Helper: Require JWT Secret
// ======================================================

const getJWTSecret = () => {

    if (!process.env.JWT_SECRET) {

        throw new Error(
            "JWT_SECRET is not configured."
        );

    }

    return process.env.JWT_SECRET;

};


// ======================================================
// Helper: Generate JWT
// ======================================================

const generateToken = (user) => {

    return jwt.sign(

        {
            id: user._id,
            role: user.role
        },

        getJWTSecret(),

        {
            expiresIn: "7d"
        }

    );

};


// ======================================================
// Helper: Normalize Email
// ======================================================

const normalizeEmail = (email) => {

    if (!email) {
        return undefined;
    }

    return email
        .toString()
        .trim()
        .toLowerCase();

};


// ======================================================
// Helper: Normalize Phone
// ======================================================

const normalizePhone = (phone) => {

    if (!phone) {
        return undefined;
    }

    return phone
        .toString()
        .trim();

};


// ======================================================
// Helper: Generate Secure OTP
// ======================================================

const generateOTP = () => {

    return crypto
        .randomInt(100000, 1000000)
        .toString();

};


// ======================================================
// Helper: Hash OTP
// ======================================================

const hashOTP = (otp) => {

    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

};


// ======================================================
// Helper: Sanitize User Response
// ======================================================

const sanitizeUser = (user) => {

    const data = user.toObject
        ? user.toObject()
        : { ...user };

    delete data.password;
    delete data.otpCode;
    delete data.refreshToken;
    delete data.passwordResetToken;
    delete data.emailVerificationToken;
    delete data.loginDevices;
    delete data.deviceTokens;
    delete data.loginAttempts;
    delete data.lockUntil;
    delete data.lastLoginIP;

    return data;

};


// ======================================================
// Register User
// ======================================================

exports.registerUser = async (req, res) => {

    try {

        const {
            fullName,
            username,
            email,
            phone,
            country,
            password
        } = req.body;


        // ------------------------------------------
        // Validate required information
        // ------------------------------------------

        if (!fullName || !fullName.trim()) {

            return res.status(400).json({

                success: false,
                message: "Full name is required."

            });

        }


        if (!password || password.length < 8) {

            return res.status(400).json({

                success: false,
                message:
                    "Password must be at least 8 characters long."

            });

        }


        if (!email && !phone) {

            return res.status(400).json({

                success: false,
                message:
                    "Email or phone number is required."

            });

        }


        const normalizedEmail =
            normalizeEmail(email);

        const normalizedPhone =
            normalizePhone(phone);


        // ------------------------------------------
        // Check email
        // ------------------------------------------

        if (normalizedEmail) {

            const emailExists =
                await User.findOne({
                    email: normalizedEmail
                });

            if (emailExists) {

                return res.status(409).json({

                    success: false,
                    message: "Email already exists."

                });

            }

        }


        // ------------------------------------------
        // Check phone
        // ------------------------------------------

        if (normalizedPhone) {

            const phoneExists =
                await User.findOne({
                    phone: normalizedPhone
                });

            if (phoneExists) {

                return res.status(409).json({

                    success: false,
                    message:
                        "Phone number already exists."

                });

            }

        }


        // ------------------------------------------
        // Check username
        // ------------------------------------------

        const normalizedUsername =
            username
                ? username.toString().trim().toLowerCase()
                : undefined;


        if (normalizedUsername) {

            const usernameExists =
                await User.findOne({
                    username: normalizedUsername
                });

            if (usernameExists) {

                return res.status(409).json({

                    success: false,
                    message:
                        "Username already exists."

                });

            }

        }


        // ------------------------------------------
        // Create customer
        // ------------------------------------------

        const user = new User({

            fullName: fullName.trim(),

            username: normalizedUsername,

            email: normalizedEmail,

            phone: normalizedPhone,

            country: country
                ? country.toString().trim()
                : "",

            password,

            role: "customer",

            status: "active",

            isActive: true,

            profileCompletion: 30

        });


        await user.save();


        // ------------------------------------------
        // Generate authentication token
        // ------------------------------------------

        const token =
            generateToken(user);


        return res.status(201).json({

            success: true,

            message:
                "Registration successful.",

            token,

            user: {

                id: user._id,

                userId: user.userId,

                fullName: user.fullName,

                username: user.username,

                email: user.email,

                phone: user.phone,

                role: user.role,

                status: user.status

            }

        });

    } catch (error) {

        console.error(
            "Registration error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to complete registration."

        });

    }

};


// ======================================================
// Login User
// ======================================================

exports.loginUser = async (req, res) => {

    try {

        const {
            email,
            phone,
            password
        } = req.body;


        if (!password) {

            return res.status(400).json({

                success: false,
                message: "Password is required."

            });

        }


        if (!email && !phone) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or phone number is required."

            });

        }


        const normalizedEmail =
            normalizeEmail(email);

        const normalizedPhone =
            normalizePhone(phone);


        // ------------------------------------------
        // Find user
        //
        // Password is select:false in User.js,
        // so it must explicitly be selected here.
        // ------------------------------------------

        let user;

        if (normalizedEmail) {

            user = await User.findOne({
                email: normalizedEmail
            })
            .select("+password");

        } else {

            user = await User.findOne({
                phone: normalizedPhone
            })
            .select("+password");

        }


        // ------------------------------------------
        // Don't reveal whether the account exists
        // ------------------------------------------

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email/phone or password."

            });

        }


        // ------------------------------------------
        // Account status
        // ------------------------------------------

        if (
            user.status !== "active" ||
            user.isActive !== true
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Your account is not currently active. Please contact SmartBuy support."

            });

        }


        // ------------------------------------------
        // Account lock
        // ------------------------------------------

        if (
            user.lockUntil &&
            user.lockUntil > new Date()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Your account is temporarily locked. Please try again later."

            });

        }


        // ------------------------------------------
        // Verify password
        // ------------------------------------------

        const isMatch =
            await user.matchPassword(password);


        if (!isMatch) {

            user.loginAttempts += 1;


            // --------------------------------------
            // Lock after 5 failed attempts
            // --------------------------------------

            if (user.loginAttempts >= 5) {

                user.lockUntil =
                    new Date(
                        Date.now() +
                        15 * 60 * 1000
                    );

            }


            await user.save();


            return res.status(401).json({

                success: false,

                message:
                    "Invalid email/phone or password."

            });

        }


        // ------------------------------------------
        // Successful login
        // ------------------------------------------

        user.loginAttempts = 0;

        user.lockUntil = undefined;

        user.lastLogin = new Date();

        user.lastSeen = new Date();

        user.lastLoginIP =
            req.ip || "";


        await user.save();


        const token =
            generateToken(user);


        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

            token,

            user: {

                id: user._id,

                userId: user.userId,

                fullName: user.fullName,

                username: user.username,

                email: user.email,

                phone: user.phone,

                role: user.role,

                status: user.status

            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to complete login."

        });

    }

};


// ======================================================
// Get User Profile
// ======================================================

exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(
            req.user._id
        );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        return res.status(200).json({

            success: true,

            user: sanitizeUser(user)

        });

    } catch (error) {

        console.error(
            "Get profile error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve profile."

        });

    }

};


// ======================================================
// Change Password
// ======================================================

exports.changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;


        if (!currentPassword || !newPassword) {

            return res.status(400).json({

                success: false,

                message:
                    "Current password and new password are required."

            });

        }


        if (newPassword.length < 8) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be at least 8 characters long."

            });

        }


        // ------------------------------------------
        // Explicitly select password
        // ------------------------------------------

        const user = await User.findById(
            req.user._id
        ).select("+password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        const isMatch =
            await user.matchPassword(
                currentPassword
            );


        if (!isMatch) {

            return res.status(400).json({

                success: false,

                message:
                    "Current password is incorrect."

            });

        }


        user.password = newPassword;

        user.refreshToken = "";


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Password changed successfully. Please log in again on other devices."

        });

    } catch (error) {

        console.error(
            "Change password error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to change password."

        });

    }

};


// ======================================================
// Forgot Password
// ======================================================

exports.forgotPassword = async (req, res) => {

    try {

        const {
            email,
            phone
        } = req.body;


        if (!email && !phone) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or phone number is required."

            });

        }


        const normalizedEmail =
            normalizeEmail(email);

        const normalizedPhone =
            normalizePhone(phone);


        const query = normalizedEmail
            ? { email: normalizedEmail }
            : { phone: normalizedPhone };


        const user = await User.findOne(query);


        // ------------------------------------------
        // Do not reveal whether an account exists
        // ------------------------------------------

        if (!user) {

            return res.status(200).json({

                success: true,

                message:
                    "If an account exists for the supplied information, password reset instructions will be sent."

            });

        }


        // ------------------------------------------
        // Generate cryptographically secure OTP
        // ------------------------------------------

        const otp =
            generateOTP();


        // ------------------------------------------
        // Store only hashed OTP
        // ------------------------------------------

        user.otpCode =
            hashOTP(otp);

        user.otpExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        await user.save();


        /*
         * IMPORTANT:
         *
         * The actual email/SMS delivery service must
         * deliver `otp` to the verified contact method.
         *
         * The raw OTP is intentionally NOT stored in
         * MongoDB and is NOT written to logs.
         */


        return res.status(200).json({

            success: true,

            message:
                "If an account exists for the supplied information, password reset instructions will be sent."

        });

    } catch (error) {

        console.error(
            "Forgot password error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to process the password reset request."

        });

    }

};


// ======================================================
// Verify OTP
// ======================================================

exports.verifyOTP = async (req, res) => {

    try {

        const {
            email,
            phone,
            otp
        } = req.body;


        if (
            (!email && !phone) ||
            !otp
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or phone number and OTP are required."

            });

        }


        const normalizedEmail =
            normalizeEmail(email);

        const normalizedPhone =
            normalizePhone(phone);


        const query = normalizedEmail
            ? { email: normalizedEmail }
            : { phone: normalizedPhone };


        const user = await User.findOne(query)
            .select("+otpCode");


        if (!user) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid verification request."

            });

        }


        if (
            !user.otpCode ||
            !user.otpExpires
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "OTP is invalid or has expired."

            });

        }


        if (
            user.otpExpires <= new Date()
        ) {

            user.otpCode = "";

            user.otpExpires = undefined;

            await user.save();

            return res.status(400).json({

                success: false,

                message:
                    "OTP has expired."

            });

        }


        const hashedOTP =
            hashOTP(
                otp.toString().trim()
            );


        if (
            hashedOTP !== user.otpCode
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid OTP."

            });

        }


        // ------------------------------------------
        // Successful contact verification
        // ------------------------------------------

        if (normalizedEmail) {

            user.isEmailVerified = true;

        }

        if (normalizedPhone) {

            user.isPhoneVerified = true;

        }


        // OTP is single-use.
        user.otpCode = "";

        user.otpExpires = undefined;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "OTP verified successfully."

        });

    } catch (error) {

        console.error(
            "OTP verification error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to verify OTP."

        });

    }

};


// ======================================================
// Reset Password
// ======================================================

exports.resetPassword = async (req, res) => {

    try {

        const {
            email,
            phone,
            otp,
            newPassword
        } = req.body;


        if (
            (!email && !phone) ||
            !otp ||
            !newPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or phone number, OTP, and new password are required."

            });

        }


        if (newPassword.length < 8) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be at least 8 characters long."

            });

        }


        const normalizedEmail =
            normalizeEmail(email);

        const normalizedPhone =
            normalizePhone(phone);


        const query = normalizedEmail
            ? { email: normalizedEmail }
            : { phone: normalizedPhone };


        const user = await User.findOne(query)
            .select("+password +otpCode");


        if (!user) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid password reset request."

            });

        }


        if (
            !user.otpCode ||
            !user.otpExpires
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "OTP is invalid or has expired."

            });

        }


        if (
            user.otpExpires <= new Date()
        ) {

            user.otpCode = "";

            user.otpExpires = undefined;

            await user.save();

            return res.status(400).json({

                success: false,

                message:
                    "OTP has expired."

            });

        }


        const hashedOTP =
            hashOTP(
                otp.toString().trim()
            );


        if (
            hashedOTP !== user.otpCode
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid OTP."

            });

        }


        // ------------------------------------------
        // Reset password
        // ------------------------------------------

        user.password = newPassword;

        user.otpCode = "";

        user.otpExpires = undefined;

        user.loginAttempts = 0;

        user.lockUntil = undefined;

        user.refreshToken = "";


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Password has been reset successfully. Please log in again."

        });

    } catch (error) {

        console.error(
            "Reset password error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to reset password."

        });

    }

};


// ======================================================
// Logout User
// ======================================================

exports.logoutUser = async (req, res) => {

    try {

        const user = await User.findById(
            req.user._id
        );


        if (user) {

            user.refreshToken = "";

            await user.save();

        }


        return res.status(200).json({

            success: true,

            message:
                "Logout successful."

        });

    } catch (error) {

        console.error(
            "Logout error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to complete logout."

        });

    }

};
