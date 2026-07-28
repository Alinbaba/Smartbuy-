// ======================================================
// SmartBuy Enterprise Supplier Model
// Supports Vendors, Manufacturers & Product Sources
// ======================================================

const mongoose = require("mongoose");


const supplierSchema = new mongoose.Schema({

    // ==================================================
    // Supplier Name
    // ==================================================

    name: {

        type: String,

        required: true,

        trim: true

    },


    // ==================================================
    // Company Name
    // ==================================================

    companyName: {

        type: String,

        required: true,

        trim: true

    },


    // ==================================================
    // Supplier Description
    // ==================================================

    description: {

        type: String,

        default: "",

        trim: true

    },

});
// ==================================================
// Supplier Contact Information
// ==================================================

contactPerson: {

    type: String,

    default: "",

    trim: true

},


phone: {

    type: String,

    required: true,

    trim: true

},


email: {

    type: String,

    default: "",

    trim: true,

    lowercase: true

},
// ==================================================
// Supplier Address Information
// ==================================================

country: {

    type: String,

    default: "",

    trim: true

},


state: {

    type: String,

    default: "",

    trim: true

},


city: {

    type: String,

    default: "",

    trim: true

},


address: {

    type: String,

    default: "",

    trim: true

},


postalCode: {

    type: String,

    default: "",

    trim: true

},
// ==================================================
// Supplier Business Information
// ==================================================

businessType: {

    type: String,

    enum: [

        "manufacturer",

        "wholesaler",

        "distributor",

        "retailer",

        "individual"

    ],

    default: "wholesaler"

},


registrationNumber: {

    type: String,

    default: "",

    trim: true

},


taxIdentificationNumber: {

    type: String,

    default: "",

    trim: true

},
// ==================================================
// Supplier Payment & Status Information
// ==================================================

paymentTerms: {

    type: String,

    enum: [

        "cash",

        "credit",

        "bank_transfer",

        "mixed"

    ],

    default: "bank_transfer"

},


status: {

    type: String,

    enum: [

        "pending",

        "approved",

        "inactive",

        "blocked"

    ],

    default: "pending"

},


isVerified: {

    type: Boolean,

    default: false

},
// ==================================================
// Supplier Audit Information
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

},