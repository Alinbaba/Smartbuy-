// ======================================================
// SmartBuy Enterprise Supplier Controller
// ======================================================


const Supplier = require("../models/Suppliers");


// ======================================================
// Create Supplier
// ======================================================

exports.createSupplier = async (req, res) => {

    try {

        const supplier = await Supplier.create({

            ...req.body,

            createdBy: req.user ? req.user.id : null

        });


        return res.status(201).json({

            success: true,

            message: "Supplier created successfully.",

            supplier

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get All Suppliers
// ======================================================

exports.getAllSuppliers = async (req, res) => {

    try {

        const suppliers = await Supplier.find()

            .populate("createdBy", "name email")

            .populate("updatedBy", "name email")

            .sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            total: suppliers.length,

            suppliers

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Single Supplier
// ======================================================

exports.getSupplierById = async (req, res) => {

    try {

        const supplier = await Supplier.findById(req.params.id)

            .populate("createdBy", "name email")

            .populate("updatedBy", "name email");


        if (!supplier) {

            return res.status(404).json({

                success: false,

                message: "Supplier not found."

            });

        }


        return res.status(200).json({

            success: true,

            supplier

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Supplier
// ======================================================

exports.updateSupplier = async (req, res) => {

    try {

        const supplier = await Supplier.findById(req.params.id);


        if (!supplier) {

            return res.status(404).json({

                success: false,

                message: "Supplier not found."

            });

        }


        Object.assign(
            supplier,
            req.body
        );


        if (req.user) {

            supplier.updatedBy = req.user.id;

        }


        await supplier.save();


        return res.status(200).json({

            success: true,

            message: "Supplier updated successfully.",

            supplier

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Delete Supplier
// ======================================================

exports.deleteSupplier = async (req, res) => {

    try {

        const supplier = await Supplier.findById(req.params.id);


        if (!supplier) {

            return res.status(404).json({

                success: false,

                message: "Supplier not found."

            });

        }


        await supplier.deleteOne();


        return res.status(200).json({

            success: true,

            message: "Supplier deleted successfully."

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Verify Supplier
// ======================================================

exports.verifySupplier = async (req, res) => {

    try {

        const supplier = await Supplier.findById(req.params.id);


        if (!supplier) {

            return res.status(404).json({

                success: false,

                message: "Supplier not found."

            });

        }


        supplier.isVerified = true;

        supplier.status = "approved";


        if (req.user) {

            supplier.updatedBy = req.user.id;

        }


        await supplier.save();


        return res.status(200).json({

            success: true,

            message: "Supplier verified successfully.",

            supplier

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Supplier Status
// ======================================================

exports.updateSupplierStatus = async (req, res) => {

    try {

        const { status } = req.body;


        const supplier = await Supplier.findById(req.params.id);


        if (!supplier) {

            return res.status(404).json({

                success: false,

                message: "Supplier not found."

            });

        }


        supplier.status = status;


        if (req.user) {

            supplier.updatedBy = req.user.id;

        }


        await supplier.save();


        return res.status(200).json({

            success: true,

            message: "Supplier status updated successfully.",

            supplier

        });


    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
