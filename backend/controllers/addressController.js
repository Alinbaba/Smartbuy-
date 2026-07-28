// ======================================================
// SmartBuy Enterprise Address Controller
// ======================================================


// ======================================================
// Import Address Model
// ======================================================

const Address = require("../models/Address");


// ======================================================
// Add New Address
// ======================================================

exports.addAddress = async (req, res) => {

    try {

        const address = await Address.create({

            ...req.body,

            user: req.user.id

        });

        return res.status(201).json({

            success: true,

            message: "Address added successfully.",

            address

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Logged-in User Addresses
// ======================================================

exports.getMyAddresses = async (req, res) => {

    try {

        const addresses = await Address.find({

            user: req.user.id

        }).sort({

            isDefault: -1,

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: addresses.length,

            addresses

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Single Address
// ======================================================

exports.getAddressById = async (req, res) => {

    try {

        const address = await Address.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!address) {

            return res.status(404).json({

                success: false,

                message: "Address not found."

            });

        }

        return res.status(200).json({

            success: true,

            address

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Address
// ======================================================

exports.updateAddress = async (req, res) => {

    try {

        const address = await Address.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!address) {

            return res.status(404).json({

                success: false,

                message: "Address not found."

            });

        }

        Object.assign(address, req.body);

        await address.save();

        return res.status(200).json({

            success: true,

            message: "Address updated successfully.",

            address

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Set Default Address
// ======================================================

exports.setDefaultAddress = async (req, res) => {

    try {

        // Remove default from all user's addresses
        await Address.updateMany(

            { user: req.user.id },

            { isDefault: false }

        );

        // Set selected address as default
        const address = await Address.findOneAndUpdate(

            {

                _id: req.params.id,

                user: req.user.id

            },

            {

                isDefault: true

            },

            {

                new: true

            }

        );

        if (!address) {

            return res.status(404).json({

                success: false,

                message: "Address not found."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Default address updated successfully.",

            address

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Delete Address
// ======================================================

exports.deleteAddress = async (req, res) => {

    try {

        const address = await Address.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!address) {

            return res.status(404).json({

                success: false,

                message: "Address not found."

            });

        }

        await address.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Address deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get All Addresses (Admin)
// ======================================================

exports.getAllAddresses = async (req, res) => {

    try {

        const addresses = await Address.find()

            .populate("user", "name email")

            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: addresses.length,

            addresses

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};