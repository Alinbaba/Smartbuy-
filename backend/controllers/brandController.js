// ======================================================
// SmartBuy Brand Controller
// ======================================================

const Brand = require("../models/Brand");


// ======================================================
// Create Brand
// ======================================================

exports.createBrand = async (req, res) => {

    try {

        const brand = await Brand.create(req.body);

        return res.status(201).json({

            success: true,

            message: "Brand created successfully.",

            brand

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get All Brands
// ======================================================

exports.getAllBrands = async (req, res) => {

    try {

        const brands = await Brand.find()
            .populate("category", "name slug")
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .sort({ displayOrder: 1, name: 1 });

        return res.status(200).json({

            success: true,

            total: brands.length,

            brands

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
 // ======================================================
// Get Single Brand
// ======================================================

exports.getBrandById = async (req, res) => {

    try {

        const brand = await Brand.findById(req.params.id)
            .populate("category", "name slug")
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email");

        if (!brand) {

            return res.status(404).json({

                success: false,

                message: "Brand not found."

            });

        }

        return res.status(200).json({

            success: true,

            brand

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Brand
// ======================================================

exports.updateBrand = async (req, res) => {

    try {

        const brand = await Brand.findById(req.params.id);

        if (!brand) {

            return res.status(404).json({

                success: false,

                message: "Brand not found."

            });

        }

        Object.assign(brand, req.body);

        if (req.user) {

            brand.updatedBy = req.user.id;

        }

        await brand.save();

        return res.status(200).json({

            success: true,

            message: "Brand updated successfully.",

            brand

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Delete Brand
// ======================================================

exports.deleteBrand = async (req, res) => {

    try {

        const brand = await Brand.findById(req.params.id);

        if (!brand) {

            return res.status(404).json({

                success: false,

                message: "Brand not found."

            });

        }

        await brand.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Brand deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};