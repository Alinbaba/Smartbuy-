const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
// ==================================================
// SmartBuy Product ID
// ==================================================

    productId: {
      type: String,
       unique: true
},

    slug: {
        type: String,
        unique: true
    },

    sku: {
        type: String,
        unique: true
    },

    price: {
        type: Number,
        required: true
    },

    discountPrice: {
        type: Number,
        default: 0
    },

    description: {
        type: String,
        default: ""
    },

    category: {
        type: String,
        default: "General"
    },

    brand: {
        type: String,
        default: ""
    },

    stock: {
        type: Number,
        default: 0
    },

    images: [{
        type: String
    }],
// Product variants.
    variants: [

    {

        name: {
            type: String
        },

        value: {
            type: String
        },

        price: {
            type: Number,
            default: 0
        },

        stock: {
            type: Number,
            default: 0
        },

        sku: {
            type: String
        }

    }

],

    thumbnail: {
        type: String,
        default: ""
    },
// Product specifications.
    specifications: [

    {

        title: {
            type: String
        },

        value: {
            type: String
        }

    }

],
// Product Attributes.
    attributes: [

    {

        name: {
            type: String
        },

        value: {
            type: String
        }

    }

],
// Products Search Engine Opimization
    seo: {

    title: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    keywords: [{
        type: String
    }]

},
//Product Shipping.
    shipping: {

    weight: {
        type: Number,
        default: 0
    },

    length: {
        type: Number,
        default: 0
    },

    width: {
        type: Number,
        default: 0
    },

    height: {
        type: Number,
        default: 0
    },

    shippingClass: {
        type: String,
        default: "Standard"
    },

    freeShipping: {
        type: Boolean,
        default: false
    }

},
// Product tags.
    tags: [

    {

        type: String,

        trim: true

    }

],
//Product Warranty.
    warranty: {

    available: {
        type: Boolean,
        default: false
    },

    duration: {
        type: String,
        default: ""
    },

    warrantyType: {
        type: String,
        default: ""
    }

},
// Product Return Policy.
    returnPolicy: {

    returnAvailable: {
        type: Boolean,
        default: true
    },

    returnPeriod: {
        type: Number,
        default: 7
    },

    refundAvailable: {
        type: Boolean,
        default: true
    },

    policy: {
        type: String,
        default: ""
    }

},
// Bar Code.
    barcode: {
    type: String,
    default: ""
},

   qrCode: {
    type: String,
    default: ""
},
// Digital Product Support.
    isDigital: {
    type: Boolean,
    default: false
},

    digitalFile: {
      type: String,
     default: ""
},

    downloadLimit: {
      type: Number,
      default: 0
},

    licenseKey: {
      type: String,
     default: ""
},
//Product Visibility.
    visibility: {
      type: String,
    enum: [
        "public",
        "private",
        "hidden",
        "scheduled"
    ],
    default: "public"
},

    publishDate: {
      type: Date
},
// Product Status History.
    statusHistory: [

    {

        status: {
            type: String
        },

        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        note: {
            type: String,
            default: ""
        },

        changedAt: {
            type: Date,
            default: Date.now
        }

    }

],
    
    rating: {
        type: Number,
        default: 0
    },

    totalReviews: {
        type: Number,
        default: 0
    },

    status: {
    type: String,
    enum: [
        "pending",
        "approved",
        "rejected",
        "inactive",
        "out_of_stock"
    ],
    default: "pending"
},
//Rejection Reason.
    rejectionReason: {
    type: String,
    default: ""
},
// Approval. 
    approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},

approvedAt: {
    type: Date
},
    
    featured: {
        type: Boolean,
        default: false
    },
  
    seller: {
       type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},

    vendorType: {
    type: String,
    enum: [
        "SmartBuy",
        "Seller",
        "Dropshipper",
        "FleaMarket"
    ],
    default: "SmartBuy"
},

    approved: {
    type: Boolean,
    default: false
},

    views: {
    type: Number,
    default: 0
},

    sales: {
    type: Number,
    default: 0
}
  
}, {
    timestamps: true
});
// ======================================================
// Generate SmartBuy Product ID
// ======================================================

productSchema.pre("save", async function (next) {

    if (!this.isNew || this.productId) {
        return next();
    }

    const count = await this.constructor.countDocuments();

    this.productId = `PRD-${String(count + 1).padStart(6, "0")}`;

    next();

});

module.exports = mongoose.model("Product", productSchema);