// ======================================================
// SmartBuy Order Model
// Enterprise Marketplace Order Schema
// ======================================================

const mongoose = require("mongoose");

// ======================================================
// Order Schema
// ======================================================

const orderSchema = new mongoose.Schema({

    // ==================================================
    // SmartBuy Order Number
    // ==================================================

    orderNumber: {
        type: String,
        unique: true
    },

    // ==================================================
    // Internal Order ID
    // ==================================================

    internalOrderId: {
        type: String,
        unique: true
    },

    // ==================================================
    // Invoice Number
    // ==================================================

    invoiceNumber: {
        type: String,
        unique: true
    },

    // ==================================================
    // Customer Information
    // ==================================================

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    customerId: {
        type: String,
        required: true
    },

    // ==================================================
    // Seller Information
    // ==================================================

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sellerId: {
        type: String,
        required: true
    },
        // ==================================================
    // Ordered Products
    // Product snapshot is stored so that even if the
    // original product changes later, the order remains
    // accurate.
    // ==================================================

    items: [

        {

            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            productId: {
                type: String,
                default: ""
            },

            name: {
                type: String,
                required: true
            },

            slug: {
                type: String,
                default: ""
            },

            sku: {
                type: String,
                default: ""
            },

            image: {
                type: String,
                default: ""
            },

            variant: {
                type: String,
                default: ""
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            },

            price: {
                type: Number,
                required: true
            },

            discountPrice: {
                type: Number,
                default: 0
            },

            subtotal: {
                type: Number,
                required: true
            }

        }

    ],
        // ==================================================
    // Shipping Information
    // Delivery details for this order
    // ==================================================

    shippingAddress: {

        fullName: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        email: {
            type: String,
            default: ""
        },

        country: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        postalCode: {
            type: String,
            default: ""
        }

    },

    // ==================================================
    // Shipping Details
    // ==================================================

    shipping: {

        courier: {
            type: String,
            default: ""
        },

        trackingNumber: {
            type: String,
            default: ""
        },

        shippingMethod: {
            type: String,
            default: "Standard"
        },

        estimatedDelivery: {
            type: Date
        },

        deliveredAt: {
            type: Date
        }

    },
    // ==================================================
// Payment Information
// ==================================================

payment: {

    method: {
        type: String,
        enum: [
            "Paystack",
            "Flutterwave",
            "Stripe",
            "PayPal",
            "Wallet",
            "Cash on Delivery",
            "Bank Transfer"
        ],
        default: ""
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed",
            "refunded",
            "partially_refunded"
        ],
        default: "pending"
    },
    
    paymentId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Payment"

    },
    
    transactionReference: {
        type: String,
        default: ""
    },

    paidAt: {
        type: Date
    }

},

// ==================================================
// Financial Summary
// ==================================================

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
    required: true
},
// ==================================================
// Order Status
// ==================================================

orderStatus: {
    type: String,
    enum: [
        "pending",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded"
    ],
    default: "pending"
},

// ==================================================
// Marketplace Commission
// ==================================================

commission: {

    rate: {
        type: Number,
        default: 0
    },

    amount: {
        type: Number,
        default: 0
    }

},

// ==================================================
// Seller Earnings
// ==================================================

sellerEarnings: {
    type: Number,
    default: 0
},

// ==================================================
// Customer Notes
// ==================================================

customerNote: {
    type: String,
    default: ""
},

// ==================================================
// Admin Notes
// ==================================================

adminNote: {
    type: String,
    default: ""
},

// ==================================================
// Order Timeline
// Keeps a history of everything that happens to an order
// ==================================================

timeline: [

    {

        status: {
            type: String
        },

        message: {
            type: String
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        createdAt: {
            type: Date,
            default: Date.now
        }

    }

],
// ==================================================
// Cancellation Information
// ==================================================

cancellation: {

    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    reason: {
        type: String,
        default: ""
    },

    cancelledAt: {
        type: Date
    }

},
// ==================================================
// Return Request
// ==================================================

returnRequest: {

    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    reason: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "requested",
            "approved",
            "rejected",
            "completed"
        ],
        default: "requested"
    },

    requestedAt: {
        type: Date
    }

},
// ==================================================
// Refund Information
// ==================================================

refund: {

    amount: {
        type: Number,
        default: 0
    },

    reason: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "processing",
            "completed",
            "failed"
        ],
        default: "processing"
    },

    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    requestedAt: {
        type: Date
    }

},
// ======================================================
// Generate SmartBuy Order Number
// ======================================================

orderSchema.pre("save", async function (next) {

    // Only generate for new orders
    if (!this.isNew) {
        return next();
    }

    // Current Date
    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const date = `${year}${month}${day}`;

    // Count today's orders
    const todayStart = new Date(year, now.getMonth(), now.getDate());

    const todayEnd = new Date(year, now.getMonth(), now.getDate() + 1);

    const count = await this.constructor.countDocuments({

        createdAt: {

            $gte: todayStart,

            $lt: todayEnd

        }

    });

    // SmartBuy Order Number
    this.orderNumber = `SB-${date}-${String(count + 1).padStart(6, "0")}`;

    // Internal Order ID
    this.internalOrderId = `ORD-${String(count + 1).padStart(9, "0")}`;

    // Invoice Number
    this.invoiceNumber = `INV-${date}-${String(count + 1).padStart(6, "0")}`;

    next();

});

// ======================================================
// Export Model
// ======================================================

module.exports = mongoose.model("Order", orderSchema);