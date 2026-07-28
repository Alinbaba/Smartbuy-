// =====================================
// SmartBuy KYC Controller
// Enterprise Multi-Vendor Marketplace
// =====================================

const KYC = require("../models/KYC");
const User = require("../models/User");

// =====================================
// Submit KYC
// =====================================

exports.submitKYC = async (req, res) => {

    try {

        // Check if KYC already exists
        const existingKYC = await KYC.findOne({
            user: req.user.id
        });

        if (existingKYC) {
            return res.status(400).json({
                success: false,
                message: "KYC has already been submitted."
            });
        }

        // Create KYC
        const kyc = await KYC.create({

            user: req.user.id,

            ...req.body,

            status: "pending",

            submittedAt: new Date()

        });

        res.status(201).json({

            success: true,

            message: "KYC submitted successfully.",

            kyc

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Get My KYC
// =====================================

exports.getMyKYC = async (req, res) => {

    try {

        const kyc = await KYC.findOne({
            user: req.user.id
        }).populate(
            "user",
            "userId fullName username email role"
        );

        if (!kyc) {

            return res.status(404).json({

                success: false,

                message: "KYC record not found."

            });

        }

        res.status(200).json({

            success: true,

            kyc

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Update My KYC
// =====================================

exports.updateMyKYC = async (req, res) => {

    try {

        const kyc = await KYC.findOne({
            user: req.user.id
        });

        if (!kyc) {

            return res.status(404).json({

                success: false,

                message: "KYC record not found."

            });

        }

        // Prevent updates after verification
        if (kyc.status === "verified") {

            return res.status(400).json({

                success: false,

                message: "Verified KYC cannot be updated."

            });

        }

        // Update fields
        Object.assign(kyc, req.body);

        // If previously rejected, send back for review
        if (kyc.status === "rejected") {
            kyc.status = "pending";
        }

        await kyc.save();

        res.status(200).json({

            success: true,

            message: "KYC updated successfully.",

            kyc

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Get Single KYC (Admin)
// =====================================

exports.getKYCById = async (req, res) => {

    try {

        const kyc = await KYC.findById(req.params.id)
            .populate(
                "user",
                "userId fullName username email phone role isVerified isActive"
            );

        if (!kyc) {

            return res.status(404).json({

                success: false,

                message: "KYC record not found."

            });

        }

        res.status(200).json({

            success: true,

            kyc

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Get All KYC Requests (Admin)
// =====================================

exports.getAllKYCs = async (req, res) => {

    try {

        const kycs = await KYC.find()
            .populate(
                "user",
                "userId fullName username email phone role isVerified isActive"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            totalKYCs: kycs.length,

            kycs

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Review KYC (Approve / Reject)
// =====================================

exports.reviewKYC = async (req, res) => {

    try {

        const { status, rejectionReason } = req.body;

        const kyc = await KYC.findById(req.params.id);

        if (!kyc) {

            return res.status(404).json({

                success: false,

                message: "KYC record not found."

            });

        }

        if (!["verified", "rejected"].includes(status)) {

            return res.status(400).json({

                success: false,

                message: "Invalid review status."

            });

        }

        kyc.kycStatus = status;

        kyc.reviewedBy = req.user.id;

        kyc.reviewedAt = new Date();

        if (status === "verified") {

            kyc.verifiedAt = new Date();

            kyc.rejectionReason = "";

        } else {

            kyc.rejectionReason = rejectionReason || "KYC verification failed.";

        }

        await kyc.save();

        // =====================================
        // Update User Verification Status
        // =====================================

        const user = await User.findById(kyc.user);

        if (user) {

            user.isVerified = (status === "verified");

            await user.save();

        }

        res.status(200).json({

            success: true,

            message: `KYC ${status} successfully.`,

            kyc

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Delete KYC Record (Admin)
// =====================================

exports.deleteKYC = async (req, res) => {

    try {

        const kyc = await KYC.findById(req.params.id);

        if (!kyc) {

            return res.status(404).json({

                success: false,

                message: "KYC record not found."

            });

        }

        await kyc.deleteOne();

        res.status(200).json({

            success: true,

            message: "KYC record deleted successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// KYC Analytics
// =====================================

exports.getKYCAnalytics = async (req, res) => {

    try {

        const totalKYC = await KYC.countDocuments();

        const pendingKYC = await KYC.countDocuments({
            kycStatus: "pending"
        });

        const verifiedKYC = await KYC.countDocuments({
            kycStatus: "verified"
        });

        const rejectedKYC = await KYC.countDocuments({
            kycStatus: "rejected"
        });

        const notSubmittedKYC = await User.countDocuments({
            isVerified: false
        });

        res.status(200).json({

            success: true,

            analytics: {

                totalKYC,

                pendingKYC,

                verifiedKYC,

                rejectedKYC,

                notSubmittedKYC

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};