// ======================================================
// SmartBuy Enterprise Address Model
// Supports Local & International Addresses
// Marketplace, Warehouses, Logistics & Business
// ======================================================

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({

    // ==================================================
    // User Owner
    // ==================================================

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    // ==================================================
    // Recipient Information
    // ==================================================

    fullName: {

        type: String,

        required: true,

        trim: true

    },

    phone: {

        type: String,

        required: true,

        trim: true

    },

    alternatePhone: {

        type: String,

        default: "",

        trim: true

    },

    companyName: {

        type: String,

        default: "",

        trim: true

    },

    // ==================================================
    // Address Label
    // ==================================================

    label: {

        type: String,

        default: "home",

        trim: true

    },
        // ==================================================
    // Address Type
    // ==================================================

    addressType: {

        type: String,

        enum: [

            "home",

            "office",

            "business",

            "warehouse",

            "pickup"

        ],

        default: "home"

    },

    // ==================================================
    // Country Information
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

    province: {

        type: String,

        default: "",

        trim: true

    },

    region: {

        type: String,

        default: "",

        trim: true

    },

    city: {

        type: String,

        required: true,

        trim: true

    },
    // ==================================================
    // Street Address
    // ==================================================

    addressLine1: {

        type: String,

        required: true,

        trim: true

    },

    addressLine2: {

        type: String,

        default: "",

        trim: true

    },

    landmark: {

        type: String,

        default: "",

        trim: true

    },

    postalCode: {

        type: String,

        default: "",

        trim: true

    },

    deliveryInstructions: {

        type: String,

        default: "",

        trim: true

    },
    // ==================================================
    // GPS Location
    // Used for Maps, Logistics and International Delivery
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
// Business Information
// Useful for Marketplace, Wholesale & Manufacturers
// ==================================================

businessRegistrationNumber: {

    type: String,

    default: "",

    trim: true

},
    // ==================================================
    // Default Address
    // ==================================================

    isDefault: {

        type: Boolean,

        default: false

    },

    // ==================================================
    // Address Status
    // ==================================================

    isActive: {

        type: Boolean,

        default: true

    }
    }, {

    timestamps: true

});


// ======================================================
// Export Address Model
// ======================================================

module.exports = mongoose.model(

    "Address",

    addressSchema

);