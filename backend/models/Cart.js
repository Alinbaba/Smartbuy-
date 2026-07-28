const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    quantity: {
        type: Number,
        default: 1,
        min: 1
    },

    price: {
        type: Number,
        required: true
    },

    variant: {
        type: String,
        default: ""
    },

    subtotal: {
        type: Number,
        default: 0
    }

});

const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    items: [cartItemSchema],

    totalItems: {
        type: Number,
        default: 0
    },

    totalQuantity: {
        type: Number,
        default: 0
    },

    subtotal: {
        type: Number,
        default: 0
    },

    discount: {
        type: Number,
        default: 0
    },

    shippingFee: {
        type: Number,
        default: 0
    },

    tax: {
        type: Number,
        default: 0
    },

    grandTotal: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Cart", cartSchema);