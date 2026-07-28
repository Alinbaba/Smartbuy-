// ======================================================
// SmartBuy Enterprise Category Model
// ======================================================

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    // ==================================================
    // Category Name
    // ==================================================

    name: {

        type: String,

        required: true,

        unique: true,

        trim: true

    },

    // ==================================================
    // Category Slug
    // ==================================================

    slug: {

        type: String,

        required: true,

        unique: true,

        lowercase: true,

        trim: true

    },

    // ==================================================
    // Category Description
    // ==================================================

    description: {

        type: String,

        default: "",

        trim: true

    },
    // ==================================================
    // Category Image
    // ==================================================

    image: {

        type: String,

        default: ""

    },

    // ==================================================
    // Parent Category
    // ==================================================

    parentCategory: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Category",

        default: null

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
    "Category",
    categorySchema
);