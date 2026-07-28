const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({

    // ==========================================
    // Upload Owner
    // ==========================================

    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // ==========================================
    // Original File Name
    // Example:
    // passport.jpg
    // logo.png
    // ==========================================

    originalName: {
        type: String,
        required: true,
        trim: true
    },

    // ==========================================
    // Stored File Name
    // Example:
    // 1723489234_passport.jpg
    // ==========================================

    fileName: {
        type: String,
        required: true,
        unique: true
    },

    // ==========================================
    // Public URL
    // ==========================================

    fileUrl: {
        type: String,
        required: true
    },

    // ==========================================
    // Storage Path
    // ==========================================

    filePath: {
        type: String,
        required: true
    },
        // ==========================================
    // File Information
    // ==========================================

    fileType: {
        type: String,
        enum: [
            "image",
            "video",
            "audio",
            "document",
            "archive",
            "other"
        ],
        required: true
    },

    mimeType: {
        type: String,
        required: true
    },

    fileExtension: {
        type: String,
        required: true,
        lowercase: true
    },

    fileSize: {
        type: Number,
        required: true
    },

    // ==========================================
    // Upload Folder
    // ==========================================

    folder: {
        type: String,
        enum: [
            "products",
            "profiles",
            "kyc",
            "reviews",
            "stores",
            "banners",
            "advertisements",
            "orders",
            "messages",
            "documents",
            "others"
        ],
        default: "others"
    },
        // ==========================================
    // File Usage
    // What this upload belongs to
    // ==========================================

    usedFor: {
        type: String,
        enum: [
            "product",
            "profile",
            "kyc",
            "review",
            "store",
            "advertisement",
            "order",
            "message",
            "document",
            "other"
        ],
        default: "other"
    },

    // ==========================================
    // Related Records
    // ==========================================

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    kyc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "KYC"
    },

    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    },

    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
    },

    advertisement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advertisement"
    },

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
        // ==========================================
    // Security & Status
    // ==========================================

    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "private"
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: {
        type: Date
    },

    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    // ==========================================
    // File Statistics
    // ==========================================

    viewCount: {
        type: Number,
        default: 0
    },

    downloadCount: {
        type: Number,
        default: 0
    },

    lastAccessedAt: {
        type: Date
    },

    // ==========================================
    // Additional Notes
    // ==========================================

    notes: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});
// ==========================================
// Database Indexes
// Improve search performance
// ==========================================

uploadSchema.index({ uploadedBy: 1 });

uploadSchema.index({ folder: 1 });

uploadSchema.index({ usedFor: 1 });

uploadSchema.index({ fileType: 1 });

uploadSchema.index({ isDeleted: 1 });

uploadSchema.index({ createdAt: -1 });

// ==========================================
// Export Upload Model
// ==========================================

module.exports = mongoose.model("Upload", uploadSchema);