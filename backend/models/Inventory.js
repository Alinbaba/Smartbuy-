// ======================================================
// SmartBuy Enterprise Inventory Model
// Supports Marketplace, Warehouses & Stock Management
// ======================================================

const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({

    // ==================================================
    // Product
    // ==================================================

    product: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Product",

        required: true

    },

    // ==================================================
    // Warehouse
    // ==================================================

    warehouse: {

        type: String,

        default: "Main Warehouse",

        trim: true

    },

    // ==================================================
    // Stock Information
    // ==================================================

    quantityInStock: {

        type: Number,

        default: 0,

        min: 0

    },

    reservedStock: {

        type: Number,

        default: 0,

        min: 0

    },

    availableStock: {

        type: Number,

        default: 0,

        min: 0

    },
    // ==================================================
    // Stock Alert Levels
    // ==================================================

    minimumStockLevel: {

        type: Number,

        default: 5,

        min: 0

    },

    maximumStockLevel: {

        type: Number,

        default: 1000,

        min: 0

    },

    reorderLevel: {

        type: Number,

        default: 10,

        min: 0

    },

    reorderQuantity: {

        type: Number,

        default: 50,

        min: 0

    },
        // ==================================================
    // Inventory Cost Information
    // ==================================================

    purchasePrice: {

        type: Number,

        default: 0,

        min: 0

    },

    averageCost: {

        type: Number,

        default: 0,

        min: 0

    },

    inventoryValue: {

        type: Number,

        default: 0,

        min: 0

    },

    supplier: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Supplier",

        default: null

    },
    // ==================================================
    // Warehouse Location
    // ==================================================

    warehouseLocation: {

        type: String,

        default: "Main Warehouse",

        trim: true

    },

    shelfNumber: {

        type: String,

        default: "",

        trim: true

    },

    binNumber: {

        type: String,

        default: "",

        trim: true

    },

    // ==================================================
    // Stock Condition
    // ==================================================

    stockStatus: {

        type: String,

        enum: [

            "available",

            "reserved",

            "damaged",

            "returned",

            "out_of_stock"

        ],

        default: "available"

    },
    // ==================================================
    // Inventory Audit
    // ==================================================

    lastStockUpdate: {

        type: Date,

        default: Date.now

    },

    updatedBy: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null

    },

    remarks: {

        type: String,

        default: "",

        trim: true

    }

}, {

    timestamps: true

});


// ======================================================
// Export Inventory Model
// ======================================================

module.exports = mongoose.model(

    "Inventory",

    inventorySchema

);