// ======================================================
// SmartBuy Enterprise Coupon Model
// Supports Discounts, Promotions & Marketing Campaigns
// ======================================================

const mongoose = require("mongoose");


const couponSchema = new mongoose.Schema({

    // ==================================================
    // Coupon Code
    // ==================================================

    code: {

        type: String,

        required: true,

        unique: true,

        uppercase: true,

        trim: true

    },


    // ==================================================
    // Coupon Description
    // ==================================================

    description: {

        type: String,

        default: "",

        trim: true

    },


    // ==================================================
    // Discount Type
    // ==================================================

    discountType: {

        type: String,

        enum: [

            "percentage",

            "fixed"

        ],

        required: true

    },


    // ==================================================
    // Discount Value
    // Percentage (%) or Fixed Amount
    // ==================================================

    discountValue: {

        type: Number,

        required: true,

        min: 0

    },

    // ==================================================
    // Minimum Purchase Amount
    // ==================================================

    minimumPurchase: {

        type: Number,

        default: 0,

        min: 0

    },


    // ==================================================
    // Maximum Discount Amount
    // (For Percentage Coupons)
    // ==================================================

    maximumDiscount: {

        type: Number,

        default: 0,

        min: 0

    },


    // ==================================================
    // Coupon Validity
    // ==================================================

    startDate: {

        type: Date,

        required: true

    },

    expiryDate: {

        type: Date,

        required: true

    },


    // ==================================================
    // Coupon Status
    // ==================================================

    isActive: {

        type: Boolean,

        default: true

    },
    // ==================================================
    // Coupon Usage Limits
    // ==================================================

    usageLimit: {

        type: Number,

        default: 0,

        min: 0

    },

    usedCount: {

        type: Number,

        default: 0,

        min: 0

    },


    // ==================================================
    // Per User Usage Limit
    // ==================================================

    usagePerUser: {

        type: Number,

        default: 1,

        min: 1

    },


    // ==================================================
    // Applicable Categories
    // Empty = All Categories
    // ==================================================

    categories: [

        {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Category"

        }

    ],


    // ==================================================
    // Applicable Products
    // Empty = All Products
    // ==================================================

    products: [

        {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Product"

        }

    ],
    // ==================================================
    // Coupon Ownership
    // For Future Marketplace Support
    // ==================================================

    createdBy: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null

    },

    // ==================================================
    // Coupon Visibility
    // ==================================================

    visibility: {

        type: String,

        enum: [

            "public",

            "private"

        ],

        default: "public"

    },

    // ==================================================
    // Customer Groups
    // ==================================================

    customerType: {

        type: String,

        enum: [

            "all",

            "new",

            "existing",

            "wholesale",

            "vendor"

        ],

        default: "all"

    },
// ==================================================
// Coupon Name
// ==================================================

name: {

    type: String,

    required: true,

    trim: true

},

    // ==================================================
    // Coupon Notes
    // ==================================================

    notes: {

        type: String,

        default: "",

        trim: true

    }

}, {

    timestamps: true

});


// ======================================================
// Export Coupon Model
// ======================================================

module.exports = mongoose.model(

    "Coupon",

    couponSchema

);