// ======================================================
// SmartBuy Enterprise Warehouse Controller
// ======================================================

const Warehouse = require("../models/Warehouse");


// ======================================================
// Create Warehouse
// ======================================================

exports.createWarehouse = async (req, res) => {

    try {

        const warehouse = await Warehouse.create({

            ...req.body,

            createdBy: req.user ? req.user.id : null

        });


        return res.status(201).json({

            success: true,

            message: "Warehouse created successfully.",

            warehouse

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });


    }

};
// ======================================================
// Get All Warehouses
// ======================================================

exports.getAllWarehouses = async (req, res) => {

    try {

        const warehouses = await Warehouse.find()
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            total: warehouses.length,

            warehouses

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });


    }

};
// ======================================================
// Get Single Warehouse
// ======================================================

exports.getWarehouseById = async (req, res) => {

    try {

        const warehouse = await Warehouse.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email");


        if (!warehouse) {

            return res.status(404).json({

                success: false,

                message: "Warehouse not found."

            });

        }


        return res.status(200).json({

            success: true,

            warehouse

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });


    }

};
// ======================================================
// Update Warehouse
// ======================================================

exports.updateWarehouse = async (req, res) => {

    try {

        const warehouse = await Warehouse.findById(req.params.id);


        if (!warehouse) {

            return res.status(404).json({

                success: false,

                message: "Warehouse not found."

            });

        }


        Object.assign(warehouse, req.body);


        if (req.user) {

            warehouse.updatedBy = req.user.id;

        }


        await warehouse.save();


        return res.status(200).json({

            success: true,

            message: "Warehouse updated successfully.",

            warehouse

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Delete Warehouse
// ======================================================

exports.deleteWarehouse = async (req, res) => {

    try {

        const warehouse = await Warehouse.findById(req.params.id);


        if (!warehouse) {

            return res.status(404).json({

                success: false,

                message: "Warehouse not found."

            });

        }


        await warehouse.deleteOne();


        return res.status(200).json({

            success: true,

            message: "Warehouse deleted successfully."

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Warehouse Status
// ======================================================

exports.updateWarehouseStatus = async (req, res) => {

    try {

        const { status } = req.body;


        const warehouse = await Warehouse.findById(req.params.id);


        if (!warehouse) {

            return res.status(404).json({

                success: false,

                message: "Warehouse not found."

            });

        }


        warehouse.status = status;


        if (req.user) {

            warehouse.updatedBy = req.user.id;

        }


        await warehouse.save();


        return res.status(200).json({

            success: true,

            message: "Warehouse status updated successfully.",

            warehouse

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Warehouse Capacity
// ======================================================

exports.updateWarehouseCapacity = async (req, res) => {

    try {

        const { maximumCapacity, currentCapacity } = req.body;


        const warehouse = await Warehouse.findById(req.params.id);


        if (!warehouse) {

            return res.status(404).json({

                success: false,

                message: "Warehouse not found."

            });

        }


        if (maximumCapacity !== undefined) {

            warehouse.maximumCapacity = maximumCapacity;

        }


        if (currentCapacity !== undefined) {

            warehouse.currentCapacity = currentCapacity;

        }


        if (req.user) {

            warehouse.updatedBy = req.user.id;

        }


        await warehouse.save();


        return res.status(200).json({

            success: true,

            message: "Warehouse capacity updated successfully.",

            warehouse

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Warehouse Controller Completed
// ======================================================