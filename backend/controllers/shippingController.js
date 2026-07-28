// ======================================================
// SmartBuy Shipping Controller
// Enterprise Multi-Vendor Marketplace
// Version 2.0
// ======================================================


// ======================================================
// Import Models
// ======================================================

const Shipping = require("../models/Shipping");
const Order = require("../models/Order");


// ======================================================
// Create Shipment
// Creates shipping record after order payment
// ======================================================

exports.createShipment = async (req, res) => {

    try {

        const {

            orderId

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
        // Check Payment Status
        // ==================================================

        if (order.payment.paymentStatus !== "paid") {

            return res.status(400).json({

                success: false,

                message: "Order must be paid before shipping."

            });

        }
        // ==================================================
        // Check Existing Shipment
        // ==================================================

        const existingShipment = await Shipping.findOne({

            order: orderId

        });


        if (existingShipment) {

            return res.status(400).json({

                success: false,

                message: "Shipment already exists."

            });

        }


        // ==================================================
        // Create Shipment
        // ==================================================

        const shipment = await Shipping.create({

            order: order._id,

            customer: order.customer,

            seller: order.seller,

            shippingAddress: order.shippingAddress,

            shippingStatus: "confirmed",

            timeline: [

                {

                    status: "confirmed",

                    message: "Shipment created successfully.",

                    updatedBy: req.user.id

                }

            ]

        });


        // ==================================================
        // Update Order Shipping Status
        // ==================================================

        order.shippingStatus = "processing";


        await order.save();


        return res.status(201).json({

            success: true,

            message: "Shipment created successfully.",

            shipment

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Customer Shipments
// Customer shipment history
// ======================================================

exports.getCustomerShipments = async (req, res) => {

    try {

        const shipments = await Shipping.find({

            customer: req.user.id

        })

        .populate("order", "orderNumber totalAmount orderStatus")

        .populate("seller", "fullName email")

        .sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            total: shipments.length,

            shipments

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Seller Shipments
// Seller shipment management
// ======================================================

exports.getSellerShipments = async (req, res) => {

    try {

        const shipments = await Shipping.find({

            seller: req.user.id

        })

        .populate("order", "orderNumber totalAmount orderStatus")

        .populate("customer", "fullName email phone")

        .sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            total: shipments.length,

            shipments

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Single Shipment
// Customer / Seller / Admin Access
// ======================================================

exports.getShipmentById = async (req, res) => {

    try {

        const shipment = await Shipping.findById(req.params.id)

        .populate("order")

        .populate("customer", "fullName email phone")

        .populate("seller", "fullName email");


        if (!shipment) {

            return res.status(404).json({

                success: false,

                message: "Shipment not found."

            });

        }


        // ==================================================
        // Permission Check
        // ==================================================

        if (

            req.user.role !== "admin" &&

            req.user.role !== "super-admin" &&

            shipment.customer._id.toString() !== req.user.id &&

            shipment.seller._id.toString() !== req.user.id

        ) {

            return res.status(403).json({

                success: false,

                message: "Access denied."

            });

        }


        return res.status(200).json({

            success: true,

            shipment

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Shipping Status
// Admin / Logistics Update
// ======================================================

exports.updateShippingStatus = async (req, res) => {

    try {

        const {

            shippingStatus,

            location,

            message

        } = req.body;


        const shipment = await Shipping.findById(req.params.id);


        if (!shipment) {

            return res.status(404).json({

                success: false,

                message: "Shipment not found."

            });

        }


        // ==================================================
        // Update Status
        // ==================================================

        shipment.shippingStatus = shippingStatus;


        shipment.timeline.push({

            status: shippingStatus,

            message: message || `Shipment status updated to ${shippingStatus}`,

            location: location || "",

            updatedBy: req.user.id

        });


        // ==================================================
        // Delivery Completion
        // ==================================================

        if (shippingStatus === "delivered") {

            shipment.deliveredAt = new Date();

        }


        await shipment.save();


        return res.status(200).json({

            success: true,

            message: "Shipping status updated successfully.",

            shipment

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Tracking Information
// Admin / Logistics Tracking Update
// ======================================================

exports.updateTrackingInfo = async (req, res) => {

    try {

        const {

            trackingNumber,

            trackingUrl

        } = req.body;


        const shipment = await Shipping.findById(req.params.id);


        if (!shipment) {

            return res.status(404).json({

                success: false,

                message: "Shipment not found."

            });

        }


        // ==================================================
        // Update Tracking Details
        // ==================================================

        if (trackingNumber) {

            shipment.trackingNumber = trackingNumber;

        }


        if (trackingUrl) {

            shipment.trackingUrl = trackingUrl;

        }


        shipment.timeline.push({

            status: shipment.shippingStatus,

            message: "Tracking information updated.",

            updatedBy: req.user.id

        });


        await shipment.save();


        return res.status(200).json({

            success: true,

            message: "Tracking information updated successfully.",

            shipment

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get All Shipments
// Admin Logistics Dashboard
// ======================================================

exports.getAllShipments = async (req, res) => {

    try {

        const shipments = await Shipping.find()

        .populate("order", "orderNumber totalAmount orderStatus")

        .populate("customer", "fullName email phone")

        .populate("seller", "fullName email")

        .sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            total: shipments.length,

            shipments

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
