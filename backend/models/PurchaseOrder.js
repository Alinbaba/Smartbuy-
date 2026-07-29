// ======================================================
// SmartBuy Enterprise Purchase Order Model
// ======================================================

const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({

    // ==================================================
    // Purchase Order Number
    // ==================================================

    purchaseOrderNumber: {

        type: String,

        required: true,

        unique: true,

        trim: true,

        uppercase: true

    },

    // ==================================================
    // Supplier
    // ==================================================

    supplier: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Supplier",

        required: true

    },

    // ==================================================
    // Warehouse
    // ==================================================

    warehouse: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Warehouse",

        required: true

    }

});    // ==================================================
    // Ordered Products
    // ==================================================

    products: [

        {

            product: {

                type: mongoose.Schema.Types.ObjectId,

                ref: "Product",

                required: true

            },

            quantity: {

                type: Number,

                required: true,

                min: 1

            },

            purchasePrice: {

                type: Number,

                required: true,

                min: 0

            },

            totalPrice: {

                type: Number,

                default: 0,

                min: 0

            }

        },

    ],
    // ==================================================
    // Financial Information
    // ==================================================

    subtotal: {

        type: Number,

        default: 0,

        min: 0

    },

    tax: {

        type: Number,

        default: 0,

        min: 0

    },

    shippingCost: {

        type: Number,

        default: 0,

        min: 0

    },

    discount: {

        type: Number,

        default: 0,

        min: 0

    },

    grandTotal: {

        type: Number,

        default: 0,

        min: 0

    },
    // ==================================================
    // Order Status & Important Dates
    // ==================================================

    status: {

        type: String,

        enum: [

            "draft",

            "pending",

            "approved",

            "shipped",

            "received",

            "cancelled"

        ],

        default: "draft"

    },

    expectedDeliveryDate: {

        type: Date,

        default: null

    },

    receivedDate: {

        type: Date,

        default: null

    },

    notes: {

        type: String,

        default: "",

        trim: true

    },
    // ==================================================
    // Approval & Audit Information
    // ==================================================

    createdBy: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null

    },

    approvedBy: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null

    },

    updatedBy: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null

    }

}, {

    timestamps: true

});
