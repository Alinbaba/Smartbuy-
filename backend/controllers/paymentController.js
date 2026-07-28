// ======================================================
// SmartBuy Payment Controller
// Enterprise Multi-Vendor Marketplace
// Version 2.0
// ======================================================


// ======================================================
// Import Models
// ======================================================

const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");


// ======================================================
// Create Payment Record
// Creates a payment linked to an order
// ======================================================

exports.createPayment = async (req, res) => {

    try {

        const {

            orderId,
            paymentMethod

        } = req.body;


        // ==================================================
        // Validate Order ID
        // ==================================================

        if (!orderId) {

            return res.status(400).json({

                success: false,

                message: "Order ID is required."

            });

        }


        // ==================================================
        // Find Order
        // ==================================================

        const order = await Order.findById(orderId);


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }
        // ==================================================
        // Check Order Ownership
        // ==================================================

        if (

            order.customer.toString() !== req.user.id &&

            req.user.role !== "admin" &&

            req.user.role !== "super-admin"

        ) {

            return res.status(403).json({

                success: false,

                message: "You cannot make payment for this order."

            });

        }


        // ==================================================
        // Create Payment
        // ==================================================

        const payment = await Payment.create({

            order: order._id,

            orderNumber: order.orderNumber,

            customer: order.customer,

            seller: order.seller,

            amount: order.grandTotal,

            currency: "NGN",

            paymentMethod,

            paymentStatus: "pending",

            timeline: [

                {

                    status: "pending",

                    message: "Payment initiated.",

                    updatedBy: req.user.id

                }

            ]

        });


        // ==================================================
        // Link Payment To Order
        // ==================================================

        order.payment.paymentId = payment._id;

        await order.save();
        // ==================================================
        // Success Response
        // ==================================================

        return res.status(201).json({

            success: true,

            message: "Payment created successfully.",

            payment

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// Verify Payment
// Updates payment after gateway confirmation
// ======================================================

exports.verifyPayment = async (req, res) => {

    try {

        const {

            paymentId,

            transactionReference,

            gatewayTransactionId,

            gatewayResponse

        } = req.body;


        // ==================================================
        // Find Payment
        // ==================================================

        const payment = await Payment.findById(paymentId);


        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }
        // ==================================================
        // Update Payment Information
        // ==================================================

        payment.transactionReference = transactionReference || "";

        payment.gatewayTransactionId = gatewayTransactionId || "";

        payment.gatewayResponse = gatewayResponse || {};

        payment.paymentStatus = "successful";

        payment.paidAt = new Date();

        payment.verifiedAt = new Date();

        // ==================================================
        // Add Payment Timeline
        // ==================================================

        payment.timeline.push({

            status: "successful",

            message: "Payment verified successfully.",

            updatedBy: req.user.id

        });


        await payment.save();

        // ==================================================
        // Update Related Order
        // ==================================================

        const order = await Order.findById(payment.order);


        if (order) {

            order.payment.paymentStatus = "successful";

            order.payment.paidAt = new Date();

            order.orderStatus = "processing";


            order.timeline.push({

                status: "processing",

                message: "Payment confirmed. Order processing started.",

                updatedBy: req.user.id

            });


            await order.save();

        }
        
        // ==================================================
        // Success Response
        // ==================================================

        return res.status(200).json({

            success: true,

            message: "Payment verified successfully.",

            payment

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// Get Customer Payments
// Returns logged-in customer's payment history
// ======================================================

exports.getCustomerPayments = async (req, res) => {

    try {

        const payments = await Payment.find({

            customer: req.user.id

        })

        .populate("order", "orderNumber grandTotal orderStatus")

        .sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            totalPayments: payments.length,

            payments

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Seller Payments
// Returns payments related to seller orders
// ======================================================

exports.getSellerPayments = async (req, res) => {

    try {

        const payments = await Payment.find({

            seller: req.user.id

        })

        .populate("order", "orderNumber grandTotal orderStatus")

        .populate("customer", "userId fullName username")

        .sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            totalPayments: payments.length,

            payments

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// Get Single Payment
// Customer, Seller and Admin Access
// ======================================================

exports.getPaymentById = async (req, res) => {

    try {

        const payment = await Payment.findById(req.params.id)

        .populate("order")

        .populate("customer", "userId fullName username email")

        .populate("seller", "userId fullName username email");


        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }
        // ==================================================
        // Permission Check
        // ==================================================

        if (

            req.user.role !== "admin" &&

            req.user.role !== "super-admin" &&

            payment.customer._id.toString() !== req.user.id &&

            payment.seller._id.toString() !== req.user.id

        ) {

            return res.status(403).json({

                success: false,

                message: "Access denied."

            });

        }


        return res.status(200).json({

            success: true,

            payment

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
// Admin/Finance Admin Operation
// ======================================================

exports.updatePaymentStatus = async (req, res) => {

    try {

        const {

            paymentStatus,

            transactionReference

        } = req.body;


        const payment = await Payment.findById(req.params.id);


        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }
        // ==================================================
        // Update Payment Details
        // ==================================================

        payment.paymentStatus = paymentStatus;


        if (transactionReference) {

            payment.transactionReference = transactionReference;

        }


        if (paymentStatus === "successful") {

            payment.paidAt = new Date();

            payment.verifiedAt = new Date();
        }
        
        payment.timeline.push({

            status: paymentStatus,

            message: `Payment status updated to ${paymentStatus}`,

            updatedBy: req.user.id

        });

        await payment.save();

        return res.status(200).json({

            success: true,

            message: "Payment status updated successfully.",

            payment

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// Get All Payments
// Admin Finance Dashboard
// ======================================================

exports.getAllPayments = async (req, res) => {

    try {

        const payments = await Payment.find()

        .populate("order", "orderNumber grandTotal")

        .populate("customer", "userId fullName username")

        .populate("seller", "userId fullName username")

        .sort({ createdAt: -1 });
          return res.status(200).json({

            success: true,

            totalPayments: payments.length,

            payments

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// Process Refund
// Admin/Finance Admin Refund Operation
// ======================================================

exports.processRefund = async (req, res) => {

    try {

        const {

            amount,

            reason

        } = req.body;


        const payment = await Payment.findById(req.params.id);


        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }


        if (payment.paymentStatus === "refunded") {

            return res.status(400).json({

                success: false,

                message: "Payment already refunded."

            });

        }
        // ==================================================
        // Update Refund Information
        // ==================================================

        payment.refund.amount = amount || payment.amount;

        payment.refund.reason = reason || "Refund requested.";

        payment.refund.status = "completed";

        payment.refund.processedBy = req.user.id;

        payment.refund.processedAt = new Date();


        payment.paymentStatus = "refunded";


        payment.timeline.push({

            status: "refunded",

            message: reason || "Payment refunded successfully.",

            updatedBy: req.user.id

        });


        await payment.save();


        // ==================================================
        // Update Related Order
        // ==================================================

        const order = await Order.findById(payment.order);


        if (order) {

            order.payment.paymentStatus = "refunded";

            order.orderStatus = "refunded";


            order.timeline.push({

                status: "refunded",

                message: "Order refunded successfully.",

                updatedBy: req.user.id

            });


            await order.save();

        }


        return res.status(200).json({

            success: true,

            message: "Refund processed successfully.",

            payment

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Payment Analytics
// Admin Finance Dashboard Statistics
// ======================================================

exports.getPaymentAnalytics = async (req, res) => {

    try {


        const totalPayments = await Payment.countDocuments();


        const successfulPayments = await Payment.countDocuments({

            paymentStatus: "successful"

        });


        const pendingPayments = await Payment.countDocuments({

            paymentStatus: "pending"

        });


        const failedPayments = await Payment.countDocuments({

            paymentStatus: "failed"

        });


        const refundedPayments = await Payment.countDocuments({

            paymentStatus: "refunded"

        });


        const paidTransactions = await Payment.find({

            paymentStatus: "successful"

        });


        const totalRevenue = paidTransactions.reduce(

            (sum, payment) => {

                return sum + payment.amount;

            },

            0

        );


        return res.status(200).json({

            success: true,

            analytics: {

                totalPayments,

                successfulPayments,

                pendingPayments,

                failedPayments,

                refundedPayments,

                totalRevenue

            }

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};