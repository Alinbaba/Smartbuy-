// ======================================================
// SmartBuy Enterprise Wishlist Model
// ======================================================

const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({

    // ==================================================
    // User Owner
    // ==================================================

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    // ==================================================
    // Products Saved By User
    // ==================================================

    products: [

        {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Product",

            required: true

        }

    ]

}, {

    timestamps: true

});


// ======================================================
// Export Wishlist Model
// ======================================================

module.exports = mongoose.model(

    "Wishlist",

    wishlistSchema

);