// ======================================================
// SmartBuy Order Controller
// Enterprise Multi-Vendor Marketplace
// Version 2.0
// ======================================================

// ======================================================
// Import Models
// ======================================================

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
// ======================================================
// Create Order
// Converts Customer Cart into SmartBuy Orders
// ======================================================

exports.createOrder = async (req, res) => {

    try {

        // ==================================================
        // Find Customer Cart
        // ==================================================

        const cart = await Cart.findOne({

            user: req.user.id

        }).populate("items.product");


        if (!cart || cart.items.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Your cart is empty."

            });

        }


        // ==================================================
        // Get Checkout Information
        // ==================================================

        const {

            shippingAddress,

            paymentMethod,

            customerNote

        } = req.body;
        
        // ==================================================
        // Group Products By Seller
        // One order will be created for each seller
        // ==================================================

        const sellerOrders = {};

        for (const item of cart.items) {

            const product = item.product;

            const sellerId = product.seller.toString();

            if (!sellerOrders[sellerId]) {

                sellerOrders[sellerId] = [];

            }

            sellerOrders[sellerId].push(item);

        }

        // ==================================================
        // Store Created Orders
        // ==================================================

        const createdOrders = [];
        // ==================================================
        // Create One Order For Each Seller
        // ==================================================

        for (const sellerId of Object.keys(sellerOrders)) {

            const sellerItems = sellerOrders[sellerId];

            let subtotal = 0;

            const orderItems = [];

            // ===============================================
            // Build Order Items
            // ===============================================

            for (const item of sellerItems) {

                const product = item.product;

                const itemSubtotal = item.quantity * item.price;

                subtotal += itemSubtotal;

                orderItems.push({

                    product: product._id,

                    productId: product.productId || "",

                    name: product.name,

                    slug: product.slug || "",

                    sku: product.sku || "",

                    image: product.thumbnail || "",

                    variant: item.variant || "",

                    quantity: item.quantity,

                    price: item.price,

                    discountPrice: product.discountPrice || 0,

                    subtotal: itemSubtotal

                });

            }
                        // ===============================================
            // Marketplace Commission
            // Default Commission: 5%
            // ===============================================

            const commissionRate = 5;

            const commissionAmount = subtotal * (commissionRate / 100);

            const sellerEarnings = subtotal - commissionAmount;

            // ===============================================
            // Calculate Financial Summary
            // ===============================================

            const discount = 0;

            const shippingFee = 0;

            const tax = 0;

            const grandTotal = subtotal - discount + shippingFee + tax;
            // ===============================================
            // Create Order
            // ===============================================

            const order = await Order.create({

                customer: req.user.id,

                customerId: req.user.userId,

                seller: sellerId,

                sellerId: sellerItems[0].product.sellerId,

                items: orderItems,

                shippingAddress,

                shipping: {},

                payment: {

                    method: paymentMethod,

                    paymentStatus: "pending"

                },

                subtotal,

                discount,

                shippingFee,

                tax,

                grandTotal,

                orderStatus: "pending",

                commission: {

                    rate: commissionRate,

                    amount: commissionAmount

                },

                sellerEarnings,

                customerNote,

                timeline: [

                    {

                        status: "pending",

                        message: "Order created successfully.",

                        updatedBy: req.user.id

                    }

                ]

            });

            createdOrders.push(order);

        }
        // ==================================================
        // Clear Customer Cart
        // ==================================================

        cart.items = [];

        await cart.save();

        // ==================================================
        // Success Response
        // ==================================================

        return res.status(201).json({

            success: true,

            message: "Order placed successfully.",

            totalOrders: createdOrders.length,

            orders: createdOrders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Customer Orders
// Returns all orders belonging to the logged-in customer
// ======================================================

exports.getCustomerOrders = async (req, res) => {

    try {

        const orders = await Order.find({

            customer: req.user.id

        })

        .populate("seller", "userId fullName username")

        .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            totalOrders: orders.length,

            orders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Seller Orders
// Returns all orders belonging to the logged-in seller
// ======================================================

exports.getSellerOrders = async (req, res) => {

    try {

        const orders = await Order.find({

            seller: req.user.id

        })

        .populate("customer", "userId fullName username phone email")

        .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            totalOrders: orders.length,

            orders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Single Order
// Customer, Seller and Admin can view an order
// ======================================================

exports.getOrderById = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)

            .populate("customer", "userId fullName username email phone")

            .populate("seller", "userId fullName username email phone")

            .populate("items.product", "productId name thumbnail price");

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        // ==========================================
        // Permission Check
        // ==========================================

        if (

            req.user.role !== "admin" &&

            req.user.role !== "super-admin" &&

            order.customer._id.toString() !== req.user.id &&

            order.seller._id.toString() !== req.user.id

        ) {

            return res.status(403).json({

                success: false,

                message: "Access denied."

            });

        }

        return res.status(200).json({

            success: true,

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get All Orders
// Admin & Super Admin Only
// ======================================================

exports.getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find()

            .populate("customer", "userId fullName username phone email")

            .populate("seller", "userId fullName username phone email")

            .populate("items.product", "productId name thumbnail")

            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            totalOrders: orders.length,

            orders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Update Order Status
// Seller/Admin updates order progress
// ======================================================

exports.updateOrderStatus = async (req, res) => {

    try {

        const { orderStatus, message } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        order.orderStatus = orderStatus;

        order.timeline.push({

            status: orderStatus,

            message: message || `Order status updated to ${orderStatus}`,

            updatedBy: req.user.id

        });

        // Save delivery date automatically
        if (orderStatus === "delivered") {

            order.shipping.deliveredAt = new Date();

        }

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Order status updated successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Cancel Order
// Customer, Seller or Admin
// ======================================================

exports.cancelOrder = async (req, res) => {

    try {

        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        if (

            order.orderStatus === "delivered" ||

            order.orderStatus === "cancelled"

        ) {

            return res.status(400).json({

                success: false,

                message: "This order cannot be cancelled."

            });

        }

        order.orderStatus = "cancelled";

        order.adminNote = reason || "Order cancelled.";

        order.timeline.push({

            status: "cancelled",

            message: reason || "Order cancelled.",

            updatedBy: req.user.id

        });

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Order cancelled successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Return Order
// Customer requests a return
// ======================================================

exports.returnOrder = async (req, res) => {

    try {

        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        if (order.orderStatus !== "delivered") {

            return res.status(400).json({

                success: false,

                message: "Only delivered orders can be returned."

            });

        }

        order.orderStatus = "returned";

        order.adminNote = reason || "Customer requested a return.";

        order.timeline.push({

            status: "returned",

            message: reason || "Customer requested a return.",

            updatedBy: req.user.id

        });

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Return request submitted successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Refund Order
// Admin processes a refund
// ======================================================

exports.refundOrder = async (req, res) => {

    try {

        const { amount, reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        if (order.payment.paymentStatus === "refunded") {

            return res.status(400).json({

                success: false,

                message: "Order has already been refunded."

            });

        }

        order.payment.paymentStatus = "refunded";

        order.orderStatus = "refunded";

        order.adminNote = reason || "Refund processed.";

        order.timeline.push({

            status: "refunded",

            message: `Refund processed. Amount: ${amount || order.grandTotal}`,

            updatedBy: req.user.id

        });

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Refund processed successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Update Payment Status
// ======================================================

exports.updatePaymentStatus = async (req, res) => {

    try {

        const { paymentStatus, transactionReference } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        order.payment.paymentStatus = paymentStatus;

        if (transactionReference) {

            order.payment.transactionReference = transactionReference;

        }

        if (paymentStatus === "paid") {

            order.payment.paidAt = new Date();

        }

        order.timeline.push({

            status: "payment_updated",

            message: `Payment status changed to ${paymentStatus}`,

            updatedBy: req.user.id

        });

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Payment status updated successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Add Tracking Information
// ======================================================

exports.addTracking = async (req, res) => {

    try {

        const {

            courier,

            trackingNumber,

            shippingMethod,

            estimatedDelivery

        } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        order.shipping.courier = courier;

        order.shipping.trackingNumber = trackingNumber;

        order.shipping.shippingMethod = shippingMethod;

        order.shipping.estimatedDelivery = estimatedDelivery;

        order.timeline.push({

            status: "tracking_updated",

            message: "Tracking information updated.",

            updatedBy: req.user.id

        });

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Tracking information added successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Generate Invoice
// ======================================================

exports.generateInvoice = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)

            .populate("customer", "userId fullName email phone")

            .populate("seller", "userId fullName")

            .populate("items.product", "productId name");

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        const invoice = {

            invoiceNumber: order.invoiceNumber,

            orderNumber: order.orderNumber,

            date: order.createdAt,

            customer: order.customer,

            seller: order.seller,

            items: order.items,

            payment: order.payment,

            subtotal: order.subtotal,

            discount: order.discount,

            shippingFee: order.shippingFee,

            tax: order.tax,

            grandTotal: order.grandTotal

        };

        return res.status(200).json({

            success: true,

            invoice

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Order Analytics
// Admin Dashboard Statistics
// ======================================================

exports.getOrderAnalytics = async (req, res) => {

    try {

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "pending"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            orderStatus: "cancelled"
        });

        const refundedOrders = await Order.countDocuments({
            orderStatus: "refunded"
        });

        const delivered = await Order.find({
            orderStatus: "delivered"
        });

        const totalRevenue = delivered.reduce((sum, order) => {

            return sum + order.grandTotal;

        }, 0);

        const averageOrderValue =

            delivered.length > 0

                ? totalRevenue / delivered.length

                : 0;

        return res.status(200).json({

            success: true,

            analytics: {

                totalOrders,

                pendingOrders,

                deliveredOrders,

                cancelledOrders,

                refundedOrders,

                totalRevenue,

                averageOrderValue

            }

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};