const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// ======================================================
// SmartBuy User Schema
// ======================================================

const userSchema = new mongoose.Schema({

    // ==================================================
    // Basic Information
    // ==================================================

    fullName: {
        type: String,
        required: [true, "Full name is required."],
        trim: true,
        minlength: 2,
        maxlength: 100
    },

    username: {
        type: String,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 50
    },

    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
        maxlength: 150,
        match: [
            /^\S+@\S+\.\S+$/,
            "Please provide a valid email address."
        ]
    },

    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        maxlength: 30
    },

    password: {
        type: String,
        required: function () {

            return (
                this.loginProvider === "email" ||
                this.loginProvider === "phone"
            );

        },
        minlength: 8,
        select: false
    },


    // ==================================================
    // Login Provider
    // ==================================================

    loginProvider: {
        type: String,
        enum: [
            "email",
            "phone",
            "google",
            "facebook",
            "apple",
            "linkedin",
            "x"
        ],
        default: "email"
    },


    // ==================================================
    // Social Login IDs
    // ==================================================

    googleId: {
        type: String,
        default: null,
        select: false
    },

    facebookId: {
        type: String,
        default: null,
        select: false
    },

    appleId: {
        type: String,
        default: null,
        select: false
    },

    linkedinId: {
        type: String,
        default: null,
        select: false
    },

    xId: {
        type: String,
        default: null,
        select: false
    },


    // ==================================================
    // Account Status
    // ==================================================

    status: {
        type: String,
        enum: [
            "pending",
            "active",
            "inactive",
            "suspended",
            "blocked",
            "deleted"
        ],
        default: "active",
        index: true
    },


    // ==================================================
    // Security Tokens
    // ==================================================

    passwordResetToken: {
        type: String,
        default: "",
        select: false
    },

    passwordResetExpires: {
        type: Date,
        select: false
    },

    emailVerificationToken: {
        type: String,
        default: "",
        select: false
    },

    refreshToken: {
    type: String,
    default: "",
    select: false
},

tokenVersion: {
    type: Number,
    default: 0,
    min: 0
},

lastSeen: {
    type: Date,
    default: Date.now
},

    // ==================================================
    // Activity Tracking
    // ==================================================

    lastSeen: {
        type: Date,
        default: Date.now
    },

    lastPasswordChange: {
        type: Date
    },


    // ==================================================
    // Login Devices
    // ==================================================

    loginDevices: [
        {
            device: {
                type: String,
                trim: true,
                maxlength: 200
            },

            browser: {
                type: String,
                trim: true,
                maxlength: 100
            },

            os: {
                type: String,
                trim: true,
                maxlength: 100
            },

            ip: {
                type: String,
                trim: true,
                maxlength: 100
            },

            location: {
                type: String,
                trim: true,
                maxlength: 200
            },

            lastLogin: {
                type: Date,
                default: Date.now
            }
        }
    ],


    // ==================================================
    // Profile
    // ==================================================

    avatar: {
        type: String,
        default: "",
        trim: true
    },

    country: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100
    },

    state: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100
    },

    city: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100
    },

    address: {
        type: String,
        default: "",
        trim: true,
        maxlength: 300
    },


    // ==================================================
    // Role
    // ==================================================
    //
    // IMPORTANT:
    // This is intentionally NOT an enum.
    //
    // SmartBuy uses the Role collection to determine
    // whether a role exists and which permissions it has.
    //
    // Example:
    // customer
    // seller
    // finance-admin
    // marketing-manager
    // regional-manager
    //
    // ==================================================

    role: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        default: "customer",
        index: true,
        maxlength: 100
    },


    // ==================================================
    // Login Security
    // ==================================================

    loginAttempts: {
        type: Number,
        default: 0,
        min: 0
    },

    lockUntil: {
        type: Date
    },

    lastLogin: {
        type: Date
    },

    lastLoginIP: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100
    },


    // ==================================================
    // Verification
    // ==================================================

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    isPhoneVerified: {
        type: Boolean,
        default: false
    },

    twoFactorEnabled: {
        type: Boolean,
        default: false
    },


    // ==================================================
    // OTP
    // ==================================================

    otpCode: {
        type: String,
        default: "",
        select: false
    },

    otpExpires: {
        type: Date,
        select: false
    },
