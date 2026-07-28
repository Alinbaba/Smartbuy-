// ======================================================
// SmartBuy Enterprise Brand Model
// ======================================================

const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({

    // ==================================================
    // Brand Name
    // ==================================================

    name: {

        type: String,

        required: true,

        unique: true,

        trim: true

    },

    // ==================================================
    // Brand Slug
    // ==================================================

    slug: {

        type: String,

        required: true,

        unique: true,

        lowercase: true,

        trim: true

    },

    // ==================================================
    // Brand Description
    // ==================================================

    description: {

        type: String,

        default: "",

        trim: true

    },
    // ==================================================
    // Brand Logo
    // ==================================================

    logo: {

        type: String,

        default: ""

    },

    // ==================================================
    // Related Category
    // ==================================================

    category: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Category",

        required: true

    },
    // ==================================================
    // Display & Status
    // ==================================================

    featured: {

        type: Boolean,

        default: false

    },

    displayOrder: {

        type: Number,

        default: 0

    },

    status: {

        type: String,

        enum: [

            "active",

            "inactive"

        ],

        default: "active"

    },
    // ==================================================
    // SEO Information
    // ==================================================

    seoTitle: {

        type: String,

        default: "",

        trim: true

    },

    seoDescription: {

        type: String,

        default: "",

        trim: true

    },

    seoKeywords: {

        type: [String],

        default: []

    },
    // ==================================================
    // Audit Information
    // ==================================================

    createdBy: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null

    },

    updatedBy: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null

    },

    notes: {

        type: String,

        default: "",

        trim: true

    }

}, {

    timestamps: true

});
module.exports = mongoose.model(
    "Brand",
    brandSchema
);