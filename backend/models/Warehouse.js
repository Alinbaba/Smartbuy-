// ======================================================
// SmartBuy Enterprise Warehouse Model
// Supports Multi-Warehouse & Logistics
// ======================================================

const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({

    // ==================================================
    // Warehouse Name
    // ==================================================

    name: {

        type: String,

        required: true,

        trim: true

    },

    // ==================================================
    // Warehouse Code
    // ==================================================

    code: {

        type: String,

        required: true,

        unique: true,

        uppercase: true,

        trim: true

    },

    // ==================================================
    // Warehouse Description
    // ==================================================

    description: {

        type: String,

        default: "",

        trim: true

    },
    // ==================================================
    // Warehouse Address
    // ==================================================

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

        default: "",

        trim: true

    },
    // ==================================================
    // Contact Information
    // ==================================================

    managerName: {

        type: String,

        default: "",

        trim: true

    },

    phone: {

        type: String,

        default: "",

        trim: true

    },

    email: {

        type: String,

        default: "",

        trim: true,

        lowercase: true

    },

    operatingHours: {

        type: String,

        default: "08:00 AM - 05:00 PM",

        trim: true

    },
    // ==================================================
    // Warehouse Capacity & Status
    // ==================================================

    maximumCapacity: {

        type: Number,

        default: 0,

        min: 0

    },

    currentCapacity: {

        type: Number,

        default: 0,

        min: 0

    },

    warehouseType: {

        type: String,

        enum: [

            "main",

            "regional",

            "distribution",

            "fulfillment",

            "pickup"

        ],

        default: "main"

    },

    status: {

        type: String,

        enum: [

            "active",

            "inactive",

            "maintenance",

            "closed"

        ],

        default: "active"

    },
    // ==================================================
    // GPS Location
    // ==================================================

    location: {

        latitude: {

            type: Number,

            default: null

        },

        longitude: {

            type: Number,

            default: null

        }

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


// ======================================================
// Export Warehouse Model
// ======================================================

module.exports = mongoose.model(

    "Warehouse",

    warehouseSchema

);