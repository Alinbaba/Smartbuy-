const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({

    // =====================================
    // User Information
    // =====================================

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    // =====================================
    // Personal Details
    // =====================================

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    dateOfBirth: {
        type: Date,
        required: true
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },

    nationality: {
        type: String,
        required: true
    },
    
    // =====================================
    // Residential Address
    // =====================================

    country: {
        type: String,
        required: true,
        trim: true
    },

    state: {
        type: String,
        required: true,
        trim: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    postalCode: {
        type: String,
        default: ""
    },
        // =====================================
    // Government Identification
    // =====================================

    idType: {
        type: String,
        enum: [
            "national-id",
            "international-passport",
            "drivers-license",
            "voters-card",
            "residence-permit",
            "other"
        ],
        required: true
    },

    idNumber: {
        type: String,
        required: true,
        trim: true
    },

    issuingCountry: {
        type: String,
        required: true,
        trim: true
    },

    expiryDate: {
        type: Date
    },
        // =====================================
    // Uploaded Documents
    // =====================================

    idFrontImage: {
        type: String,
        required: true
    },

    idBackImage: {
        type: String,
        default: ""
    },

    selfieImage: {
        type: String,
        required: true
    },

    proofOfAddress: {
        type: String,
        default: ""
    },
    // =====================================
    // KYC Review Information
    // =====================================

    status: {
        type: String,
        enum: [
            "not-submitted",
            "pending",
            "verified",
            "rejected"
        ],
        default: "not-submitted"
    },

    rejectionReason: {
        type: String,
        default: ""
    },

    adminNotes: {
        type: String,
        default: ""
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    reviewedAt: {
        type: Date
    },
    // =====================================
    // Submission Information
    // =====================================

    submittedAt: {
        type: Date
    },

    verifiedAt: {
        type: Date
    }

}, {
    timestamps: true
});

// =====================================
// Export KYC Model
// =====================================

module.exports = mongoose.model("KYC", kycSchema);