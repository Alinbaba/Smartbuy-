const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ==========================
// Register User
// ==========================

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

        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: "Email or phone number is required."
            });
        }

        if (email) {

            const emailExists = await User.findOne({ email });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists."
                });
            }

        }

        if (phone) {

            const phoneExists = await User.findOne({ phone });

            if (phoneExists) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number already exists."
                });
            }

        }

        const user = await User.create({

            fullName,
            username,
            email,
            phone,
            country,
            password

        });
        user.profileCompletion = 30;

await user.save();
        
        const token = jwt.sign(

            {
                id: user._id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.status(201).json({

            success: true,

            message: "Registration successful.",

            token,

    user: {
          id: user._id,
          userId: user.userId,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role
}

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================
// Login User
// ==========================

exports.loginUser = async (req, res) => {

    try {

        const { email, phone, password } = req.body;
        console.log(req.body);

        const user = await User.findOne({

            $or: [

                { email: email },

                { phone: phone }

            ]

        });
        
        if (!user) {

    return res.status(401).json({

        success: false,

        message: "Invalid email/phone or password."

    });

}

// Check if account is active

if (!user.isActive) {

    return res.status(403).json({

        success: false,

        message: "Your account has been disabled. Please contact support."

    });

}
// Check if account is temporarily locked

        if (user.lockUntil && user.lockUntil > Date.now()) {

           return res.status(403).json({

               success: false,

               message: "Your account has been temporarily locked. Please try again after 15 minutes."

    });

}

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {

    user.loginAttempts += 1;

        if (user.loginAttempts >= 5) {

        user.lockUntil = Date.now() + 15 * 60 * 1000;

    }

    await user.save();

           return res.status(401).json({

               success: false,

               message: "Invalid password."

    });

}
// Reset login attempts after successful login

user.loginAttempts = 0;

user.lockUntil = undefined;

user.lastLogin = new Date();

user.lastLoginIP = req.ip;

await user.save();

        const token = jwt.sign(

            {

                id: user._id,

                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.status(200).json({

            success: true,

            message: "Login successful.",

            token,

            user: {

                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Get User Profile
// ==========================

exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Change Password
// ==========================

exports.changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });

        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });
    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Forgot Password
// ==========================

exports.forgotPassword = async (req, res) => {

    try {

        const { email, phone } = req.body;

        const user = await User.findOne({

            $or: [
                { email },
                { phone }
            ]

        });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        // Generate 6-digit OTP

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otpCode = otp;

        user.otpExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        res.status(200).json({

            success: true,

            message: "OTP has been generated successfully. Please check your email or phone."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Verify OTP
// ==========================

exports.verifyOTP = async (req, res) => {

    try {

        const { email, phone, otp } = req.body;

        const user = await User.findOne({

            $or: [
                { email },
                { phone }
            ]

        });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        if (user.otpCode !== otp) {

            return res.status(400).json({

                success: false,

                message: "Invalid OTP."

            });

        }

        if (user.otpExpires < Date.now()) {

            return res.status(400).json({

                success: false,

                message: "OTP has expired."

            });

        }
        
        user.otpCode = "";

user.otpExpires = undefined;

// Mark verified

if (email) {

    user.isEmailVerified = true;

}

if (phone) {

    user.isPhoneVerified = true;

}

await user.save();
        
        res.status(200).json({

            success: true,

            message: "OTP verified successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Reset Password
// ==========================

exports.resetPassword = async (req, res) => {

    try {

        const {

            email,

            phone,

            otp,

            newPassword

        } = req.body;

        const user = await User.findOne({

            $or: [

                { email },

                { phone }

            ]

        });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        if (user.otpCode !== otp) {

            return res.status(400).json({

                success: false,

                message: "Invalid OTP."

            });

        }

        if (!user.otpExpires || user.otpExpires < Date.now()) {

            return res.status(400).json({

                success: false,

                message: "OTP has expired."

            });

        }

        user.password = newPassword;

        user.otpCode = "";

        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({

            success: true,

            message: "Password has been reset successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Logout User
// ==========================

exports.logoutUser = async (req, res) => {

    try {

        res.status(200).json({

            success: true,

            message: "Logout successful."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
