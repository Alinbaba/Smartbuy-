// ======================================================
// SmartBuy Notification Model
// Handles all user notifications
// ======================================================


// ======================================================
// Import Mongoose
// ======================================================

const mongoose = require("mongoose");


// ======================================================
// Notification Schema
// ======================================================

const notificationSchema = new mongoose.Schema({

    // User receiving notification
    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },


    // Notification title
    title: {

        type: String,

        required: true

    },


    // Notification message
    message: {

        type: String,

        required: true

    },


    // Notification type
    type: {

        type: String,

        enum: [

            "order",

            "payment",

            "shipping",

            "system",

            "promotion"

        ],

        default: "system"

    },


    // Read status
    isRead: {

        type: Boolean,

        default: false

    }

});
// ======================================================
// Related Reference
// Links notification to an order, payment or shipment
// ======================================================

notificationSchema.add({

    referenceId: {

        type: mongoose.Schema.Types.ObjectId,

        default: null

    },


    referenceModel: {

        type: String,

        enum: [

            "Order",

            "Payment",

            "Shipping",

            null

        ],

        default: null

    }

});


// ======================================================
// Notification Time
// ======================================================

notificationSchema.set("timestamps", true);


// ======================================================
// Export Model
// ======================================================

module.exports = mongoose.model(

    "Notification",

    notificationSchema

);