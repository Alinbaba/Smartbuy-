// ======================================================
// SmartBuy Shipping Model
// Enterprise Multi-Vendor Marketplace
// Version 2.0
// ======================================================


// ======================================================
// Import Mongoose
// ======================================================

const mongoose = require("mongoose");


// ======================================================
// Shipping Schema
// ======================================================

const ShippingSchema = new mongoose.Schema({

    // ==================================================
    // Order Reference
    // ==================================================

    order: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Order",

        required: true

    },


    // ==================================================
    // Customer Reference
    // ==================================================

    customer: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },


    // ==================================================
    // Seller Reference
    // ==================================================

    seller: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User"

    },


    // ==================================================
    // Delivery Address
    // ==================================================

    shippingAddress: {

        fullName: String,

        phone: String,

        address: String,

        city: String,

        state: String,

        country: {

            type: String,

            default: "Nigeria"

        }

    },
    // ==================================================
    // Logistics Provider Information
    // ==================================================

    logisticsProvider: {

        name: String,

        phone: String,

        email: String

    },


    // ==================================================
    // Tracking Information
    // ==================================================

    trackingNumber: {

        type: String,

        unique: true,

        sparse: true

    },


    trackingUrl: {

        type: String,

        default: ""

    },


    // ==================================================
    // Shipping Status
    // ==================================================

    shippingStatus: {

        type: String,

        enum: [

            "pending",

            "confirmed",

            "processing",

            "picked-up",

            "in-transit",

            "out-for-delivery",

            "delivered",

            "cancelled",

            "returned"

        ],

        default: "pending"

    },
    // ==================================================
    // Delivery Timeline
    // ==================================================

    timeline: [

        {

            status: String,

            message: String,

            location: String,

            updatedBy: {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User"

            },

            date: {

                type: Date,

                default: Date.now

            }

        }

    ],


    // ==================================================
    // Delivery Dates
    // ==================================================

    shippedAt: Date,

    deliveredAt: Date,


    // ==================================================
    // Shipping Cost
    // ==================================================

    shippingCost: {

        type: Number,

        default: 0

    },


    // ==================================================
    // Notes
    // ==================================================

    notes: {

        type: String,

        default: ""

    }

}, {

    timestamps: true

});


// ======================================================
// Export Model
// ======================================================

module.exports = mongoose.model(

    "Shipping",

    ShippingSchema

);