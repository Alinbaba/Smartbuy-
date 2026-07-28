// ======================================================
// SmartBuy Coupon Controller
// ======================================================

const Coupon = require("../models/Coupon");


// ======================================================
// Create Coupon
// Admin / Vendor
// ======================================================

exports.createCoupon = async (req, res) => {

    try {

        const coupon = await Coupon.create({

            ...req.body,

            createdBy: req.user.id

        });

        return res.status(201).json({

            success: true,

            message: "Coupon created successfully.",

            coupon

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get All Coupons
// ======================================================

exports.getAllCoupons = async (req, res) => {

    try {

        const coupons = await Coupon.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: coupons.length,

            coupons

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Single Coupon
// ======================================================

exports.getCouponById = async (req, res) => {

    try {

        const coupon = await Coupon.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!coupon) {

            return res.status(404).json({

                success: false,

                message: "Coupon not found."

            });

        }

        return res.status(200).json({

            success: true,

            coupon

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Coupon
// ======================================================

exports.updateCoupon = async (req, res) => {

    try {

        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {

            return res.status(404).json({

                success: false,

                message: "Coupon not found."

            });

        }

        Object.assign(coupon, req.body);

        await coupon.save();

        return res.status(200).json({

            success: true,

            message: "Coupon updated successfully.",

            coupon

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Delete Coupon
// ======================================================

exports.deleteCoupon = async (req, res) => {

    try {

        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {

            return res.status(404).json({

                success: false,

                message: "Coupon not found."

            });

        }

        await coupon.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Coupon deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Validate Coupon
// ======================================================

exports.validateCoupon = async (req, res) => {

    try {

        const { code } = req.body;

        const coupon = await Coupon.findOne({

            code: code.toUpperCase(),

            isActive: true

        });

        if (!coupon) {

            return res.status(404).json({

                success: false,

                message: "Invalid coupon."

            });

        }

        const now = new Date();

        if (now < coupon.startDate || now > coupon.expiryDate) {

            return res.status(400).json({

                success: false,

                message: "Coupon has expired or is not yet active."

            });

        }

        if (
            coupon.usageLimit > 0 &&
            coupon.usedCount >= coupon.usageLimit
        ) {

            return res.status(400).json({

                success: false,

                message: "Coupon usage limit reached."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Coupon is valid.",

            coupon

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Apply Coupon
// ======================================================

exports.applyCoupon = async (req, res) => {

    try {

        const { code, totalAmount } = req.body;

        const coupon = await Coupon.findOne({

            code: code.toUpperCase(),

            isActive: true

        });

        if (!coupon) {

            return res.status(404).json({

                success: false,

                message: "Invalid coupon."

            });

        }

        let discount = 0;

        if (coupon.discountType === "percentage") {

            discount = (totalAmount * coupon.discountValue) / 100;

            if (
                coupon.maximumDiscount > 0 &&
                discount > coupon.maximumDiscount
            ) {

                discount = coupon.maximumDiscount;

            }

        } else {

            discount = coupon.discountValue;

        }

        const finalAmount = Math.max(0, totalAmount - discount);

        return res.status(200).json({

            success: true,

            message: "Coupon applied successfully.",

            discount,

            finalAmount,

            coupon

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};