// ======================================================
// SmartBuy Purchase Order Controller
// ======================================================

const PurchaseOrder = require("../models/PurchaseOrder");


// ======================================================
// Create Purchase Order
// ======================================================

exports.createPurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder = await PurchaseOrder.create(req.body);

        return res.status(201).json({

            success: true,

            message: "Purchase order created successfully.",

            purchaseOrder

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get All Purchase Orders
// ======================================================

exports.getAllPurchaseOrders = async (req, res) => {

    try {

        const purchaseOrders = await PurchaseOrder.find()
            .populate("supplier")
            .populate("warehouse")
            .populate("products.product")
            .populate("createdBy", "name email")
            .populate("approvedBy", "name email")
            .populate("updatedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: purchaseOrders.length,

            purchaseOrders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Single Purchase Order
// ======================================================

exports.getPurchaseOrderById = async (req, res) => {

    try {

        const purchaseOrder = await PurchaseOrder.findById(req.params.id)
            .populate("supplier")
            .populate("warehouse")
            .populate("products.product")
            .populate("createdBy", "name email")
            .populate("approvedBy", "name email")
            .populate("updatedBy", "name email");

        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message: "Purchase order not found."

            });

        }

        return res.status(200).json({

            success: true,

            purchaseOrder

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Purchase Order
// ======================================================

exports.updatePurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder = await PurchaseOrder.findById(req.params.id);

        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message: "Purchase order not found."

            });

        }

        Object.assign(purchaseOrder, req.body);

        if (req.user) {

            purchaseOrder.updatedBy = req.user.id;

        }

        await purchaseOrder.save();

        return res.status(200).json({

            success: true,

            message: "Purchase order updated successfully.",

            purchaseOrder

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Delete Purchase Order
// ======================================================

exports.deletePurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder = await PurchaseOrder.findById(req.params.id);

        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message: "Purchase order not found."

            });

        }

        await purchaseOrder.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Purchase order deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Approve Purchase Order
// ======================================================

exports.approvePurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder = await PurchaseOrder.findById(req.params.id);

        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message: "Purchase order not found."

            });

        }

        purchaseOrder.status = "approved";

        if (req.user) {

            purchaseOrder.approvedBy = req.user.id;

            purchaseOrder.updatedBy = req.user.id;

        }

        await purchaseOrder.save();

        return res.status(200).json({

            success: true,

            message: "Purchase order approved successfully.",

            purchaseOrder

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Receive Purchase Order
// ======================================================

exports.receivePurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder = await PurchaseOrder.findById(req.params.id);

        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message: "Purchase order not found."

            });

        }

        purchaseOrder.status = "received";

        purchaseOrder.receivedDate = new Date();

        if (req.user) {

            purchaseOrder.updatedBy = req.user.id;

        }

        await purchaseOrder.save();

        return res.status(200).json({

            success: true,

            message: "Purchase order received successfully.",

            purchaseOrder

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Cancel Purchase Order
// ======================================================

exports.cancelPurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder = await PurchaseOrder.findById(req.params.id);

        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message: "Purchase order not found."

            });

        }

        purchaseOrder.status = "cancelled";

        if (req.user) {

            purchaseOrder.updatedBy = req.user.id;

        }

        await purchaseOrder.save();

        return res.status(200).json({

            success: true,

            message: "Purchase order cancelled successfully.",

            purchaseOrder

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};