const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    username: {
        type: String,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true
    },

    phone: {
        type: String,
        unique: true,
        sparse: true
    },

    password: {
        type: String,
        required: true
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
    default: null
},

facebookId: {
    type: String,
    default: null
},

appleId: {
    type: String,
    default: null
},

linkedinId: {
    type: String,
    default: null
},

xId: {
    type: String,
    default: null
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
    default: "active"
},

// ==================================================
// Security Tokens
// ==================================================

passwordResetToken: {
    type: String,
    default: ""
},

passwordResetExpires: {
    type: Date
},

emailVerificationToken: {
    type: String,
    default: ""
},

refreshToken: {
    type: String,
    default: ""
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

loginDevices: [{
    device: String,
    browser: String,
    os: String,
    ip: String,
    location: String,
    lastLogin: Date
}],

    avatar: {
        type: String,
        default: ""
    },

    country: {
        type: String,
        default: ""
    },

    state: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: [
            "customer",
            "seller",
            "dropshipper",
            "affiliate",
            "manufacturer",
            "wholesaler",
            "admin",
            "customer-care",
            "finance-admin",
            "logistics-admin",
            "advertising-admin",
            "security-admin",
            "ai-admin",
            "warehouse-staff",
            "delivery-staff",
           "vendor-manager",
            "super-admin"
        ],
        default: "customer"
    },
    loginAttempts: {
    type: Number,
    default: 0
},

    lockUntil: {
    type: Date
},

    lastLogin: {
    type: Date
},

    lastLoginIP: {
    type: String,
    default: ""
},

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

    otpCode: {
    type: String,
    default: ""
},

   otpExpires: {
    type: Date
},
    walletBalance: {
        type: Number,
        default: 0
    },

    rewardPoints: {
        type: Number,
        default: 0
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    preferredLanguage: {
        type: String,
        default: "English"
    },

    preferredCurrency: {
        type: String,
        default: "NGN"
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
        sparse: true
    },

    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
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
    // Device Tokens (Push Notifications)
    // ==================================================

    deviceTokens: [{
        type: String
    }],
        // ==================================================
    // SmartBuy User ID
    // ==================================================

    userId: {
        type: String,
        unique: true
    },

}, {
    timestamps: true
});

// Encrypt password
userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();

});

// Compare password
userSchema.methods.matchPassword = async function(password){

    return await bcrypt.compare(password, this.password);

};

// ======================================================
// Generate SmartBuy User ID
// ======================================================

userSchema.pre("save", async function (next) {

    if (!this.isNew || this.userId) {
        return next();
    }

    const count = await this.constructor.countDocuments();

    let prefix = "CUS";

    switch (this.role) {

        case "seller":
            prefix = "SEL";
            break;

        case "admin":
        case "super-admin":
            prefix = "ADM";
            break;

        case "customer-care":
            prefix = "SUP";
            break;

        default:
            prefix = "CUS";

    }

    this.userId = `${prefix}-${String(count + 1).padStart(6, "0")}`;

    next();

});

module.exports = mongoose.model("User", userSchema);
