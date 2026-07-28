// ======================================================
// SmartBuy Inventory Controller
// ======================================================

const Inventory = require("../models/Inventory");


// ======================================================
// Create Inventory Record
// ======================================================

exports.createInventory = async (req, res) => {

    try {

        const inventory = await Inventory.create(req.body);

        return res.status(201).json({

            success: true,

            message: "Inventory created successfully.",

            inventory

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get All Inventory
// ======================================================

exports.getAllInventory = async (req, res) => {

    try {

        const inventory = await Inventory.find()
            .populate("product")
            .populate("supplier")
            .populate("updatedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: inventory.length,

            inventory

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Single Inventory Record
// ======================================================

exports.getInventoryById = async (req, res) => {

    try {

        const inventory = await Inventory.findById(req.params.id)
            .populate("product")
            .populate("supplier")
            .populate("updatedBy", "name email");

        if (!inventory) {

            return res.status(404).json({

                success: false,

                message: "Inventory record not found."

            });

        }

        return res.status(200).json({

            success: true,

            inventory

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Inventory
// ======================================================

exports.updateInventory = async (req, res) => {

    try {

        const inventory = await Inventory.findById(req.params.id);

        if (!inventory) {

            return res.status(404).json({

                success: false,

                message: "Inventory record not found."

            });

        }

        Object.assign(inventory, req.body);

        inventory.lastStockUpdate = new Date();

        if (req.user) {

            inventory.updatedBy = req.user.id;

        }

        await inventory.save();

        return res.status(200).json({

            success: true,

            message: "Inventory updated successfully.",

            inventory

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Delete Inventory Record
// ======================================================

exports.deleteInventory = async (req, res) => {

    try {

        const inventory = await Inventory.findById(req.params.id);

        if (!inventory) {

            return res.status(404).json({

                success: false,

                message: "Inventory record not found."

            });

        }

        await inventory.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Inventory record deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Restock Inventory
// ======================================================

exports.restockInventory = async (req, res) => {

    try {

        const { quantity } = req.body;

        const inventory = await Inventory.findById(req.params.id);

        if (!inventory) {

            return res.status(404).json({

                success: false,

                message: "Inventory record not found."

            });

        }

        inventory.quantityInStock += quantity;

        inventory.availableStock += quantity;

        inventory.lastStockUpdate = new Date();

        if (req.user) {

            inventory.updatedBy = req.user.id;

        }

        await inventory.save();

        return res.status(200).json({

            success: true,

            message: "Inventory restocked successfully.",

            inventory

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Reduce Stock After Order
// ======================================================

exports.reduceStock = async (req, res) => {

    try {

        const { quantity } = req.body;

        const inventory = await Inventory.findById(req.params.id);

        if (!inventory) {

            return res.status(404).json({

                success: false,

                message: "Inventory record not found."

            });

        }

        if (inventory.availableStock < quantity) {

            return res.status(400).json({

                success: false,

                message: "Insufficient stock available."

            });

        }

        inventory.quantityInStock -= quantity;

        inventory.availableStock -= quantity;

        inventory.lastStockUpdate = new Date();

        if (req.user) {

            inventory.updatedBy = req.user.id;

        }

        await inventory.save();

        return res.status(200).json({

            success: true,

            message: "Stock reduced successfully.",

            inventory

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Reserve Stock
// ======================================================

exports.reserveStock = async (req, res) => {

    try {

        const { quantity } = req.body;

        const inventory = await Inventory.findById(req.params.id);

        if (!inventory) {

            return res.status(404).json({

                success: false,

                message: "Inventory record not found."

            });

        }

        if (inventory.availableStock < quantity) {

            return res.status(400).json({

                success: false,

                message: "Not enough stock available."

            });

        }

        inventory.availableStock -= quantity;

        inventory.reservedStock += quantity;

        inventory.lastStockUpdate = new Date();

        if (req.user) {

            inventory.updatedBy = req.user.id;

        }

        await inventory.save();

        return res.status(200).json({

            success: true,

            message: "Stock reserved successfully.",

            inventory

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Release Reserved Stock
// ======================================================

exports.releaseReservedStock = async (req, res) => {

    try {

        const { quantity } = req.body;

        const inventory = await Inventory.findById(req.params.id);

        if (!inventory) {

            return res.status(404).json({

                success: false,

                message: "Inventory record not found."

            });

        }

        if (inventory.reservedStock < quantity) {

            return res.status(400).json({

                success: false,

                message: "Reserved stock is insufficient."

            });

        }

        inventory.reservedStock -= quantity;

        inventory.availableStock += quantity;

        inventory.lastStockUpdate = new Date();

        if (req.user) {

            inventory.updatedBy = req.user.id;

        }

        await inventory.save();

        return res.status(200).json({

            success: true,

            message: "Reserved stock released successfully.",

            inventory

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};