otpPurpose: {
    type: String,
    enum: [
        "email-verification",
        "phone-verification",
        "password-reset"
    ],
    select: false
},

    // ==================================================
    // Wallet / Rewards
    // ==================================================

    walletBalance: {
        type: Number,
        default: 0,
        min: 0
    },

    rewardPoints: {
        type: Number,
        default: 0,
        min: 0
    },


    // ==================================================
    // Verification / Legacy Compatibility
    // ==================================================

    isVerified: {
        type: Boolean,
        default: false
    },

    // Kept temporarily for compatibility with existing
    // SmartBuy code. `status` should become the primary
    // account-status authority.
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },


    // ==================================================
    // Preferences
    // ==================================================

    preferredLanguage: {
        type: String,
        default: "English",
        trim: true,
        maxlength: 50
    },

    preferredCurrency: {
        type: String,
        default: "NGN",
        uppercase: true,
        trim: true,
        maxlength: 10
    },


    // ==================================================
    // Personal Information
    // ==================================================

    dateOfBirth: {
        type: Date
    },

    gender: {
        type: String,
        enum: [
            "male",
            "female",
            "other",
            "prefer-not-to-say"
        ],
        default: "prefer-not-to-say"
    },


    // ==================================================
    // Profile Completion
    // ==================================================

    profileCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },


    // ==================================================
    // Referral System
    // ==================================================

    referralCode: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        uppercase: true,
        maxlength: 50
    },

    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true
    },


    // ==================================================
    // Notification Preferences
    // ==================================================

    notificationPreferences: {

        email: {
            type: Boolean,
            default: true
        },

        sms: {
            type: Boolean,
            default: true
        },

        push: {
            type: Boolean,
            default: true
        },

        promotions: {
            type: Boolean,
            default: true
        },

        orderUpdates: {
            type: Boolean,
            default: true
        }

    },


    // ==================================================
    // Device Tokens
    // ==================================================

    deviceTokens: [
        {
            type: String,
            trim: true,
            maxlength: 500
        }
    ],


    // ==================================================
    // SmartBuy User ID
    // ==================================================

    userId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        index: true
    }

}, {
    timestamps: true
});


// ======================================================
// Indexes
// ======================================================

userSchema.index({
    role: 1,
    status: 1
});

userSchema.index({
    createdAt: -1
});


// ======================================================
// Password Hashing
// ======================================================

userSchema.pre("save", async function (next) {

    try {

        if (!this.isModified("password")) {
            return next();
        }

        // Password should never be empty when changed.
        if (!this.password) {
            return next(
                new Error("Password cannot be empty.")
            );
        }

        const salt = await bcrypt.genSalt(12);

        this.password = await bcrypt.hash(
            this.password,
            salt
        );

        this.lastPasswordChange = new Date();

        next();

    } catch (error) {

        next(error);

    }

});


// ======================================================
// Compare Password
// ======================================================

userSchema.methods.matchPassword = async function (password) {

    return await bcrypt.compare(
        password,
        this.password
    );

};


// ======================================================
// Generate SmartBuy User ID
// ======================================================
//
// Uses the Counter model instead of countDocuments().
// This prevents duplicate IDs when multiple users are
// created at approximately the same time.
//
// ======================================================

userSchema.pre("save", async function (next) {

    try {

        if (!this.isNew || this.userId) {
            return next();
        }

        const Counter = mongoose.model("Counter");

        let prefix = "CUS";

        switch (this.role) {

            case "seller":
                prefix = "SEL";
                break;

            case "admin":
            case "super-admin":
            case "security-admin":
            case "ai-admin":
                prefix = "ADM";
                break;

            case "finance-admin":
                prefix = "FIN";
                break;

            case "customer-care":
                prefix = "SUP";
                break;

            case "logistics-admin":
                prefix = "LOG";
                break;

            case "advertising-admin":
                prefix = "ADV";
                break;

            case "warehouse-staff":
                prefix = "WH";
                break;

            case "delivery-staff":
                prefix = "DEL";
                break;

            case "vendor-manager":
                prefix = "VEN";
                break;

            default:
                prefix = "CUS";

        }


        const counter = await Counter.findOneAndUpdate(

            {
                name: `user_${prefix}`
            },

            {
                $inc: {
                    sequence: 1
                }
            },

            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }

        );


        this.userId =
            `${prefix}-${String(counter.sequence).padStart(6, "0")}`;


        next();

    } catch (error) {

        next(error);

    }

});


// ======================================================
// Limit Stored Login Devices
// ======================================================

userSchema.pre("save", function (next) {

    if (
        Array.isArray(this.loginDevices) &&
        this.loginDevices.length > 10
    ) {

        this.loginDevices =
            this.loginDevices
                .sort((a, b) => {

                    return (
                        new Date(b.lastLogin || 0) -
                        new Date(a.lastLogin || 0)
                    );

                })
                .slice(0, 10);

    }

    next();

});


// ======================================================
// Limit Device Tokens
// ======================================================

userSchema.pre("save", function (next) {

    if (
        Array.isArray(this.deviceTokens) &&
        this.deviceTokens.length > 20
    ) {

        this.deviceTokens =
            this.deviceTokens.slice(-20);

    }

    next();

});


// ======================================================
// Export Model
// ======================================================

module.exports = mongoose.model(
    "User",
    userSchema
);
